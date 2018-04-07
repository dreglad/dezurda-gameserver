# Dezurda Multiplayer Game Server


## Requerimientos

 * [Docker](https://www.docker.com/community-edition)
 * [Docker Compose](https://docs.docker.com/compose/install/) (incluido en Docker para Mac y Windows)


## Instalación

Una vez instalados los requerimientos, clonar repositorio y ejecutar:

```bash
$ docker-compose up -d
```


## Funcionamiento


## Endpoints

Endpoint                            | URL
----------------------------------- | -------------
Servidor HTTP / WebSockets          | http://127.0.0.1:2657
Cliente de ejemplo (Javascript)     | http://127.0.0.1:2657/client.html


### Consideraciones

 - El campo de juego se representa mediante un rectángilo con una longitud de 10 unidades en el eje horizontal y 6 unidades en el eje vertical. El sistema de coordenadas tiene su origen en la esquina superior izquierda.

### Representación del estado del juego

```json

```

### Representación del estado de cada jugador

```json

```
