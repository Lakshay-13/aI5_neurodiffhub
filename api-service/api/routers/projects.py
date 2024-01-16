from fastapi import APIRouter, Depends, Path, Query, BackgroundTasks

from api.auth import Auth
from api.data_models import (
    Pagination,
    Project1,
    Project2,
    ProjectUserRemoval,
    ProjectUserUpdate,
    ProjectNotification,
    ProjectDetailsNotification,
)
from utils import normalize_name
from dataaccess import projects as dataaccess_projects
from dataaccess import users as dataaccess_users
from api import errors
from dataaccess.errors import RecordNotFoundError, NoAccessError
from dataaccess.types import PermissionType
from notifications.emails import send_notification_email, send_detailsnotification_email

router = APIRouter()


@router.get(
    "/projects",
    tags=["Projects"],
    summary="Get list of projects for the user",
    description="Get list of projects for the user",
)
async def projects_index(
    q: str = Query(None, description="An optional search query"),
    pagination: Pagination = Depends(),
    auth: Auth = Depends(),
):
    return await dataaccess_projects.browse(
        q=q,
        user_id=auth.user_id,
        page_number=pagination.page_number,
        page_size=pagination.page_size,
    )


# Get information for a particluar project: If you are owner
# All users for project
# Project Name
# Project Description
@router.get(
    "/projects/{projectid}",
    tags=["Projects"],
    summary="Gets information for this project if user is owner of this project",
    description="Gets all Users, Project Name, Project Description for this project if owner",
)
async def get_information_for_project(
    projectid: int = Path(..., description="Project ID"), auth: Auth = Depends()
):
    # Check user is owner for this project
    try:
        await dataaccess_projects.check_owner_access(auth.user_id, projectid)
        is_own = 1
    except:
        is_own = 0

    # Fetch all users for this Project
    users = await dataaccess_projects.get_all_users(projectid)
    # users is dictionary: [{username, projectname, description, permission type, is_default}]
    new_users = {}
    new_users["is_owner"] = is_own
    new_users["projectname"] = users[0]["projectname"]
    new_users["description"] = users[0]["description"]
    new_users["is_public"] = users[0]["is_public"]
    new_users["users"] = []
    for user in users:
        new_users["users"].append(
            {"username": user["username"], "permission_type": user["permission_type"]}
        )

    return new_users


# Checks if you have access to this Project Name


@router.get(
    "/projects/check_access/{projectname}",
    tags=["projects"],
    summary="Get list of projects for the user",
    description="Get list of projects for the user",
)
async def projects_check_access(
    projectname: str = Path(..., description="The project name"),
    permission_type: str = Query(
        "readwrite", description="Permission type read, readwrite, owner"
    ),
    auth: Auth = Depends(),
):
    projectname = normalize_name(projectname)
    print("projectname:", projectname)

    # Get project
    project = await dataaccess_projects.check_projectname_access(
        auth.user_id, projectname, permission_type
    )
    # auth.user_id enures that it's being checked whether the logged in user has access to those projects
    return project


# User creates a new Project


@router.post(
    "/projects",
    tags=["Projects"],
    summary="Create a new project",
    description="User is creating a new project",
    response_description="Project Creation Successful or not,",
)
async def create_new_project(project: Project1, auth: Auth = Depends()):
    projectname = normalize_name(project.projectname)
    # print("Normalised:")
    # print(projectname)
    description = project.description

    # Check if projectname exists
    try:
        proj_name = await dataaccess_projects.get_by_projectname(projectname)
        raise errors.ProjectAlreadyExists("This Project Name already exists")
    except RecordNotFoundError:
        pass

    if description is None:
        description = ""
    # Create project with given details
    project = await dataaccess_projects.create(
        projectname=projectname, description=description, is_public=project.is_public
    )
    project_user = await dataaccess_projects.create_project_user(
        project_id=project["id"],
        user_id=auth.user_id,
        permission_type=PermissionType.owner,
        is_default=False,
    )

    return {"Project Created": True}


# User updates an existing project where he/she is the Owner or has readwrite access
@router.put(
    "/projects/{id}",
    tags=["Projects"],
    summary="Update Existing Projects where you are an owner or with readwrite",
    description="Can can update description & project name",
    response_description="New Project Details",
)
async def update_project_data(
    project: Project2,
    id: int = Path(..., description="The Project ID"),
    auth: Auth = Depends(),
):
    if project.projectname:
        projectname = normalize_name(project.projectname)
    else:
        raise errors.BadRequestError("Project Name cannot be empty or null")

    description = project.description

    # Check if same project name as current project then obviously allow

    users = await dataaccess_projects.get_all_users(id)
    # users is dictionary: [{username, projectname, description, permission type, is_default}]
    og_projectname = users[0]["projectname"]

    if projectname == og_projectname:
        pass
    else:
        # If projectname given to update check if it exists
        if projectname:
            try:
                proj_name = await dataaccess_projects.get_by_projectname(projectname)
                raise errors.ProjectAlreadyExists(f"This Project Name already exists")
            except RecordNotFoundError:
                pass

    # Check if user is owner or has readwrite access, otherwise can't update

    await dataaccess_projects.check_update_access(auth.user_id, id)

    # If no error raised then can update project details
    updated_project = await dataaccess_projects.update(
        id=id,
        projectname=projectname,
        description=description,
        is_public=project.is_public,
    )
    return updated_project


"""
Not going to be used now as we are making default projects entirely personal: Can't add to them + ensures uniqueness of name

#User updates the set_default flag for an existing project where he/she is the Owner or has readwrite access
@router.put(
    "/projects/set_default",
    tags = ["Projects"],
    summary="Update is_default for existing projects where you are an owner or with readwrite",
    description="Can can is_default for user",
    response_description="New Default Project Details"
)
async def update_project_data(
    projectid: int,
    auth: Auth = Depends()
):


#Check if user is owner or has readwrite access, otherwise can't update
    
    await dataaccess_projects.check_update_access(auth.user_id, projectid)
    
#If no error raised then can set this project as the default
    updated_project = await dataaccess_projects.update_default_project_user(projectid,auth.user_id)

    return updated_project

"""

# User deletes a project where he/she is the owner


@router.delete(
    "/projects/{id}",
    tags=["Projects"],
    summary="Deletes Project for Project ID if you are owner",
    description="Delete the Project with this project ID if you are the owner of this Project",
    response_description="Deletion Successful or not",
)
async def del_project(
    id: int = Path(..., description="Delete Project"), auth: Auth = Depends()
):
    try:
        # Check if you are owner for the Project
        await dataaccess_projects.check_owner_access(auth.user_id, id)

        # Check if Project is default or not
        await dataaccess_projects.check_default_project(auth.user_id, id)

        # Delete the Project
        await dataaccess_projects.delete(id)

        return {"Project Deleted": True}

    except NoAccessError as e:
        raise errors.SpecificAcessDeniedError(str(e))


# User adds or updates Users to projects where he/she is the Owner


@router.put(
    "/projects/update_users/{username}",
    tags=["Projects"],
    summary="Add or change permissions for users in Projects where you are Owner",
    description="Managing Users for a given Project: Add or Change Permissions",
)
async def add_change_project_users(
    *,
    project: ProjectUserUpdate,
    username: str = Path(..., description="The Username"),
    auth: Auth = Depends(),
):
    projectid = project.projectid
    permission_type = project.permission_type
    # Check if Owner for the Project

    await dataaccess_projects.check_owner_access(auth.user_id, projectid)

    # Check if it is the default Project: Not Allowed to add users to default project
    try:
        await dataaccess_projects.check_default_project(auth.user_id, projectid)
    except NoAccessError as e:
        raise errors.SpecificAcessDeniedError(str(e))

    # If user exists for project, add to it with permission else change permission for user

    # Fetch all users for this Project
    users = await dataaccess_projects.get_all_users(projectid)

    user_names = []
    for u in users:
        user_names.append(u["username"])
    print(user_names)

    # return user_names

    if username in user_names:
        # Change Permission Type
        print("Going for update user function")
        try:
            results = await dataaccess_projects.update_project_user(
                projectid, username, permission_type, auth.user_id
            )
            return results
        except NoAccessError as e:
            raise errors.SpecificAcessDeniedError(str(e))

    else:
        # Add as a new user with Permission
        print("Going for add user function")
        results = await dataaccess_projects.add_project_user(
            projectid, username, permission_type
        )
        return results


# Deleting Users from Projects, if you are the owner
# Constraint: Owner can't remove himself -> ensures @1 owner at least exists


@router.put(
    "/projects/remove_users/{username}",
    tags=["Projects"],
    summary="Remove users in Projects where you are Owner",
    description="Managing Users for a given Project: Remove Users",
)
async def remove_project_users(
    *,
    projectid: ProjectUserRemoval,
    username: str = Path(..., description="The Username"),
    auth: Auth = Depends(),
):
    projectid = projectid.projectid
    # Check if Owner for the Project
    try:
        await dataaccess_projects.check_owner_access(auth.user_id, projectid)
    except:
        raise errors.AccessDeniedError()
    # If user exists for project, remove user else raise

    # Fetch all users for this Project
    users = await dataaccess_projects.get_all_users(projectid)

    user_names = []
    for u in users:
        user_names.append(u["username"])
    print(user_names)

    if username in user_names:
        # Remove
        print("Going for remove user function")
        try:
            results = await dataaccess_projects.remove_project_user(
                projectid, username, auth.user_id
            )
            return results
        except NoAccessError:
            raise errors.SpecificAcessDeniedError("Cannot Remove Current Owner itself")
    else:
        # raise error
        print("No such user in this project")
        raise errors.NotFoundError("No such user in this project")


@router.post(
    "/projects/notification",
    tags=["Projects"],
    summary="Notify about Projects",
    description="If a user has been added/removed from a Project, notify him/her",
    response_description="Response message",
)
async def project_notify(
    background_tasks: BackgroundTasks,
    Project_Notification: ProjectNotification,
    auth: Auth = Depends(),
):
    try:
        user = await dataaccess_users.get_by_name(Project_Notification.username)

    except:
        raise errors.NotFoundError(
            "User with Name " + Project_Notification.username + " is not found!"
        )

    try:
        project = await dataaccess_projects.get(Project_Notification.projectid)
    except:
        raise errors.NotFoundError("Project Not Found")

    try:
        current_user = await dataaccess_users.get(auth.user_id)
    except:
        raise errors.NotFoundError("User Not Found")

    subject = "NeuroDiff: Projects Notification"
    email_to = user["email"]
    print(email_to)
    body = {
        "title": "NeuroDiff: Changes in Project",
        "name": user["username"] + " " + user["full_name"],
        "project_admin": current_user["username"],
        "project_status": Project_Notification.projectstatus,
        "project_name": project["projectname"],
        "permission": Project_Notification.permission_given,
    }

    # Send Reset Password Email
    send_notification_email(
        background_tasks, subject=subject, email_to=email_to, body=body
    )

    return "Notification Sent!"


@router.post(
    "/projects/details_notification",
    tags=["Projects"],
    summary="Notify about Projects",
    description="If Project has been added/removed/edited notify all users belonging to it",
    response_description="Response message",
)
async def project_details_notify(
    background_tasks: BackgroundTasks,
    Project_Details: ProjectDetailsNotification,
    auth: Auth = Depends(),
):
    users_list = Project_Details.users
    usernames = [u["username"] for u in users_list]
    print(usernames)
    emails = []

    for u in usernames:
        try:
            user = await dataaccess_users.get_by_name(u)
            emails.append(user["email"])
        except:
            raise errors.NotFoundError("User" + u + "not found")

    print(emails)

    try:
        current_user = await dataaccess_users.get(auth.user_id)
    except:
        raise errors.NotFoundError("User Not Found")

    subject = "NeuroDiff: Projects Notification"
    email_to = emails
    body = {
        "title": "NeuroDiff: Changes in Project",
        "project_admin": current_user["username"],
        "project_status": Project_Details.projectstatus,
        "project_name": Project_Details.projectname,
        "project_descrip": Project_Details.projectdescription,
    }

    # Send  Email
    send_detailsnotification_email(
        background_tasks, subject=subject, email_to=email_to, body=body
    )

    return "Notification Sent!"
