// src/utils/math.js

/**
 * Math utility functions for the NEXUS89 project.
 * Provides tools for 2D vector operations, noise generation, and procedural effects
 * to power glitch systems, agent behaviors, and visualizations.
 */

/**
 * Represents a 2D vector with advanced operations for spatial calculations.
 * Used in glitch positioning, agent movement, and visualization effects.
 */
export class Vector2 {
  /**
   * @param {number} [x=0] - X coordinate
   * @param {number} [y=0] - Y coordinate
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add another vector to this one.
   * @param {Vector2} v - Vector to add
   * @returns {Vector2} New vector representing the sum
   */
  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtract another vector from this one.
   * @param {Vector2} v - Vector to subtract
   * @returns {Vector2} New vector representing the difference
   */
  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiply this vector by a scalar.
   * @param {number} scalar - Scalar value
   * @returns {Vector2} New scaled vector
   */
  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Divide this vector by a scalar.
   * @param {number} scalar - Scalar value (non-zero)
   * @returns {Vector2} New divided vector
   * @throws {Error} If scalar is zero
   */
  divide(scalar) {
    if (scalar === 0) throw new Error("Division by zero");
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * Calculate the dot product with another vector.
   * @param {Vector2} v - Vector to compute dot product with
   * @returns {number} Dot product result
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculate distance to another vector.
   * @param {Vector2} v - Target vector
   * @returns {number} Euclidean distance
   */
  distance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate squared distance to another vector (faster than distance).
   * @param {Vector2} v - Target vector
   * @returns {number} Squared Euclidean distance
   */
  distanceSquared(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /**
   * Calculate the magnitude (length) of this vector.
   * @returns {number} Magnitude
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculate the squared magnitude (faster than magnitude).
   * @returns {number} Squared magnitude
   */
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalize this vector to unit length.
   * @returns {Vector2} New normalized vector
   */
  normalize() {
    const mag = this.magnitude();
    return mag === 0 ? new Vector2() : new Vector2(this.x / mag, this.y / mag);
  }

  /**
   * Linearly interpolate to another vector.
   * @param {Vector2} v - Target vector
   * @param {number} t - Interpolation factor (0-1)
   * @returns {Vector2} Interpolated vector
   */
  lerp(v, t) {
    return new Vector2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    );
  }

  /**
   * Rotate this vector by an angle (in radians).
   * @param {number} angle - Angle in radians
   * @returns {Vector2} New rotated vector
   */
  rotate(angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return new Vector2(
      this.x * cosA - this.y * sinA,
      this.x * sinA + this.y * cosA
    );
  }

  /**
   * Reflect this vector over a normal.
   * @param {Vector2} normal - Normal vector (should be normalized)
   * @returns {Vector2} Reflected vector
   */
  reflect(normal) {
    const dot = this.dot(normal);
    return this.subtract(normal.multiply(2 * dot));
  }

  /**
   * Clone this vector.
   * @returns {Vector2} New identical vector
   */
  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * Create a vector from an angle (in radians).
   * @param {number} angle - Angle in radians
   * @param {number} [length=1] - Length of the vector
   * @returns {Vector2} New vector
   */
  static fromAngle(angle, length = 1) {
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
  }
}

/**
 * Generates Perlin noise for smooth, organic glitch effects.
 * @param {number} [seed] - Optional seed for consistent noise
 * @returns {Function} 2D noise function returning values in [-1, 1]
 */
export function createNoise2D(seed = Math.random() * 1000) {
  const p = new Uint8Array(512);
  const permutation = new Uint8Array(256);
  const random = seededRandom(seed);

  // Initialize permutation table
  for (let i = 0; i < 256; i++) permutation[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = permutation[i % 256];

  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (hash, x, y) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x, y) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = fade(x);
    const v = fade(y);

    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];

    return lerp(
      lerp(grad(aa, x, y), grad(ba, x - 1, y), u),
      lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u),
      v
    ) * 1.414; // Scale to approximate [-1, 1]
  };
}

/**
 * Generates a random color in hex or rgba format.
 * @param {number} [alpha=1] - Alpha value (0-1)
 * @param {string} [type='hex'] - 'hex' or 'rgba'
 * @returns {string} Random color string
 */
export function randomColor(alpha = 1, type = 'hex') {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  if (type === 'rgba' || alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Linearly interpolates between two values.
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Maps a value from one range to another.
 * @param {number} value - Input value
 * @param {number} inMin - Input min
 * @param {number} inMax - Input max
 * @param {number} outMin - Output min
 * @param {number} outMax - Output max
 * @returns {number} Mapped value
 */
export function map(value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

/**
 * Clamps a value between a min and max.
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a random float within a range.
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Returns a random integer within a range (inclusive).
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a seeded random number generator.
 * @param {number} seed - Seed value
 * @returns {Function} Seeded random function (returns 0-1)
 */
export function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Calculates Euclidean distance between two points.
 * @param {number} x1 - First x
 * @param {number} y1 - First y
 * @param {number} x2 - Second x
 * @param {number} y2 - Second y
 * @returns {number} Distance
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Picks a random element from an array.
 * @param {Array} array - Source array
 * @returns {*} Random element
 */
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Converts degrees to radians.
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees.
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Calculates the angle between two points in radians.
 * @param {number} x1 - First x
 * @param {number} y1 - First y
 * @param {number} x2 - Second x
 * @param {number} y2 - Second y
 * @returns {number} Angle in radians
 */
export function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Applies cubic ease-in-out to a value.
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased value
 */
export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Generates fractal noise by layering Perlin noise.
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} [octaves=4] - Number of noise layers
 * @param {number} [persistence=0.5] - Amplitude reduction per octave
 * @param {number} [seed] - Optional seed
 * @returns {number} Fractal noise value
 */
export function fractalNoise(x, y, octaves = 4, persistence = 0.5, seed = Math.random() * 1000) {
  const noise = createNoise2D(seed);
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += noise(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return value / maxValue; // Normalized to [-1, 1]
}

/**
 * Generates a smoothstep value for transitions.
 * @param {number} edge0 - Lower edge
 * @param {number} edge1 - Upper edge
 * @param {number} x - Input value
 * @returns {number} Smoothstep value (0-1)
 */
export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Simulates a damped oscillation.
 * @param {number} t - Time
 * @param {number} [amplitude=1] - Initial amplitude
 * @param {number} [frequency=1] - Oscillation frequency
 * @param {number} [decay=1] - Decay rate
 * @returns {number} Oscillatory value
 */
export function dampOscillate(t, amplitude = 1, frequency = 1, decay = 1) {
  return amplitude * Math.sin(t * frequency * Math.PI * 2) * Math.exp(-t * decay);
}
