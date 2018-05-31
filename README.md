# Dezurda Multiplayer Game Server

Servidor de juego multiplayer basado en [Colyseus](https://github.com/gamestdio/colyseus)

## Requerimientos

 * [Docker](https://www.docker.com/community-edition)
 * [Docker Compose](https://docs.docker.com/compose/install/) (incluido en Docker para Mac y Windows)


## Instalación

Una vez instalados los requerimientos, clonar repositorio y ejecutar:

```bash
$ docker-compose up -d
```

## Clientes

Basado en [Colyseus](http://colyseus.io/)

## Endpoints

Endpoint                            | URL
----------------------------------- | -------------
Servidor de Juego (Websocket)       | ws://127.0.0.1/
Cliente de ejemplo (Javascript)     | http://127.0.0.1/
