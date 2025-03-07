class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
    multiply(scalar) { return new Vector2(this.x * scalar, this.y * scalar); }
    distance(v) { return Math.hypot(this.x - v.x, this.y - v.y); }
}

function createNoise2D() {
    return (x, y) => {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    };
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export { Vector2, createNoise2D, randomChoice };
