import pytest

from dataaccess import users as dataaccess_users
from dataaccess.types import PermissionType
from dataaccess.errors import NoAccessError, RecordNotFoundError

@pytest.mark.asyncio
async def test_browse(get_users):
    
    users = await dataaccess_users.browse()
    assert len(users) == len(get_users)

    #Testing with string query parameter
    batman_user = await dataaccess_users.browse(q="Batman")
    assert len(batman_user)==1
    assert batman_user[0]["full_name"] == "Batman Begins"

@pytest.mark.asyncio
async def test_get(create_users):
    
    user1 = await dataaccess_users.get(id=create_users[0])
    assert user1["username"] == "batman"

    user2 = await dataaccess_users.get(id=create_users[1])
    assert user2["username"] == "dark knight"

    with pytest.raises(RecordNotFoundError) as exc:
        await dataaccess_users.get(id=9999999)
    assert str(exc.value) == f"Could not find row with id '9999999'"


@pytest.mark.asyncio
async def test_get_by_name(create_users):
    
    user1 = await dataaccess_users.get_by_name(username="batman")
    assert user1["username"] == "batman"
    assert user1["id"] == create_users[0]

    user2 = await dataaccess_users.get_by_name_or_email(username="dark knight")
    assert user2["username"] == "dark knight"
    assert user2["id"] == create_users[1]

    with pytest.raises(RecordNotFoundError) as exc:
        await dataaccess_users.get_by_name(username="GShock")
    assert str(exc.value) == f"Could not find row with username 'gshock'"

    with pytest.raises(RecordNotFoundError) as exc:
        await dataaccess_users.get_by_name_or_email(username="GShock")
    assert str(exc.value) == f"Could not find row with username or email 'gshock'"


@pytest.mark.asyncio
async def test_get_by_email(create_users):
    
    email_user1 = await dataaccess_users.get_by_email(email="joker@test")
    assert email_user1["username"] == "batman"
    assert email_user1["id"] == create_users[0]

    email2_user1= await dataaccess_users.get_by_name_or_email("bats@test")
    assert email2_user1["username"] == "dark knight"
    assert email2_user1["id"] == create_users[1]

    with pytest.raises(RecordNotFoundError) as exc:
        await dataaccess_users.get_by_name_or_email(username="GShock")
    assert str(exc.value) == f"Could not find row with username or email 'gshock'"

    with pytest.raises(RecordNotFoundError) as exc:
        await dataaccess_users.get_by_email("GShock")
    assert str(exc.value) == f"Could not find row with email 'gshock'"


@pytest.mark.asyncio
async def test_create_update(get_users):
    
    #Creating

    prev_count = len(get_users)
    user1 = await dataaccess_users.create(username="Create1", email="test1@test", full_name="Create 1", id=602)
    get_user1 = await dataaccess_users.get(user1["id"])
    assert get_user1["username"] == "create1"
    assert get_user1["id"] == 602

    users = await dataaccess_users.browse()

    new_count = len(users)

    assert new_count == prev_count + 1

    #Updating

    _ = await dataaccess_users.update(user1["id"], email="test_updated@test", github_username="Bats", twitter_handle="Rodriguez", research_interests= "Fun")
    updated_user1 = await dataaccess_users.get(user1["id"])
    assert updated_user1["email"] == "test_updated@test"
    assert updated_user1["github_username"] == "Bats"
    assert updated_user1["twitter_handle"] == "Rodriguez"
    assert updated_user1["research_interests"] == "Fun"


    