import { EntityMap, nosync } from "colyseus";
import Player from './player'
import config from './config'


export default class State {

    players: EntityMap<Player> = {};
    ball: number[] = { x: config.fieldSize.x/2, y: config.fieldSize.y/2 };
    rightTurn: boolean = false;
    score: number[] = [0, 0];

    @nosync
    something = "This attribute won't be sent to the client-side";

    createPlayer (id: string) {
        this.players[id] = new Player(Object.keys(this.players).length > 0);
        console.log(this.players[id])
    }

    removePlayer (id: string) {
        delete this.players[id];
    }

    movePlayer (id: string, movement: any) {
        const player = this.players[id];
        this.players[id].pieces[movement.piece]
        // if (movement.x) {
        //     this.players[ id ].x += movement.x * 10;

        // } else if (movement.y) {
        //     this.players[ id ].y += movement.y * 10;
        // }
    }
}
