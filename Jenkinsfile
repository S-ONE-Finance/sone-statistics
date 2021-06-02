pipeline {
  agent any

  environment {
    // Convert branch name to image tag by removing origin/ and replacing slash with dash
    IMG_TAG = sh(script:"echo ${GIT_BRANCH} | sed 's/origin\\///g' | sed 's/\\//-/g'", returnStdout: true).trim()
    
    LOCAL_IMG_TAG = "${ECR_REPOSITORY}:${IMG_TAG}"
    ECR_HOST = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    ECR_IMG_TAG = "${ECR_HOST}/${LOCAL_IMG_TAG}"
    SUBDOMAIN = sh(script:"echo ${ECR_REPOSITORY}-${NAMESPACE} | sed -E 's/[^[:alnum:]]+/-/g' | tr '[:upper:]' '[:lower:]'", returnStdout: true).trim()
  }

  stages {
    stage('Archive') {
      steps {
        sh "aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION} --image-scanning-configuration scanOnPush=true || true"
        sh "cp ~/config/${NAMESPACE}/swap_statistics_env ./.env"
        sh "git submodule update --init"
        sh "docker build --no-cache -t ${LOCAL_IMG_TAG} ."
        sh "docker tag ${LOCAL_IMG_TAG} ${ECR_IMG_TAG}"
        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_HOST}"
        sh "docker push ${ECR_IMG_TAG}"
        sh "kubectl config use-context ${KUBE_CONTEXT}"
        sh "helm upgrade ${ECR_REPOSITORY} ./chart/ --install --create-namespace --wait --debug --namespace ${NAMESPACE} --set-string podAnnotations.jenkinsBuildNumber=${BUILD_NUMBER} --set replicaCount=${NUMBER_OF_PODS} --set autoscaling.minReplicas=${NUMBER_OF_PODS} --set image.repository=${ECR_HOST}/${ECR_REPOSITORY} --set image.tag=${IMG_TAG} --set ingress.hosts[0]=${SUBDOMAIN}${PRIVATE_HOST_POSTFIX} --set ingress.hosts[1]=${PUBLIC_HOST} --set autoscaling.enabled=${POD_AUTOSCALING}"
      }
    }
  }
}
