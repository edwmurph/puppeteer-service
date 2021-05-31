FROM buildkite/puppeteer:9.1.1

WORKDIR /usr/src/puppeteer-service

COPY package.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
