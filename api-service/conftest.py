# Test fixtures which are autoloaded by pytest
import os
import pytest

from asyncio import SelectorEventLoop
from databases import Database

from dataaccess import session

try:
    database_url = os.environ["DATABASE_URL"] + "_test"
except KeyError:
    raise RuntimeError("The DATABASE_URL environment variable is missing.")

# Create a test DB
db = Database(database_url, force_rollback=True)
session.database = db

@pytest.fixture(scope="session")
def event_loop():
    loop = SelectorEventLoop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def database_connection(event_loop):
    if not session.database.is_connected:
        async with session.database as database_connection:
            yield database_connection
    else:
        yield session.database

@pytest.fixture(scope="session")
async def database(database_connection):
    await database_connection.execute("BEGIN;")
    yield database_connection
    await database_connection.execute("ROLLBACK;")

pytest_plugins = [
    "test.fixtures"
]