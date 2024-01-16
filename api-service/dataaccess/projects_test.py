import pytest

from dataaccess import projects as dataaccess_projects
from dataaccess.types import PermissionType
from dataaccess.errors import NoAccessError, RecordNotFoundError

@pytest.mark.asyncio
async def test_browse(user_id):
    print(user_id)

    projects = await dataaccess_projects.browse(user_id=user_id)

    assert len(projects) == 3



@pytest.mark.asyncio
async def test_check_projectname_access(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0]
    project_2 = create_projects_users[1]
    

    # Create projects
    project_4 = await dataaccess_projects.create(projectname="Project4", description="Project 4")
    
    #User should have access to Project 1 & 2 but not 4

    #Project 1
    _ = await dataaccess_projects.check_projectname_access(user_id=user_id,projectname=project_1["projectname"],permission_type=PermissionType.owner)
    #Project 2
    _ = await dataaccess_projects.check_projectname_access(user_id=user_id,projectname=project_2["projectname"],permission_type=PermissionType.readwrite)

    #Project 3 should raise error

    with pytest.raises(NoAccessError) as exc:
        await dataaccess_projects.check_projectname_access(user_id=user_id,projectname=project_4["projectname"],permission_type=PermissionType.readwrite)
    assert str(exc.value) == f"No access to the projectname '{project_4['projectname']}'"


@pytest.mark.asyncio
async def test_getdefaultproject(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0]
    
    #Project 1 is default
    default_project = await dataaccess_projects.get_default_project(user_id=user_id)
    #print(default_project["projectname"])
    #print(await dataaccess_projects.get_by_projectname(default_project["projectname"]))
    assert default_project["id"] == project_1["id"]
    
@pytest.mark.asyncio
async def test_updateproject(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0]
    project_id = project_1["id"]

    updated_project = await dataaccess_projects.update(project_id, description="Changed Now")
    assert updated_project["description"] == "Changed Now"


@pytest.mark.asyncio
async def test_getbyprojectname(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0]
    
    #Get Project 1 
    got_project_1 = await dataaccess_projects.get_by_projectname(project_1["projectname"])
    
    assert got_project_1["id"] == project_1["id"]
    
    #Check Project Shouldn't Exist
    with pytest.raises(RecordNotFoundError):
        await dataaccess_projects.get_by_projectname("No Such Project")

@pytest.mark.asyncio
async def test_checkupdateaccess(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0]
    project_3 = create_projects_users[2]
    
    #Check Update Access for Project 1 
    _ = await dataaccess_projects.check_update_access(user_id, project_1["id"])
    
    #Check Update Access for Project 3: Shouldn't have, as it's read
    with pytest.raises(NoAccessError) as exc:
        await dataaccess_projects.check_update_access(user_id, project_3["id"])
    assert str(exc.value) == f"No access to the project with id '{project_3['id']}'"


@pytest.mark.asyncio
async def test_get(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0]
    project_3 = create_projects_users[2]
     
    get_project_1 = await dataaccess_projects.get(project_1["id"])
    get_project_3 = await dataaccess_projects.get(project_3["id"])
    
    assert get_project_1["id"] == project_1["id"]
    assert get_project_3["id"] == project_3["id"]



@pytest.mark.asyncio
async def test_checkowneraccess(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0] #Owner
    project_3 = create_projects_users[2] #Read
    
    #Check Owner Access for Project 1 
    _ = await dataaccess_projects.check_owner_access(user_id, project_1["id"])
    
    #Check Owner Access for Project 3: Shouldn't have, as it's read
    with pytest.raises(NoAccessError) as exc:
        await dataaccess_projects.check_owner_access(user_id, project_3["id"])
    assert str(exc.value) == f"No owner access to the project"


@pytest.mark.asyncio
async def test_checkdefaultproject(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0] #Default Project (Also needs to be Owner)
    
    #Check Default Project 1
    with pytest.raises(NoAccessError) as exc:
        await dataaccess_projects.check_default_project(user_id, project_1["id"])
    assert str(exc.value) == f"Cannot add to or delete your default project"

@pytest.mark.asyncio
async def test_getallusers(make_user, user_id, create_projects_users):
    print(user_id)
    project_2 = create_projects_users[1] 
    new_user2 = await make_user(user_name='test_2', full_name='Test 2')
    print(new_user2)
    _ = await dataaccess_projects.create_project_user(project_id=project_2["id"],user_id=new_user2,permission_type=PermissionType.owner,is_default=True)    
    
    users = await dataaccess_projects.get_all_users(project_2["id"])
    print(users)
    assert len(users) == 2


@pytest.mark.asyncio
async def test_addprojectuser(make_user, user_id, create_projects_users):
    print(user_id)
    project_2 = create_projects_users[1] 
    _ = await make_user(user_name='test_3', full_name='Test 3')
    added_user = await dataaccess_projects.add_project_user(projectid=project_2["id"],username='test_3',permission_type=PermissionType.read)    
    
    assert added_user["project_id"] == project_2["id"]
    

@pytest.mark.asyncio
async def test_updateprojectuser(user_id, create_projects_users):
    print(user_id)
    project_2 = create_projects_users[1] 
    
    updated_user = await dataaccess_projects.update_project_user(projectid=project_2["id"],username='test_3',permission_type=PermissionType.readwrite, auth_id= 0)    
    
    assert updated_user["project_id"] == project_2["id"]
    assert updated_user["permission_type"] == "readwrite"


@pytest.mark.asyncio
async def test_removeprojectuser(make_user, user_id, create_projects_users):
    print(user_id)
    project_2 = create_projects_users[1] 
    _ = await make_user(user_name='test_4', full_name='Test 4')
    _ = await dataaccess_projects.add_project_user(projectid=project_2["id"],username='test_4',permission_type=PermissionType.readwrite)
    users_init = await dataaccess_projects.get_all_users(project_2["id"])
    init_len = len(users_init) #Initial Number of Users
    print(init_len)
    
    _ = await dataaccess_projects.remove_project_user(projectid=project_2["id"],username='test_4',auth_id=0)    
    
    users_final = await dataaccess_projects.get_all_users(project_2["id"])
    final_len = len(users_final) #Final Number of Users
    print(final_len)
    
    assert (final_len - init_len) == -1
    
@pytest.mark.asyncio
async def test_delete(user_id, create_projects_users):
    print(user_id)
    project_1 = create_projects_users[0]

    projects_init = await dataaccess_projects.browse(user_id=user_id)
    initial_num_projects = len(projects_init) 
    print(initial_num_projects)

    _ = await dataaccess_projects.delete(project_1["id"])

    projects_final = await dataaccess_projects.browse(user_id=user_id)
    final_num_projects = len(projects_final) 
    print(final_num_projects)

    assert (final_num_projects - initial_num_projects) == -1

