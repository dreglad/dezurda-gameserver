FROM node

RUN mkdir /src
WORKDIR /src

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json

RUN npm update --global
RUN npm install

EXPOSE 2657

CMD npm start
