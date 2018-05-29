import { EntityMap, nosync } from "colyseus";
import Player from './player'
import config from './config'
import createWorld from './soccer'


function toCords(worldPos) {
    return { x: worldPos.x+10, y: worldPos.y+6 }
}

export default class State {

    // Jugadores
    players: EntityMap<Player> = {};

    // La posición inicial del balón es justo a la mitad del campo
    ball: number[];

    // Número de turnos transcurridos
    turns: number = 0;

    ended: boolean = false;

    winningScore: number = 3;

    working: boolean = false;

    error: string = '';

    reset (): void {
        this.error = '';
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
        this.turns = 0;
    }

    removePlayer (id: string) {
        console.log('State.removePlayer(), id:', id);
        delete this.players[id];
        this.reset();
        this.turns = 0;
    }

    reportWinner (Player: player) {
        console.log('About to report winner')
    }

    executeTurn (id: string, movement: any) {
        console.log('State.executeTurn(), id:', id, ' movement:', movement);

        const player = this.players[id];

        if (this.ended) {
            player.error = { code: 5, message: 'Esta partida ha finalizado' }
            console.log(player.error)
            return
        }

        console.log(player.isLeft)
        console.log(this.turns % 2)
        if ((player.isLeft && this.turns % 2 !== 0) || (!player.isLeft && this.turns % 2 !== 1)) {
            player.error = { code: 1, message: 'No es tu turno' };
            console.log(player.error);
            return
        }

        const { piece, angle, force, token } = movement

        player.error = null
        if (!Number.isInteger(piece) || piece < 0 || piece >= this.players[id].pieces.length) {
            player.error = { code: 2, message: 'Número de pieza inválido' };
        } else if (isNaN(force) || force <= 0 || force > config.maxForce) {
            player.error = { code: 3, message: 'Magnitud de la fuerza inválida' };
        } else if (!Number.isInteger(angle) || angle < 0 || angle > 365) {
            player.error = { code: 4, message: 'Ángulo inválido' };
        }

        if (player.error) {
            console.log('Error:', player.error)
            return
        }

        this.working = true;

        const playerValues = Object.values(this.players);
        const playerNum = playerValues.indexOf(player);
        const world = createWorld(this.players, this.ball, playerNum, piece, force, angle)

        function doStep() {
            console.log('step')
            world.step(1/60)
            for (var body = world.getBodyList(); body; body = body.getNext()) {
              for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                const data = fixture.getUserData();
                if (typeof data == 'object' && data.type === 'piece') {
                    const piece = playerValues[data.player].pieces[data.piece];
                    const coords = toCords(body.getPosition());
                    piece.x = coords.x;
                    piece.y = coords.y;
                } else if (typeof data == 'object' && data.type === 'ball') {
                    this.ball = toCords(body.getPosition())
                    console.log(this.ball)
                  }
              }
            }
        }

        let i = 0;
        while(i < 10) {
            i++;
            doStep();
        }

        this.turns++;
        this.working = false;
    }
}
