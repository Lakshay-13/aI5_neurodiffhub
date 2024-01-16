from fastapi import APIRouter, Depends, Path, Query

from api.auth import Auth, OptionalAuth, get_password_hash
from api.data_models import Profile, Account, AccountUpdate, Pagination
from dataaccess import users as dataaccess_users
from dataaccess.types import AccountType
from api.errors import AccessDeniedError, BadRequestError

router = APIRouter()

@router.get(
    "/profile",
    tags=["Settings"],
    summary="Get profile information",
    description="Get all information about the currently signed in user.",
    response_description="The user profile information",
    response_model=Profile
)
async def profile_fetch(
    auth: Auth = Depends()
):
    print("user_id:",auth.user_id)

    # Get user
    user = await dataaccess_users.get(auth.user_id) #We get dictionary back with id,username,email,full_name,hashed_password,github_username,twitter_handle,research_interests

    return {
        "username": user["username"],
        "full_name": user["full_name"],
        "account_type": user["account_type"],
        "github_username": user["github_username"],
        "twitter_handle": user["twitter_handle"],
        "research_interests": user["research_interests"]
    }


@router.get(
    "/userinfo",
    tags=["Settings"],
    summary="Get User information",
    description="Get all information about the user with given id.",
    response_description="The user profile information",
    response_model=Profile
)
async def profile_fetch(
    id: int = Query(None, description="user id"),
    auth: Auth = Depends()
):
    
    # Get user by ID
    user = await dataaccess_users.get(id) #We get dictionary back with id,username,email,full_name,hashed_password,github_username,twitter_handle,research_interests

    return {
        "username": user["username"],
        "full_name": user["full_name"],
        "account_type": user["account_type"],
        "github_username": user["github_username"],
        "twitter_handle": user["twitter_handle"],
        "research_interests": user["research_interests"]
    }



@router.get(
    "/profile/{username}",
    tags=["Profile"],
    summary="Get profile information",
    description="Get profile information of the username",
    response_description="Get profile information of the username",
    response_model=Profile
)
async def profile_by_name_fetch(
    username: str = Path(..., description="The username"),
    auth: OptionalAuth = Depends()
):
    print("username:",username)

    # Get user
    user = await dataaccess_users.get_by_name(username)

    return {
        "username": user["username"],
        "full_name": user["full_name"],
        "github_username": user["github_username"],
        "twitter_handle": user["twitter_handle"],
        "research_interests": user["research_interests"]
    }

@router.put(
    "/profile",
    tags=["Settings"],
    summary="Update profile information",
    description="Update profile information",
    response_description="The user profile information",
    response_model=Profile
)
async def profile_update(
        profile: Profile,
        auth: Auth = Depends()
):
    # Get user
    user = await dataaccess_users.get(auth.user_id)

    # Update user profile information
    user_db = await dataaccess_users.update(
        id=user["id"],
        full_name=profile.full_name,
        github_username = profile.github_username,
        twitter_handle= profile.twitter_handle,
        research_interests=profile.research_interests

    )  #We get dictionary back with id,username,email,full_name,hashed_password

    return {
        "username": user_db["username"],
        "full_name": user_db["full_name"],
        "account_type": user_db["account_type"],
        "github_username": user_db["github_username"],
        "twitter_handle": user_db["twitter_handle"],
        "research_interests": user_db["research_interests"]
    }

@router.get(
    "/account",
    tags=["Settings"],
    summary="Get account information",
    description="Get all information about the currently signed in user.",
    response_description="The user account information",
    response_model=Account
)
async def account_fetch(
    auth: Auth = Depends()
):
    print("user_id:",auth.user_id)

    # Get user
    user = await dataaccess_users.get(auth.user_id)

    return {
        "username": user["username"],
        "email": user["email"]
    }

@router.put(
    "/account",
    tags=["Settings"],
    summary="Update account information",
    description="Update account information",
    response_description="The user account information",
    response_model=Account
)
async def account_update(
        account: AccountUpdate,
        auth: Auth = Depends()
):
    # Get user
    user = await dataaccess_users.get(auth.user_id)

    #pswd none, empty or blanks handled
    ln_pswd = len(account.password)
    if (account.password=='' or account.password == None): #Password not entered
        hashed_password = None
    elif(account.password == ' '*ln_pswd):  #Password all blanks
        hashed_password = None
    else:
        # Hash password
        hashed_password = get_password_hash(account.password)

    # Update user profile information
    user_db = await dataaccess_users.update(
        id=user["id"],
        email=account.email,
        hashed_password=hashed_password
    )

    return {
        "username": user_db["username"],
        "email": user_db["email"]
    }
    
@router.get(
    "/users",
    tags=["Users"],
    summary="Get list of users",
    description="Get list of users"
)
async def users_index(
    q: str = Query(None, description="An optional search query"),
    account_type: str = Query(None, description="User account type"),
    pagination: Pagination = Depends(), 
    auth: Auth = Depends()
):
    
    return await dataaccess_users.browse(
        q=q,
        account_type=account_type,
        page_number=pagination.page_number,
        page_size=pagination.page_size
    )

@router.post(
    "/add_admin/{username}",
    tags=["Admin"],
    summary="Makes a user an admin",
    description="Makes a user an admin",
    response_description="The user account information",
    response_model=Account
)
async def add_admin(
        username: str = Path(..., description="The username"),
        auth: Auth = Depends()
):
    # Get user
    current_user = await dataaccess_users.get(auth.user_id)
    if current_user["account_type"] != "admin":
        raise AccessDeniedError

    user_to_update = await dataaccess_users.get_by_name(username)

    # Update user profile information
    user_db = await dataaccess_users.update(
        id=user_to_update["id"],
        account_type=AccountType.admin
    )

    return {
        "username": user_db["username"],
        "account_type": user_db["account_type"]
    }

@router.post(
    "/remove_admin/{username}",
    tags=["Admin"],
    summary="Removes a user as an admin",
    description="Removes a user as an admin",
    response_description="The user account information",
    response_model=Account
)
async def remove_admin(
        username: str = Path(..., description="The username"),
        auth: Auth = Depends()
):
    # Get user
    current_user = await dataaccess_users.get(auth.user_id)
    if current_user["account_type"] != "admin":
        raise AccessDeniedError

    if current_user["username"] == username:
        raise BadRequestError("Cannot Delete Current Admin")

    user_to_update = await dataaccess_users.get_by_name(username)

    # Update user profile information
    user_db = await dataaccess_users.update(
        id=user_to_update["id"],
        account_type=AccountType.hub
    )

    return {
        "username": user_db["username"],
        "account_type": user_db["account_type"]
    }