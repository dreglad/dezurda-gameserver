// Player
import config from './config'

export default class Player {
    pieces: [];
    isLeft: boolean;
    score: number = 0;
    lastMovement: any = {};
    name: string = '';
    token: string = '';

    constructor (isLeft?: boolean, options) {
        this.isLeft = isLeft;
        this.pieces = this.isLeft
            ? [ { x: 3.7, y: 1.5 },
                { x: 3.7, y: 3 },
                { x: 3.7, y: 4.5 },
                { x: 2.8, y: 2 },
                { x: 2.8, y: 4 } ]
            : [ { x: 6.3, y: 1.5 },
                { x: 6.3, y: 3 },
                { x: 6.3, y: 4.5 },
                { x: 7.2, y: 2 },
                { x: 7.2, y: 4 } ];
        if (options && typeof options.name == 'string') {
            this.name = options.name;
        }
        if (options && typeof options.token == 'string') {
            this.token = options.token;
        }
    }


    setPieces () {
        const initial = [...config[this.isLeft ? 'initialLeft' : 'initialRight']];
        for (let i=0; i<initial.length; i++) {
            this.pieces[i].x = initial[i].x
            this.pieces[i].y = initial[i].y
        }
    }
}


