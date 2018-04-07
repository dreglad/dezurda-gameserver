FROM node

RUN mkdir /src

COPY src/package.json package.json

WORKDIR /src
RUN npm install

EXPOSE 2657

CMD npm start
