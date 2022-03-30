
pipeline {
  agent any
  environment {
    //put your environment variables
    DOCKER_REPO ="dhruvsisodia1998/login"
  }
	stages {
      stage ('clone') {
      steps { 
          sh ''' 
          rm -rf DevopsProject
        git clone  https://github.com/aj95-nair/DevopsProject.git  
        cd DevopsProject/Login_microservice/ '''
        } 
      }
    
    stage ('Build Image') {
      steps {
        sh '''
        cd /var/lib/jenkins/workspace/Login-service/DevopsProject/Login_microservice/
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
        kubectl  set image deploy login login=${DOCKER_REPO}:latest
        kubectl scale deploy login --replicas=0
        kubectl scale deploy login --replicas=1
        
        '''
        }
    }

stage ('Testing ') {
      steps {
        sh '''
        cd /var/lib/jenkins/workspace/Login-service/
        newman run login-test.json
        
        '''
        }
    }
    

stage (' Security Testing ') {
      steps {
        sh '''
        docker pull owasp/zap2docker-stable
        docker run -i owasp/zap2docker-stable zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://34.133.0.195:5000/
        '''
        }
    }
    

    
    stage ('Deploy on production') {
      steps {
        sh '''
        gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project hw-cw2
        kubectl  set image deploy login login=${DOCKER_REPO}:latest
        kubectl scale deploy login --replicas=0
        kubectl scale deploy login --replicas=1
        
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
