import { EntityMap, nosync } from "colyseus";
import Player from './player'
import config from './config'


export default class State {

    // Jugadores
    players: EntityMap<Player> = {};

    // La posición inicial del balón es justo a la mitad del campo
    ball: number[] = {
        x: config.fieldSize.x/2,
        y: config.fieldSize.y/2
    };

    // Número de turnos transcurridos
    turns: number = 0;

    createPlayer (id: string) {
        const players = Object.values(this.players)

        // El jugador es izquierdo o no?
        const isLeft = !players.length || !players[0].isLeft

        // Crear nuevo jugador
        this.players[id] = new Player(isLeft);
    }

    removePlayer (id: string) {
        console.log('State.removePlayer(', id, ')')
        delete this.players[id];
    }

    executeTurn (id: string, movement: any) {
        const player = this.players[id];
        const { piece, angle, force } = movement

        // Validar movimiento

        player.error = null
        if (Number.isInteger(piece) || piece < 0 || piece > this.players[id].pieces.length) {
            player.error = 'Número de pieza inválido'
        } else if (isNaN(force) || force < 0 || force > config.maxForce) {
            player.error = 'Magnitud de la fuerza inválida'
        } else if (Number.isInteger(angle) || anlge < 0 || angle > 365) {
            player.error = 'Ámgulo inválida'
        }

        if (player.error) {
            return        
        }

        const piecePosition = this.players[id].pieces[piece];

        // TODO: Calcular posiciones finales (física)
        piecePosition.x += 0.1

        // Aumentar número de turnos
        this.turns += 1;

        // player.pieces[1].x = 3.3
        // player.pieces[1].y = 2

        // if (movement.x) {
        //     this.players[ id ].x += movement.x * 10;

        // } else if (movement.y) {
        //     this.players[ id ].y += movement.y * 10;
        // }
    }
}
