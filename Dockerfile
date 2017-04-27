FROM readytalk/nodejs
ADD . /code
WORKDIR /code
RUN npm install
