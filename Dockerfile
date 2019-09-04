FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
RUN npm install -g nodemon
RUN npm install forever -g
