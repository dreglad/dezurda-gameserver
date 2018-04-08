// Player
import config from './config'


export default class Player {
    pieces: number[];
    isLeft: boolean;

    constructor (isLeft?: boolean) {
        this.isLeft = isLeft;
        this.pieces = config[isLeft ? 'initialLeft' : 'initialRight'];
    }
}
