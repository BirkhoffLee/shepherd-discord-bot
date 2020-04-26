FROM node:lts

WORKDIR /app

COPY package.json .

ENV NODE_ENV=production

RUN npm install --production

COPY . .

CMD ["node", "index.js"]
