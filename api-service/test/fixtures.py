import pytest
from dataaccess import projects as dataaccess_projects
from dataaccess import equations as dataaccess_equations
from dataaccess import use_cases as dataaccess_use_cases
from dataaccess import api_keys as dataaccess_api_keys
from dataaccess.types import PermissionType

#For Projects

@pytest.fixture(scope="session")
def make_user(database):
    async def __make_user(user_name, full_name, email:str = None) -> int:
        user_name = user_name.lower()
        if(email == None):
            query = """
                INSERT INTO users(username,full_name,account_type,hashed_password) 
                VALUES 
                (:username,:full_name,'hub','$2b$12$vWxVSPzAzicnvlqBat.6nexCkmZNDLbzUnPDXN8eiY60q0INEa5j2')
                RETURNING id;
            """
            values = {
            "username":user_name,
            "full_name":full_name
            }

            return (await database.execute(query, values))
        else:
            query = """
                INSERT INTO users(username,full_name,account_type,hashed_password,email) 
                VALUES 
                (:username,:full_name,'hub','$2b$12$vWxVSPzAzicnvlqBat.6nexCkmZNDLbzUnPDXN8eiY60q0INEa5j2',:email)
                RETURNING id;
            """
            values = {
            "username":user_name,
            "full_name":full_name,
            "email":email
            }

            return (await database.execute(query, values))


    return __make_user

@pytest.fixture(scope="session")
def make_admin(database):
    async def __make_admin() -> int:
        query = """
            INSERT INTO users(username,full_name,account_type,hashed_password) 
            VALUES 
            ('admin','Admin User','admin','$2b$12$vWxVSPzAzicnvlqBat.6nexCkmZNDLbzUnPDXN8eiY60q0INEa5j2')
            RETURNING id;
        """
        return (await database.execute(query))

    return __make_admin

@pytest.fixture(scope="session")
async def user_id(database, make_user) -> int:
    return await make_user(user_name='test', full_name='Test Name')

@pytest.fixture(scope="session", autouse=True)
async def create_projects_users(user_id):
    print("Creating!")
    # Create projects
    project_1 = await dataaccess_projects.create(projectname="Project1", description="Project 1")
    print("created P1")
    project_2 = await dataaccess_projects.create(projectname="Project2", description="Project 2")
    print("created P2")
    project_3 = await dataaccess_projects.create(projectname="Project3", description="Project 3")
    print("created P3")

    # Assign user to projects
    _ = await dataaccess_projects.create_project_user(project_id=project_1["id"],user_id=user_id,permission_type=PermissionType.owner,is_default=True)
    print('Assigned P1 to user')
    _ = await dataaccess_projects.create_project_user(project_id=project_2["id"],user_id=user_id,permission_type=PermissionType.readwrite,is_default=False)
    print('Assigned P2 to user')
    _ = await dataaccess_projects.create_project_user(project_id=project_3["id"],user_id=user_id,permission_type=PermissionType.read,is_default=False)
    print('Assigned P3 to user')

    return [project_1, project_2, project_3]

#For Equations Now

@pytest.fixture(scope="session", autouse=True)
async def create_equations(database):
   equation_1 = await dataaccess_equations.create(name="Test Equation 1", id=1103)
   print("Created Eq1")
   equation_2 = await dataaccess_equations.create(name="Test Equation 2", id=2606)
   print("Created Eq2")

   return [equation_1, equation_2]


@pytest.fixture(scope="session")
async def get_equations_count(database):
    query = """
        select id,name,description
        from equations
    """
    result = await database.fetch_all(query)
    print("Number of Equationns:",len(result))
    return len(result)

#For Use Cases
@pytest.fixture(scope="session")
async def get_usecase_count(database):
    query = """
        select id,name
        from use_cases
    """
    result = await database.fetch_all(query)
    print("Number of Use Cases:",len(result))
    return len(result)

@pytest.fixture(scope="session", autouse=True)
async def create_usecases(database):
   usecase_1 = await dataaccess_use_cases.create(name="Test UseCase 1", id=1103)
   print("Created UseCase1")
   usecase_2 = await dataaccess_use_cases.create(name="Test UseCase 2", id=2606)
   print("Created UseCase2")

   return [usecase_1, usecase_2]

#For API Keys
@pytest.fixture(scope="session", autouse=True)
async def create_apikeys(database, user_id):
   key_1 = await dataaccess_api_keys.create(user_id=user_id, key="Test1", id=1103)
   print("Created Key 1")
   key_2 = await dataaccess_api_keys.create(user_id=user_id, key="Test2", id=2606)
   print("Created Key 2")

   return [key_1, key_2]

@pytest.fixture(scope="session")
async def get_key(database, user_id):
    query = """
        select uak.id,uak.key
        from users_api_keys uak
        where 1=1
        and user_id = :user_id
    """
    values = {
        "user_id": user_id
    }
    result = await database.fetch_all(query, values)
    print("Number of Keys:",len(result))
    result = [dict(row) for row in result]
    print(result)
    return result

#For Users
@pytest.fixture(scope="session", autouse=True)
async def create_users(database, make_user):
   user1 = await make_user("Batman", "Batman Begins", "joker@test")
   print("User 1 Created")
   user2 = await make_user("Dark Knight", "Bruce Wayne", "bats@test")
   print("User 2 Created")

   return [user1, user2]

@pytest.fixture(scope="session")
async def get_users(database):
    query = """
        select id,username,email,full_name
        from users
        where 1=1
    """
    result = await database.fetch_all(query)
    print("Number of Users:",len(result))
    result = [dict(row) for row in result]
    print(result)
    return result

   
   

