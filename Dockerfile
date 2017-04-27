FROM readytalk/nodejs
ADD . /code
WORKDIR /code
RUN ls -al
