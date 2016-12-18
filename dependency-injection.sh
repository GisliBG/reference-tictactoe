#!/bin/bash

#Remove previous build 
echo Cleaning...
rm -rf ./build

echo "instaling all dependencies"
npm install --silent && cd client && npm install --silent
cd ..

echo "running tests"
./startTests.sh

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test failed with exit code " $rc
    exit $rc
fi

echo "Building app"
npm run build

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test failed with exit code " $rc
    exit $rc
fi

cp ./Dockerfile ./build/
cp ./migratescript.sh ./build/
cp ./AcceptTests.sh ./build

echo "sending to docker hub"
./dockerbuild.sh