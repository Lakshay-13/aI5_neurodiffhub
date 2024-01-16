from fastapi import APIRouter, Depends, Path
import secrets

from api.auth import Auth
from api.data_models import Pagination, UseCase
from dataaccess import use_cases as dataaccess_use_cases

router = APIRouter()


@router.get(
    "/use_cases",
    tags=["Use Cases"],
    summary="Get list of use cases",
    description="Get list of Get list of use cases"
)
async def use_cases_index(pagination: Pagination = Depends()):

    return await dataaccess_use_cases.browse(
        page_number=pagination.page_number,
        page_size=pagination.page_size
    )


@router.post(
    "/use_cases",
    tags=["Admin"],
    summary="Create a new use case",
    description="Create a new use case",
    response_description="The created use case"
)
async def use_cases_create(
    use_case: UseCase, auth: Auth = Depends()
):
    # Check if user has admin role

    # Create use case
    use_case_db = await dataaccess_use_cases.create(
        name=use_case.name
    )
    return use_case_db


@router.put(
    "/use_cases/{id}",
    tags=["Admin"],
    summary="Update a use case",
    description="Update a use case using the provided metadata.",
    response_description="The updated use case"
)
async def use_cases_update(
        use_case: UseCase,
        id: int = Path(..., description="The use case id"),
        auth: Auth = Depends()
):
    # Check if user has admin role

    # # Update use case
    use_case_db = await dataaccess_use_cases.update(
        name=use_case.name
    )

    return use_case_db


@router.get(
    "/use_cases/{id}",
    tags=["Admin"],
    summary="Get information about a use case",
    description="Get all information about a specific use case.",
    response_description="The use case"
)
async def use_cases_fetch(
        id: int = Path(..., description="The use cases id"),
        auth: Auth = Depends()
):
    # Check if user has admin role

    use_case_db = await dataaccess_use_cases.get(id)

    return use_case_db
