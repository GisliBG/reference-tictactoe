FROM node:6.9.1
WORKDIR /ticktactoe

COPY . /ticktactoe
RUN npm install --silent

EXPOSE 8080
CMD ["node","run.js"]
