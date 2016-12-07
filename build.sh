#!/bin/bash
#Tell node we are in working path
export NODE_PATH=.
#remove build previous build before new build starts
npm run clean 
#create a new build folder
npm run createbuild 
#run npm build in client folder
npm run buildclient 
#move all folders that have been built to the build folder so our program will run
mv client/build build/static 
cp -R server build/server 
mkdir -p build/client/src 
cp -r client/src/common build/client/src 
cp run.js build
#the package.json has to tag along so the program knows how to run. 
cp package.json build