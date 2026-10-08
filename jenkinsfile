pipeline {
  agent any
  environment {
    DB_USER = 'appuser'
    DB_NAME = 'appdb'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps {
        withCredentials([string(credentialsId: 'db-password', variable: 'DB_PASSWORD')]) {
          sh 'docker compose build'
        }
      }
    }
    stage('Deploy') {
      steps {
        withCredentials([string(credentialsId: 'db-password', variable: 'DB_PASSWORD')]) {
          sh 'docker compose up -d'
        }
      }
    }
    stage('Smoke test') {
      steps {
        sh '''
          sleep 10
          curl -f http://host.docker.internal:3000 || (docker compose logs app && exit 1)
        '''
      }
    }
  }
  post {
    failure { sh 'docker compose logs || true' }
  }
}
