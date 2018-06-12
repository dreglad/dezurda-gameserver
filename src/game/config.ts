/* config */

const pieceRadius = 3.50;
const ballRadius = 2.30;
const maxForce = 1.0;
const winningScore = 2;  // 2 de 3 goles para ganar
const fieldSize = {
    x: 95.4,
    y: 60 
};

const initialLeft = [
    { x: 37.0, y: 15.0 },
    { x: 37.0, y: 30.0 },
    { x: 37.0, y: 45.0 },
    { x: 28.0, y: 20.0 },
    { x: 28.0, y: 40.0 }
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
