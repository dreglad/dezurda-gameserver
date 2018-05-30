// Player
import config from './config'


export default class Player {
    pieces: number[];
    isLeft: boolean;
    score: number = 0;
    lastMovement: any = {};

    constructor (isLeft?: boolean) {
        this.isLeft = isLeft;

        // Posiciones iniciales
        this.pieces = config[isLeft ? 'initialLeft' : 'initialRight'];
    }
}
