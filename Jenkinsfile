pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = 'f157a865-7f94-47f5-8c92-539036455233'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

    stages {

        // this is a comment

        stage('Docker') {
            steps {
                sh 'docker build -t my-docker-image .'
            }
        }

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

        stage('Tests') {
            parallel {
                stage('Unit Test') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        echo 'Test stage'
                        sh '''
                            test -f build/index.html
                            npm test
                        '''
                    }
                }

                stage('E2E') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                            reuseNode true
                        }
                    }
                    steps {
                        sh '''
                            echo "E2E Commands"
                            npm install serve 
                            node_modules/.bin/serve -s build &
                            sleep 10
                            npx playwright test
                        '''
                    }
                }
            }
        }

         stage('Staging deploy with E2E') {
            agent {
                docker {
                    image 'my-docker-image'
                    reuseNode true
                }
            }
            environment {
                CI_ENVIRONMENT_URL = "TO_BE_SET"
            }
            steps {
                sh '''
                    netlify --version
                    echo "Deploying to temporal sandbox. Site ID: $NETLIFY_SITE_ID"
                    netlify status
                    netlify deploy --dir=build --json > deploy-output.txt
                    CI_ENVIRONMENT_URL=$(node-jq -r '.deploy_url' deploy-output.txt)
                    echo "Staging E2E to this URL: ${URL_STAGING}"
                    npx playwright test
                '''
            }
        }


        stage('Deploy production with E2E') {
            agent {
                docker {
                    image 'my-docker-image'
                    reuseNode true
                }
            }
            environment {
                CI_ENVIRONMENT_URL = 'https://regal-tulumba-cc1984.netlify.app/'
            }
            steps {
                sh '''
                    echo "Production E2E"
                    node --version
                    netlify --version
                    echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
                    netlify status
                    netlify deploy --dir=build --prod
                    sleep 5
                    npx playwright test
                '''
            }
        }
    }

    post {
        always {
            junit 'jest-results/junit.xml'
        }
    }
}