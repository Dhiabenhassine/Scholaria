FROM node:18-alpine

WORKDIR /index

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3100
CMD ["node", "index.js"]
