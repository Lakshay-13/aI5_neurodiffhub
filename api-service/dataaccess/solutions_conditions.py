import os
from typing import Any, Dict, List

from dataaccess import utils as data_utils
from dataaccess.types import ConditionType
from dataaccess.session import database
from dataaccess.errors import RecordNotFoundError

async def create(*,
        solution_id: int,
        version: float,
        condition_type: ConditionType,
        ith_unit: float = None,
        t_0: float = None,
        u_0: float = None,
        u_0_prime: float = None,
        t_1: float = None,
        u_1: float = None,
        x0: float = None,
        f0: str = None,
        x1: float = None,
        f1: str = None,
        y0: float = None,
        g0: str = None,
        y1: float = None,
        g1: str = None,
        id: int = None) -> Dict[str, Any]:
    """
    Create a new row. Returns the created record as a dict.
    """

    # Set the values
    values = {
        "solution_id": solution_id,
        "version":version,
        "condition_type":condition_type,
    }

    # if the id was passed
    if id is not None:
        values["id"] = id
    
    if ith_unit is not None:
        values["ith_unit"] = ith_unit
    if t_0 is not None:
        values["t_0"] = t_0
    if u_0 is not None:
        values["u_0"] = u_0
    if t_1 is not None:
        values["t_1"] = t_1
    if u_1 is not None:
        values["u_1"] = u_1
    if x0 is not None:
        values["x0"] = x0
    if f0 is not None:
        values["f0"] = f0
    if x1 is not None:
        values["x1"] = x1
    if f1 is not None:
        values["f1"] = f1
    if y0 is not None:
        values["y0"] = y0
    if g0 is not None:
        values["g0"] = g0
    if y1 is not None:
        values["y1"] = y1
    if g1 is not None:
        values["g1"] = g1

    # Generate the field and values list
    field_list = ", ".join(values.keys())
    param_list = ", ".join(":" + key for key in values.keys())

    result = await database.fetch_one(f"""
        INSERT INTO solutions_conditions (
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

    return result