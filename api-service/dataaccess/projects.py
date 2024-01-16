import os
from typing import Any, Dict, List

from dataaccess import utils as data_utils
from dataaccess.session import database
from dataaccess.errors import RecordNotFoundError, NoAccessError
from dataaccess.types import PermissionType


async def browse(
    *,
    q: str = None,
    user_id: int,
    is_default: bool = None,
    page_number: int = 0,
    page_size: int = 20,
) -> List[Dict[str, Any]]:
    """
    Retrieve a list of rows based on filters
    """

    query = """
        select r.id,r.projectname,r.description, ru.permission_type,ru.is_default,r.is_public
        from projects r
        inner join projects_users ru on (r.id = ru.project_id) 
        inner join users u on (u.id = ru.user_id)
        where 1=1
        and u.id = :user_id
    """

    if q is not None:
        query += " and r.projectname like'%" + q + "%'"

    if is_default is not None:
        query += " and ru.is_default=" + str(is_default)

    # order by

    # offset/limit
    query += data_utils.build_pagination(page_number, page_size)

    values = {"user_id": user_id}

    print("query", query)
    result = await database.fetch_all(query, values)

    return [prep_data(row) for row in result]


async def get(id: int) -> Dict[str, Any]:
    """
    Retrieve one row based by its id. Return object is a dict.
    Raises if the record was not found.
    """

    query = """
        select id,projectname,description,is_public from projects where id = :id
    """

    values = {"id": id}

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(f"Could not find row with id '{id}'")

    return prep_data(result)


async def get_by_projectname_for_user(user_id: int, projectname: str) -> Dict[str, Any]:
    """
    Retrieve one row based by its projectname. Return object is a dict.
    Raises if the record was not found.
    """

    query = """
        select r.id,r.projectname,r.description, ru.permission_type,ru.is_default,r.is_public
        from projects r
        inner join projects_users ru on (r.id = ru.project_id) 
        inner join users u on (u.id = ru.user_id)
        where 1=1
        and (u.id = :user_id
        and r.projectname = :projectname)
        or (r.is_public is TRUE)
    """

    values = {"user_id": user_id, "projectname": projectname}

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(
            f"Could not find row with projectname '{projectname}'"
        )

    return prep_data(result)


async def check_projectname_access(
    user_id: int, projectname: str, permission_type: str
) -> Dict[str, Any]:
    """
    Retrieve one row based by its projectname. Return object is a dict.
    Raises if the record was not found.
    """

    query = """
        select r.id,r.projectname,r.description, ru.permission_type,ru.is_default,r.is_public
        from projects r
        inner join projects_users ru on (r.id = ru.project_id) 
        where 1=1
        and 
        (ru.user_id = :user_id
            and r.projectname = :projectname
            and (ru.permission_type = :permission_type or ru.permission_type='owner')
        ) or (r.is_public is TRUE)
    """

    values = {
        "user_id": user_id,
        "projectname": projectname,
        "permission_type": permission_type,
    }

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise NoAccessError(f"No access to the projectname '{projectname}'")

    return prep_data(result)


async def get_default_project(user_id: int) -> Dict[str, Any]:
    query = """
        select p.id,pu.user_id,p.projectname,p.is_public
        from projects_users pu
        inner join projects p on (pu.project_id = p.id)
        where user_id = :user_id
        and is_default = true
    """

    values = {"user_id": user_id}

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(f"Could not find default project")

    return prep_data(result)


async def create(
    *,
    projectname: str,
    description: str = None,
    is_public: bool = False,
    id: int = None,
) -> Dict[str, Any]:
    """
    Create a new row. Returns the created record as a dict.
    """
    projectname = projectname.lower()

    # Set the values
    values = {"projectname": projectname, "is_public": is_public}

    # if the id was passed
    if id is not None:
        values["id"] = id

    if description is not None:
        values["description"] = description

    # Generate the field and values list
    field_list = ", ".join(values.keys())
    param_list = ", ".join(":" + key for key in values.keys())

    result = await database.fetch_one(
        f"""
        INSERT INTO projects (
            {field_list}
        ) VALUES (
            {param_list}
        ) RETURNING *;
    """,
        values=values,
    )

    result = prep_data(result)
    return result


async def create_project_user(
    *,
    project_id: int,
    user_id: int,
    permission_type: PermissionType,
    is_default: bool,
    id: int = None,
) -> Dict[str, Any]:
    """
    Create a new row. Returns the created record as a dict.
    """

    # Set the values
    values = {
        "project_id": project_id,
        "user_id": user_id,
        "permission_type": permission_type,
        "is_default": is_default,
    }

    # if the id was passed
    if id is not None:
        values["id"] = id

    # Generate the field and values list
    field_list = ", ".join(values.keys())
    param_list = ", ".join(":" + key for key in values.keys())

    result = await database.fetch_one(
        f"""
        INSERT INTO projects_users (
            {field_list}
        ) VALUES (
            {param_list}
        ) RETURNING *;
    """,
        values=values,
    )

    result = prep_data(result)
    return result


async def update(
    id: int,
    projectname: str = None,
    description: str = None,
    is_public: bool = False,
) -> Dict[str, Any]:
    """
    Updates an existing row. Keyword arguments left at None will not be
    changed in the database. Returns the updated record as a dict. Raises if
    the record was not found.
    """

    values = {"id": id}

    changes: Dict[str, Any] = {"is_public": is_public}

    if projectname is not None:
        changes["projectname"] = projectname

    if description is not None:
        changes["description"] = description

    change_list = ", ".join(key + " = :" + key for key in changes.keys())
    change_list += ", updated_at = EXTRACT(EPOCH FROM clock_timestamp()) * 1000"

    print(change_list)

    result = await database.fetch_one(
        f"""
        UPDATE projects
        SET {change_list}
        WHERE id = :id
        RETURNING *;
    """,
        values={**values, **changes},
    )

    if result is None:
        raise RecordNotFoundError(f"Could not update row with id '{id}'")

    result = prep_data(result)
    return result


async def update_default_project_user(projectid: int, userid: int):
    """
    Update is_default project for this user
    Returns updated details for user
    """

    values = {"project_id": projectid, "user_id": userid}

    changes: Dict[str, Any] = {"is_default": True}

    change_list = ", ".join(key + " = :" + key for key in changes.keys())
    change_list += ", updated_at = EXTRACT(EPOCH FROM clock_timestamp()) * 1000"

    print(change_list)

    result = await database.fetch_one(
        f"""
        UPDATE projects_users
        SET {change_list}
        WHERE 1=1
        and project_id = :project_id
        and user_id = :user_id
        RETURNING *;
    """,
        values={**values, **changes},
    )

    changes: Dict[str, Any] = {"is_default": False}

    change_list = ", ".join(key + " = :" + key for key in changes.keys())
    change_list += ", updated_at = EXTRACT(EPOCH FROM clock_timestamp()) * 1000"

    print(change_list)

    result2 = await database.fetch_one(
        f"""
        UPDATE projects_users
        SET {change_list}
        WHERE 1=1
        and project_id != :project_id
        and user_id = :user_id
        RETURNING *;
    """,
        values={**values, **changes},
    )

    if result2 is None or result is None:
        raise RecordNotFoundError(f"Could not update Project with id '{projectid}'")

    result = prep_data(result)
    result2 = prep_data(result2)
    print(result)
    print(result2)
    return [result, result2]  # Returns both changed entries


async def get_by_projectname(projectname: str) -> Dict[str, Any]:
    """
    Retrieve one row based by its name. Return object is a dict.
    Raises if the record was not found.
    """

    projectname = projectname.lower()

    query = """
        select id,projectname,description from projects where projectname = :projectname
    """

    values = {"projectname": projectname}

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(f"Could not find row with username '{projectname}'")

    return prep_data(result)


async def check_update_access(user_id: int, projectid: int):
    """
    Check if user is owner or has readwrite access for project with project id
    Raises if above not true
    """

    query = """
        select r.id,r.projectname,r.description, ru.permission_type,ru.is_default
        from projects r
        inner join projects_users ru on (r.id = ru.project_id) 
        where 1=1
        and ru.user_id = :user_id
        and r.id = :project_id
        and (ru.permission_type = 'readwrite' or ru.permission_type='owner')
    """

    values = {
        "user_id": user_id,
        "project_id": projectid,
    }

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise NoAccessError(f"No access to the project with id '{projectid}'")

    return prep_data(result)


async def check_owner_access(user_id: int, projectid: int):
    """
    Check if user is owner for project with project id
    Raises if above not true
    """

    query = """
        select r.id,r.projectname,r.description, ru.permission_type,ru.is_default
        from projects r
        inner join projects_users ru on (r.id = ru.project_id) 
        where 1=1
        and ru.user_id = :user_id
        and r.id = :project_id
        and ru.permission_type='owner'
    """

    values = {
        "user_id": user_id,
        "project_id": projectid,
    }

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise NoAccessError(f"No owner access to the project")

    return prep_data(result)


async def check_default_project(user_id: int, projectid: int):
    """
    Check if Project is the default one for owner
    Raises if true
    """

    query = """
        select ru.is_default
        from projects r
        inner join projects_users ru on (r.id = ru.project_id) 
        where 1=1
        and ru.user_id = :user_id
        and r.id = :project_id
        and ru.permission_type='owner'
    """

    values = {
        "user_id": user_id,
        "project_id": projectid,
    }

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)

    if prep_data(result)["is_default"]:  # If It is the default project
        raise NoAccessError(f"Cannot add to or delete your default project")

    return prep_data(result)


async def get_all_users(projectid: int):
    """
    Get details for all users for project with this project id
    """

    query = """
        select u.username,r.projectname,r.description,ru.permission_type,ru.is_default,r.is_public
        from projects r
        inner join projects_users ru on (r.id = ru.project_id) 
        inner join users u on (u.id = ru.user_id)
        where 1=1
        and r.id = :project_id
    """

    values = {
        "project_id": projectid,
    }

    print("query:", query, "values:", values)
    result = await database.fetch_all(query, values)

    if result is None:
        raise NoAccessError(f"No access to the project with id '{projectid}'")

    all_rows = []
    for row in result:
        all_rows.append(prep_data(row))

    return all_rows


async def add_project_user(
    projectid: int, username: str, permission_type: PermissionType
):
    """
    Add user for project with this project id
    Returns updated details for user
    """

    print("In Add User Function")

    values = {"username": username}

    query = """
        select u.id
        from users u
        where 1=1
        and u.username = :username
    """

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)
    if result is None:
        raise RecordNotFoundError(f"No such user exists with username'{username}'")

    result = prep_data(result)

    user_id = result["id"]

    print("User ID gotten:", user_id)

    # Set the values
    values = {
        "project_id": projectid,
        "user_id": user_id,
        "permission_type": permission_type,
        "is_default": False,
    }

    # Generate the field and values list
    field_list = ", ".join(values.keys())
    param_list = ", ".join(":" + key for key in values.keys())

    result = await database.fetch_one(
        f"""
        INSERT INTO projects_users (
            {field_list}
        ) VALUES (
            {param_list}
        ) RETURNING *;
    """,
        values=values,
    )

    result = prep_data(result)
    return result

    result = prep_data(result)
    return result


async def update_project_user(
    projectid: int, username: str, permission_type: PermissionType, auth_id: int
):
    """
    Add user for project with this project id
    Returns updated details for user
    """

    print("In Update User Function")

    values = {"username": username}

    query = """
        select u.id
        from users u
        where 1=1
        and u.username = :username
    """

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)
    if result is None:
        raise RecordNotFoundError(f"No such user exists with username'{username}'")

    result = prep_data(result)

    user_id = result["id"]

    print("User ID gotten:", user_id)
    # If Auth Id is same as user id deny
    if user_id == auth_id:
        raise NoAccessError("Cannot Update Permissions for Current Owner itself")

    # user_id
    # created at

    values = {"project_id": projectid, "user_id": user_id}

    changes: Dict[str, Any] = {"permission_type": permission_type}

    change_list = ", ".join(key + " = :" + key for key in changes.keys())
    change_list += ", updated_at = EXTRACT(EPOCH FROM clock_timestamp()) * 1000"

    print(change_list)

    result = await database.fetch_one(
        f"""
        UPDATE projects_users
        SET {change_list}
        WHERE 1=1
        and project_id = :project_id
        and user_id = :user_id
        RETURNING *;
    """,
        values={**values, **changes},
    )

    if result is None:
        raise RecordNotFoundError(f"Could not update Project with id '{projectid}'")

    result = prep_data(result)
    return result


async def remove_project_user(projectid: int, username: str, auth_id: int):
    """
    Remove user for project with this project id
    Returns Removal Successful
    """

    print("In Remove User Function")

    values = {"username": username}

    query = """
        select u.id
        from users u
        where 1=1
        and u.username = :username
    """

    print("query:", query, "values:", values)
    result = await database.fetch_one(query, values)
    if result is None:
        raise RecordNotFoundError(f"No such user exists with username'{username}'")

    result = prep_data(result)

    user_id = result["id"]

    print("User ID gotten:", user_id)

    # If Auth Id is same as user id deny
    if user_id == auth_id:
        raise NoAccessError("Cannot Remove Current Owner itself")

    # Delete from Projects_Users

    deleted_row_count = await database.execute(
        """
        WITH deleted AS (
            DELETE FROM projects_users
            WHERE 1=1
            and project_id = :id 
            and user_id = :user_id
            RETURNING id
        ) SELECT COUNT(id) FROM deleted;
    """,
        values={"id": projectid, "user_id": user_id},
    )

    if deleted_row_count == 0:
        raise RecordNotFoundError(
            f"Could not delete User {username} from Project with id '{projectid}'"
        )

    return {"User Removal": True}


async def delete(id: int) -> None:
    """
    Deletes existing row(s). Raises if the record was not found.
    """
    print("In Delete the Project Dataaccess Function")
    # First Delete from Projects_Users

    deleted_row_count = await database.execute(
        """
        WITH deleted AS (
            DELETE FROM projects_users
            WHERE project_id = :id 
            RETURNING id
        ) SELECT COUNT(id) FROM deleted;
    """,
        values={"id": id},
    )

    if deleted_row_count == 0:
        raise RecordNotFoundError(f"Could not delete Project with id '{id}'")

    # Then Delete from Projects

    deleted_row_count = await database.execute(
        """
        WITH deleted AS (
            DELETE FROM projects
            WHERE id = :id 
            RETURNING id
        ) SELECT COUNT(id) FROM deleted;
    """,
        values={"id": id},
    )

    if deleted_row_count == 0:
        raise RecordNotFoundError(f"Could not delete Project with id '{id}'")


def prep_data(result) -> Dict[str, Any]:
    if result is None:
        raise ValueError("Tried to prepare null result")

    result = dict(result)
    return result
