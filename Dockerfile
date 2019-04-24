FROM node:10

EXPOSE 3000

WORKDIR /app
COPY . /app
RUN npm install
CMD npm start