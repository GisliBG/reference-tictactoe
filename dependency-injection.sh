#!/bin/bash

#Remove previous build 
echo Cleaning...
rm -rf ./build

#install all dependencies and run build
npm install --silent && cd client && npm install --silent
cd ..
echo Building app
npm run build

#Move neccesery files to build folder so they will be available on other state machines
cp ./Dockerfile ./build/
cp ./migratescript.sh ./build/