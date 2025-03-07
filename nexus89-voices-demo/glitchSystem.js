import { Vector2, createNoise2D } from './mathUtils.js';

class Glitch {
    constructor(pos, type) {
        this.pos = pos;
        this.type = type;
        this.radius = 20 + Math.random() * 20;
        this.intensity = Math.random() * 0.5 + 0.5;
        this.color = {
            'spacetime_rift': '#FF4500',
            'dream_eruption': '#FFD700',
            'consciousness_nexus': '#00CED1',
            'chaos_pulse': '#8A2BE2'
        }[type];
        this.life = 50 + Math.random() * 100;
    }

    update() {
        this.life--;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius * this.intensity, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${Math.floor(this.life / 2).toString(16)}`;
        ctx.fill();
    }
}

class GlitchSystem {
    constructor() {
        this.glitches = [];
        this.noise = createNoise2D();
        this.time = 0;
    }

    spawnGlitch(pos, type) {
        this.glitches.push(new Glitch(pos, type));
    }

    update() {
        this.time += 0.02;
        this.glitches = this.glitches.filter(g => g.life > 0);
        this.glitches.forEach(g => g.update());
    }

    draw(ctx) {
        this.glitches.forEach(g => g.draw(ctx));
    }

    getNearbyGlitches(pos, radius) {
        return this.glitches.filter(g => g.pos.distance(pos) < radius);
    }
}

export { GlitchSystem };
