pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }

            steps {
                echo 'Build this app ...'
                sh '''
                    node --version
                    npm --version

                    ls -la
                    npm ci
                    npm run build

                    ls -la
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Test stage'
            }
        }
    }
}