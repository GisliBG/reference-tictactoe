#!/bin/bash

#Remove previous build 
echo Cleaning...
rm -rf ./build

echo instaling all dependencies
npm install --silent && cd client && npm install --silent
cd ..

echo running tests
./startTests.sh

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test failed with exit code " $rc
    exit $rc
fi

echo Building app
CI=true npm run build

#Move neccesery files to build folder so they will be available on other state machines
cp ./Dockerfile ./build/
cp ./migratescript.sh ./build/