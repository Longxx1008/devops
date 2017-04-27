FROM readytalk/nodejs
ADD . /code
WORKDIR /code/Code/develop-base
RUN node bin/www
