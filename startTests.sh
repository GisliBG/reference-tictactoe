#!/bin/bash

npm run test-prod

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm test failed with exit code " $rc
    exit $rc
fi

cd ./client
npm run test-prod

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm client test failed with exit code " $rc
    exit $rc
fi

cd ..
