REM call env.bat
docker network inspect neurodiffhub >NUL || docker network create neurodiffhub
docker-compose run --rm --service-ports --name database-client neurodiffdb-client