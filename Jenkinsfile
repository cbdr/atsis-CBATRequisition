node('ATSIntegrationServices') {
  stage('Checkout') {
    checkout scm
    repositoryName = scm.getUserRemoteConfigs()[0].getUrl().tokenize('/').last().split("\\.")[0]
  }
  stage('Build') {
     sh """#!/bin/bash --login
      set -e
      nvm install 8.11
      nvm use 8.11
      npm install
     """      
  }
  stage('Test') {
      sh """#!/bin/bash --login
      set -e
      nvm install 8.11
      nvm use 8.11
      npm install
      npm run coverage
     """      
  }
  stage('Publish') {
     if (env.BRANCH_NAME == 'master') {  
         withCredentials([usernamePassword(credentialsId: 'DockerHub', passwordVariable: 'DHPASSWORD', usernameVariable: 'DHUSERNAME')]) {
               sh """#!/bin/bash -l
                    `bash acreds.sh arn:aws:iam::160387761777:role/jenkinsIAM-JenkinsIAMRole-1F7NR6EJHNB70`
                     export AWS_DEFAULT_REGION=us-east-1
                     docker login --username $DHUSERNAME --password $DHPASSWORD
                     `aws ecr get-login --no-include-email`
                     docker build --pull -t cbdr/atsis-candidate-pull:j-$BUILD_DISPLAY_NAME .
                     docker tag cbdr/atsis-candidate-pull:j-$BUILD_DISPLAY_NAME 160387761777.dkr.ecr.us-east-1.amazonaws.com/atsis/cbat-requisition:j-$BUILD_DISPLAY_NAME
                     docker push 160387761777.dkr.ecr.us-east-1.amazonaws.com/atsis/cbat-requisition:j-$BUILD_DISPLAY_NAME

                     aws s3 cp s3://atsis/applications/atsis-cbat-requisition/.env.prod .env
                     zip --exclude '.git/**' -r package.zip .
                     aws s3 cp package.zip s3://atsis/serverless-packages/atsis-cbat-requisition-produs-${env.BUILD_DISPLAY_NAME}.zip
                     rm package.zip

                     aws s3 cp s3://atsis/applications/atsis-cbat-requisition/.env.staging .env
                     zip --exclude '.git/**' -r package.zip .
                     aws s3 cp package.zip s3://atsis/serverless-packages/atsis-cbat-requisition-stage-${env.BUILD_DISPLAY_NAME}.zip
                     rm package.zip
            """
         }
            
     }
  }
  stage('Deploy') {
     if (env.BRANCH_NAME == 'master') {  
        build job: 'ATSIntegrationServices/atsis-candidate-pull/Stage/Deploy', parameters: [string(name: 'buildVersion', value: "${env.BUILD_DISPLAY_NAME}")]
     }
  }
}