import os
from typing import Any, Dict, List

from dataaccess import utils as data_utils
from dataaccess.session import database
from dataaccess.errors import RecordNotFoundError

async def browse(
    *,
    user_id: int,
    page_number: int = 0,
    page_size: int = 20
) -> List[Dict[str, Any]]:
    """
    Retrieve a list of rows based on filters
    """
    
    query = """
        select uak.id,uak.key
        from users_api_keys uak
        where 1=1
        and user_id = :user_id
    """

    # order by

    # offset/limit
    query += data_utils.build_pagination(page_number,page_size)

    values = {
        "user_id": user_id
    }

    print("query",query)
    result = await database.fetch_all(query, values)

    return [prep_data(row) for row in result]

async def get(id: int) -> Dict[str, Any]:
    """
    Retrieve one row based by its id. Return object is a dict. 
    Raises if the record was not found.
    """

    query = """
        select id,key from users_api_keys where id = :id
    """

    values = {
        "id": id
    }

    print("query:",query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(f"Could not find row with id '{id}'")

    return prep_data(result)

async def get_by_key(key: str) -> Dict[str, Any]:
    """
    Retrieve one row based on column value. Return object is a dict. 
    Raises if the record was not found.
    """

    query = """
        select id,key,user_id from users_api_keys where key = :key
    """

    values = {
        "key": key
    }

    print("query:",query, "values:", values)
    result = await database.fetch_one(query, values)

    if result is None:
        raise RecordNotFoundError(f"Could not find row with key '{key}'")

    return prep_data(result)

async def create(*,
                 user_id: int,
                 key: str,
                 id: int = None) -> Dict[str, Any]:
    """
    Create a new row. Returns the created record as a dict.
    """

    # Set the values
    values = {
        "user_id": user_id,
        "key": key
    }

    # if the id was passed
    if id is not None:
        values["id"] = id

    # Generate the field and values list
    field_list = ", ".join(values.keys())
    param_list = ", ".join(":" + key for key in values.keys())

    result = await database.fetch_one(f"""
        INSERT INTO users_api_keys (
            {field_list}
        ) VALUES (
            {param_list}
        ) RETURNING *;
    """, values=values)

    result = prep_data(result)
    return result

async def delete(*,id:int, user_id: int) -> None:
    """
    Deletes an existing row. Raises if the record was not found.
    """

    deleted_row_count = await database.execute("""
        WITH deleted AS (
            DELETE FROM users_api_keys
            WHERE id = :id AND user_id = :user_id
            RETURNING id
        ) SELECT COUNT(id) FROM deleted;
    """, values={"id": id, "user_id": user_id})

    if deleted_row_count == 0:
        raise RecordNotFoundError(f"Could not delete API key with id '{id}'")

def prep_data(result) -> Dict[str, Any]:
    if result is None:
        raise ValueError("Tried to prepare null result")

    result = dict(result)
    return result