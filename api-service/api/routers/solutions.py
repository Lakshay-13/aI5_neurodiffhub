import os
import io
import json
import re
import dill
import pandas as pd
from glob import glob
from fastapi import (
    APIRouter,
    Path,
    Query,
    File,
    Form,
    Depends,
    UploadFile,
    BackgroundTasks,
)
from pytest import param
from starlette.responses import Response
from urllib.parse import urlparse
from typing import List, Optional

from api.auth import OptionalAuth, Auth
from api import errors
from api.data_models import (
    SolutionCreate,
    SolutionUpdate,
    Pagination,
    SolutionStatusComment,
)
from utils import normalize_name
from utils import equations as equation_utils
from fileaccess import solutions as fileaccess_solutions
from dataaccess import solutions as dataaccess_solutions
from dataaccess import solutions_conditions as dataaccess_solutions_conditions
from dataaccess import projects as dataaccess_projects
from dataaccess import users as dataaccess_users
from dataaccess.types import (
    diff_equation_type_mapping,
    condition_type_mapping,
    HubStatusType,
    SolutionSorting,
)
from dataaccess.errors import RecordNotFoundError
from notifications.emails import send_detailsnotification_email

router = APIRouter()


def get_variables(lambda_function):
    results = []
    try:
        result = re.search("lambda(.*):", lambda_function)
        if result is not None:
            result = result.group(1).strip()
            result = result.split(",")
        else:
            result = re.search("\((.*)\):", lambda_function)
            result = result.group(1).strip()
            result = result.split(",")

        result = [r.strip() for r in result]
    except:
        pass

    return result


def get_order(lambda_function):
    order_dict = {}
    try:
        result = re.findall(r"diff\((.*?)\)", lambda_function)
        for group in result:
            group = group.strip()
            elements = group.split(",")
            if len(elements) > 2:
                new_order = int(elements[2].split("=")[1])
                if elements[0] in order_dict.keys():
                    if new_order > order_dict[elements[0]]:
                        order_dict[elements[0]] = new_order
                else:
                    order_dict[elements[0]] = new_order

            else:
                if elements[0] in order_dict.keys():
                    new_order = 1
                    if new_order > order_dict[elements[0]]:
                        order_dict[elements[0]] = new_order
                else:
                    order_dict[elements[0]] = 1
    except:
        pass
    return order_dict


def get_independent_variables(variables, order):
    independent_variables = []
    for variable in variables:
        if variable not in order:
            independent_variables.append(variable)

    return independent_variables


@router.get(
    "/solutions",
    tags=["Solutions"],
    summary="Get list of solutions",
    description="Get list of solutions",
)
async def solutions_index(
    my: bool = Query(
        False, description="Set to true to filter solutions for the current user"
    ),
    q: str = Query(None, description="An optional search query"),
    username: str = Query(
        None, description="The username for which to filter solutions"
    ),
    status: str = Query(None, description="An optional status filter"),
    featured: bool = Query(
        None, description="An optional flag to get featured solutions"
    ),
    return_count: bool = Query(
        False, description="An optional flag to return row count"
    ),
    equation_types: List[str] = Query(
        None, description="A list of equation types to filter by"
    ),
    problem_types: List[str] = Query(
        None, description="A list of problem types to filter by"
    ),
    condition_types: List[str] = Query(
        None, description="A list of condition types to filter by"
    ),
    equations: List[str] = Query(None, description="A list of equations to filter by"),
    use_cases: List[str] = Query(None, description="A list of use cases to filter by"),
    tags: List[str] = Query(None, description="A list of tags to filter by"),
    domain_t_min: float = Query(None, description="A filter for domain"),
    domain_t_max: float = Query(None, description="A filter for domain"),
    domain_x_min: float = Query(None, description="A filter for domain"),
    domain_x_max: float = Query(None, description="A filter for domain"),
    domain_y_min: float = Query(None, description="A filter for domain"),
    domain_y_max: float = Query(None, description="A filter for domain"),
    sort_by: str = Query(None, description="Sort solutions by"),
    pagination: Pagination = Depends(),
    auth: OptionalAuth = Depends(),
):
    user_id = None
    hub_status = ["published"]
    if username is not None:
        user = await dataaccess_users.get_by_name(username=username)
        user_id = user["id"]
        hub_status = ["created", "published"]

    if my:
        user_id = auth.user_id
        hub_status = None

    if status is not None:
        # TODO: check if user is admin
        hub_status = [status]

    if sort_by is not None:
        sort_by = SolutionSorting[sort_by]

    # Get row count
    if return_count:
        results = await dataaccess_solutions.browse(
            q=q,
            user_id=user_id,
            hub_status=hub_status,
            equation_types=equation_types,
            problem_types=problem_types,
            condition_types=condition_types,
            equation_ids=equations,
            use_case_ids=use_cases,
            domain_t_min=domain_t_min,
            domain_t_max=domain_t_max,
            domain_x_min=domain_x_min,
            domain_x_max=domain_x_max,
            domain_y_min=domain_y_min,
            domain_y_max=domain_y_max,
            return_count=True,
        )
        return results[0]
    else:
        return await dataaccess_solutions.browse(
            q=q,
            user_id=user_id,
            hub_status=hub_status,
            featured=featured,
            equation_types=equation_types,
            problem_types=problem_types,
            condition_types=condition_types,
            equation_ids=equations,
            use_case_ids=use_cases,
            domain_t_min=domain_t_min,
            domain_t_max=domain_t_max,
            domain_x_min=domain_x_min,
            domain_x_max=domain_x_max,
            domain_y_min=domain_y_min,
            domain_y_max=domain_y_max,
            sort_by=sort_by,
            page_number=pagination.page_number,
            page_size=pagination.page_size,
        )


@router.post(
    "/solutions",
    tags=["Solutions"],
    summary="Create a new solution",
    description="Create a new solution using the provided metadata.",
    response_description="The created solution",
)
async def solutions_create(solution: SolutionCreate, auth: Auth = Depends()):
    # # Check if we have a solution with same name
    # try:
    #     sol_db = await dataaccess_solutions.get_by_name(name=solution.name)
    #     sol_db = await dataaccess_solutions.update(
    #         id=sol_db["id"],
    #         user_id=auth.user_id,
    #         description=solution.description,
    #         diff_equation_details=solution.diff_equation_details
    #     )
    # except RecordNotFoundError:
    #     project_id = None
    #     # Check if project was passed
    #     if solution.project is not None:
    #         # Check if project is valid
    #         try:
    #             project = await dataaccess_projects.get_by_projectname(auth.user_id,solution.project)
    #             project_id = project["id"]
    #         except RecordNotFoundError:
    #             print("project not found, default project will be used")
    #     # Get users default project
    #     if project_id == None:
    #         project = await dataaccess_projects.get_default_project(user_id=auth.user_id)
    #         project_id = project["project_id"]

    #     # Create solution
    #     sol_db = await dataaccess_solutions.create(
    #         name=solution.name,
    #         description=solution.description,
    #         project_id=project_id,
    #         diff_equation_details=solution.diff_equation_details
    #     )

    # return sol_db

    # Check if project was passed and if user has access to that project
    if solution.project is not None:
        ...

    return {}


@router.put(
    "/solutions/{id}",
    tags=["Solutions"],
    summary="Update a solution",
    description="Update a solution using the provided metadata.",
    response_description="The updated solution",
)
async def solutions_update(
    solution: SolutionUpdate,
    id: int = Path(..., description="The solution id"),
    auth: Auth = Depends(),
):
    # solution.name = normalize_name(solution.name) Cannot change solution name yet
    # Update solution
    sol_db = await dataaccess_solutions.update(
        id=id,
        user_id=auth.user_id,
        description=solution.description,
        equation_id=solution.equation_id,
        featured=solution.featured,
        equation_details=solution.equation_details,
        variable_summary=solution.variable_summary,
        usecase_summary=solution.usecase_summary,
        reference_summary=solution.reference_summary,
        training_summary=solution.training_summary,
        other_summary=solution.other_summary,
        citation=solution.citation,
    )

    return sol_db


@router.post(
    "/solutions/upload",
    tags=["Solutions"],
    summary="Upload a solution file along with solution metadata",
    description="Upload a solution file along with solution metadata",
)
async def solutions_upload(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    solution: UploadFile = File(...),
    auth: Auth = Depends(),
):
    # Read the solution file
    file_contents = await file.read()
    print(len(file_contents), type(file_contents))

    # Read the solutions metadata
    solution_json = await solution.read()
    solution_json = solution_json.decode("utf-8")
    solution_json = json.loads(solution_json)
    print(solution_json)

    # solution_json["name"] = normalize_name(solution_json["name"])

    # Get project
    projectname = None
    if "/" in solution_json["name"]:
        projectname = solution_json["name"].split("/")[0]
        projectname = normalize_name(projectname)
        solutionname = "/".join(solution_json["name"].split("/")[1:])
        solutionname = normalize_name(solutionname)
    else:
        solutionname = solution_json["name"]
        solutionname = normalize_name(solutionname)

    if projectname is None:
        # Get users default project
        project = await dataaccess_projects.get_default_project(user_id=auth.user_id)
        projectname = project["projectname"]
    else:
        project = await dataaccess_projects.get_by_projectname_for_user(
            auth.user_id, projectname
        )

    # Getting Project Users to mail to
    # print("Project ID:",project["id"])
    project_users = await dataaccess_projects.get_all_users(project["id"])
    print("Project Users:", project_users)
    project_description = project_users[0]["description"]
    usernames = [u["username"] for u in project_users]
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

    # # Check if public
    # if project["is_public"] == True:
    #     solutionname = auth.user_id

    lambda_function = solution_json["diff_equation_details"]["equation"]
    if lambda_function != "":
        order = get_order(lambda_function)
        variables = get_variables(lambda_function)
        independent_variables = get_independent_variables(variables, order)
        solution_json["diff_equation_details"]["order"] = order
        solution_json["diff_equation_details"]["variables"] = variables
        solution_json["diff_equation_details"][
            "independent_variables"
        ] = independent_variables
        solution_json["diff_equation_details"]["dependent_variables"] = list(
            order.keys()
        )

    domain_t_min = None
    domain_t_max = None
    domain_x_min = None
    domain_x_max = None
    domain_y_min = None
    domain_y_max = None
    if solution_json["type_name"] == "Solver1D":
        domain_t_min = solution_json["diff_equation_details"]["generator"]["t_min"]
        domain_t_max = solution_json["diff_equation_details"]["generator"]["t_max"]
    elif solution_json["type_name"] == "Solver2D":
        domain_x_min = solution_json["diff_equation_details"]["generator"]["xy_min"][0]
        domain_x_max = solution_json["diff_equation_details"]["generator"]["xy_max"][0]
        domain_y_min = solution_json["diff_equation_details"]["generator"]["xy_min"][1]
        domain_y_max = solution_json["diff_equation_details"]["generator"]["xy_max"][1]

    # # Generate equation_details -> equation_tex (array of tex equations returned from parse function)
    # equation_tex = equation_utils.parse_string(
    #     solution_json["diff_equation_details"]["equation"])
    # #Temp Fix
    # if(len(equation_tex) == 1):
    #     equation_tex = equation_tex[0].split(";")
    # conditions_tex = equation_utils.parse_conditions(
    #     solution_json["diff_equation_details"]["conditions"],
    #     solution_json["diff_equation_details"]["independent_variables"],
    #     solution_json["diff_equation_details"]["dependent_variables"])
    greek_letters = {
        "alpha",
        "beta",
        "gamma",
        "delta",
        "epsilon",
        "theta",
        "iota",
        "kappa",
        "lambda",
        "mu",
        "nu",
        "pi",
        "rho",
        "sigma",
        "phi",
        "psi",
        "omega",
        "cos",
        "sin",
        "tan",
        "sec",
        "cosec",
        "cot",
    }
    parameter_list = []
    if len(solution_json["diff_equation_details"]["parameters"]) > 0:
        for p, v in solution_json["diff_equation_details"]["parameters"].items():
            p = p.replace("_", "\_")
            if p in greek_letters:
                p = "\\" + p
            val = p + " = " + str(v)
            parameter_list.append(val)

    # Eq Details vary if Universal or Normal

    if "conditions_tex" in solution_json["diff_equation_details"]:
        # equation_details = {
        #     "equation_tex": solution_json["diff_equation_details"]["equation_tex"],
        #     "conditions_tex": solution_json["diff_equation_details"]["conditions_tex"],
        #     "parameters": parameter_list
        # }
        equation_details = {"equation_tex": "", "conditions_tex": "", "parameters": ""}

    else:
        # equation_details = {
        #     "equation_tex": solution_json["diff_equation_details"]["equation_tex"],
        #     "t_tex": solution_json["diff_equation_details"]["t_tex"],
        #     "u_tex": solution_json["diff_equation_details"]["u_tex"],
        #     "parameters": parameter_list
        # }
        equation_details = {
            "equation_tex": "",
            "t_tex": "",
            "u_tex": "",
            "parameters": "",
        }

    # Check if solution already exists in project
    try:
        sol_db = await dataaccess_solutions.get_by_name(solutionname, projectname)
        version = sol_db["version"] + 1

        # Update existing solution with new version
        sol_db = await dataaccess_solutions.update(
            id=sol_db["id"],
            user_id=auth.user_id,
            version=version,
            description=solution_json["description"],
            equation_type=diff_equation_type_mapping[solution_json["type_name"]],
            diff_equation_details=solution_json["diff_equation_details"],
            domain_t_min=domain_t_min,
            domain_t_max=domain_t_max,
            domain_x_min=domain_x_min,
            domain_x_max=domain_x_max,
            domain_y_min=domain_y_min,
            domain_y_max=domain_y_max,
            equation_details=equation_details,
            variable_summary=solution_json.get("variable_summary"),
            usecase_summary=solution_json.get("usecase_summary"),
            reference_summary=solution_json.get("reference_summary"),
            training_summary=solution_json.get("training_summary"),
            other_summary=solution_json.get("other_summary"),
            citation=solution_json.get("citation"),
        )
        body = {
            "title": "NeuroDiff: Solution Uploaded",
            "project_admin": current_user["username"],
            "project_status": "updated solution " + solutionname + " in project",
            "project_name": project["projectname"],
            "project_descrip": project_description,
        }
        print(body)
        # Send  Email
        try:
            send_detailsnotification_email(
                background_tasks, subject=subject, email_to=email_to, body=body
            )
        except Exception as e:
            print(e)

    except RecordNotFoundError:
        # Create solution
        sol_db = await dataaccess_solutions.create(
            user_id=auth.user_id,
            name=solutionname,
            description=solution_json["description"],
            project_id=project["id"],
            equation_type=diff_equation_type_mapping[solution_json["type_name"]],
            diff_equation_details=solution_json["diff_equation_details"],
            domain_t_min=domain_t_min,
            domain_t_max=domain_t_max,
            domain_x_min=domain_x_min,
            domain_x_max=domain_x_max,
            domain_y_min=domain_y_min,
            domain_y_max=domain_y_max,
            equation_details=equation_details,
            variable_summary=solution_json.get("variable_summary"),
            usecase_summary=solution_json.get("usecase_summary"),
            reference_summary=solution_json.get("reference_summary"),
            training_summary=solution_json.get("training_summary"),
            other_summary=solution_json.get("other_summary"),
            citation=solution_json.get("citation"),
        )
        body = {
            "title": "NeuroDiff: Solution Uploaded",
            "project_admin": current_user["username"],
            "project_status": "created a new solution " + solutionname,
            "project_name": project["projectname"],
            "project_descrip": project_description,
        }
        print(body)
        try:
            send_detailsnotification_email(
                background_tasks, subject=subject, email_to=email_to, body=body
            )
        except Exception as e:
            print(e)

        version = sol_db["version"]
        print("Version:", version)
        # Hub status history
        _ = await dataaccess_solutions.create_hub_status_history(
            solution_id=sol_db["id"],
            hub_status=HubStatusType.created,
            comments="Solution created",
        )

    # Insert solution conditions for the current version
    conditions = solution_json["diff_equation_details"]["conditions"]
    for condition in conditions:
        # Create solution condition
        sol_cond_db = await dataaccess_solutions_conditions.create(
            solution_id=sol_db["id"],
            version=version,
            condition_type=condition_type_mapping[condition["condition_type"]],
            ith_unit=condition.get("ith_unit", None),
            t_0=condition.get("t_0", None),
            u_0=condition.get("u_0", None),
            u_0_prime=condition.get("u_0_prime", None),
            t_1=condition.get("t_1", None),
            u_1=condition.get("u_1", None),
            x0=condition.get("x0", None),
            f0=condition.get("f0", None),
            x1=condition.get("x1", None),
            f1=condition.get("f1", None),
            y0=condition.get("y0", None),
            g0=condition.get("g0", None),
            y1=condition.get("y1", None),
            g1=condition.get("g1", None),
        )

    # Save the solution file
    # Save the solution file to <folder solution id>/<filename version>
    solution_file_path = fileaccess_solutions.save_solution(
        file_contents, str(sol_db["id"]), str(version)
    )

    # # Load the solution file to extract info from the saved dict file
    # with open(solution_file_path, 'rb') as file:
    #     load_dict = dill.load(file)

    # nets = load_dict['nets']
    # print(nets)

    return sol_db


@router.get(
    "/solutions/top_contributors",
    tags=["Solutions"],
    summary="Get top contributors",
    description="Get top contributors",
    response_description="The list of top contributors",
)
async def get_top_contributors():
    return await dataaccess_solutions.get_top_contributors()


@router.get(
    "/solutions/hub_status_history",
    tags=["Solutions"],
    summary="Get solutions hub status history",
    description="Get solutions hub status history",
    response_description="The list of solution hub status",
)
async def get_hub_status_history(
    id: int = Query(..., description="The solution id"), auth: Auth = Depends()
):
    return await dataaccess_solutions.get_hub_status_history(id=id)


@router.get(
    "/solutions/versions",
    tags=["Solutions"],
    summary="Get solution versions",
    description="Get solution versions",
    response_description="The list of solution versions",
)
async def get_solution_versions(id: int = Query(..., description="The solution id")):
    return await dataaccess_solutions.get_versions(id=id)


@router.get(
    "/solutions/download",
    tags=["Solutions"],
    summary="Download a solution",
    description="Download a solution by id or name.",
    response_description="The solution pickle file",
)
async def solutions_download(
    id: int = Query(None, description="The solution id"),
    name: str = Query(None, description="The solution name"),
    auth: OptionalAuth = Depends(),
):
    # If name was passed get the id from DB
    # Get the project from name
    # e.g: shivasj/laplace
    # e.q: shivasj/laplace?version=2
    # e.q: shivasj/laplace?version=2&key=asasasasasas
    # url = NEURODIFF_API_URL + "/projects/check_access/{project}"
    # response = requests.get(
    #    url.format(project=project),
    #    headers=_make_api_headers()
    #    )
    # if not response.ok:
    # response.raise_for_status()
    # print("You do not have access to the project:",project)

    if id is None:
        projectname = name.split("/")[0]
        solution_name = name.split("/")[1]
        projectname = normalize_name(projectname)
        solution_name = normalize_name(solution_name)
        solution = await dataaccess_solutions.get_by_name(
            name=solution_name, projectname=projectname
        )
    else:
        solution = await dataaccess_solutions.get(id)

    # Update download count
    download_count = solution["download_count"] + 1
    _ = await dataaccess_solutions.update(
        id=solution["id"], user_id=auth.user_id, download_count=download_count
    )

    # Get the saved solution
    solutions_file = fileaccess_solutions.get_solution(
        str(solution["id"]), str(solution["version"])
    )

    # print(solutions_file)
    print(type(solutions_file))

    # return FileResponse(solutions_file, media_type='application/octet-stream',filename=name)
    headers = {"Content-Disposition": "attachment; filename=" + solution["name"]}
    return Response(
        solutions_file, media_type="application/octet-stream", headers=headers
    )


@router.get(
    "/solutions/access/{id}",
    tags=["Solutions"],
    summary="Check access for a solution",
    description="Get all information about a specific solution.",
    response_description="The solution",
)
async def solutions_access(
    id: int = Path(..., description="The solution id"), auth: OptionalAuth = Depends()
):
    if auth.user_id is None:
        user_id = -1
    else:
        user_id = auth.user_id
    result = await dataaccess_solutions.check_access(id, user_id)

    return result


@router.get(
    "/solutions/{id}",
    tags=["Solutions"],
    summary="Get information about a solution",
    description="Get all information about a specific solution.",
    response_description="The solution",
)
async def solutions_fetch(
    id: int = Path(..., description="The solution id"), auth: OptionalAuth = Depends()
):
    result = await dataaccess_solutions.get(id)

    return result


@router.post(
    "/solutions/{id}/upload",
    tags=["Solutions"],
    summary="Upload a solution file",
    description="Upload a solution file",
)
async def solutions_upload_with_id(
    file: bytes = File(...),
    id: int = Path(..., description="The solution id"),
    auth: Auth = Depends(),
):
    print(len(file), type(file))

    # Get Solution details
    solution = await dataaccess_solutions.get(id)

    # Save the file
    fileaccess_solutions.save_solution(file, str(id))


@router.put(
    "/solutions/{id}/submit",
    tags=["Solutions"],
    summary="Submit a solution for review",
    description="Submit a solution for review.",
    response_description="The updated solution",
)
async def solutions_submit(
    status_comment: SolutionStatusComment,
    id: int = Path(..., description="The solution id"),
    auth: Auth = Depends(),
):
    # TODO: Check if user has access to update solution

    # Update solution
    sol_db = await dataaccess_solutions.update(
        id=id, user_id=auth.user_id, hub_status=HubStatusType.submitted
    )

    # Hub status history
    _ = await dataaccess_solutions.create_hub_status_history(
        solution_id=sol_db["id"],
        hub_status=HubStatusType.submitted,
        comments=status_comment.comment,
    )

    return sol_db


@router.put(
    "/solutions/{id}/publish",
    tags=["Solutions"],
    summary="Publish a solution",
    description="Publish a solution",
    response_description="The updated solution",
)
async def solutions_publish(
    status_comment: SolutionStatusComment,
    id: int = Path(..., description="The solution id"),
    auth: Auth = Depends(),
):
    # TODO: Check if user is admin

    # Update solution
    sol_db = await dataaccess_solutions.update(
        id=id, user_id=auth.user_id, hub_status=HubStatusType.published
    )

    # Hub status history
    _ = await dataaccess_solutions.create_hub_status_history(
        solution_id=sol_db["id"],
        hub_status=HubStatusType.published,
        comments=status_comment.comment,
    )

    return sol_db


@router.put(
    "/solutions/{id}/reject",
    tags=["Solutions"],
    summary="Reject a solution for publishing",
    description="Reject a solution for publishing",
    response_description="The updated solution",
)
async def solutions_reject(
    status_comment: SolutionStatusComment,
    id: int = Path(..., description="The solution id"),
    auth: Auth = Depends(),
):
    # TODO: Check if user is admin

    # Update solution
    sol_db = await dataaccess_solutions.update(
        id=id, user_id=auth.user_id, hub_status=HubStatusType.rejected
    )

    # Hub status history
    _ = await dataaccess_solutions.create_hub_status_history(
        solution_id=sol_db["id"],
        hub_status=HubStatusType.rejected,
        comments=status_comment.comment,
    )

    return sol_db


@router.delete(
    "/solutions/{id}",
    tags=["Solutions"],
    summary="Delete solution for user by solution id",
    description="Delete solution for user",
    response_description="Deleted solution",
)
async def solution_id_delete(
    id: int = Path(..., description="The solution id"),
    # auth: Auth = Depends()
):
    # TODO: Check if user has access to delete solution
    await dataaccess_solutions.delete(
        id=id,
        # user_id=auth.user_id
    )
