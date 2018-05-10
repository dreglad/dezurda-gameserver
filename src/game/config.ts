const initialLeft = [
    { x: 3.7, y: 1.5 },
    { x: 3.7, y: 3 },
    { x: 3.7, y: 4.5 },
    { x: 2.8, y: 2 },
    { x: 2.8, y: 4 }
];

const fieldSize = { x: 10, y: 6 };

const pieceDiameter = 1.0;

const ballDiameter = 0.5;

const maxForce = 1.0;

export default {
    fieldSize,
    pieceDiameter,
    maxForce,
    ballDiameter,
    initialLeft,
    // Copiar el estado inicial de left, pero en espejo
    initialRight: initialLeft.map(piece => {
        return {
            x: Math.abs((fieldSize.x/2) - (piece.x)) + fieldSize.x/2,
            y: piece.y
        }
    })
}
