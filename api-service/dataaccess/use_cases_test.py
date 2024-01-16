import pytest

from dataaccess import equations as dataaccess_equations
from dataaccess import use_cases as dataaccess_use_cases
from dataaccess.types import PermissionType
from dataaccess.errors import NoAccessError, RecordNotFoundError

@pytest.mark.asyncio
async def test_browse(get_usecase_count):
    
    equations = await dataaccess_use_cases.browse()
    assert len(equations) == get_usecase_count 

@pytest.mark.asyncio
async def test_get():
    
    got_usecase = await dataaccess_use_cases.get(id=1103)
    assert got_usecase["id"] == 1103

    got_usecase2 = await dataaccess_use_cases.get(id=2606)
    assert got_usecase2["id"] == 2606

@pytest.mark.asyncio
async def test_update(create_usecases):
    
    updated_usecase1 = await dataaccess_use_cases.update(create_usecases[0]["id"], name="Test Use Case 1 Updated")
    assert updated_usecase1["name"] == "Test Use Case 1 Updated"

    updated_usecase2 = await dataaccess_use_cases.update(create_usecases[1]["id"], name="Test Use Case 2 Updated")
    assert updated_usecase2["name"] == "Test Use Case 2 Updated"


@pytest.mark.asyncio
async def test_create(get_usecase_count):
    
    prev_count = get_usecase_count
    new_use_case = await dataaccess_use_cases.create(name="Test Use Case 3")
    assert new_use_case["name"] == "Test Use Case 3"
    new_count = len(await dataaccess_use_cases.browse())
    print(new_count)
    assert new_count == prev_count + 1





    