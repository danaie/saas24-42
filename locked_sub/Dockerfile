FROM node:latest

WORKDIR /usr/src/app
COPY package*.json app.js dbSchema.js ./    
COPY middlewares ./middlewares
COPY messageHandlers ./messageHandlers         
RUN npm install
EXPOSE 4000
CMD ["node", "app.js"]