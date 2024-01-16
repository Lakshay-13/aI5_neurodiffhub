# Deployment

## Start Docker Container
To start the docker container run:  
`sh ./docker-shell.sh`

## API's to enbale in GCP
* Compute Engine API
* Service Usage API
* Cloud Resource Manager API
* Google Container Registry API

## SSH Setup
#### Configuring OS Login for service account
```
gcloud compute project-info add-metadata --project neurodiff --metadata enable-oslogin=TRUE
```

#### Create SSH key for service account
```
cd /secrets
ssh-keygen -f ssh-key-neurodiff-ansible
cd /app
```

#### Providing public SSH keys to instances
```
gcloud compute os-login ssh-keys add --key-file=/secrets/ssh-key-neurodiff-ansible.pub
```
From the output of the above command keep note of the username. Here is a snippet of the output 
```
- accountId: neurodiff
    gid: '4031716515'
    homeDirectory: /home/sa_101274744188256150293
    name: users/ansible@neurodiff.iam.gserviceaccount.com/projects/neurodiff
    operatingSystemType: LINUX
    primary: true
    uid: '4031716515'
    username: sa_101274744188256150293
```
The username is `sa_101274744188256150293`


## Deployment Setup
* GCP project details in env.dev file
* GCP project details in inventory-dev.yml file
* GCP Compute instance details in inventory-dev.yml file
* GCP project details in inventory-prod.yml file
* GCP Compute instance details in inventory-prod.yml file

## Deployment
#### Create Dev/Prod Server in GCP
```
ansible-playbook deploy-create-instance.yml -i inventory-dev.yml

ansible-playbook deploy-create-instance.yml -i inventory-prod.yml
```
Once the command runs successfully get the IP address of the compute instance from GCP and update the appserver>hosts in inventory-dev.yml or inventory-prod.yml file

#### Provision Dev Server in GCP
```
ansible-playbook deploy-provision-instance.yml -i inventory-dev.yml
ansible-playbook deploy-provision-instance.yml -i inventory-prod.yml
```

#### Configure Nginx file
* Create nginx.conf file for defaults routes in web server (Copy IP address for dev or prod)
* Create sites -> for dev server we need routes for dev.neurodiff.io setup
* Create sites -> for prod server we need routes for www.neurodiff.io setup

#### Setup Webserver on Dev Server in GCP
```
ansible-playbook deploy-setup-webserver.yml -i inventory-dev.yml
ansible-playbook deploy-setup-webserver.yml -i inventory-prod.yml
```
Once the command runs you can go to `http://34.122.163.79/` and you should see the default nginx page

#### Build and Push Docker Containers to GCR
```
ansible-playbook deploy-docker-images.yml -i inventory-dev.yml
```

#### Deploy Docker Containers to Server
```
ansible-playbook deploy-setup-containers.yml -i inventory-dev.yml

ansible-playbook deploy-setup-containers.yml -i inventory-prod.yml
```
 
