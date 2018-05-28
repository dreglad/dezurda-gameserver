import { EntityMap, nosync } from "colyseus";
import Player from './player'
import config from './config'


export default class State {

    // Jugadores
    players: EntityMap<Player> = {};

    // La posición inicial del balón es justo a la mitad del campo
    ball: number[];

    // Número de turnos transcurridos
    turns: number = 0;

    error: string = '';

    reset (): void {
        this.error = '';
        this.turns = 0;
        this.ball = {
            x: config.fieldSize.x/2,
            y: config.fieldSize.y/2
        };
    }

    createPlayer (id: string) {
        const players = Object.values(this.players);

        // El jugador es izquierdo o derecho?
        const isLeft = players.length === 0 || !players[0].isLeft
        this.players[id] = new Player(isLeft);

        this.reset();
    }

    removePlayer (id: string) {
        console.log('State.removePlayer(), id:', id);
        delete this.players[id];
        this.reset();
    }

    executeTurn (id: string, movement: any) {
        console.log('State.executeTurn(), id:', id, ' movement:', movement);

        const player = this.players[id];

        if (player.isLeft && this.turns % 2 !== 0) {
            player.error = 'No es tu turno';
            console.log(player.error);
            return
        }
        const { piece, angle, force } = movement

        // Validar movimiento

        // if (this.turns % 2)

        player.error = null
        if (!Number.isInteger(piece) || piece < 0 || piece >= this.players[id].pieces.length) {
            player.error = 'Número de pieza inválido'
        } else if (isNaN(force) || force < 0 || force > config.maxForce) {
            player.error = 'Magnitud de la fuerza inválida'
        } else if (!Number.isInteger(angle) || angle <= 0 || angle > 365) {
            player.error = 'Ámgulo inválido'
        }

        if (player.error) {
            console.log('Error:', player.error)
            return
        }

        const piecePosition = this.players[id].pieces[piece];
        // TODO: Calcular posiciones finales (física)
        piecePosition.x += 0.1;

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        console.log('aaa')
        const players = Object.keys(this.players)

        players.forEach(player => {
            this.players[player]
            .pieces.forEach(piece => {
                piece.x = getRandomArbitrary(0.5, 9.5)
            piece.y = getRandomArbitrary(0.5, 5.5)
            })
        })

        this.ball.x = getRandomArbitrary(0.5, 9.5)
        this.ball.y = getRandomArbitrary(0.5, 9.5)

        // Aumentar número de turnos
        this.turns ++;
        // player.pieces[1].x = 3.3
        // player.pieces[1].y = 2

        // if (movement.x) {
        //     this.players[ id ].x += movement.x * 10;

        // } else if (movement.y) {
        //     this.players[ id ].y += movement.y * 10;
        // }
    }
}
