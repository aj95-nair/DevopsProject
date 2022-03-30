
pipeline {
  agent any
  environment {
    //put your environment variables
   DOCKER_REPO ="dhruvsisodia1998/patient-registration"
  }
	stages {
      stage ('clone') {
      steps { 
          sh ''' 
          rm -rf DevopsProject
        git clone  https://github.com/aj95-nair/DevopsProject.git  
        cd DevopsProject/Patient_register_microservice/ '''
        } 
      }
    
    stage ('Build Image') {
      steps {
        sh '''
        cd /var/lib/jenkins/workspace/patient-registeration/DevopsProject/Patient_register_microservice/
        docker build -t ${DOCKER_REPO}:latest .
        '''
      }
          
      }
    stage ('push image') {
      steps {
        sh ''' 
        docker push ${DOCKER_REPO}:latest
        '''
        }
    }
    stage ('Deploy on Stagging') {
      steps {
        sh '''
        gcloud container clusters get-credentials cost-optimized-cluster-1 --zone us-central1-c --project hw-cw2
        kubectl  set image deploy patient-registeration patient-registeration=${DOCKER_REPO}:latest
        kubectl scale deploy patient-registeration --replicas=0
        kubectl scale deploy patient-registeration --replicas=1
        
        '''
        }
    }

stage ('Testing ') {
      steps {
        sh '''
        cd /var/lib/jenkins/
        newman run patient-registration.json
        
        '''
        }
    }
    

stage (' Security Testing ') {
      steps {
        sh '''
        docker pull owasp/zap2docker-stable
        docker run -i owasp/zap2docker-stable zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://34.72.244.225:5555/
        
        '''
        }
    }
    

    
    stage ('Deploy on production') {
      steps {
        sh '''
        gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project hw-cw2
        kubectl  set image deploy patient-registeration patient-registeration=${DOCKER_REPO}:latest
		kubectl scale deploy patient-registeration --replicas=0
        kubectl scale deploy patient-registeration --replicas=1
        
        '''
        }
    }

    stage ('Cleanup') {
        
       steps  {  
      sh '''
         docker rmi  ${DOCKER_REPO}:latest 
        '''
       } }
        

  stage('Success') {
    steps {
        echo "Success :)"
    }
}
}

post {
      always {
          emailext body: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} More info at: $RUN_DISPLAY_URL",
    subject: "Job ${env.JOB_NAME}",
    to: 'aravind.jnair2@gmail.com'

      }
  }
}
