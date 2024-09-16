FROM node:latest

WORKDIR /usr/src/app
COPY package*.json app.js dbSchema.js ./
COPY messageHandlers ./messageHandlers    
RUN npm install
CMD ["node", "app.js"]
