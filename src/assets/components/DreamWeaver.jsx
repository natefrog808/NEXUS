import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sparkles, BrainCircuit, Share2, Zap, Cloud, Send, Save } from 'lucide-react';

const DreamWeaver = ({ agents = [], simulation = {} }) => {
  // State for dream data and interactions
  const [activeDreams, setActiveDreams] = useState([]);
  const [selectedDream, setSelectedDream] = useState(null);
  const [dreamCanvasMode, setDreamCanvasMode] = useState('explore'); // explore, influence, collect
  const [influenceInput, setInfluenceInput] = useState('');
  const [dreamSeeds, setDreamSeeds] = useState([
    { id: 1, text: 'crimson door', type: 'visual' },
    { id: 2, text: 'ticking clock', type: 'auditory' },
    { id: 3, text: 'falling sensation', type: 'kinetic' }
  ]);
  const [collectedSymbols, setCollectedSymbols] = useState([]);
  const [sharedDreamId, setSharedDreamId] = useState(null);

  // Canvas refs
  const dreamCanvasRef = useRef(null);
  const dreamspaceRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 }); // Track mouse for interactions

  // Animation frame ref
  const animationRef = useRef(null);

  // Helper function to get color for a symbol type
  const getColorForSymbolType = (type) => {
    switch (type) {
      case 'person': return 'rgba(100, 149, 237, 0.8)'; // Cornflower blue
      case 'creature': return 'rgba(255, 99, 71, 0.8)'; // Tomato
      case 'object': return 'rgba(255, 215, 0, 0.8)'; // Gold
      case 'landscape': return 'rgba(46, 139, 87, 0.8)'; // Sea green
      case 'abstract': return 'rgba(186, 85, 211, 0.8)'; // Medium orchid
      default: return 'rgba(200, 200, 200, 0.8)';
    }
  };

  // Initialize and update dreams
  useEffect(() => {
    const generateSimulatedDreams = () => {
      const dreaming = agents.filter(a => a.dreaming);
      if (dreaming.length === 0) return [];

      return dreaming.map(agent => {
        const dreamTypes = ['exploration', 'transformation', 'conflict', 'discovery'];
        const dreamType = dreamTypes[Math.floor(Math.random() * dreamTypes.length)];
        const symbolCount = 3 + Math.floor(Math.random() * 5);
        const symbols = [];

        const symbolTypes = ['person', 'creature', 'object', 'landscape', 'abstract'];
        const symbolNames = {
          person: ['guardian', 'stranger', 'shadow', 'child', 'elder'],
          creature: ['bird', 'snake', 'wolf', 'dragon', 'fish'],
          object: ['key', 'door', 'clock', 'mirror', 'book'],
          landscape: ['mountain', 'ocean', 'forest', 'desert', 'city'],
          abstract: ['light', 'darkness', 'spiral', 'void', 'patterns']
        };

        for (let i = 0; i < symbolCount; i++) {
          const type = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
          const name = symbolNames[type][Math.floor(Math.random() * symbolNames[type].length)];

          symbols.push({
            id: `symbol_${agent.id}_${i}`,
            type,
            name,
            meaning: `Represents ${Math.random() > 0.5 ? 'conscious' : 'unconscious'} ${Math.random() > 0.5 ? 'desires' : 'fears'}`,
            intensity: 0.4 + Math.random() * 0.6,
            position: { x: 150 + Math.random() * 300, y: 150 + Math.random() * 300 },
            velocity: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 },
            color: getColorForSymbolType(type)
          });
        }

        const narrativeStructures = [
          "Journey through {landscape} seeking {object}",
          "Confrontation with {creature} that transforms into {person}",
          "Discovery of {object} that reveals {abstract}",
          "Being lost in {landscape} while pursued by {creature}",
          "Conversation with {person} who gifts {object}"
        ];
        const narrativeStructure = narrativeStructures[Math.floor(Math.random() * narrativeStructures.length)];
        const narrative = narrativeStructure.replace(/{(\w+)}/g, (_, type) => {
          const matches = symbols.filter(s => s.type === type);
          return matches.length > 0 ? matches[Math.floor(Math.random() * matches.length)].name : type;
        });

        return {
          id: `dream_${agent.id}`,
          agentId: agent.id,
          agentName: agent.name,
          type: dreamType,
          intensity: 0.5 + Math.random() * 0.5,
          symbols,
          narrative,
          startTime: Date.now() - Math.floor(Math.random() * 30000),
          duration: 30000 + Math.floor(Math.random() * 60000),
          influenced: Math.random() > 0.7
        };
      });
    };

    const dreams = generateSimulatedDreams();
    setActiveDreams(dreams);
    if (dreams.length > 0 && !selectedDream) setSelectedDream(dreams[0]);

    // Check for shared dream
    const dreamingAgentIds = agents.filter(a => a.dreaming).map(a => a.id);
    if (dreamingAgentIds.length >= 2 && Math.random() > 0.7) {
      const participantIds = dreamingAgentIds.filter(() => Math.random() > 0.3);
      if (participantIds.length >= 2) setSharedDreamId(`shared_${participantIds.join('_')}`);
    } else {
      setSharedDreamId(null);
    }

    startAnimationLoop();

    return () => cancelAnimationFrame(animationRef.current);
  }, [agents, simulation]);

  // Animation loop
  const startAnimationLoop = () => {
    const loop = () => {
      renderDreamCanvas();
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
  };

  // Render dream canvas
  const renderDreamCanvas = () => {
    const canvas = dreamCanvasRef.current;
    if (!canvas || !selectedDream) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear with gradient background
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height / 2);
    gradient.addColorStop(0, '#14122B');
    gradient.addColorStop(1, '#09090F');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw aura and symbols
    drawDreamAura(ctx, width, height, selectedDream);
    selectedDream.symbols.forEach(symbol => {
      drawDreamSymbol(ctx, symbol);

      if (!symbol.fixed) {
        symbol.position.x += symbol.velocity.x;
        symbol.position.y += symbol.velocity.y;

        if (symbol.position.x < 50 || symbol.position.x > width - 50) symbol.velocity.x *= -0.8;
        if (symbol.position.y < 50 || symbol.position.y > height - 50) symbol.velocity.y *= -0.8;

        symbol.velocity.x += (Math.random() - 0.5) * 0.05;
        symbol.velocity.y += (Math.random() - 0.5) * 0.05;
        symbol.velocity.x *= 0.99;
        symbol.velocity.y *= 0.99;
      }
    });

    if (sharedDreamId && selectedDream.agentId) drawSharedDreamConnections(ctx);
    if (dreamCanvasMode === 'influence') drawUserInfluence(ctx, width, height);
    else if (dreamCanvasMode === 'collect') drawCollectionCursor(ctx, width, height);
  };

  // Drawing functions
  const drawDreamAura = (ctx, width, height, dream) => {
    const time = Date.now() / 1000;
    const centerX = width / 2;
    const centerY = height / 2;
    let colors;

    switch (dream.type) {
      case 'exploration': colors = ['rgba(70, 130, 180, 0.1)', 'rgba(30, 60, 90, 0)']; break;
      case 'transformation': colors = ['rgba(147, 112, 219, 0.1)', 'rgba(90, 50, 140, 0)']; break;
      case 'conflict': colors = ['rgba(178, 34, 34, 0.1)', 'rgba(90, 20, 20, 0)']; break;
      case 'discovery': colors = ['rgba(46, 139, 87, 0.1)', 'rgba(20, 70, 40, 0)']; break;
      default: colors = ['rgba(100, 100, 100, 0.1)', 'rgba(50, 50, 50, 0)'];
    }

    const outerRadius = Math.min(width, height) * 0.45;
    const innerRadius = outerRadius * 0.3;
    const pulse = (Math.sin(time) + 1) * 0.5;
    const currentRadius = innerRadius + (outerRadius - innerRadius) * pulse;

    const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, currentRadius);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time % (Math.PI * 2);
      const distance = innerRadius + Math.sin(time * 2 + i) * (outerRadius - innerRadius) * 0.5;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = 1 + Math.sin(time * 3 + i * 0.7) * 2;

      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawDreamSymbol = (ctx, symbol) => {
    const { position, intensity, type, name } = symbol;
    const size = 20 + intensity * 20;
    const time = Date.now() / 1000;

    ctx.globalAlpha = 0.7 + Math.sin(time * 2) * 0.2;
    switch (type) {
      case 'person': drawPersonSymbol(ctx, position, size, symbol.color, time); break;
      case 'creature': drawCreatureSymbol(ctx, position, size, symbol.color, time); break;
      case 'object': drawObjectSymbol(ctx, position, size, symbol.color, time, name); break;
      case 'landscape': drawLandscapeSymbol(ctx, position, size, symbol.color, time); break;
      case 'abstract': drawAbstractSymbol(ctx, position, size, symbol.color, time); break;
      default:
        ctx.fillStyle = symbol.color;
        ctx.beginPath();
        ctx.arc(position.x, position.y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, position.x, position.y + size + 15);
  };

  const drawPersonSymbol = (ctx, position, size, color, time) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(position.x, position.y - size * 0.2, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(position.x, position.y - size * 0.1);
    ctx.lineTo(position.x, position.y + size * 0.3);
    ctx.stroke();

    const armAngle = Math.sin(time * 1.5) * 0.2;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + Math.cos(armAngle + Math.PI * 0.7) * size * 0.3, position.y + Math.sin(armAngle + Math.PI * 0.7) * size * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + Math.cos(armAngle + Math.PI * 0.3) * size * 0.3, position.y + Math.sin(armAngle + Math.PI * 0.3) * size * 0.3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(position.x, position.y + size * 0.3);
    ctx.lineTo(position.x - size * 0.2, position.y + size * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(position.x, position.y + size * 0.3);
    ctx.lineTo(position.x + size * 0.2, position.y + size * 0.6);
    ctx.stroke();
  };

  const drawCreatureSymbol = (ctx, position, size, color, time) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(position.x, position.y, size * 0.5, size * 0.3, Math.sin(time) * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(position.x + size * 0.4, position.y - size * 0.1, size * 0.2, size * 0.2, Math.sin(time * 1.5) * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(position.x - size * 0.5, position.y);
    const tailEnd = { x: position.x - size * 0.8 + Math.sin(time * 3) * size * 0.1, y: position.y + Math.cos(time * 2) * size * 0.2 };
    ctx.quadraticCurveTo(position.x - size * 0.7, position.y + Math.sin(time * 2.5) * size * 0.3, tailEnd.x, tailEnd.y);
    ctx.stroke();
  };

  const drawObjectSymbol = (ctx, position, size, color, time, name) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;

    if (name === 'key') {
      ctx.beginPath();
      ctx.arc(position.x, position.y - size * 0.3, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(position.x, position.y - size * 0.1);
      ctx.lineTo(position.x, position.y + size * 0.3);
      ctx.lineTo(position.x + size * 0.2, position.y + size * 0.3);
      ctx.stroke();
    } else if (name === 'door') {
      ctx.fillRect(position.x - size * 0.3, position.y - size * 0.4, size * 0.6, size * 0.8);
      ctx.strokeRect(position.x - size * 0.3, position.y - size * 0.4, size * 0.6, size * 0.8);
      ctx.beginPath();
      ctx.arc(position.x + size * 0.15, position.y, size * 0.06, 0, Math.PI * 2);
      ctx.stroke();
    } else if (name === 'clock') {
      ctx.beginPath();
      ctx.arc(position.x, position.y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const hourAngle = time % (Math.PI * 2);
      const minuteAngle = (time * 12) % (Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(position.x + Math.cos(hourAngle) * size * 0.2, position.y + Math.sin(hourAngle) * size * 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(position.x + Math.cos(minuteAngle) * size * 0.3, position.y + Math.sin(minuteAngle) * size * 0.3);
      ctx.stroke();
    } else {
      ctx.fillRect(position.x - size * 0.3, position.y - size * 0.2, size * 0.6, size * 0.4);
      ctx.strokeRect(position.x - size * 0.3, position.y - size * 0.2, size * 0.6, size * 0.4);
      ctx.beginPath();
      ctx.moveTo(position.x - size * 0.1, position.y - size * 0.2);
      ctx.lineTo(position.x - size * 0.1, position.y + size * 0.2);
      ctx.stroke();
    }
  };

  const drawLandscapeSymbol = (ctx, position, size, color, time) => {
    const gradient = ctx.createLinearGradient(position.x - size * 0.5, position.y + size * 0.4, position.x + size * 0.5, position.y - size * 0.4);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(100, 100, 150, 0.6)');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(position.x - size * 0.5, position.y + size * 0.4);
    ctx.lineTo(position.x + size * 0.5, position.y + size * 0.4);
    ctx.lineTo(position.x + size * 0.5, position.y + size * 0.2);
    for (let i = 0; i <= 10; i++) {
      const progress = i / 10;
      const x = position.x - size * 0.5 + size * progress;
      const height = size * 0.2 + Math.sin(progress * Math.PI * 2 + time) * size * 0.1;
      ctx.lineTo(x, position.y + size * 0.2 - height);
    }
    ctx.lineTo(position.x - size * 0.5, position.y + size * 0.2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 200, 0.7)';
    ctx.beginPath();
    ctx.arc(position.x + size * 0.3, position.y - size * 0.3, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawAbstractSymbol = (ctx, position, size, color, time) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(position.x, position.y, size * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    const spiralPoints = 12;
    const spiralTurns = 2 + Math.sin(time) * 0.5;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    for (let i = 0; i <= 100; i++) {
      const progress = i / 100;
      const angle = progress * Math.PI * 2 * spiralTurns + time % (Math.PI);
      const radius = progress * size * 0.4;
      ctx.lineTo(position.x + Math.cos(angle) * radius, position.y + Math.sin(angle) * radius);
    }
    ctx.stroke();

    ctx.fillStyle = color;
    for (let i = 0; i < spiralPoints; i++) {
      const progress = i / spiralPoints;
      const angle = progress * Math.PI * 2 * spiralTurns + time % (Math.PI);
      const radius = progress * size * 0.4;
      const x = position.x + Math.cos(angle) * radius;
      const y = position.y + Math.sin(angle) * radius;
      const particleSize = 2 + Math.sin(time * 2 + i) * 1;
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawSharedDreamConnections = (ctx) => {
    const time = Date.now() / 1000;
    const symbols = selectedDream.symbols;

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        if ((i + j) % 3 !== 0) continue;
        const symbol1 = symbols[i];
        const symbol2 = symbols[j];
        const distance = Math.sqrt(Math.pow(symbol1.position.x - symbol2.position.x, 2) + Math.pow(symbol1.position.y - symbol2.position.y, 2));
        if (distance > 150) continue;

        const progress = (Math.sin(time * 2 + i * j) + 1) / 2;
        const gradient = ctx.createLinearGradient(symbol1.position.x, symbol1.position.y, symbol2.position.x, symbol2.position.y);
        gradient.addColorStop(0, symbol1.color);
        gradient.addColorStop(1, symbol2.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.globalAlpha = 0.4 + progress * 0.3;
        ctx.beginPath();
        ctx.moveTo(symbol1.position.x, symbol1.position.y);
        const midX = (symbol1.position.x + symbol2.position.x) / 2;
        const midY = (symbol1.position.y + symbol2.position.y) / 2;
        const offset = 20 * Math.sin(time + i);
        ctx.quadraticCurveTo(midX + offset, midY - offset, symbol2.position.x, symbol2.position.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;
      }
    }
  };

  const drawUserInfluence = (ctx, width, height) => {
    if (!influenceInput) return;

    const { x, y } = mousePosition.current;
    const time = Date.now() / 1000;

    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    const radius = 30 + Math.sin(time * 4) * 5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '14px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText(influenceInput, x, y - radius - 10);

    const particleCount = 8;
    for (let i = 0; 5; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time % (Math.PI * 2);
      const distance = radius * (0.7 + Math.sin(time * 3 + i) * 0.3);
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.setLineDash([]);
  };

  const drawCollectionCursor = (ctx, width, height) => {
    const { x, y } = mousePosition.current;
    const time = Date.now() / 1000;

    ctx.strokeStyle = '#00CED1';
    ctx.lineWidth = 2;
    const outerRadius = 40 + Math.sin(time * 2) * 5;
    const innerRadius = 35;

    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 206, 209, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#00CED1';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    const pulse = (Math.sin(time * 3) + 1) / 2;
    ctx.globalAlpha = 0.5 + pulse * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, outerRadius * (0.5 + pulse * 0.5), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  };

  // Interaction handlers
  const handleCanvasMouseMove = (e) => {
    const rect = dreamCanvasRef.current.getBoundingClientRect();
    mousePosition.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleCanvasClick = (e) => {
    const rect = dreamCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dreamCanvasMode === 'influence' && influenceInput) {
      const newSymbol = {
        id: `influenced_${Date.now()}`,
        type: 'abstract',
        name: influenceInput,
        meaning: 'User-influenced symbol',
        intensity: 0.7,
        position: { x, y },
        velocity: { x: 0, y: 0 },
        color: '#FFD700',
        fixed: true
      };
      setActiveDreams(prev => prev.map(d => d.id === selectedDream.id ? { ...d, symbols: [...d.symbols, newSymbol] } : d));
      simulation.influenceAgentDream(agents.find(a => a.id === selectedDream.agentId), { symbol: influenceInput, intensity: 0.7 });
      setInfluenceInput('');
    } else if (dreamCanvasMode === 'collect') {
      const clickedSymbol = selectedDream.symbols.find(s => {
        const dx = s.position.x - x;
        const dy = s.position.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 20 + s.intensity * 20;
      });
      if (clickedSymbol) {
        setCollectedSymbols(prev => [...prev, clickedSymbol]);
        setActiveDreams(prev => prev.map(d => d.id === selectedDream.id ? { ...d, symbols: d.symbols.filter(s => s.id !== clickedSymbol.id) } : d));
      }
    }
  };

  // Control handlers
  const handleInfluenceSubmit = () => {
    if (influenceInput && dreamCanvasMode === 'influence') {
      handleCanvasClick({ clientX: mousePosition.current.x + dreamCanvasRef.current.getBoundingClientRect().left, clientY: mousePosition.current.y + dreamCanvasRef.current.getBoundingClientRect().top });
    }
  };

  const handleSeedClick = (seed) => {
    setInfluenceInput(seed.text);
    setDreamCanvasMode('influence');
  };

  const handleSaveDream = () => {
    const dreamData = JSON.stringify(selectedDream);
    const blob = new Blob([dreamData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDream.agentName}_dream.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Render UI components
  const renderDreamList = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2 flex items-center">
        <Moon className="mr-2 text-purple-400" size={18} />
        Active Dreams
      </h2>
      {activeDreams.length === 0 ? (
        <p className="text-gray-400">No active dreams</p>
      ) : (
        <ul className="space-y-2">
          {activeDreams.map(dream => (
            <li
              key={dream.id}
              className={`p-2 rounded cursor-pointer ${selectedDream?.id === dream.id ? 'bg-purple-900' : 'bg-gray-700'} hover:bg-purple-800`}
              onClick={() => setSelectedDream(dream)}
            >
              <div className="flex justify-between">
                <span>{dream.agentName} - {dream.type}</span>
                <span className="text-xs">{Math.round((Date.now() - dream.startTime) / 1000)}s</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderControls = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2 flex items-center">
        <Zap className="mr-2 text-blue-400" size={18} />
        Dream Controls
      </h2>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button
            className={`flex-1 p-2 rounded ${dreamCanvasMode === 'explore' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
            onClick={() => setDreamCanvasMode('explore')}
          >
            <Cloud className="mx-auto" size={16} />
            Explore
          </button>
          <button
            className={`flex-1 p-2 rounded ${dreamCanvasMode === 'influence' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
            onClick={() => setDreamCanvasMode('influence')}
          >
            <Sparkles className="mx-auto" size={16} />
            Influence
          </button>
          <button
            className={`flex-1 p-2 rounded ${dreamCanvasMode === 'collect' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
            onClick={() => setDreamCanvasMode('collect')}
          >
            <Share2 className="mx-auto" size={16} />
            Collect
          </button>
        </div>
        <div>
          <input
            type="text"
            value={influenceInput}
            onChange={(e) => setInfluenceInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleInfluenceSubmit()}
            placeholder="Enter dream influence"
            className="w-full bg-gray-700 border border-gray-600 rounded p-2"
          />
          <button
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 p-2 rounded flex items-center justify-center"
            onClick={handleInfluenceSubmit}
          >
            <Send className="mr-2" size={16} />
            Inject
          </button>
        </div>
        <div>
          <h3 className="text-sm font-bold mb-1">Dream Seeds</h3>
          <div className="flex flex-wrap gap-2">
            {dreamSeeds.map(seed => (
              <button
                key={seed.id}
                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs"
                onClick={() => handleSeedClick(seed)}
              >
                {seed.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCollectedSymbols = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-2 flex items-center">
        <BrainCircuit className="mr-2 text-green-400" size={18} />
        Collected Symbols
      </h2>
      {collectedSymbols.length === 0 ? (
        <p className="text-gray-400">No symbols collected</p>
      ) : (
        <ul className="space-y-2">
          {collectedSymbols.map(symbol => (
            <li key={symbol.id} className="p-2 bg-gray-700 rounded flex justify-between">
              <span>{symbol.name} ({symbol.type})</span>
              <span className="text-xs">{(symbol.intensity * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold flex items-center">
          <Moon className="mr-2 text-purple-400" size={24} />
          Dream Weaver
          <span className="ml-2 text-sm text-gray-400">v1.0.0</span>
        </h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <canvas
            ref={dreamCanvasRef}
            width={600}
            height={600}
            className="w-full h-full bg-gray-950"
            onMouseMove={handleCanvasMouseMove}
            onClick={handleCanvasClick}
          />
          {selectedDream && (
            <div className="absolute bottom-4 left-4 bg-gray-800 p-2 rounded text-sm">
              {selectedDream.narrative}
            </div>
          )}
        </div>
        <div className="w-80 p-4 bg-gray-800 overflow-y-auto space-y-4">
          {renderDreamList()}
          {renderControls()}
          {renderCollectedSymbols()}
          {selectedDream && (
            <button
              className="w-full bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center"
              onClick={handleSaveDream}
            >
              <Save className="mr-2" size={16} />
              Save Dream
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamWeaver;
