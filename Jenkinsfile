pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel_token')
    }

    stages {

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy Frontend to Vercel') {
            steps {
                dir('frontend') {
                    bat "npx vercel --prod --yes --token=%VERCEL_TOKEN%"
                }
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        // Optional: backend build ya test add kar sakte ho
        stage('Backend Ready') {
            steps {
                echo 'Backend dependencies installed (no build step).'
            }
        }

    }
}
