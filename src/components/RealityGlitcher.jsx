import React, { useState, useEffect, useRef } from 'react';
import { Camera, Brain, ZapOff, Sparkles, Eye, Clock, GitMerge, Download, Zap, Share2, Maximize, Minimize } from 'lucide-react';

const RealityGlitcher = ({ simulation, collectiveGlitchSystem }) => {
  // State for glitch system integration and UI
  const [activeGlitches, setActiveGlitches] = useState([]);
  const [agents, setAgents] = useState([]);
  const [quantumData, setQuantumData] = useState({ nodes: [], emergentGlitches: [], connections: [] });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedGlitch, setSelectedGlitch] = useState(null);
  const [userMode, setUserMode] = useState('observe'); // observe, create, interact, harvest
  const [creationSettings, setCreationSettings] = useState({
    type: 'spatial',
    intensity: 0.7,
    radius: 30
  });
  const [isQuantumExpanded, setIsQuantumExpanded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visualEffects, setVisualEffects] = useState([]); // For memory fragments, dream manifestations

  // Canvas refs
  const mainCanvasRef = useRef(null);
  const quantumGraphRef = useRef(null);
  const animationRef = useRef(null);

  // Sync with simulation and glitch system
  useEffect(() => {
    if (!simulation || !collectiveGlitchSystem) return;

    // Initial data sync
    setAgents(simulation.agents || []);
    setActiveGlitches(collectiveGlitchSystem.getActiveGlitches());
    setQuantumData(collectiveGlitchSystem._updateQuantumGraph?.() || quantumData);

    // Event listeners for real-time updates
    const updateGlitches = () => setActiveGlitches(collectiveGlitchSystem.getActiveGlitches());
    const updateAgents = () => setAgents([...simulation.agents]);
    const updateQuantum = () => setQuantumData(collectiveGlitchSystem._updateQuantumGraph?.() || quantumData);

    simulation.on('agent_update', updateAgents);
    collectiveGlitchSystem.perceptionSuite.realityGlitcher.on('glitch_update', updateGlitches);
    collectiveGlitchSystem.perceptionSuite.realityGlitcher.on('quantum_update', updateQuantum);
    collectiveGlitchSystem.perceptionSuite.realityGlitcher.on('memory_fragment', (fragment) => {
      setVisualEffects(prev => [...prev, { ...fragment, type: 'memory_fragment' }]);
    });
    collectiveGlitchSystem.perceptionSuite.realityGlitcher.on('dream_manifestation', (manifestation) => {
      setVisualEffects(prev => [...prev, { ...manifestation, type: 'dream_manifestation' }]);
    });

    startAnimationLoop();

    return () => {
      cancelAnimationFrame(animationRef.current);
      simulation.off('agent_update', updateAgents);
      collectiveGlitchSystem.perceptionSuite.realityGlitcher.off('glitch_update', updateGlitches);
      collectiveGlitchSystem.perceptionSuite.realityGlitcher.off('quantum_update', updateQuantum);
    };
  }, [simulation, collectiveGlitchSystem]);

  // Animation loop
  const startAnimationLoop = () => {
    const loop = () => {
      renderMainCanvas();
      renderQuantumGraph();
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
  };

  // Render main canvas
  const renderMainCanvas = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx, width, height);

    // Draw visual effects (memory fragments, dream manifestations)
    setVisualEffects(prev => prev.filter(effect => {
      drawVisualEffect(ctx, effect);
      return Date.now() - effect.createdAt < effect.duration;
    }));

    activeGlitches.forEach(glitch => drawGlitch(ctx, glitch));
    agents.forEach(agent => drawAgent(ctx, agent, agent.id === selectedAgent?.id));
    if (selectedGlitch) drawSelectionRing(ctx, selectedGlitch.visualPosition || selectedGlitch.position, selectedGlitch.radius + 10, '#FFFFFF');
    drawUserModeIndicator(ctx, width, height);
  };

  // Render quantum graph
  const renderQuantumGraph = () => {
    const canvas = quantumGraphRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    drawQuantumBackground(ctx, width, height);

    quantumData.connections.forEach(connection => drawConnection(ctx, connection));
    quantumData.nodes.forEach(node => drawQuantumNode(ctx, node));
    quantumData.emergentGlitches.forEach(glitch => drawQuantumGlitch(ctx, glitch));
  };

  // Drawing helpers
  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(50, 50, 80, 0.3)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawGlitch = (ctx, glitch) => {
    const { visualPosition = glitch.position, radius, intensity, color, type, generation = 0 } = glitch;
    const time = Date.now() / 1000;

    const gradient = ctx.createRadialGradient(visualPosition.x, visualPosition.y, 0, visualPosition.x, visualPosition.y, radius);
    gradient.addColorStop(0, `${color}CC`);
    gradient.addColorStop(0.7, `${color}66`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(visualPosition.x, visualPosition.y, radius, 0, Math.PI * 2);
    ctx.fill();

    switch (true) {
      case type.includes('spatial') || type === 'void_tear' || type === 'dimensional_shift':
        drawSpatialWarpEffect(ctx, visualPosition, radius, intensity, time);
        break;
      case type.includes('temporal') || type === 'chrono_fracture' || type === 'time_echo':
        drawTemporalEffect(ctx, visualPosition, radius, intensity, time);
        break;
      case type.includes('dream') || type === 'dream_eruption' || type === 'collective_dreamscape':
        drawDreamEffect(ctx, visualPosition, radius, intensity, time);
        break;
      case type === 'sync' || type === 'consciousness_nexus':
        drawSyncEffect(ctx, visualPosition, radius, intensity, time);
        break;
      case type === 'chaos_pulse':
        drawChaosPulseEffect(ctx, visualPosition, radius, intensity, time);
        break;
    }

    if (generation > 0) drawGenerationRing(ctx, visualPosition, radius, generation, time);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(type, visualPosition.x, visualPosition.y - radius - 5);
  };

  const drawSpatialWarpEffect = (ctx, position, radius, intensity, time) => {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * intensity})`;
    ctx.lineWidth = 1.5;
    const lineCount = 10;
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2 + (time * 0.5) % (Math.PI * 2);
      const warp = Math.sin(time + i) * 5;
      ctx.beginPath();
      ctx.moveTo(position.x + Math.cos(angle) * radius * 0.3, position.y + Math.sin(angle) * radius * 0.3);
      ctx.lineTo(position.x + Math.cos(angle) * (radius + warp), position.y + Math.sin(angle) * (radius + warp));
      ctx.stroke();
    }
  };

  const drawTemporalEffect = (ctx, position, radius, intensity, time) => {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * intensity})`;
    ctx.lineWidth = 2;
    const hourAngle = time % (Math.PI * 2);
    const minuteAngle = (time * 12) % (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + Math.cos(hourAngle) * radius * 0.5, position.y + Math.sin(hourAngle) * radius * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + Math.cos(minuteAngle) * radius * 0.7, position.y + Math.sin(minuteAngle) * radius * 0.7);
    ctx.stroke();

    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius * 0.9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawDreamEffect = (ctx, position, radius, intensity, time) => {
    const particleCount = Math.floor(radius * 0.4);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (time * 0.3) % (Math.PI * 2);
      const distance = radius * (0.4 + Math.sin(time * 0.5 + i) * 0.5);
      const size = 2 + Math.sin(time + i) * 2 * intensity;
      ctx.fillStyle = `rgba(230, 230, 255, ${0.6 * intensity})`;
      ctx.beginPath();
      ctx.arc(position.x + Math.cos(angle) * distance, position.y + Math.sin(angle) * distance, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawSyncEffect = (ctx, position, radius, intensity, time) => {
    ctx.strokeStyle = `rgba(0, 206, 209, ${0.7 * intensity})`;
    ctx.lineWidth = 2;
    const pulse = 1 + Math.sin(time * 2) * 0.2;
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + time * 0.4;
      const dist = radius * 0.8;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(position.x + Math.cos(angle) * dist, position.y + Math.sin(angle) * dist, 3 * intensity, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawChaosPulseEffect = (ctx, position, radius, intensity, time) => {
    ctx.strokeStyle = `rgba(255, 0, 255, ${0.8 * intensity})`;
    ctx.lineWidth = 3;
    const pulse = 1 + Math.sin(time * 5) * 0.3;
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    const spikeCount = 8;
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * Math.PI * 2 + time * 2;
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(position.x + Math.cos(angle) * radius * 1.2, position.y + Math.sin(angle) * radius * 1.2);
      ctx.stroke();
    }
  };

  const drawGenerationRing = (ctx, position, radius, generation, time) => {
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + generation * 0.1})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    for (let i = 0; i < generation; i++) {
      const offset = i * 5;
      ctx.beginPath();
      ctx.arc(position.x, position.y, radius + offset, time % (Math.PI * 2), (time + Math.PI) % (Math.PI * 2));
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const drawAgent = (ctx, agent, isSelected) => {
    const { x, y, dreaming, consciousness } = agent;
    const radius = 12 + consciousness * 3;

    ctx.fillStyle = dreaming ? '#9370DB' : '#4682B4';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isSelected ? '#FFD700' : '#000000';
    ctx.lineWidth = isSelected ? 3 : 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    if (dreaming) {
      const time = Date.now() / 1000;
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (time * 0.5) % (Math.PI * 2);
        const dist = radius * 1.5 + Math.sin(time + i) * 5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(agent.name, x, y - radius - 5);
  };

  const drawVisualEffect = (ctx, effect) => {
    const time = Date.now() / 1000;
    const age = (Date.now() - effect.createdAt) / effect.duration;
    const fade = Math.max(0, 1 - age);

    if (effect.type === 'memory_fragment') {
      const { position, visualIntensity, memory, velocity } = effect;
      position.x += velocity.x;
      position.y += velocity.y;

      ctx.fillStyle = `rgba(255, 215, 0, ${fade * visualIntensity})`;
      ctx.beginPath();
      ctx.arc(position.x, position.y, 5 + visualIntensity * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '8px Arial';
      ctx.fillText(memory.content.slice(0, 10), position.x, position.y + 10);
    } else if (effect.type === 'dream_manifestation') {
      const { position, visualIntensity, symbol, behavior } = effect;
      const size = 10 + visualIntensity * 10;

      ctx.fillStyle = `rgba(138, 43, 226, ${fade * visualIntensity})`;
      switch (behavior.movement) {
        case 'wander':
          position.x += Math.sin(time) * behavior.speed;
          position.y += Math.cos(time) * behavior.speed;
          break;
        case 'circle':
          position.x += Math.cos(time * behavior.speed) * 5;
          position.y += Math.sin(time * behavior.speed) * 5;
          break;
        case 'grow':
          size += behavior.expansionRate * 10;
          break;
      }

      ctx.beginPath();
      ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '10px Arial';
      ctx.fillText(symbol.name, position.x, position.y + size + 5);
    }
  };

  const drawQuantumBackground = (ctx, width, height) => {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
    gradient.addColorStop(0, 'rgba(20, 20, 40, 0.8)');
    gradient.addColorStop(1, 'rgba(10, 10, 20, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const drawQuantumNode = (ctx, node) => {
    const [x, y] = node.position;
    const { type, intensity, radius } = node;

    ctx.fillStyle = type === 'agent' ? `rgba(70, 130, 180, ${intensity})` : getGlitchColor(node.type);
    ctx.globalAlpha = intensity * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawQuantumGlitch = (ctx, glitch) => {
    const [x, y] = glitch.position;
    const { intensity, radius, generation = 0 } = glitch;
    const time = Date.now() / 1000;

    ctx.fillStyle = getGlitchColor(glitch.type);
    ctx.globalAlpha = intensity * 0.9;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    if (generation > 0) {
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 + generation * 0.1})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 5, time % (Math.PI * 2), (time + Math.PI) % (Math.PI * 2));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const drawConnection = (ctx, connection) => {
    const sourceNode = quantumData.nodes.find(n => n.id === connection.from) || quantumData.emergentGlitches.find(g => g.id === connection.from);
    const targetNode = quantumData.nodes.find(n => n.id === connection.to) || quantumData.emergentGlitches.find(g => g.id === connection.to);
    if (!sourceNode || !targetNode) return;

    const [x1, y1] = sourceNode.position;
    const [x2, y2] = targetNode.position;
    const time = Date.now() / 1000;

    ctx.strokeStyle = connection.type === 'contribution' ? `rgba(255, 215, 0, ${connection.strength})` : `rgba(0, 191, 255, ${connection.strength})`;
    ctx.lineWidth = 2 * connection.strength;
    ctx.setLineDash(connection.type === 'contribution' ? [5, 3] : []);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (connection.strength > 0.7) {
      const pulse = (Math.sin(time * 4) + 1) / 2;
      const pulseX = x1 + (x2 - x1) * pulse;
      const pulseY = y1 + (y2 - y1) * pulse;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawSelectionRing = (ctx, position, radius, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const time = Date.now() / 1000;
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, time % (Math.PI * 2), (time + Math.PI * 1.5) % (Math.PI * 2));
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawUserModeIndicator = (ctx, width, height) => {
    const size = 50;
    const x = width - size - 10;
    const y = height - size - 10;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icons = { observe: '👁️', create: '✨', interact: '✋', harvest: '📥' };
    ctx.fillText(icons[userMode] || '?', x, y);
    ctx.font = '10px Arial';
    ctx.fillText(userMode, x, y + 20);
  };

  // Interaction handlers
  const handleCanvasMouseMove = (e) => {
    const rect = mainCanvasRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCanvasClick = (e) => {
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (userMode) {
      case 'observe':
        selectEntityAtPosition(x, y);
        break;
      case 'create':
        createGlitchAtPosition(x, y);
        break;
      case 'interact':
      case 'harvest':
        if (selectedGlitch) interactWithGlitch(selectedGlitch.id, userMode === 'harvest' ? 'harvest' : 'amplify');
        else selectEntityAtPosition(x, y);
        break;
    }
  };

  const selectEntityAtPosition = (x, y) => {
    const clickedAgent = agents.find(agent => Math.sqrt((agent.x - x) ** 2 + (agent.y - y) ** 2) < 15);
    if (clickedAgent) {
      setSelectedAgent(clickedAgent);
      setSelectedGlitch(null);
      return;
    }

    const clickedGlitch = activeGlitches.find(glitch => {
      const pos = glitch.visualPosition || glitch.position;
      return Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2) < glitch.radius;
    });
    if (clickedGlitch) {
      setSelectedGlitch(clickedGlitch);
      setSelectedAgent(null);
      return;
    }

    setSelectedAgent(null);
    setSelectedGlitch(null);
  };

  const createGlitchAtPosition = (x, y) => {
    const newGlitch = collectiveGlitchSystem.createUserGlitch(
      { x, y },
      creationSettings.type,
      creationSettings.intensity,
      { radius: creationSettings.radius }
    );
    setActiveGlitches(collectiveGlitchSystem.getActiveGlitches());
    setSelectedGlitch(newGlitch);
    setQuantumData(collectiveGlitchSystem._updateQuantumGraph?.() || quantumData);
  };

  const interactWithGlitch = (glitchId, interactionType) => {
    collectiveGlitchSystem._handleUserGlitchInteraction(glitchId, interactionType);
    setActiveGlitches(collectiveGlitchSystem.getActiveGlitches());
    setQuantumData(collectiveGlitchSystem._updateQuantumGraph?.() || quantumData);
    if (interactionType === 'harvest') setSelectedGlitch(null);
    else setSelectedGlitch(activeGlitches.find(g => g.id === glitchId));
  };

  const getGlitchColor = (type) => {
    const colorMap = {
      'spatial': '#FF4500', 'temporal': '#00FF7F', 'dream': '#8A2BE2', 'sync': '#00CED1',
      'spacetime_rift': '#FF1493', 'void_tear': '#FF4500', 'chrono_fracture': '#00FA9A',
      'dream_eruption': '#9400D3', 'collective_dreamscape': '#9932CC', 'consciousness_nexus': '#4682B4',
      'time_echo': '#20B2AA', 'reality_bleed': '#FF6347', 'dimensional_shift': '#FF69B4',
      'dream_warp': '#BA55D3', 'lucid_rupture': '#DDA0DD', 'chaos_pulse': '#FF00FF'
    };
    return colorMap[type] || '#FFFFFF';
  };

  // UI handlers
  const handleModeChange = (mode) => setUserMode(mode);

  const handleCreateSettingsChange = (setting, value) => {
    setCreationSettings(prev => ({ ...prev, [setting]: value }));
  };

  // UI components
  const renderAgentInfoPanel = () => selectedAgent && (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        <Brain className="mr-2 text-blue-400" size={18} />
        {selectedAgent.name}
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between"><span>Consciousness:</span><span className="font-mono">{(selectedAgent.consciousness * 100).toFixed(1)}%</span></div>
        <div className="flex justify-between"><span>Adaptability:</span><span className="font-mono">{selectedAgent.adaptability}</span></div>
        <div className="flex justify-between"><span>Emotional:</span><span className="font-mono">{selectedAgent.emotional}</span></div>
        <div className="flex justify-between"><span>Memories:</span><span className="font-mono">{selectedAgent.memories}</span></div>
        <div className="flex justify-between"><span>Status:</span><span className={`font-mono ${selectedAgent.dreaming ? 'text-purple-400' : 'text-green-400'}`}>{selectedAgent.dreaming ? 'Dreaming' : 'Active'}</span></div>
      </div>
    </div>
  );

  const renderGlitchInfoPanel = () => selectedGlitch && (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        <Sparkles className="mr-2" size={18} style={{ color: selectedGlitch.color }} />
        {selectedGlitch.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between"><span>Intensity:</span><span className="font-mono">{(selectedGlitch.intensity * 100).toFixed(1)}%</span></div>
        <div className="flex justify-between"><span>Radius:</span><span className="font-mono">{selectedGlitch.radius.toFixed(1)}u</span></div>
        <div className="flex justify-between"><span>Generation:</span><span className="font-mono">{selectedGlitch.generation || 0}</span></div>
        <div className="flex justify-between"><span>Agents:</span><span className="font-mono">{selectedGlitch.contributingAgentIds?.length || 0}</span></div>
        {selectedGlitch.createdByUser && <div className="mt-2 p-2 bg-blue-900 rounded text-xs">👤 User-Created</div>}
        {selectedGlitch.amplifiedByUser && <div className="mt-2 p-2 bg-yellow-900 rounded text-xs">⚡ Amplified</div>}
        {selectedGlitch.stabilized && <div className="mt-2 p-2 bg-green-900 rounded text-xs">🛡️ Stabilized</div>}
      </div>
      {userMode === 'interact' && (
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 p-1 rounded flex items-center justify-center" onClick={() => interactWithGlitch(selectedGlitch.id, 'amplify')}>
            <Zap className="mr-1" size={14} /> Amplify
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 p-1 rounded flex items-center justify-center" onClick={() => interactWithGlitch(selectedGlitch.id, 'harvest')}>
            <Download className="mr-1" size={14} /> Harvest
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 p-1 rounded flex items-center justify-center" onClick={() => interactWithGlitch(selectedGlitch.id, 'stabilize')}>
            <Share2 className="mr-1" size={14} /> Stabilize
          </button>
        </div>
      )}
    </div>
  );

  const renderCreationControls = () => userMode === 'create' && (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64">
      <h2 className="text-xl font-bold mb-2 flex items-center">
        <Sparkles className="mr-2 text-yellow-400" size={18} />
        Create Glitch
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1"
            value={creationSettings.type}
            onChange={(e) => handleCreateSettingsChange('type', e.target.value)}
          >
            {['spatial', 'temporal', 'dream', 'sync', 'chaos_pulse'].map(type => (
              <option key={type} value={type}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Intensity: {(creationSettings.intensity * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={creationSettings.intensity}
            onChange={(e) => handleCreateSettingsChange('intensity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Radius: {creationSettings.radius}u</label>
          <input
            type="range"
            min="20"
            max="50"
            step="5"
            value={creationSettings.radius}
            onChange={(e) => handleCreateSettingsChange('radius', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="text-sm italic text-gray-400">Click canvas to spawn glitch</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold flex items-center">
          <Sparkles className="mr-2 text-purple-400" size={24} />
          Reality Glitcher
          <span className="ml-2 text-sm text-gray-400">v2.0.0</span>
        </h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <canvas
            ref={mainCanvasRef}
            width={800}
            height={600}
            className="w-full h-full bg-gray-950"
            onMouseMove={handleCanvasMouseMove}
            onClick={handleCanvasClick}
          />
          <div className="absolute bottom-4 left-4 bg-gray-800 rounded-lg shadow-lg p-1 flex space-x-1">
            <button className={`p-2 rounded ${userMode === 'observe' ? 'bg-blue-700' : 'hover:bg-gray-700'}`} onClick={() => handleModeChange('observe')} title="Observe"><Eye size={20} /></button>
            <button className={`p-2 rounded ${userMode === 'create' ? 'bg-blue-700' : 'hover:bg-gray-700'}`} onClick={() => handleModeChange('create')} title="Create"><Sparkles size={20} /></button>
            <button className={`p-2 rounded ${userMode === 'interact' ? 'bg-blue-700' : 'hover:bg-gray-700'}`} onClick={() => handleModeChange('interact')} title="Interact"><Zap size={20} /></button>
            <button className={`p-2 rounded ${userMode === 'harvest' ? 'bg-blue-700' : 'hover:bg-gray-700'}`} onClick={() => handleModeChange('harvest')} title="Harvest"><Download size={20} /></button>
          </div>
        </div>
        <div className="w-80 p-4 bg-gray-800 overflow-y-auto space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <GitMerge className="mr-2 text-blue-400" size={18} />
                Quantum Fluctuations
              </div>
              <button onClick={() => setIsQuantumExpanded(!isQuantumExpanded)} className="text-gray-400 hover:text-white">
                {isQuantumExpanded ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </h2>
            <div className="border border-gray-700 rounded overflow-hidden">
              <canvas
                ref={quantumGraphRef}
                width={isQuantumExpanded ? 600 : 300}
                height={isQuantumExpanded ? 600 : 300}
                className={`w-full ${isQuantumExpanded ? 'h-[600px]' : 'h-64'} bg-gray-900`}
              />
            </div>
          </div>
          {renderAgentInfoPanel()}
          {renderGlitchInfoPanel()}
          {renderCreationControls()}
        </div>
      </div>
    </div>
  );
};

export default RealityGlitcher;
