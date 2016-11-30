FROM node
WORKDIR /ticktactoe
COPY package.json .
RUN npm install --silent
COPY index.js .
COPY ./test/ /code/test
EXPOSE 3000
CMD ["node","run.js"]
