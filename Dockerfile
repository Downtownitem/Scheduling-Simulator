FROM node:22-alpine

RUN mkdir -p /web
WORKDIR /web

COPY package.json /web
RUN npm install

EXPOSE 8000
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev"]