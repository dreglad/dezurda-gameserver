/* config */

const pieceRadius = 0.35;
const ballRadius = 0.23;
const maxForce = 1.0;
const winningScore = 2;
const fieldSize = {
    x: 9.08,
    y: 6.0
};

const initialLeft = [
    { x: 3.7, y: 1.5 },
    { x: 3.7, y: 3 },
    { x: 3.7, y: 4.5 },
    { x: 2.8, y: 2 },
    { x: 2.8, y: 4 }
];

const initialRight = initialLeft.map(piece => {
    // Copiar el estado inicial de left, pero en espejo
    return {
        x: Math.abs((fieldSize.x/2) - (piece.x)) + fieldSize.x/2,
        y: piece.y
    }
});

export default {
    fieldSize,
    ballRadius,
    pieceRadius,
    maxForce,
    initialLeft,
    initialRight
}
