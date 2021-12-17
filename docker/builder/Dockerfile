FROM public.ecr.aws/lambda/nodejs:14

COPY zip-routers.sh /zip-routers.sh
RUN yum install zip openssl -y

RUN npm i -g yarn

ENTRYPOINT ["/zip-routers.sh"]
