from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header, Security, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, OAuth2PasswordRequestFormStrict
from fastapi.security.api_key import APIKeyHeader, APIKey
from fastapi.param_functions import Form
from starlette.responses import Response
from jose import JWTError, jwt
from passlib.context import CryptContext
from secrets import token_urlsafe

from api.data_models import User, TokenData, ResetPassword
from api import errors
from dataaccess import users as dataaccess_users
from dataaccess import projects as dataaccess_projects
from dataaccess import api_keys as dataaccess_api_keys
from dataaccess.types import PermissionType, AccountType
from dataaccess.errors import RecordNotFoundError
from notifications.emails import send_email

router = APIRouter()

# TODO: Move this to environment variables
# openssl rand -hex 32
JWT_SECRET_KEY = "9cabc189857b09c584aa58d4779ee3f08078be5eca67043958ba75e0368fbd08"
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60
API_KEY_NAME = "apikey"

# Password context
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define PasswordBearer Auth Schema
auth_scheme = OAuth2PasswordBearer(
    tokenUrl="/v1/auth/login",
    scheme_name="OAuth2",
    auto_error=False
)
#auth_scheme.model.flows.password = None
apikey_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


def verify_password(plain_password, hashed_password):
    return password_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY,
                             algorithm=JWT_ALGORITHM)
    return encoded_jwt


class AuthData():
    user_id: Optional[int]
    apikey: Optional[str]

    def __init__(self, token: str, apikey: str, optional: bool = False):
        self.user_id = None
        self.apikey = None
        if (optional and not token and not apikey):
            return

        print("token:", token)
        print("apikey:", apikey)
        # Check api key first
        if apikey:
            self.apikey = apikey
        else:
            # Check jwt token
            try:
                payload = jwt.decode(token, JWT_SECRET_KEY,
                                     algorithms=[JWT_ALGORITHM])
            except JWTError:
                raise errors.AuthenticationError()

            try:
                self.user_id = payload["id"]
            except KeyError:
                raise errors.AuthenticationError()

    async def load(self):
        if self.apikey:
            try:
                api_key_db = await dataaccess_api_keys.get_by_key(key=self.apikey)
            except RecordNotFoundError:
                raise errors.AuthenticationError()

            try:
                self.user_id = api_key_db["user_id"]
            except KeyError:
                raise errors.AuthenticationError()

        # TODO:Load other access control details from DB


class AsyncAuth():
    def __init__(self, optional: bool = False):
        self.optional = optional

    async def __call__(self, token: str = Depends(auth_scheme), apikey: APIKey = Security(apikey_header)) -> AuthData:
        auth = AuthData(token=token, apikey=apikey, optional=self.optional)
        await auth.load()

        return auth


class OAuth2PasswordRequestFormCustom:
    def __init__(
        self,
        grant_type: str = Form(..., regex="password"),
        username: str = Form(...),
        password: str = Form(...),
        scope: str = Form(""),
        client_id: Optional[str] = Form(None),
        client_secret: Optional[str] = Form(None),
        email: Optional[str] = Form(None),
    ):
        self.grant_type = grant_type
        self.username = username
        self.password = password
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret
        self.email = email


Auth = AsyncAuth(optional=False)
OptionalAuth = AsyncAuth(optional=True)


async def generate_user_token(user, response: Response):
    access_token_expires = timedelta(
        minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "username": user["username"],
            "id": user["id"]
        },
        expires_delta=access_token_expires
    )

    # Ensure Auth Response is not cached
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"

    return {
        "username": user["username"],
        "full_name": user["full_name"],
        "access_token": access_token,
        "token_type": "bearer",
        "account_type": user["account_type"]
    }


@router.post(
    "/auth/login",
    tags=["Authentication"],
    summary="Authenticate with login credentials",
    description="Authenticate with an username/password and request an access and refresh token.",
    response_description="The access and refresh tokens, and an expiration duration.",
)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestFormStrict = Depends(),
    user_agent: Optional[str] = Header(None),
):
    try:
        # Get user
        user = await dataaccess_users.get_by_name_or_email(form_data.username)

        # Verify password
        if not verify_password(form_data.password, user["hashed_password"]):
            raise errors.IncorrectLoginError()

        return await generate_user_token(user, response=response)
    except:
        raise errors.AuthenticationError()


@router.post(
    "/auth/signup",
    tags=["Authentication"],
    summary="Signup with login credentials",
    description="Signup to create an account",
    response_description="Account creation success or failure",
)
async def signup(
    form_data: OAuth2PasswordRequestFormCustom = Depends(),
    user_agent: Optional[str] = Header(None),
):
    # Checking if username is not null or empty strings
    if(form_data.username!=None and form_data.username!='' and form_data.username not in [' '*i for i in range(10)]):
        pass
    else:
        raise errors.BadRequestError("Please Enter a Username")

    # Checking if email is not null or empty strings
    
    if(form_data.password!=None and form_data.password!='' and form_data.password not in [' '*i for i in range(10)]):
        pass
    else:
        raise errors.BadRequestError("Please Enter a Password")

    # Checking if email is not null or empty strings
    
    if(form_data.email!=None and form_data.email!='' and form_data.email not in [' '*i for i in range(10)]):
        pass
    else:
        raise errors.BadRequestError("Please Enter an Email")


    # Check if username exists
    try:
        user = await dataaccess_users.get_by_name(form_data.username)
        raise errors.UserAlreadyExists("Username already exists")
    except RecordNotFoundError:
        pass

    try:
        user = await dataaccess_users.get_by_email(form_data.email)
        raise errors.UserAlreadyExists("Email already exists")
    except RecordNotFoundError:
        pass

    # Hash password
    hashed_password = get_password_hash(form_data.password)

    # Save user
    user = await dataaccess_users.create(
        username=form_data.username,
        email=form_data.email,
        full_name='',
        github_username='',
        twitter_handle='',
        research_interests='',
        hashed_password=hashed_password
    )

    # Create default project with username
    project = await dataaccess_projects.create(projectname=form_data.username, description='')
    project_user = await dataaccess_projects.create_project_user(project_id=project["id"], user_id=user["id"], permission_type=PermissionType.owner, is_default=True)

    return {"account_created": True}


@router.post(
    "/auth/validate",
    tags=["Authentication"],
    summary="Validate authenticattion token",
    description="Validate authenticattion token and request a new access token.",
    response_description="The access token and an expiration duration.",
)
async def validate(
    response: Response,
    auth: Auth = Depends()
):
    try:
        # Get user
        user = await dataaccess_users.get(auth.user_id)

        return await generate_user_token(user, response=response)
    except:
        raise errors.AuthenticationError()


@router.post(
    "/auth/resetpassword",
    tags=["Authentication"],
    summary="Reset user password",
    description="Reset user password",
    response_description="Response message",
)
async def resetpassword(
    background_tasks: BackgroundTasks,
    reset_password: ResetPassword,
):
    try:
        # Get user based on email
        user = await dataaccess_users.get_by_email(reset_password.email)
    except:
        raise errors.IncorrectEmailError()

    # Generate new password
    new_password = token_urlsafe(10)

    # Hash password
    hashed_password = get_password_hash(new_password)

    # Save password to db
    user = await dataaccess_users.update(
        id=user["id"],
        hashed_password=hashed_password
    )

    subject = "NeuroDiff: Reset Password Request"
    email_to = reset_password.email
    body = {
        'title': 'NeuroDiff: Reset Password',
        'name': user["username"] + " " + user["full_name"],
        "password": new_password
    }

    # Send Reset Password Email
    send_email(background_tasks, subject=subject,
               email_to=email_to, body=body)

    return "Password reset"
