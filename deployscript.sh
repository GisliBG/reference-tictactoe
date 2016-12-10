echo "sending docker-compse & env folder to aws"
#Moving neccesery files to aws so it can run
scp -i ~/gislibg-key-pair.pem ~/workspace/Commit\ Stage\ Job/docker-compose.yml  ec2-user@35.160.42.253:~/.
scp -i ~/gislibg-key-pair.pem ~/workspace/Commit\ Stage\ Job/.env  ec2-user@35.160.42.253:~/.

echo "restarting docker build on aws server"
#ssh -i ~/Downloads/gislibg-key-pair.pem ec2-user@35.160.42.253 < ../provisioning/provision.sh
ssh -i ~/gislibg-key-pair.pem ec2-user@35.160.42.253 < ./provisioning/provision.sh
echo "Done"
