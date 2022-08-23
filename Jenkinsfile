pipeline {
    agent any
    environment {
        GIT_LOCAL_BRANCH = ""
        GIT_TAG = ""
        GIR_REPO_NAME = ""
    }
    stages {
        stage('Prepare branch and tag information') {
            steps {
                script {
                    def (orig, lb) = env.GIT_BRANCH.split('/')
                    GIT_LOCAL_BRANCH = lb
                    GIT_REPO_NAME = env.GIT_URL.replaceFirst(/^.*\/([^\/]+?).git$/, '$1')
                }
            }
        }
        stage('Build and push docker image main') {
            when {
                expression {
                    return GIT_LOCAL_BRANCH == 'main'
                }
            }
            steps {
                script {
                    GIT_TAG = "main-${env.BUILD_NUMBER}"
                }
                buildName "${GIT_REPO_NAME}:${GIT_TAG}"
                withDockerRegistry([ credentialsId: "dockerhub", url: "" ]) {
                    sh "docker build -t canozsoy/${GIT_REPO_NAME}:${GIT_TAG} ."
                    sh "docker push canozsoy/${GIT_REPO_NAME}:${GIT_TAG}"
                }
                /* Run build job */
                /*build job: 'inavitas/deploy/deploy-microservices', parameters: [
                    string(name: 'service_name', value: "${GIT_REPO_NAME}"),
                    string(name: 'image_tag', value: "${GIT_TAG}"),
                    string(name: 'group', value: "hetzner-main")
                ]*/
            }
        }
    }
}
