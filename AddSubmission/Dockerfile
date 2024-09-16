FROM node:latest

WORKDIR /usr/src/app
COPY package*.json app.js ./    
COPY middlewares ./middlewares         
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
