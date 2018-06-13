import { EntityMap, nosync } from "colyseus";
import Player from './player'
import config from './config'
import createWorld from './soccer'
const axios = require('axios');


function toCords(worldPos) {
    return {
        x: worldPos.x + config.fieldSize.x/2,
        y: worldPos.y + config.fieldSize.y/2
    }
}

export default class State {

    // Jugadores
    players: EntityMap<Player> = {};

    // La posición inicial del balón es justo a la mitad del campo
    ball: number[];

    // Número de turnos transcurridos
    turns: number = 0;

    ended: boolean = false;

    winningScore: number = 2;

    working: boolean = false;

    error: string = '';

    reset (): void {
        if (Object.values(this.players).find(player => player.score >= this.winningScore)) {
            // REPORT WINNER
            console.log('WINNER')

            const p1 = Object.values(players).find(p => p.isLeft === true);
            const p2 = Object.values(players).find(p => p.isLeft === false);
            const unixtime = Math.round((new Date()).getTime() / 1000);

            if (p1.token && p2.token) {
                const url = `${config.reportingUrl}/${p1.token}/${p2.token}/${p1.score}/${p2.score}/${unixtime}`
                console.log('About to report winner: ', url);
                axios.post(url).then(response => {
                    console.log('Done reporting winner', response);
                }).catch(error => {
                    console.log('Error reporting winner:', error);
                })
            } else {
                console.log("No winner reporting because no auth token found for both players")
            }
            this.ended = true
        }
        this.error = '';
        Object.values(this.players).forEach(player => {
            player.setPieces();
        })
        this.ball = {
            x: config.fieldSize.x/2,
            y: config.fieldSize.y/2
        };
    }

    createPlayer (id: string, options) {
        const players = Object.values(this.players);

        // El jugador es izquierdo o derecho?
        const isLeft = players.length === 0 || !players[0].isLeft
        this.players[id] = new Player(isLeft, options);

        this.reset();
        this.ended = false;
        this.turns = 0;
    }

    removePlayer (id: string) {
        console.log('State.removePlayer(), id:', id);
        delete this.players[id];
        this.turns = 0;
        this.ended = true;
    }

    reportWinner (Player: player) {
        console.log('About to report winner')
    }

    executeTurn (id: string, movement: any, delayed) {
        console.log('State.executeTurn(), id:', id, ' movement:', movement);

        const player = this.players[id];

        if (this.ended) {
            player.error = { code: 5, message: 'Esta partida ha finalizado' }
            console.log(player.error)
            return
        }

        const { piece, angle, force, token, forceX, forceY, wallRestitution, disableTurns } = movement

        if (!disableTurns && ((player.isLeft && this.turns % 2 !== 0) || (!player.isLeft && this.turns % 2 !== 1))) {
            player.error = { code: 1, message: 'No es tu turno' };
            console.log(player.error);
            return
        }

        player.error = null
        if (!Number.isInteger(piece) || piece < 0 || piece >= this.players[id].pieces.length) {
            player.error = { code: 2, message: 'Número de pieza inválido' };
        }

        if (isNaN(forceX) && isNaN(forceY)) {
            if (isNaN(force) || force <= 0 || force > config.maxForce) {
                player.error = { code: 3, message: 'Magnitud de la fuerza inválida' };
            } else if (isNaN(angle) || angle < -365 || angle > 365) {
                player.error = { code: 4, message: 'Ángulo inválido' };
            }
        }

        if (player.error) {
            console.log('Error:', player.error)
            return
        }

        delayed.reset();

        this.working = true;

        const world = createWorld(this.players, player, this.ball, piece, force, angle, forceX, forceY, wallRestitution, this)

        console.log('step')
        for (let i=0; i<1000; i++){
            world.step(1/60)
        }

        const playerValues = Object.values(this.players)

        for (var body = world.getBodyList(); body; body = body.getNext()) {
          for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
            const data = fixture.getUserData();
            if (typeof data == 'object' && data.type === 'piece') {
                const piece = playerValues.find(p => p.isLeft == data.isLeft).pieces[data.piece];
                const coords = toCords(body.getPosition());
                piece.x = coords.x;
                piece.y = coords.y;
            } else if (data === 'ball') {
                const newBall = toCords(body.getPosition())
                this.ball.x = newBall.x;
                this.ball.y = newBall.y;
              }
          }
        }

        this.turns++;
        player.lastMovement = movement;

        delayed.reset();

        this.working = false;
    }
}
