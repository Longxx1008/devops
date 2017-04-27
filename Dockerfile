FROM daocloud.io/library/node
ADD . /code
WORKDIR /code/Code/develop-base
RUN npm install
RUN node bin/www
