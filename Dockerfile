FROM node
ADD . /code
WORKDIR /code/Code/develop-base
RUN npm install
