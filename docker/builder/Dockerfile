FROM public.ecr.aws/lambda/nodejs:14

COPY zip-routers.sh /zip-routers.sh
RUN yum install zip openssl -y

RUN npm i -g yarn
RUN npm config set registry https://registry.npmjs.org
RUN npm config set @feprisa:registry https://feprisa-181459816757.d.codeartifact.us-east-1.amazonaws.com/npm/internal/
RUN npm config set //feprisa-181459816757.d.codeartifact.us-east-1.amazonaws.com/npm/internal/:_authToken "\${CODEARTIFACT_AUTH_TOKEN}"

ENTRYPOINT ["/zip-routers.sh"]
