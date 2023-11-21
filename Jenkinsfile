@Library('ceiba-jenkins-library') _
pipeline{
     // Donde se va a ejecutar el Pipeline
    agent any
    
    // Opciones específicas de Pipeline dentro del Pipeline
    options {
    	buildDiscarder(logRotator(numToKeepStr: '3'))
 		disableConcurrentBuilds()
    }
    
    // Una sección que define las herramientas “preinstaladas” en Jenkins
    tools {
        nodejs 'NodeJS18' // Versión preinstalada en la Configuración del Master
    }
    
    // Aquí comienzan los "ítems" del Pipeline
    stages {
        stage('Checkout') {
            steps {
                echo "------------>Checkout<------------"
                checkout scm
            }
        }
    
        stage('NPM Install') {
            steps {
                echo "------------>Installing<------------"
                sh 'npm ci'
            }
        }

        stage('Unit Test') {
            steps {
                echo "------------>Testing<------------"
                sh 'npm run test:headless'
            }
        }

        stage('Static Code Analysis') {
            steps{
                sonarqubeMasQualityGatesP(sonarKey:'co.com.ceiba.adn:adn-gestiondeclasesdeinglesfront-juan.montoya', 
                sonarName:'ADN-GestionDeClasesDeInglesFront-juan.montoya', 
                sonarPathProperties:'./sonar-project.properties')
            }
        }
          stage('Build') {
            steps {
                echo "------------>Construcción del proyecto<------------"
                sh 'npm run build'
            }
        }
    }

   post {
        failure {
            mail(
                to: 'juan.montoya@ceiba.com.co',
                body:"Build failed in Jenkins: Project: ${env.JOB_NAME} Build /n Number: ${env.BUILD_NUMBER} URL de build: ${env.BUILD_NUMBER}/n/nPlease go to ${env.BUILD_URL} and verify the build",
                subject: "ERROR CI: ${env.JOB_NAME}"
            )
            updateGitlabCommitStatus name: 'IC Jenkins', state: 'failed'
        }
        success {
            updateGitlabCommitStatus name: 'IC Jenkins', state: 'success'
        }
    }
}
