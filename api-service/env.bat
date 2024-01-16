REM The name of the docker images to produce
SET IMAGE_NAME="neurodiff-api-service"
SET BASE_DIR= %cd%
cd ..
cd model-store
SET MODELSTORE_DIR= %cd%
cd ..
cd api-service
SET DATABASE_URL= "postgres://neurodiffhub:diffeq@postgres/neurodiffhubdb"
SET MODELSTORE_BUCKET= \modelstore