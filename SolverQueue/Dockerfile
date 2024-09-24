FROM node:latest

WORKDIR /usr/src/app
COPY package*.json app.js dbSchema.js ./
COPY messageHandlers ./messageHandlers
COPY middlewares ./middlewares    
RUN npm install
CMD ["node", "app.js"]
