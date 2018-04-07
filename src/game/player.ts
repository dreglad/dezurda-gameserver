// Player
import config from './config'


export default class Player {
    rightSide: boolean;
    pieces: number[];

    constructor(rightSide: boolean) {
        this.rightSide = rightSide;
        this.pieces = rightSide ? config.initialRight : config.initial;
    }
}
