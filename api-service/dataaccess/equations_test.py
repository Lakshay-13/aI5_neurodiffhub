import pytest

from dataaccess import equations as dataaccess_equations
from dataaccess.types import PermissionType
from dataaccess.errors import NoAccessError, RecordNotFoundError

@pytest.mark.asyncio
async def test_browse(get_equations_count):
    
    equations = await dataaccess_equations.browse()
    assert len(equations) == get_equations_count 

@pytest.mark.asyncio
async def test_update(create_equations):
    
    updated_eq1 = await dataaccess_equations.update(create_equations[0]["id"], description="Test Description")
    assert updated_eq1["description"] == "Test Description"

    updated_eq2 = await dataaccess_equations.update(create_equations[1]["id"], description="Test Description 2")
    assert updated_eq2["description"] == "Test Description 2"

@pytest.mark.asyncio
async def test_create(get_equations_count):
    
    prev_count = get_equations_count
    new_equation = await dataaccess_equations.create(name="Test 3", description="Check")
    assert new_equation["name"] == "Test 3"
    new_count = len(await dataaccess_equations.browse())
    print(new_count)
    assert new_count == prev_count + 1


@pytest.mark.asyncio
async def test_get():
    
    got_equation = await dataaccess_equations.get(id=1103)
    assert got_equation["name"] == "Test Equation 1"

    got_equation2 = await dataaccess_equations.get(id=2606)
    assert got_equation2["name"] == "Test Equation 2"


    