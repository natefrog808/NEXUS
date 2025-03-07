// CollectiveGlitchSystem.js
// Enhanced system for detecting, generating, and managing emergent glitch patterns
// from collective agent consciousness distortions, with deeper simulation integration

import { Vector2, createNoise2D } from './utils/math.js';

export class CollectiveGlitchSystem {
  constructor(simulation, perceptionSuite) {
    this.simulation = simulation;
    this.perceptionSuite = perceptionSuite;

    // Core glitch tracking
    this.glitchNodes = new Map(); // Agent-specific glitch contributions
    this.activeGlitches = []; // Live emergent glitches
    this.harvestedGlitches = []; // User-captured glitches
    this.glitchHistory = []; // Archive of past glitches for analysis

    // Configurable thresholds and settings
    this.distortionThreshold = 0.65; // Minimum collective distortion for emergent glitches
    this.maxGlitchNodes = 50; // Cap to prevent overload
    this.glitchPersistence = 60000; // 60s default lifespan for nodes
    this.noise = createNoise2D(); // Perlin noise for organic movement
    this.elapsedTime = 0;

    // Glitch behavior modifiers
    this.globalIntensityMod = 1.0; // Global multiplier for glitch strength
    this.interactionAmplifier = 1.2; // Boost for glitch interactions

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.simulation.on('memory_distortion', this._handleAgentDistortion.bind(this));
    this.simulation.on('dream', this._handleAgentDream.bind(this));
    this.simulation.on('consciousness_sync', this._handleConsciousnessSync.bind(this));
    this.simulation.on('environment_transition', this._handleEnvironmentTransition.bind(this));
    this.perceptionSuite.realityGlitcher.on('glitch_interaction', this._handleUserGlitchInteraction.bind(this));
  }

  /**
   * Handle agent memory distortions
   * @param {Object} agent - The agent
   * @param {Object} memory - Distorted memory data
   */
  _handleAgentDistortion(agent, memory) {
    const glitchContribution = {
      position: new Vector2(agent.x, agent.y),
      type: memory.type || 'spatial',
      intensity: Math.min(1.0, (memory.distortionLevel || 0.5) * this.globalIntensityMod),
      radius: 10 + (memory.distortionLevel || 0.5) * 20,
      color: this._getGlitchColor(memory.type),
      timestamp: Date.now(),
      agentId: agent.id,
      source: 'memory',
      distortionSource: memory.content // Track what caused the distortion
    };

    // Cap glitch nodes to prevent memory explosion
    if (this.glitchNodes.size >= this.maxGlitchNodes) {
      const oldest = [...this.glitchNodes.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.glitchNodes.delete(oldest[0]);
    }

    this.glitchNodes.set(agent.id, glitchContribution);
    this._evaluateEmergentGlitches();
    this._updateQuantumGraph();
  }

  /**
   * Handle agent dream states
   * @param {Object} agent - Dreaming agent
   * @param {Object} dreamState - Dream data
   */
  _handleAgentDream(agent, dreamState) {
    if (dreamState.intensity > 0.7) {
      const dreamGlitch = {
        position: new Vector2(agent.x + (Math.random() - 0.5) * 20, agent.y + (Math.random() - 0.5) * 20),
        type: 'dream',
        intensity: Math.min(1.0, dreamState.intensity * 0.8 * this.globalIntensityMod),
        radius: 15 + dreamState.intensity * 25,
        color: '#8A2BE2',
        timestamp: Date.now(),
        agentId: agent.id,
        source: 'dream',
        dreamSymbols: dreamState.symbols || [],
        dreamDepth: dreamState.depth || 'shallow' // Shallow, deep, lucid
      };

      this.glitchNodes.set(`dream_${agent.id}`, dreamGlitch);

      if (dreamState.intensity > 0.9) {
        this._createEmergentGlitch([dreamGlitch], dreamState.depth === 'lucid' ? 'lucid_rupture' : 'dream_rupture');
      } else {
        this._evaluateEmergentGlitches();
      }
    }
  }

  /**
   * Handle consciousness sync between agents
   * @param {Array} agents - Synced agents
   * @param {number} syncStrength - Sync strength (0-1)
   */
  _handleConsciousnessSync(agents, syncStrength) {
    if (syncStrength > 0.4 && agents.length >= 2) {
      const midpoint = this._calculateMidpoint(agents);
      const syncGlitch = {
        position: midpoint,
        type: 'sync',
        intensity: Math.min(1.0, syncStrength * this.globalIntensityMod),
        radius: 30 * syncStrength * Math.sqrt(agents.length),
        color: '#00CED1',
        timestamp: Date.now(),
        agentIds: agents.map(a => a.id),
        source: 'sync',
        bridgeType: syncStrength > 0.7 ? 'quantum_bridge' : 'empathic_link',
        syncStrength
      };

      const syncId = `sync_${agents.map(a => a.id).join('_')}`;
      this.glitchNodes.set(syncId, syncGlitch);

      if (syncStrength > 0.6 && agents.length >= 3) {
        this._createEmergentGlitch(
          Array.from(this.glitchNodes.values()).filter(g => g.type === 'sync' || agents.some(a => a.id === g.agentId)),
          'consciousness_convergence'
        );
      } else {
        this._evaluateEmergentGlitches();
      }
    }
  }

  /**
   * Handle environment transitions
   * @param {Object} transition - Transition data
   */
  _handleEnvironmentTransition(transition) {
    this.globalIntensityMod = transition.intensity || 1.0; // Environment affects glitch strength
    this.activeGlitches.forEach(glitch => {
      glitch.intensity *= this.globalIntensityMod;
      glitch.radius *= this.globalIntensityMod;
      glitch.effects.forEach(effect => effect.strength *= this.globalIntensityMod);
    });
    this._evaluateEmergentGlitches(); // New environment might trigger glitches
  }

  /**
   * Handle user interactions with glitches
   * @param {string} glitchId - Glitch ID
   * @param {string} interactionType - Interaction type
   * @param {Object} options - Additional interaction options
   */
  _handleUserGlitchInteraction(glitchId, interactionType, options = {}) {
    const glitchIndex = this.activeGlitches.findIndex(g => g.id === glitchId);
    if (glitchIndex === -1) return;

    const glitch = this.activeGlitches[glitchIndex];

    switch (interactionType) {
      case 'harvest':
        this.activeGlitches.splice(glitchIndex, 1);
        const harvested = { ...glitch, harvestedAt: Date.now(), harvestedBy: options.userId || 'unknown' };
        this.harvestedGlitches.push(harvested);
        this.glitchHistory.push(harvested);
        this.perceptionSuite.onGlitchHarvest(glitch);
        this._triggerFeedback('harvest', glitch);
        break;

      case 'amplify':
        glitch.intensity = Math.min(1.5, glitch.intensity + (options.boost || 0.2));
        glitch.radius *= this.interactionAmplifier;
        glitch.amplifiedByUser = true;
        glitch.amplificationCount = (glitch.amplificationCount || 0) + 1;
        glitch.contributingAgentIds.forEach(agentId => {
          const agent = this.simulation.getAgent(agentId);
          if (agent) {
            this.simulation.influenceAgentConsciousness(agent, {
              type: 'glitch_amplification',
              intensity: 0.3 * this.interactionAmplifier,
              source: 'user_interaction'
            });
          }
        });
        this._triggerFeedback('amplify', glitch);
        break;

      case 'stabilize':
        glitch.intensity *= 0.7;
        glitch.decay = (glitch.decay || 0.05) * 0.5;
        glitch.stabilized = true;
        glitch.color = this._adjustColorStability(glitch.color);
        glitch.persistence = Date.now() + (options.duration || 30000); // Stabilize for 30s
        this._triggerFeedback('stabilize', glitch);
        break;

      case 'disrupt':
        glitch.intensity *= 0.5;
        glitch.radius *= 0.8;
        glitch.disrupted = true;
        glitch.contributingAgentIds.forEach(agentId => {
          const agent = this.simulation.getAgent(agentId);
          if (agent) {
            this.simulation.notifyAgent(agent, {
              type: 'glitch_disrupted',
              intensity: glitch.intensity,
              source: 'user_interaction'
            });
          }
        });
        this._triggerFeedback('disrupt', glitch);
        break;
    }

    this.perceptionSuite.realityGlitcher.updateGlitchVisuals(glitch);
    this._updateQuantumGraph();
  }

  /**
   * Trigger feedback effects for interactions
   * @param {string} type - Interaction type
   * @param {Object} glitch - Affected glitch
   */
  _triggerFeedback(type, glitch) {
    const feedbackEvent = {
      type: `glitch_${type}_feedback`,
      glitchId: glitch.id,
      position: glitch.position,
      intensity: glitch.intensity,
      timestamp: Date.now()
    };
    this.simulation.triggerEvent(feedbackEvent.type, feedbackEvent);
  }

  /**
   * Main update loop
   * @param {number} deltaTime - Time since last update in ms
   */
  update(deltaTime) {
    this.elapsedTime += deltaTime;

    this.activeGlitches.forEach(glitch => this._updateGlitch(glitch, deltaTime));
    this._removeExpiredGlitches();
    if (this.elapsedTime % 500 < deltaTime) { // Check every 0.5s
      this._evaluateEmergentGlitches();
      this._checkGlitchOverload();
    }
    this._updateVisualization();
  }

  /**
   * Update a single glitch
   * @param {Object} glitch - Glitch to update
   * @param {number} deltaTime - Time delta
   */
  _updateGlitch(glitch, deltaTime) {
    if (!glitch.stabilized) {
      glitch.intensity -= (glitch.decay || 0.05) * (deltaTime / 1000);
    } else if (glitch.persistence && Date.now() > glitch.persistence) {
      glitch.stabilized = false; // Stability wears off
    }

    const noiseScale = 0.001;
    const noiseT = this.elapsedTime * 0.0005;
    const offsetX = this.noise(glitch.position.x * noiseScale, noiseT) * 3 * glitch.intensity;
    const offsetY = this.noise(glitch.position.y * noiseScale, noiseT + 100) * 3 * glitch.intensity;

    glitch.visualPosition = {
      x: glitch.position.x + offsetX * 10,
      y: glitch.position.y + offsetY * 10
    };

    this._processGlitchInteractions(glitch);
    if (glitch.intensity > 0.3) this._generateGlitchEffects(glitch);
  }

  /**
   * Check for glitch overload and stabilize system
   */
  _checkGlitchOverload() {
    if (this.activeGlitches.length > 20) {
      this.globalIntensityMod *= 0.9; // Dampen intensity to prevent runaway
      this.activeGlitches.forEach(glitch => {
        glitch.intensity *= 0.95;
      });
      this.simulation.triggerEvent('glitch_overload', {
        activeCount: this.activeGlitches.length,
        reductionFactor: 0.95
      });
    }
  }

  /**
   * Process glitch interactions
   * @param {Object} glitch - Glitch to process
   */
  _processGlitchInteractions(glitch) {
    this.activeGlitches.forEach(otherGlitch => {
      if (glitch.id === otherGlitch.id) return;

      const distance = this._distance(glitch.position, otherGlitch.position);
      const interactionRadius = (glitch.radius + otherGlitch.radius) * this.interactionAmplifier;

      if (distance < interactionRadius) {
        const strength = 1 - (distance / interactionRadius);
        const interactionPairs = {
          'dream-spatial': 'reality_bleed',
          'temporal-temporal': 'time_fracture',
          'sync-dream': 'collective_dream',
          'spatial-sync': 'dimensional_shift',
          'dream-temporal': 'dream_warp'
        };

        const pairKey = `${glitch.type}-${otherGlitch.type}`;
        const reversePairKey = `${otherGlitch.type}-${glitch.type}`;
        const childType = interactionPairs[pairKey] || interactionPairs[reversePairKey];

        if (childType && strength > 0.6 && Math.random() < strength * 0.2) {
          this._createChildGlitch(glitch, otherGlitch, childType);
        }
      }
    });
  }

  /**
   * Create a child glitch from two parents
   * @param {Object} parent1 - First parent glitch
   * @param {Object} parent2 - Second parent glitch
   * @param {string} childType - Child glitch type
   */
  _createChildGlitch(parent1, parent2, childType) {
    const childPosition = {
      x: (parent1.position.x + parent2.position.x) / 2 + (Math.random() - 0.5) * 10,
      y: (parent1.position.y + parent2.position.y) / 2 + (Math.random() - 0.5) * 10
    };

    const contributingAgentIds = [
      ...(parent1.contributingAgentIds || [parent1.agentId]),
      ...(parent2.contributingAgentIds || [parent2.agentId])
    ].filter((v, i, a) => a.indexOf(v) === i);

    const childGlitch = {
      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: childPosition,
      visualPosition: childPosition,
      type: childType,
      parentTypes: [parent1.type, parent2.type],
      intensity: Math.min(1.2, (parent1.intensity + parent2.intensity) * 0.6 * this.globalIntensityMod),
      radius: Math.min(parent1.radius, parent2.radius) * this.interactionAmplifier,
      color: this._getGlitchColor(childType),
      timestamp: Date.now(),
      contributingAgentIds,
      decay: 0.04,
      effects: this._getGlitchEffects(childType),
      generation: (parent1.generation || 0) + 1
    };

    this.activeGlitches.push(childGlitch);
    this.perceptionSuite.realityGlitcher.registerGlitch(childGlitch);
    this._notifyAgentsOfGlitch(childGlitch, 'child_glitch_created');
  }

  /**
   * Generate glitch effects
   * @param {Object} glitch - Glitch to process
   */
  _generateGlitchEffects(glitch) {
    glitch.effects.forEach(effect => {
      switch (effect.type) {
        case 'temporal_distortion':
          this.simulation.applyTemporalDistortion({
            position: glitch.position,
            radius: glitch.radius * 0.8,
            factor: 1 + ((glitch.intensity - 0.5) * effect.strength)
          });
          break;
        case 'reality_blur':
          this.simulation.applyRealityBlur({
            position: glitch.position,
            radius: glitch.radius,
            intensity: glitch.intensity * effect.strength
          });
          break;
        case 'memory_leak':
          if (Math.random() < 0.06 * glitch.intensity) this._spawnMemoryFragment(glitch);
          break;
        case 'dream_manifestation':
          if (Math.random() < 0.04 * glitch.intensity) this._manifestDreamElement(glitch);
          break;
        case 'chaos_pulse':
          if (Math.random() < 0.03) this._spawnChaosPulse(glitch);
          break;
      }
    });
  }

  /**
   * Evaluate emergent glitches from nodes
   */
  _evaluateEmergentGlitches() {
    const nodes = Array.from(this.glitchNodes.values());
    if (nodes.length < 3) return;

    const clusters = this._clusterGlitchNodes(nodes);
    clusters.forEach(cluster => {
      if (cluster.length >= 3) {
        const collectiveDistortion = cluster.reduce((sum, node) => sum + node.intensity, 0) / cluster.length;
        if (collectiveDistortion > this.distortionThreshold) {
          this._createEmergentGlitch(cluster);
        }
      }
    });
  }

  /**
   * Create an emergent glitch
   * @param {Array} cluster - Cluster of nodes
   * @param {string} forcedType - Optional forced type
   */
  _createEmergentGlitch(cluster, forcedType = null) {
    const contributingAgentIds = Array.from(new Set(cluster.map(node => node.agentId || node.agentIds).flat().filter(Boolean)));
    const center = this._calculateClusterCenter(cluster);
    const types = cluster.map(node => node.type);
    const dominantType = this._getMostFrequent(types);
    const glitchType = forcedType || this._determineEmergentType(types, dominantType);

    const baseIntensity = cluster.reduce((sum, node) => sum + node.intensity, 0) / cluster.length;
    const intensityBonus = Math.min(0.4, (cluster.length - 3) * 0.15) * this.globalIntensityMod;
    const finalIntensity = Math.min(1.5, baseIntensity + intensityBonus);

    const emergentGlitch = {
      id: `emergent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: center,
      visualPosition: center,
      type: glitchType,
      sourceTypes: types,
      intensity: finalIntensity,
      radius: 40 + (cluster.length * 5) + (finalIntensity * 25),
      color: this._getGlitchColor(glitchType),
      timestamp: Date.now(),
      contributingAgentIds,
      contributingNodes: cluster.length,
      decay: 0.015,
      effects: this._getGlitchEffects(glitchType),
      generation: 0
    };

    this.activeGlitches.push(emergentGlitch);
    this.perceptionSuite.realityGlitcher.registerEmergentGlitch(emergentGlitch);
    this.glitchHistory.push({ ...emergentGlitch, endedAt: null });
    this.simulation.triggerEvent('collective_distortion', {
      agents: contributingAgentIds.map(id => this.simulation.getAgent(id)).filter(Boolean),
      glitchType,
      intensity: finalIntensity,
      position: center
    });
    this._notifyAgentsOfGlitch(emergentGlitch, 'emergent_glitch_created');
    return emergentGlitch;
  }

  /**
   * Notify agents of glitch events
   * @param {Object} glitch - Glitch data
   * @param {string} eventType - Event type
   */
  _notifyAgentsOfGlitch(glitch, eventType) {
    glitch.contributingAgentIds.forEach(agentId => {
      const agent = this.simulation.getAgent(agentId);
      if (agent) {
        this.simulation.notifyAgent(agent, {
          type: eventType,
          glitchType: glitch.type,
          collaborators: glitch.contributingAgentIds.filter(id => id !== agentId).map(id => ({ id, agentName: `Agent-${id}` })),
          intensity: glitch.intensity,
          significance: glitch.intensity > 0.8 ? 'major' : 'moderate'
        });
      }
    });
  }

  /**
   * Determine emergent glitch type
   * @param {Array} types - Constituent types
   * @param {string} dominantType - Most frequent type
   */
  _determineEmergentType(types, dominantType) {
    const hasTypes = (...checkTypes) => checkTypes.every(type => types.includes(type));
    if (hasTypes('spatial', 'temporal')) return 'spacetime_rift';
    if (hasTypes('dream', 'sync')) return 'collective_dreamscape';
    if (hasTypes('temporal', 'sync')) return 'time_echo';
    if (hasTypes('spatial', 'dream')) return 'reality_bleed';
    if (hasTypes('spatial', 'sync')) return 'dimensional_shift';
    if (hasTypes('dream', 'temporal')) return 'dream_warp';

    if (types.every(type => type === dominantType)) return `${dominantType}_cascade`;

    switch (dominantType) {
      case 'spatial': return 'void_tear';
      case 'temporal': return 'chrono_fracture';
      case 'dream': return 'dream_eruption';
      case 'sync': return 'consciousness_nexus';
      default: return 'reality_anomaly';
    }
  }

  /**
   * Get glitch effects
   * @param {string} glitchType - Glitch type
   */
  _getGlitchEffects(glitchType) {
    const effectsMap = {
      'spacetime_rift': [{ type: 'temporal_distortion', strength: 0.8 }, { type: 'reality_blur', strength: 0.7 }],
      'void_tear': [{ type: 'reality_blur', strength: 0.9 }, { type: 'memory_leak', strength: 0.4 }],
      'chrono_fracture': [{ type: 'temporal_distortion', strength: 1.0 }, { type: 'memory_leak', strength: 0.6 }],
      'dream_eruption': [{ type: 'dream_manifestation', strength: 0.9 }, { type: 'reality_blur', strength: 0.5 }],
      'collective_dreamscape': [{ type: 'dream_manifestation', strength: 1.0 }, { type: 'temporal_distortion', strength: 0.3 }],
      'consciousness_nexus': [{ type: 'memory_leak', strength: 0.8 }, { type: 'dream_manifestation', strength: 0.5 }],
      'time_echo': [{ type: 'temporal_distortion', strength: 0.7 }, { type: 'memory_leak', strength: 0.7 }],
      'reality_bleed': [{ type: 'reality_blur', strength: 0.8 }, { type: 'dream_manifestation', strength: 0.6 }],
      'dimensional_shift': [{ type: 'reality_blur', strength: 0.7 }, { type: 'chaos_pulse', strength: 0.5 }],
      'dream_warp': [{ type: 'dream_manifestation', strength: 0.8 }, { type: 'temporal_distortion', strength: 0.6 }],
      'lucid_rupture': [{ type: 'dream_manifestation', strength: 1.2 }, { type: 'chaos_pulse', strength: 0.7 }]
    };
    return effectsMap[glitchType] || [{ type: 'reality_blur', strength: 0.5 }];
  }

  /**
   * Cluster glitch nodes
   * @param {Array} nodes - Nodes to cluster
   */
  _clusterGlitchNodes(nodes) {
    const clusters = [];
    const maxDistance = 60; // Slightly increased for more dynamic clustering
    const remainingNodes = [...nodes];

    while (remainingNodes.length > 0) {
      const cluster = [remainingNodes.shift()];
      let i = 0;
      while (i < remainingNodes.length) {
        const node = remainingNodes[i];
        const isClose = cluster.some(clusterNode => this._distance(node.position, clusterNode.position) < maxDistance);
        if (isClose) {
          cluster.push(node);
          remainingNodes.splice(i, 1);
        } else {
          i++;
        }
      }
      clusters.push(cluster);
    }
    return clusters;
  }

  /**
   * Calculate cluster center
   * @param {Array} cluster - Cluster of nodes
   */
  _calculateClusterCenter(cluster) {
    const sum = cluster.reduce((acc, node) => ({ x: acc.x + node.position.x, y: acc.y + node.position.y }), { x: 0, y: 0 });
    return { x: sum.x / cluster.length, y: sum.y / cluster.length };
  }

  /**
   * Calculate midpoint
   * @param {Array} agents - Agents
   */
  _calculateMidpoint(agents) {
    const sum = agents.reduce((acc, agent) => ({ x: acc.x + agent.x, y: acc.y + agent.y }), { x: 0, y: 0 });
    return { x: sum.x / agents.length, y: sum.y / agents.length };
  }

  /**
   * Get most frequent item
   * @param {Array} array - Input array
   */
  _getMostFrequent(array) {
    const counts = array.reduce((acc, value) => { acc[value] = (acc[value] || 0) + 1; return acc; }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  /**
   * Calculate distance
   * @param {Object} point1 - First point
   * @param {Object} point2 - Second point
   */
  _distance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get glitch color
   * @param {string} type - Glitch type
   */
  _getGlitchColor(type) {
    const colorMap = {
      'spatial': '#FF4500', 'temporal': '#00FF7F', 'dream': '#8A2BE2', 'sync': '#00CED1',
      'spacetime_rift': '#FF1493', 'void_tear': '#FF4500', 'chrono_fracture': '#00FA9A',
      'dream_eruption': '#9400D3', 'collective_dreamscape': '#9932CC', 'consciousness_nexus': '#4682B4',
      'time_echo': '#20B2AA', 'reality_bleed': '#FF6347', 'reality_anomaly': '#FFD700',
      'dimensional_shift': '#FF69B4', 'dream_warp': '#BA55D3', 'lucid_rupture': '#DDA0DD'
    };
    return colorMap[type] || '#FFFFFF';
  }

  /**
   * Adjust color for stability
   * @param {string} color - Hex color
   */
  _adjustColorStability(color) {
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    const stabilizedR = Math.min(255, r + 50);
    const stabilizedG = Math.min(255, g + 50);
    const stabilizedB = Math.min(255, b + 50);
    return `#${stabilizedR.toString(16).padStart(2, '0')}${stabilizedG.toString(16).padStart(2, '0')}${stabilizedB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Remove expired glitches
   */
  _removeExpiredGlitches() {
    const now = Date.now();
    for (const [id, node] of this.glitchNodes.entries()) {
      if (now - node.timestamp > this.glitchPersistence) this.glitchNodes.delete(id);
    }

    this.activeGlitches = this.activeGlitches.filter(glitch => {
      const expired = glitch.intensity <= 0.1;
      if (expired) {
        this.perceptionSuite.realityGlitcher.unregisterGlitch(glitch.id);
        const historyEntry = this.glitchHistory.find(h => h.id === glitch.id);
        if (historyEntry) historyEntry.endedAt = now;
      }
      return !expired;
    });
  }

  /**
   * Spawn memory fragment
   * @param {Object} glitch - Source glitch
   */
  _spawnMemoryFragment(glitch) {
    const agentIds = glitch.contributingAgentIds;
    if (!agentIds?.length) return;

    const agentId = agentIds[Math.floor(Math.random() * agentIds.length)];
    const agent = this.simulation.getAgent(agentId);
    if (!agent) return;

    const memory = this.simulation.getRandomAgentMemory(agent);
    if (!memory) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = glitch.radius * 0.6 * Math.random();
    const position = { x: glitch.position.x + Math.cos(angle) * distance, y: glitch.position.y + Math.sin(angle) * distance };

    const fragment = {
      type: 'memory_fragment',
      position,
      memory: { ...memory },
      visualIntensity: 0.5 + (memory.importance || 0.5) * 0.5,
      duration: 5000 + (memory.importance || 0.5) * 10000,
      createdAt: Date.now(),
      velocity: { x: (Math.random() - 0.5) * 0.2, y: (Math.random() - 0.5) * 0.2 }
    };

    this.perceptionSuite.realityGlitcher.registerMemoryFragment(fragment);
  }

  /**
   * Manifest dream element
   * @param {Object} glitch - Source glitch
   */
  _manifestDreamElement(glitch) {
    if (!['dream', 'dream_eruption', 'collective_dreamscape', 'lucid_rupture'].includes(glitch.type) &&
        !(glitch.sourceTypes || []).includes('dream')) return;

    const agentIds = glitch.contributingAgentIds;
    if (!agentIds?.length) return;

    let dreamData, sourceAgentId;
    for (const agentId of agentIds) {
      const agent = this.simulation.getAgent(agentId);
      if (!agent) continue;
      const agentDream = this.simulation.getAgentDreamState(agent);
      if (agentDream?.symbols?.length) {
        dreamData = agentDream;
        sourceAgentId = agentId;
        break;
      }
    }

    if (!dreamData) return;

    const symbol = dreamData.symbols[Math.floor(Math.random() * dreamData.symbols.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = glitch.radius * 0.8 * Math.random();
    const position = { x: glitch.position.x + Math.cos(angle) * distance, y: glitch.position.y + Math.sin(angle) * distance };

    const manifestation = {
      type: 'dream_manifestation',
      position,
      symbol: { ...symbol, intensity: symbol.intensity || 0.7 },
      sourceAgentId,
      visualIntensity: 0.6 + (symbol.intensity || 0) * 0.5,
      duration: 8000 + Math.random() * 8000,
      behavior: this._getDreamManifestationBehavior(symbol.type),
      createdAt: Date.now()
    };

    this.perceptionSuite.realityGlitcher.registerDreamManifestation(manifestation);
    const agent = this.simulation.getAgent(sourceAgentId);
    if (agent) {
      this.simulation.notifyAgent(agent, {
        type: 'dream_manifesting',
        symbol: symbol.name,
        intensity: manifestation.visualIntensity
      });
    }
  }

  /**
   * Spawn chaos pulse (new effect)
   * @param {Object} glitch - Source glitch
   */
  _spawnChaosPulse(glitch) {
    const pulse = {
      id: `pulse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: { ...glitch.position },
      visualPosition: { ...glitch.position },
      type: 'chaos_pulse',
      intensity: glitch.intensity * 0.8,
      radius: glitch.radius * 1.5,
      color: '#FF00FF', // Magenta for chaos
      timestamp: Date.now(),
      contributingAgentIds: glitch.contributingAgentIds,
      decay: 0.1,
      duration: 3000,
      effects: [{ type: 'reality_blur', strength: 0.6 }]
    };

    this.activeGlitches.push(pulse);
    this.perceptionSuite.realityGlitcher.registerGlitch(pulse);
  }

  /**
   * Get dream manifestation behavior
   * @param {string} symbolType - Symbol type
   */
  _getDreamManifestationBehavior(symbolType) {
    const behaviors = {
      'person': { movement: 'wander', speed: 0.3, fadeEffect: 'dissolve' },
      'creature': { movement: 'circle', speed: 0.5, fadeEffect: 'scatter' },
      'object': { movement: 'stationary', pulseRate: 0.2, fadeEffect: 'fade' },
      'landscape': { movement: 'grow', expansionRate: 0.1, fadeEffect: 'sink' },
      'abstract': { movement: 'float', turbulence: 0.4, fadeEffect: 'pixelate' }
    };
    return behaviors[symbolType] || { movement: 'float', fadeEffect: 'fade' };
  }

  /**
   * Update quantum graph
   */
  _updateQuantumGraph() {
    const graphData = {
      nodes: Array.from(this.glitchNodes.values()).map(node => ({
        id: node.agentId || `${node.type}_${node.timestamp}`,
        type: node.type,
        intensity: node.intensity,
        position: [node.position.x, node.position.y],
        radius: node.radius * 0.5,
        source: node.source
      })),
      emergentGlitches: this.activeGlitches.map(glitch => ({
        id: glitch.id,
        type: glitch.type,
        intensity: glitch.intensity,
        position: [glitch.position.x, glitch.position.y],
        radius: glitch.radius * 0.7,
        contributors: glitch.contributingAgentIds || [],
        generation: glitch.generation || 0
      })),
      connections: []
    };

    this.activeGlitches.forEach(glitch => {
      const contributingIds = glitch.contributingAgentIds || [];
      contributingIds.forEach(agentId => {
        const node = Array.from(this.glitchNodes.values()).find(n => n.agentId === agentId);
        if (node) {
          graphData.connections.push({
            from: agentId,
            to: glitch.id,
            strength: node.intensity * 0.7,
            type: 'contribution'
          });
        }
      });

      this.activeGlitches.forEach(otherGlitch => {
        if (glitch.id === otherGlitch.id) return;
        const distance = this._distance(glitch.position, otherGlitch.position);
        const interactionRadius = glitch.radius + otherGlitch.radius;
        if (distance < interactionRadius) {
          const strength = 1 - (distance / interactionRadius);
          graphData.connections.push({
            from: glitch.id,
            to: otherGlitch.id,
            strength: strength * 0.8,
            type: 'interaction'
          });
        }
      });
    });

    this.perceptionSuite.realityGlitcher.updateQuantumGraph(graphData);
  }

  /**
   * Update visualization
   */
  _updateVisualization() {
    this.activeGlitches.forEach(glitch => {
      this.perceptionSuite.realityGlitcher.updateGlitchVisuals({
        id: glitch.id,
        position: glitch.visualPosition,
        intensity: glitch.intensity,
        radius: glitch.radius,
        effects: glitch.effects,
        generation: glitch.generation || 0
      });
    });
  }

  /**
   * Get active glitches
   */
  getActiveGlitches() {
    return [...this.activeGlitches];
  }

  /**
   * Get harvested glitches
   */
  getHarvestedGlitches() {
    return [...this.harvestedGlitches];
  }

  /**
   * Get glitch history
   */
  getGlitchHistory() {
    return [...this.glitchHistory];
  }

  /**
   * Create user-initiated glitch
   * @param {Object} position - Position
   * @param {string} type - Glitch type
   * @param {number} intensity - Intensity (0-1)
   * @param {Object} options - Additional options
   */
  createUserGlitch(position, type, intensity, options = {}) {
    const glitch = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position,
      visualPosition: position,
      type,
      intensity: Math.min(1.2, Math.max(0, intensity) * this.globalIntensityMod),
      radius: 20 + intensity * 35,
      color: this._getGlitchColor(type),
      timestamp: Date.now(),
      createdByUser: true,
      decay: options.decay || 0.03,
      effects: this._getGlitchEffects(type),
      userId: options.userId || 'unknown',
      generation: 0
    };

    this.activeGlitches.push(glitch);
    this.perceptionSuite.realityGlitcher.registerGlitch(glitch);
    this.glitchHistory.push({ ...glitch, endedAt: null });

    const affectedAgents = this.simulation.agents.filter(agent => 
      this._distance({ x: agent.x, y: agent.y }, position) < glitch.radius * 1.5
    );
    affectedAgents.forEach(agent => {
      this.simulation.notifyAgent(agent, {
        type: 'user_glitch_detected',
        glitchType: type,
        intensity,
        distance: this._distance({ x: agent.x, y: agent.y }, position)
      });
    });

    return glitch;
  }

  /**
   * Adjust global glitch intensity
   * @param {number} factor - Adjustment factor
   */
  adjustGlobalIntensity(factor) {
    this.globalIntensityMod = Math.max(0.5, Math.min(2.0, factor));
    this.activeGlitches.forEach(glitch => {
      glitch.intensity = Math.min(1.5, glitch.intensity * this.globalIntensityMod);
    });
  }
}
