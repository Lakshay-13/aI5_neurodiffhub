
import os
from typing import Any, Dict, List
import json

from dataaccess import utils as data_utils
from dataaccess.session import database
from dataaccess.types import DiffEquationType, HubStatusType, SolutionSorting, ConditionType
from dataaccess.errors import RecordNotFoundError


async def browse(
    *,
    q: str = None,
    user_id: int = None,
    hub_status: List[str] = None,
    return_count: bool = False,
    featured: bool = None,
    equation_types: List[str] = None,
    problem_types: List[str] = None,
    condition_types: List[str] = None,
    equation_ids: List[int] = None,
    use_case_ids: List[int] = None,
    domain_t_min: float = None,
    domain_t_max: float = None,
    domain_x_min: float = None,
    domain_x_max: float = None,
    domain_y_min: float = None,
    domain_y_max: float = None,
    sort_by: SolutionSorting = None,
    sort_direction: str = None,
    page_number: int = 0,
    page_size: int = 20
) -> List[Dict[str, Any]]:
    """
    Retrieve a list of rows based on filters
    """

    select_count = """
        select count(*) as count
    """

    select = """
        select s.id,s.name,s.description,s.diff_equation_details,s.version, s.is_private, s.hub_status, s.equation_type ,r.projectname,
        s.download_count,s.featured,s.like_count,s.favorite_count,s.domain_t_min,s.domain_t_max,s.domain_x_min,s.domain_x_max,s.domain_y_min,
        s.domain_y_max,
        s.equation_details,s.variable_summary,s.usecase_summary,s.reference_summary,s.training_summary,s.other_summary,s.citation,
        concat(r.projectname,'/',s.name) as label , eq.name as equation_name
    """
    where = """
        from solutions s
        inner join projects r on (r.id = s.project_id)
        left join equations eq on (s.equation_id = eq.id)
        where 1=1
    """

    #query += " and is_private=false"

    if user_id is not None:
        where += " and r.id in (select project_id from projects_users where user_id={user_id})".format(
            user_id=user_id)

    if equation_types is not None:
        equation_types_filter = ",".join(equation_types)
        equation_types_filter = "'" + \
            equation_types_filter.replace(",", "','")+"'"

        where += " and s.equation_type in ("+equation_types_filter+")"

    if problem_types is not None:
        condition_types_filter = None
        for pt in problem_types:
            if pt == 'ivp':
                condition_types_filter = "'"+ConditionType.ivp+"','"+ConditionType.ibvp1d+"'"

            if pt == 'bvp':
                condition_types_filter = "'"+ConditionType.ibvp1d+"','" + \
                    ConditionType.dirichletbvp+"','"+ConditionType.dirichletbvp2d+"'"

        if condition_types_filter is not None:
            where += " and s.id in ("
            where += " select distinct solution_id from solutions_conditions where condition_type in (" + \
                condition_types_filter+")"
            where += ")"

    if condition_types is not None:
        condition_types_filter = ",".join(condition_types)
        condition_types_filter = "'" + \
            condition_types_filter.replace(",", "','")+"'"

        where += " and s.id in ("
        where += " select distinct solution_id from solutions_conditions where condition_type in (" + \
            condition_types_filter+")"
        where += ")"

    if equation_ids is not None:
        equation_ids_filter = ",".join(equation_ids)
        where += " and s.equation_id in ("+equation_ids_filter+")"

    if use_case_ids is not None:
        use_case_ids_filter = ",".join(use_case_ids)
        where += " and s.id in ("
        where += " select distinct solution_id from solutions_use_cases where use_case_id in (" + \
            use_case_ids_filter+")"
        where += ")"

    if domain_t_min is not None:
        where += " and s.domain_t_min <= " + str(domain_t_min)
    if domain_t_max is not None:
        where += " and s.domain_t_max >= " + str(domain_t_max)
    if domain_x_min is not None:
        where += " and s.domain_x_min <= " + str(domain_x_min)
    if domain_x_max is not None:
        where += " and s.domain_x_max >= " + str(domain_x_max)
    if domain_y_min is not None:
        where += " and s.domain_y_min <= " + str(domain_y_min)
    if domain_y_max is not None:
        where += " and s.domain_y_max >= " + str(domain_y_max)

    if hub_status is not None:
        hub_status_filter = ",".join(hub_status)
        hub_status_filter = "'"+hub_status_filter.replace(",", "','")+"'"

        where += " and s.hub_status in ("+hub_status_filter+")"

    # search string
    if q is not None:
        where += " and (r.projectname like'%"+q+"%' or s.name like '%"+q+"%')"

    # featured
    if featured:
        where += " and s.featured = true"

    # order by
    order = ""
    if sort_by is not None:
        if sort_by == SolutionSorting.created:
            order = " order by s.created_at"
            sort_direction = "desc"
        if sort_by == SolutionSorting.updated:
            order = " order by s.updated_at"
            sort_direction = "desc"
        if sort_by == SolutionSorting.alphabetical:
            order = " order by label"
            sort_direction = "asc"
        if sort_by == SolutionSorting.downloads:
            order = " order by s.download_count"
            sort_direction = "desc"
        if sort_by == SolutionSorting.likes:
            order = " order by s.like_count"
            sort_direction = "desc"

        if sort_direction is not None:
            order += " " + sort_direction

    if return_count:
        # Build total count query
        query = select_count + " " + where
        print("query", query)
        result = await database.fetch_one(query)

        return [prep_data(result)]
    else:
        # Build select query
        query = select + " " + where + " " + order + \
            data_utils.build_pagination(page_number, page_size)

        print("query", query)
        result = await database.fetch_all(query)

        return [prep_data(row) for row in result]


async def get_top_contributors() -> List[Dict[str, Any]]:
    """
    Retrieve a list of rows
    """
    query = """
        select u.username,u.full_name,p.user_id, count(s.id) as solutions_count
        from solutions s
        inner join projects_users p on (p.project_id = s.project_id and (p.permission_type='owner' or p.permission_type='readwrite'))
        inner join users u on (p.user_id = u.id)
        where 1=1
        and s.hub_status = 'published'
        group by u.username,u.full_name,p.user_id
        order by solutions_count desc
    """

    print("query", query)
    result = await database.fetch_all(query)

    return [prep_data(row) for row in result]


async def get_hub_status_history(id: int) -> List[Dict[str, Any]]:
    """
    Retrieve a list of rows
    """
    query = """
        select solution_id, hub_status, comments,created_at
        from solutions_hub_status_history
        where 1=1
        and solution_id = :id
        order by created_at desc
    """

    values = {
        "id": id
    }

    print("query:", query, "values:", values)
    result = await database.fetch_all(query, values)

    return [prep_data(row) for row in result]


async def get(id: int) -> Dict[str, Any]:
    """
    Retrieve one row based by its id. Return object is a dict. 
    Raises if the record was not found.
    """

    query = """
        select s.id,s.name,s.description,s.diff_equation_details,s.version, s.is_private, s.hub_status,
        s.download_count,s.featured, s.equation_type,s.equation_id ,r.projectname,s.like_count,s.favorite_count,s.domain_t_min,s.domain_t_max,
        s.domain_x_min,s.domain_x_max,s.domain_y_min,s.domain_y_max,
        s.equation_details,s.variable_summary,s.usecase_summary,s.reference_summary,s.training_summary,s.other_summary,s.citation,
        concat(r.projectname,'/',s.name) as label , eq.name as equation_name
        from solutions s
        inner join projects r on (r.id = s.project_id)
        left join equations eq on (s.equation_id = eq.id)
        where 1=1
        and s.id = :id
    """

    values = {
        "id": id
    }

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(f"Could not find row with id '{id}'")

    return prep_data(result)


async def get_versions(id: int) -> List[Dict[str, Any]]:
    """
    Retrieve a list of rows
    """

    query = """
        select s.id,s.name,sv.description,sv.version,sv.updated_by, sv.updated_at, u.username
        from solutions s
        inner join solutions_versions sv on (s.id = sv.solution_id)
        inner join users u on (sv.updated_by = u.id) 
        where 1=1
        and s.id = :id
    """

    values = {
        "id": id
    }

    print("query:", query, "values:", values)
    result = await database.fetch_all(query, values)
    print("Getting Version")
    print(result)
    return [prep_data(row) for row in result]


async def get_by_name(name: str, projectname: str) -> Dict[str, Any]:
    """
    Retrieve one row based by its name. Return object is a dict. 
    Raises if the record was not found.
    """

    query = """
        select s.id,s.name,s.description,s.diff_equation_details,s.version, s.is_private ,s.hub_status,
        s.download_count, s.featured,s.like_count,s.favorite_count
        from solutions s
        inner join projects r on (r.id = s.project_id)
        where 1=1
        and name = :name
        and r.projectname = :projectname
    """

    values = {
        "name": name,
        "projectname": projectname
    }

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(f"Could not find row with name '{name}'")

    return prep_data(result)


async def check_access(id: int, user_id: int) -> Dict[str, Any]:

    query = """
        select s.id,p.permission_type
        from solutions s
        inner join projects_users p on (p.project_id = s.project_id and p.user_id = :user_id)
        where 1=1
        and s.id = :id
    """

    values = {
        "id": id,
        "user_id": user_id
    }

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        result = {
            "permission_type": "read"
        }
    else:
        result = {
            "permission_type": result["permission_type"]
        }

    return result


async def create(*,
                 user_id: int,
                 name: str,
                 description: str,
                 project_id: int,
                 equation_type: DiffEquationType,
                 diff_equation_details: str = None,
                 domain_t_min: float = None,
                 domain_t_max: float = None,
                 domain_x_min: float = None,
                 domain_x_max: float = None,
                 domain_y_min: float = None,
                 domain_y_max: float = None,
                 equation_details: str = None,
                 variable_summary: str = None,
                 usecase_summary: str = None,
                 reference_summary: str = None,
                 training_summary: str = None,
                 other_summary: str = None,
                 citation: str = None,
                 id: int = None) -> Dict[str, Any]:
    """
    Create a new row. Returns the created record as a dict.
    """

    # Set the values
    values = {
        "name": name,
        "description": description,
        "project_id": project_id,
        "equation_type": equation_type,
        "created_by": user_id,
        "updated_by": user_id,
    }

    # if the id was passed
    if id is not None:
        values["id"] = id

    if diff_equation_details is not None:
        values["diff_equation_details"] = json.dumps(diff_equation_details)
    if equation_details is not None:
        values["equation_details"] = json.dumps(equation_details)
    if variable_summary is not None:
        values["variable_summary"] = variable_summary
    if usecase_summary is not None:
        values["usecase_summary"] = usecase_summary
    if reference_summary is not None:
        values["reference_summary"] = reference_summary
    if training_summary is not None:
        values["training_summary"] = training_summary
    if other_summary is not None:
        values["other_summary"] = other_summary
    if citation is not None:
        values["citation"] = citation

    if domain_t_min is not None:
        values["domain_t_min"] = domain_t_min
    if domain_t_max is not None:
        values["domain_t_max"] = domain_t_max
    if domain_x_min is not None:
        values["domain_x_min"] = domain_x_min
    if domain_x_max is not None:
        values["domain_x_max"] = domain_x_max
    if domain_y_min is not None:
        values["domain_y_min"] = domain_y_min
    if domain_y_max is not None:
        values["domain_y_max"] = domain_y_max

    # Generate the field and values list
    field_list = ", ".join(values.keys())
    param_list = ", ".join(":" + key for key in values.keys())

    result = await database.fetch_one(f"""
        INSERT INTO solutions (
            {field_list}
        ) VALUES (
            {param_list}
        ) RETURNING *;
    """, values=values)

    result = prep_data(result)
    return result


async def update(id: int,
                 user_id: int,
                 version: float = None,
                 name: str = None,
                 description: str = None,
                 equation_type: DiffEquationType = None,
                 diff_equation_details: str = None,
                 equation_id: int = None,
                 hub_status: HubStatusType = None,
                 download_count: int = None,
                 domain_t_min: float = None,
                 domain_t_max: float = None,
                 domain_x_min: float = None,
                 domain_x_max: float = None,
                 domain_y_min: float = None,
                 domain_y_max: float = None,
                 featured: bool = None,
                 equation_details: str = None,
                 variable_summary: str = None,
                 usecase_summary: str = None,
                 reference_summary: str = None,
                 training_summary: str = None,
                 other_summary: str = None,
                 citation: str = None) -> Dict[str, Any]:
    """
    Updates an existing row. Keyword arguments left at None will not be
    changed in the database. Returns the updated record as a dict. Raises if
    the record was not found.
    """

    values = {
        "id": id
    }

    changes: Dict[str, Any] = {
        "updated_by": user_id
    }

    if version is not None:
        changes["version"] = version
    if name is not None:
        changes["name"] = name
    if description is not None:
        changes["description"] = description
    if equation_type is not None:
        changes["equation_type"] = equation_type
    if diff_equation_details is not None:
        changes["diff_equation_details"] = json.dumps(diff_equation_details)
    if equation_id is not None:
        changes["equation_id"] = equation_id
    if hub_status is not None:
        changes["hub_status"] = hub_status
    if download_count is not None:
        changes["download_count"] = download_count
    if featured is not None:
        changes["featured"] = featured
    if domain_t_min is not None:
        changes["domain_t_min"] = domain_t_min
    if domain_t_max is not None:
        changes["domain_t_max"] = domain_t_max
    if domain_x_min is not None:
        changes["domain_x_min"] = domain_x_min
    if domain_x_max is not None:
        changes["domain_x_max"] = domain_x_max
    if domain_y_min is not None:
        changes["domain_y_min"] = domain_y_min
    if domain_y_max is not None:
        changes["domain_y_max"] = domain_y_max
    if equation_details is not None:
        changes["equation_details"] = json.dumps(equation_details)
    if variable_summary is not None:
        changes["variable_summary"] = variable_summary
    if usecase_summary is not None:
        changes["usecase_summary"] = usecase_summary
    if reference_summary is not None:
        changes["reference_summary"] = reference_summary
    if training_summary is not None:
        changes["training_summary"] = training_summary
    if other_summary is not None:
        changes["other_summary"] = other_summary
    if citation is not None:
        changes["citation"] = citation

    change_list = ", ".join(key + " = :" + key for key in changes.keys())
    change_list += ", updated_at = EXTRACT(EPOCH FROM clock_timestamp()) * 1000"

    print(change_list)

    result = await database.fetch_one(f"""
        UPDATE solutions
        SET {change_list}
        WHERE id = :id
        RETURNING *;
    """, values={**values, **changes})

    if result is None:
        raise RecordNotFoundError(f"Could not update row with id '{id}'")

    result = prep_data(result)
    return result


async def create_hub_status_history(*,
                                    solution_id: int,
                                    hub_status: HubStatusType,
                                    comments: str,
                                    id: int = None) -> Dict[str, Any]:
    """
    Create a new row. Returns the created record as a dict.
    """

    # Set the values
    values = {
        "solution_id": solution_id,
        "hub_status": hub_status,
        "comments": comments
    }

    # if the id was passed
    if id is not None:
        values["id"] = id

    # Generate the field and values list
    field_list = ", ".join(values.keys())
    param_list = ", ".join(":" + key for key in values.keys())

    result = await database.fetch_one(f"""
        INSERT INTO solutions_hub_status_history (
            {field_list}
        ) VALUES (
            {param_list}
        ) RETURNING *;
    """, values=values)

    result = prep_data(result)
    return result


def prep_data(result) -> Dict[str, Any]:
    if result is None:
        raise ValueError("Tried to prepare null result")

    result = dict(result)

    if "diff_equation_details" in result and result["diff_equation_details"] is not None:
        result["diff_equation_details"] = json.loads(
            result["diff_equation_details"])

    if "equation_details" in result and result["equation_details"] is not None:
        result["equation_details"] = json.loads(
            result["equation_details"])

    return result


async def delete(*, id: int) -> None:
    """
    Deletes an existing row. Raises if the record was not found.
    """

    deleted_row_count = await database.execute("""
        WITH deleted AS (
            DELETE FROM solutions
            WHERE id = :id
            RETURNING id
        ) SELECT COUNT(id) FROM deleted;
    """, values={"id": id})

    if deleted_row_count == 0:
        raise RecordNotFoundError(f"Could not delete Solution with id '{id}'")
