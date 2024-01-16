from fastapi import APIRouter, Depends, Path
import secrets

from api.auth import Auth
from api.data_models import Pagination, Equation
from dataaccess import equations as dataaccess_equations

router = APIRouter()


@router.get(
    "/equations",
    tags=["Equations"],
    summary="Get list of equations",
    description="Get list of Get list of equations"
)
async def equations_index(pagination: Pagination = Depends()):

    return await dataaccess_equations.browse(
        page_number=pagination.page_number,
        page_size=pagination.page_size
    )


@router.post(
    "/equations",
    tags=["Admin"],
    summary="Create a new equation",
    description="Create a new equation",
    response_description="The created equation"
)
async def equations_create(
    equation: Equation, auth: Auth = Depends()
):
    # Check if user has admin role

    # Create use case
    equation_db = await dataaccess_equations.create(
        name=equation.name,
        description=equation.description
    )
    return equation_db


@router.put(
    "/equations/{id}",
    tags=["Admin"],
    summary="Update an equation",
    description="Update an equation using the provided metadata.",
    response_description="The updated equation"
)
async def equations_update(
        equation: Equation,
        id: int = Path(..., description="The equation id"),
        auth: Auth = Depends()
):
    # Check if user has admin role

    # Update use case
    equation_db = await dataaccess_equations.update(
        name=equation.name,
        description=equation.description
    )

    return equation_db


@router.get(
    "/equations/{id}",
    tags=["Admin"],
    summary="Get information about an equation",
    description="Get all information about a specific equation.",
    response_description="The equation"
)
async def equations_fetch(
        id: int = Path(..., description="The equation id"),
        auth: Auth = Depends()
):
    # Check if user has admin role

    equation_db = await dataaccess_equations.get(id)

    return equation_db
