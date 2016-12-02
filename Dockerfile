FROM node:6.9.1
WORKDIR /ticktactoe

COPY . .
RUN npm install --silent

EXPOSE 3000
ENV NODE_PATH .
CMD ./migratescript.sh
