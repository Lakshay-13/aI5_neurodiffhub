import pytest

from dataaccess import api_keys as dataaccess_api_keys
from dataaccess import use_cases as dataaccess_use_cases
from dataaccess.types import PermissionType
from dataaccess.errors import NoAccessError, RecordNotFoundError

@pytest.mark.asyncio
async def test_browse(user_id, get_key):
    
    keys = await dataaccess_api_keys.browse(user_id=user_id)
    assert len(keys) == len(get_key)

@pytest.mark.asyncio
async def test_get():
    
    got_key1 = await dataaccess_api_keys.get(id=1103)
    assert got_key1["id"] == 1103
    assert got_key1["key"] == "Test1"

    got_key2 = await dataaccess_api_keys.get(id=2606)
    assert got_key2["id"] == 2606
    assert got_key2["key"] == "Test2"


@pytest.mark.asyncio
async def test_get_by_key():
    
    got_key1 = await dataaccess_api_keys.get_by_key(key="Test1")
    assert got_key1["id"] == 1103

    got_key2 = await dataaccess_api_keys.get_by_key(key="Test2")
    assert got_key2["id"] == 2606

@pytest.mark.asyncio
async def test_create_delete(user_id, get_key):
    
    # Create Part
    prev_count = len(get_key)
    new_api_key = await dataaccess_api_keys.create(user_id=user_id, key="Test3", id=101)
    assert new_api_key["key"] == "Test3"
    new_count = len(await dataaccess_api_keys.browse(user_id=user_id))
    print(new_count)
    assert new_count == prev_count + 1

    # Delete Part
    await dataaccess_api_keys.delete(id=101, user_id=user_id)

    #Should Raise Error if Deleted Properly
    with pytest.raises(RecordNotFoundError) as exc:
        await dataaccess_api_keys.get(id=101)
    assert str(exc.value)== f"Could not find row with id '101'"



    