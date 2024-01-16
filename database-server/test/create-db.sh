#!/bin/bash

echo "Creating Test DB"

dbmate -e "TEST_DATABASE_URL" drop
dbmate -e "TEST_DATABASE_URL" status
dbmate -e "TEST_DATABASE_URL" create
dbmate -e "TEST_DATABASE_URL" up