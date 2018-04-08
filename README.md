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


## Funcionamiento



## Endpoints

Endpoint                            | URL
----------------------------------- | -------------
Servidor HTTP / WebSockets          | http://127.0.0.1:2657
Cliente de ejemplo (Javascript)     | http://127.0.0.1:2657/client.html



### Consideraciones

  - Posiciones:
    - Las posiciones se representan como un objeto con dos miembos numéricos de la forma: `{ x: 2.34, y: 1.03 }`
    - Están acotadas a un rectángulo de 10 unidades en el eje horizontal y 6 en el eje vertical. El origen es la esq. sup. izquierda en (0, 0) y la esq. inf. derecha en (10, 6)

  - Fichas:
    - Cada ficha (11 por jugador) se define con una posición que representa el centro de un cuerpo circular de 0.1 unidades de radio.

  - Movimiento:
    - Cada movimiento se define como un objeto con 3 miembros muméricos de la forma: `{ piece: 2, angle: 30, force: 10.23 }`

  - Reglas

 - Se sigue la convención típica de

### Representación del estado del juego

Path                            | Ejemplo
---------------------------------- | -------------
ball                | Posición de la pelota     { x: 10.001, y: 3.00 }
turn                | Número de turno
player/:id/pieces   | http://127.0.0.1:2657/client.html



### Cliente de ejemplo

Se incluye un cliente de ejemplo para navegador web, implementado en Javascript / HTML5 localizado en [src/static/client.html](src/static/client.html)

![Cliente de ejemplo](example_client.png?raw=true "Cliente de ejemplo")



### Representación del estado de cada jugador

```json

```
