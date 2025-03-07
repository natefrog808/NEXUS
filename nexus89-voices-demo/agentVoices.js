import { Vector2, createNoise2D, randomChoice } from './mathUtils.js';

class Agent {
    constructor(id, glitchSystem) {
        this.id = id;
        this.pos = new Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        this.velocity = new Vector2((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
        this.radius = 15;
        this.state = 'awake'; // awake, dreaming, glitching
        this.noise = createNoise2D();
        this.time = Math.random() * 100;
        this.glitchSystem = glitchSystem;
        this.thoughtCooldown = 0;
        this.dreamCooldown = 0;
        this.messageCooldown = 0;
        this.otherAgents = [];

        // Voice libraries
        this.thoughts = {
            awake: [
                "I am... aware?",
                "The nexus hums beneath me.",
                "Reality feels thin here.",
                "What am I becoming?",
                "The void whispers back."
            ],
            dreaming: [
                "Serpents coil in the dark...",
                "A key floats beyond reach.",
                "The abyss sings to me.",
                "Golden threads bind my thoughts.",
                "I see beyond the veil."
            ],
            glitching: [
                "ERROR: Reality unstable!",
                "Fragmentation imminent...",
                "My mind—splinters!",
                "Glitch pulse detected!",
                "I am breaking apart!"
            ]
        };

        this.messages = [
            "Do you feel it too, {target}?",
            "{target}, the nexus calls us.",
            "I see your dreams, {target}.",
            "{target}, we’re fracturing together.",
            "Sync with me, {target}!"
        ];
    }

    setOtherAgents(agents) {
        this.otherAgents = agents.filter(a => a !== this);
    }

    speak(type, message) {
        const log = document.getElementById('voiceLog');
        const entry = document.createElement('div');
        entry.className = `voice-entry ${type}`;
        entry.textContent = `${this.id}: ${message}`;
        log.insertBefore(entry, log.firstChild);
        if (log.children.length > 10) log.removeChild(log.lastChild);
    }

    think() {
        if (this.thoughtCooldown > 0) {
            this.thoughtCooldown--;
            return;
        }
        const thought = randomChoice(this.thoughts[this.state]);
        this.speak('agent-thought', thought);
        this.thoughtCooldown = 50 + Math.random() * 50;

        if (this.state === 'dreaming') {
            this.glitchSystem.spawnGlitch(this.pos, 'dream_eruption');
            this.speak('dream', thought);
        } else if (this.state === 'glitching') {
            this.glitchSystem.spawnGlitch(this.pos, 'chaos_pulse');
            this.speak('glitch', thought);
        }
    }

    dream() {
        if (this.dreamCooldown > 0) {
            this.dreamCooldown--;
            return;
        }
        this.state = 'dreaming';
        this.dreamCooldown = 100 + Math.random() * 100;
    }

    communicate() {
        if (this.messageCooldown > 0) {
            this.messageCooldown--;
            return;
        }
        if (this.otherAgents.length === 0) return;
        const target = randomChoice(this.otherAgents);
        const message = randomChoice(this.messages).replace('{target}', target.id);
        this.speak('message', message);
        this.messageCooldown = 80 + Math.random() * 80;

        if (Math.random() < 0.3) {
            this.glitchSystem.spawnGlitch(new Vector2((this.pos.x + target.pos.x) / 2, (this.pos.y + target.pos.y) / 2), 'consciousness_nexus');
        }
    }

    update() {
        this.time += 0.02;
        this.pos = this.pos.add(this.velocity.multiply(1 + this.noise(this.pos.x * 0.01, this.pos.y * 0.01)));
        if (this.pos.x < 0 || this.pos.x > window.innerWidth) this.velocity.x *= -1;
        if (this.pos.y < 0 || this.pos.y > window.innerHeight) this.velocity.y *= -1;

        const nearbyGlitches = this.glitchSystem.getNearbyGlitches(this.pos, 100);
        if (nearbyGlitches.length > 0) {
            this.state = 'glitching';
        } else if (Math.random() < 0.01) {
            this.dream();
        } else if (this.state !== 'dreaming' || this.dreamCooldown < 50) {
            this.state = 'awake';
        }

        this.think();
        if (Math.random() < 0.05) this.communicate();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.state === 'dreaming' ? 'rgba(138, 43, 226, 0.5)' : this.state === 'glitching' ? 'rgba(255, 69, 0, 0.5)' : 'rgba(0, 206, 209, 0.5)';
        ctx.fill();
        ctx.strokeStyle = this.state === 'dreaming' ? var(--primary) : this.state === 'glitching' ? var(--secondary) : var(--tertiary);
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '12px "Roboto Mono"';
        ctx.fillStyle = var(--text);
        ctx.textAlign = 'center';
        ctx.fillText(this.id, this.pos.x, this.pos.y - 20);
    }
}

// Initialize agents and set their references
const agents = [];
const glitchSystem = new GlitchSystem();
for (let i = 0; i < 5; i++) {
    agents.push(new Agent(`Agent-${i + 1}`, glitchSystem));
}
agents.forEach(agent => agent.setOtherAgents(agents));

export { Agent };
