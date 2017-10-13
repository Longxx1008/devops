FROM node
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g pm2
RUN npm install -g mocha

COPY ./Code/develop-base /user/src/app
WORKDIR /user/src/app

EXPOSE 30000 
RUN cnpm install
CMD ["npm","start"]
