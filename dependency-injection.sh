#!/bin/bash

npm install nodemon
npm install create-react-app

echo "restarting postgres image"
docker stop pg2
docker rm pg2
docker run -p 5432:5432 --name pg2 -e POSTGRES_PASSWORD=mysecretpassword -d postgres

#Remove previous build 
echo Cleaning...
rm -rf ./build

echo "instaling all dependencies"
npm install --silent && cd client && npm install --silent
cd ..

npm run migratedb-dev

echo "running tests"
./startTests.sh

#If the test fail, stop!
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test failed with exit code " $rc
    exit $rc
fi

echo "Building app"
npm run build

#You can't build? fix the problem and start again!
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test failed with exit code " $rc
    exit $rc
fi

cp ./Dockerfile ./build/
cp ./migratescript.sh ./build/

echo "sending to docker hub"
./dockerbuild.sh