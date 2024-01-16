import pytest

from dataaccess import utils as dataaccess_utils
from dataaccess.types import PermissionType
from dataaccess.errors import NoAccessError, RecordNotFoundError

@pytest.mark.asyncio
async def test_build_pagination():
    
    statement_1 = dataaccess_utils.build_pagination(30, 40)
    assert statement_1 == " offset 30 limit 40"

    statement_2 = dataaccess_utils.build_pagination(1, 20)
    assert statement_2 == " offset 1 limit 20"


    