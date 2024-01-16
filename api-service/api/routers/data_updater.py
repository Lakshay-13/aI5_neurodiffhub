from fastapi import APIRouter
from jose import JWTError, jwt

from utils import equations as equation_utils
from api.auth import JWT_SECRET_KEY, JWT_ALGORITHM
from dataaccess import solutions as dataaccess_solutions

router = APIRouter()


@router.get(
    "/run_data_updates",
    include_in_schema=False
)
async def run_data_updates():

    solutions = await dataaccess_solutions.browse(page_size=100)

    for sol in solutions:
        equation_tex = equation_utils.parse_string(
            sol["diff_equation_details"]["equation"])
        conditions_tex = equation_utils.parse_conditions(
            sol["diff_equation_details"]["conditions"],
            sol["diff_equation_details"]["independent_variables"],
            sol["diff_equation_details"]["dependent_variables"])
        equation_details = {
            "equation_tex": equation_tex,
            "conditions_tex": conditions_tex
        }
        print(equation_details)

        sol_db = await dataaccess_solutions.update(
            id=sol["id"],
            equation_details=equation_details
        )

    return {
        "message": "Done"
    }


@router.get(
    "/tester",
    include_in_schema=False
)
async def tester():

    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImV4cCI6MTYyODI1MTU2NH0.N0m4-tDIQICUp4K_HzIsTvEScGvqFKjWTD9uk4QF5L0"

    payload = jwt.decode(token, JWT_SECRET_KEY,
                         algorithms=[JWT_ALGORITHM])

    return payload
