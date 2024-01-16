from fastapi import APIRouter, Depends, Path
import secrets

from api.auth import Auth
from api.data_models import Pagination
from dataaccess import api_keys as dataaccess_api_keys

router = APIRouter()

@router.get(
    "/api_keys",
    tags=["Settings"],
    summary="Get list of api keys for the user",
    description="Get list of api keys for the user"
)
async def api_keys_index(pagination: Pagination = Depends(), auth: Auth = Depends()):

    return await dataaccess_api_keys.browse(
        user_id=auth.user_id,
        page_number=pagination.page_number,
        page_size=pagination.page_size
    )

@router.post(
    "/api_keys",
    tags=["Settings"],
    summary="Create a new api key for user",
    description="Create a new api key for user",
    response_description="The created api key"
)
async def api_keys_create(
    auth: Auth = Depends()
):
    # Create api key
    key = secrets.token_urlsafe(32)
    apikey = await dataaccess_api_keys.create(
        user_id=auth.user_id,
        key=key
    )
    return apikey

@router.delete(
    "/api_keys/{id}",
    tags=["Settings"],
    summary="Delete api key for user",
    description="Delete api key for user"
)
async def api_keys_delete(
    id: int = Path(..., description="The API key id"),
    auth: Auth = Depends()
):
    await dataaccess_api_keys.delete(
        id=id,
        user_id=auth.user_id
    )