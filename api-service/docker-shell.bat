call env.bat
docker build -t %IMAGE_NAME% -f Dockerfile .
cd ..
docker run --rm --name %IMAGE_NAME% -ti --mount type=bind,source="%cd%/api-service",target=/app --mount type=bind,source="%cd%/model-store",target=/modelstore -p 9000:9000 -e DEV=1 -e DATABASE_URL="postgres://neurodiffhub:diffeq@neurodiffhubdb-server/neurodiffhubdb" -e MODELSTORE_BUCKET=\modelstore --network neurodiffhub %IMAGE_NAME%