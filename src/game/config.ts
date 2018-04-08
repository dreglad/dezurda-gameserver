const initialLeft = [
    { x: 4.4, y: 3 },
    { x: 3.7, y: 1.5 }, { x: 3.7, y: 3 }, { x: 3.7, y: 4.5 },
    { x: 2.8, y: 2 }, { x: 2.8, y: 4 },
    { x: 2, y: 1 }, { x: 1.8, y: 2 }, { x: 1.8, y: 4 }, { x: 2, y: 5 },
    { x: 1, y: 3 }
];

const fieldSize = { x: 10, y: 6 };

export default {
    fieldSize,
    initialLeft,
    initialRight: initialLeft.map(piece => {
        return {
            x: Math.abs((fieldSize.x/2) - (piece.x)) + fieldSize.x/2,
            y: piece.y
        }
    })
}
