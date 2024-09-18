FROM node:latest

WORKDIR /usr/src/app
COPY package*.json app.js ./         
RUN npm install
EXPOSE 9000
CMD ["node", "app.js"]
