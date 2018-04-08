FROM node

RUN mkdir /src
WORKDIR /src

COPY ./package.json package.json

RUN npm install

EXPOSE 2657

CMD npm start
