FROM node:10

EXPOSE 3000

WORKDIR /app
RUN npm install
COPY . /app
CMD npm start