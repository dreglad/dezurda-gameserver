import { EntityMap, nosync } from "colyseus";
import Player from './player'
import config from './config'


export default class State {

    players: EntityMap<Player> = {};
    ball: number[] = { x: config.fieldSize.x/2, y: config.fieldSize.y/2 };
    turns: number = 0;

    createPlayer (id: string) {
        const players = Object.values(this.players)
        this.players[id] = new Player(!players.length || !players[0].isLeft);
    }

    removePlayer (id: string) {
        console.log('State.removePlayer(', id, ')')
        delete this.players[id];
    }

    executeTurn (id: string, movement: any) {
        console.log(Object.keys(this.players).length);
        const player = this.players[id];
        this.turns += 1;
        // if (movement.x) {
        //     this.players[ id ].x += movement.x * 10;

        // } else if (movement.y) {
        //     this.players[ id ].y += movement.y * 10;
        // }
    }
}
