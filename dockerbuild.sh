#!/bin/bash

#Remove previous build 
echo Cleaning...
rm -rf ./build

#Aquire git information from current commit
if [ -z "$GIT_COMMIT" ]; then
  export GIT_COMMIT=$(git rev-parse HEAD)
  export GIT_URL=$(git config --get remote.origin.url)
fi

# Remove .git from url in order to get https link to repo (assumes https url for GitHub)
export GITHUB_URL=$(echo $GIT_URL | rev | cut -c 5- | rev)
npm install --silent && cd client && npm install --silent
echo Building app
npm run build

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Npm build failed with exit code " $rc
    exit $rc
fi

cat > ./build/githash.txt <<_EOF_
$GIT_COMMIT
_EOF_

cat > ./build/public/version.html <<_EOF_
<!doctype html>
<head>
   <title>App version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GITHUB_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GITHUB_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_

#Move neccesery files to build folder so they will be available on other state machines
cp ./Dockerfile ./build/
cp ./migratescript.sh ./build/

#Saving this commit id on a enviorment file to identify with docker build 
cat > ./.env <<_EOF_
GIT_COMMIT=$GIT_COMMIT
_EOF_

cd build
echo Building docker image
#create image with current git commit as tag
docker build -t gislibg/tictactoe:$GIT_COMMIT .

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi
#send the image to the docker hub
echo Pushing docker image
docker push gislibg/tictactoe:$GIT_COMMIT

rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

echo "sending docker-compse & env folder to aws"
#Moving neccesery files to aws so it can run
scp -i ~/gislibg-key-pair.pem ~/../../var/lib/jenkins/workspace/Commit\ Stage\ Job/docker-compose.yml  ec2-user@35.160.42.253:~/.
scp -i ~/gislibg-key-pair.pem ~~/../../var/lib/jenkins/workspace/Commit\ Stage\ Job/.env  ec2-user@35.160.42.253:~/.

echo "restarting docker build on aws server(work in progress)"
#ssh -i ~/Downloads/gislibg-key-pair.pem ec2-user@35.160.42.253 < ../provisioning/provision.sh
ssh -i ~/gislibg-key-pair.pem ec2-user@35.160.42.253
echo "Done"

