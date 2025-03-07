import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, BrainCircuit, Moon, GitMerge, Plus, CloudLightning, Database, Settings, Play, Pause, Rewind, Trash2 } from 'lucide-react';
import RealityGlitcher from '../components/RealityGlitcher';
import DreamWeaver from '../components/DreamWeaver';
import { CollectiveGlitchSystem } from '../systems/CollectiveGlitchSystem';

// Simulated simulation object (replace with real HESMS implementation if available)
const createSimulation = () => ({
  agents: [],
  on: (event, callback) => {},
  off: (event, callback) => {},
  triggerEvent: (event, data) => {},
  notifyAgent: (agent, data) => {},
  getAgent: (id) => this.agents.find(a => a.id === id),
  getRandomAgentMemory: (agent) => ({ content: 'Random memory', importance: Math.random() }),
  getAgentDreamState: (agent) => agent.dreaming ? { intensity: Math.random(), symbols: [{ type: 'object', name: 'key' }] } : null,
  influenceAgentConsciousness: (agent, data) => {},
  applyTemporalDistortion: (data) => {},
  applyRealityBlur: (data) => {},
});

const RealitySandbox = () => {
  // Core state
  const [agents, setAgents] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1.0);
  const [currentEnvironment, setCurrentEnvironment] = useState('default');
  const [activeGlitches, setActiveGlitches] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const [globalIntensity, setGlobalIntensity] = useState(1.0);

  // Refs and systems
  const simulationTimer = useRef(null);
  const simulationTime = useRef(0);
  const simulationRef = useRef(createSimulation());
  const glitchSystemRef = useRef(null);
  const perceptionSuiteRef = useRef({
    realityGlitcher: {
      on: (event, callback) => {},
      off: (event, callback) => {},
      registerGlitch: () => {},
      registerEmergentGlitch: () => {},
      updateGlitchVisuals: () => {},
      updateQuantumGraph: () => {},
      registerMemoryFragment: () => {},
      registerDreamManifestation: () => {},
      unregisterGlitch: () => {},
    },
    onGlitchHarvest: () => {},
  });

  // New agent form state
  const [newAgentForm, setNewAgentForm] = useState({
    adaptability: 50,
    emotional: 50,
    curiosity: 50,
    socialAffinity: 50,
  });

  // Initialize simulation and glitch system
  useEffect(() => {
    simulationRef.current.agents = Array(5).fill().map((_, i) => createDefaultAgent(i + 1));
    setAgents(simulationRef.current.agents);
    glitchSystemRef.current = new CollectiveGlitchSystem(simulationRef.current, perceptionSuiteRef.current);

    addSystemMessage('Reality Sandbox initialized', 'info');
    addSystemMessage('HESMS cognitive architecture online', 'info');
    addSystemMessage('PROJECT89 Perception-Hacking Suite engaged', 'info');

    return () => {
      if (simulationTimer.current) clearInterval(simulationTimer.current);
    };
  }, []);

  // Simulation control
  useEffect(() => {
    if (isSimulationRunning) {
      simulationTimer.current = setInterval(() => {
        simulationTime.current += 1;
        updateSimulation(1000 / simulationSpeed);
      }, 1000 / simulationSpeed);
      addSystemMessage(`Simulation running at ${simulationSpeed}x speed`, 'info');
    } else {
      if (simulationTimer.current) {
        clearInterval(simulationTimer.current);
        simulationTimer.current = null;
        if (simulationTime.current > 0) addSystemMessage('Simulation paused', 'info');
      }
    }
    return () => {
      if (simulationTimer.current) clearInterval(simulationTimer.current);
    };
  }, [isSimulationRunning, simulationSpeed]);

  // Update simulation
  const updateSimulation = (deltaTime) => {
    glitchSystemRef.current.update(deltaTime);
    setActiveGlitches(glitchSystemRef.current.getActiveGlitches());

    setAgents(prevAgents => prevAgents.map(agent => {
      const updatedAgent = { ...agent };
      updatedAgent.consciousness = Math.min(1, Math.max(0, updatedAgent.consciousness + (Math.random() * 0.02 - 0.01)));

      // Dream state transitions
      if (Math.random() < 0.03) {
        updatedAgent.dreaming = !updatedAgent.dreaming;
        const message = updatedAgent.dreaming ? `Agent-${agent.id} entered dream state` : `Agent-${agent.id} awoke`;
        addSystemMessage(message, 'info');
        if (updatedAgent.dreaming) simulationRef.current.triggerEvent('dream', { agent, intensity: Math.random() });
      }

      // Memory formation and glitch chance
      if (Math.random() < 0.08) {
        updatedAgent.memories += 1;
        if (Math.random() < updatedAgent.curiosity / 200) {
          simulationRef.current.triggerEvent('memory_distortion', {
            agent,
            memory: { type: 'spatial', distortionLevel: Math.random() * 0.5 },
          });
        }
      }

      // Social sync chance
      if (Math.random() < updatedAgent.socialAffinity / 500 && prevAgents.length > 1) {
        const syncPartners = prevAgents.filter(a => a.id !== agent.id && Math.random() < a.socialAffinity / 100);
        if (syncPartners.length > 0) {
          simulationRef.current.triggerEvent('consciousness_sync', {
            agents: [agent, ...syncPartners.slice(0, 2)],
            syncStrength: Math.random() * 0.8,
          });
        }
      }

      return updatedAgent;
    }));
  };

  // Agent creation
  const createDefaultAgent = (id) => ({
    id,
    name: `Agent-${id}`,
    x: 400 + Math.cos(id / 5 * Math.PI * 2) * 200,
    y: 300 + Math.sin(id / 5 * Math.PI * 2) * 200,
    consciousness: 0.5 + Math.random() * 0.4,
    dreaming: false,
    memories: Math.floor(5 + Math.random() * 10),
    adaptability: 40 + Math.random() * 40,
    emotional: 30 + Math.random() * 50,
    curiosity: 40 + Math.random() * 40,
    socialAffinity: 30 + Math.random() * 40,
  });

  const createNewAgent = () => {
    const newId = agents.length > 0 ? Math.max(...agents.map(a => a.id)) + 1 : 1;
    const newAgent = {
      id: newId,
      name: `Agent-${newId}`,
      x: 400 + Math.random() * 200 - 100,
      y: 300 + Math.random() * 200 - 100,
      consciousness: 0.5,
      dreaming: false,
      memories: 0,
      adaptability: newAgentForm.adaptability,
      emotional: newAgentForm.emotional,
      curiosity: newAgentForm.curiosity,
      socialAffinity: newAgentForm.socialAffinity,
    };
    simulationRef.current.agents.push(newAgent);
    setAgents([...simulationRef.current.agents]);
    setShowAgentPanel(false);
    addSystemMessage(`Agent-${newId} spawned`, 'info');
  };

  // Environment handling
  const changeEnvironment = (envName) => {
    const envEffects = {
      'default': { intensity: 1.0, glitchChance: 0.1 },
      'forest': { intensity: 0.8, glitchChance: 0.15 },
      'digital': { intensity: 1.2, glitchChance: 0.25 },
      'abstract': { intensity: 1.5, glitchChance: 0.3 },
    };
    const effect = envEffects[envName] || envEffects['default'];
    setCurrentEnvironment(envName);
    glitchSystemRef.current.adjustGlobalIntensity(effect.intensity);
    addSystemMessage(`Transitioned to ${envName} environment`, 'info');
    simulationRef.current.triggerEvent('environment_transition', { intensity: effect.intensity });

    setAgents(prevAgents => prevAgents.map(agent => {
      const stress = (1 - agent.adaptability / 100) * effect.glitchChance;
      if (Math.random() < stress) {
        setTimeout(() => simulationRef.current.triggerEvent('memory_distortion', {
          agent,
          memory: { type: 'spatial', distortionLevel: stress },
        }), Math.random() * 1000);
      }
      return { ...agent, consciousness: Math.max(0.2, agent.consciousness - stress * 0.1) };
    }));
  };

  // System utilities
  const addSystemMessage = (message, type = 'info') => {
    setSystemMessages(prev => [{
      id: Date.now(),
      text: message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 100));
  };

  const resetSimulation = () => {
    setIsSimulationRunning(false);
    simulationTime.current = 0;
    simulationRef.current.agents = Array(5).fill().map((_, i) => createDefaultAgent(i + 1));
    setAgents(simulationRef.current.agents);
    glitchSystemRef.current.activeGlitches = [];
    setActiveGlitches([]);
    setSystemMessages([]);
    addSystemMessage('Simulation reset', 'warning');
  };

  // UI handlers
  const handleAgentFormChange = (field, value) => {
    setNewAgentForm(prev => ({ ...prev, [field]: value }));
  };

  // UI renderers
  const renderSimulationControls = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <Settings className="mr-2 text-blue-400" size={20} />
        Control Matrix
      </h2>
      <div className="flex space-x-4 items-center mb-4">
        <button
          className={`px-4 py-2 rounded font-medium ${isSimulationRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          onClick={() => setIsSimulationRunning(!isSimulationRunning)}
        >
          {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700"
          onClick={resetSimulation}
        >
          <Rewind size={16} />
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Speed:</span>
          <select
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
            disabled={isSimulationRunning}
          >
            {[0.25, 0.5, 1.0, 2.0, 4.0].map(speed => (
              <option key={speed} value={speed}>{speed}x</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-300">
          Time: {Math.floor(simulationTime.current / 60)}m {simulationTime.current % 60}s
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Reality:</span>
          <select
            value={currentEnvironment}
            onChange={(e) => changeEnvironment(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
          >
            {['default', 'forest', 'digital', 'abstract'].map(env => (
              <option key={env} value={env}>{env.charAt(0).toUpperCase() + env.slice(1)}</option>
            ))}
          </select>
        </div>
        <button
          className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 flex items-center"
          onClick={() => setShowAgentPanel(true)}
        >
          <Plus className="mr-1" size={16} /> Spawn Agent
        </button>
      </div>
      <div className="mt-4">
        <label className="text-sm text-gray-300">Glitch Intensity: {(globalIntensity * 100).toFixed(0)}%</label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={globalIntensity}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setGlobalIntensity(value);
            glitchSystemRef.current.adjustGlobalIntensity(value);
          }}
          className="w-full mt-1"
        />
      </div>
    </div>
  );

  const renderSystemLog = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <Database className="mr-2 text-green-400" size={20} />
        System Log
      </h2>
      <div className="bg-gray-900 rounded border border-gray-700 h-40 overflow-y-auto p-2">
        {systemMessages.map(msg => (
          <div
            key={msg.id}
            className={`text-xs px-2 py-1 rounded ${
              msg.type === 'warning' ? 'bg-yellow-900/30 text-yellow-200' :
              msg.type === 'error' ? 'bg-red-900/30 text-red-200' :
              'text-gray-300'
            }`}
          >
            <span className="text-gray-500">[{msg.timestamp}]</span> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAgentForm = () => showAgentPanel && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <BrainCircuit className="mr-2 text-purple-400" size={20} />
          Spawn New Entity
        </h2>
        {Object.entries(newAgentForm).map(([field, value]) => (
          <div key={field} className="mb-4">
            <label className="block text-sm mb-1 capitalize">{field}: {value}</label>
            <input
              type="range"
              min="10"
              max="90"
              value={value}
              onChange={(e) => handleAgentFormChange(field, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={() => setShowAgentPanel(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={createNewAgent}
          >
            Spawn
          </button>
        </div>
      </div>
    </div>
  );

  const renderAgentOverview = () => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <BrainCircuit className="mr-2 text-purple-400" size={20} />
        Agent Network
      </h2>
      <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
        {agents.map(agent => (
          <div
            key={agent.id}
            className={`p-3 rounded border ${
              agent.dreaming ? 'bg-purple-900/30 border-purple-700' : 'bg-gray-700 border-gray-600'
            } cursor-pointer hover:border-blue-500`}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{agent.name}</div>
              <div className={`text-xs px-2 py-0.5 rounded ${agent.dreaming ? 'bg-purple-800' : 'bg-green-800'}`}>
                {agent.dreaming ? 'Dreaming' : 'Active'}
              </div>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between"><span>Consciousness:</span><span>{(agent.consciousness * 100).toFixed(1)}%</span></div>
              <div className="flex justify-between"><span>Memories:</span><span>{agent.memories}</span></div>
              <div className="flex justify-between"><span>Curiosity:</span><span>{agent.curiosity}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSynchronicityDetector = () => (
    <div className="h-full bg-gray-900 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <GitMerge className="mr-2 text-blue-400" size={20} />
        Synchronicity Detector
      </h2>
      <canvas
        ref={canvas => {
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const syncEvents = systemMessages.filter(m => m.text.includes('sync') || m.text.includes('convergence'));
          syncEvents.forEach((event, i) => {
            const angle = (i / syncEvents.length) * Math.PI * 2;
            const radius = 100 + Math.sin(Date.now() / 1000) * 20;
            ctx.fillStyle = 'rgba(0, 206, 209, 0.7)';
            ctx.beginPath();
            ctx.arc(
              canvas.width / 2 + Math.cos(angle) * radius,
              canvas.height / 2 + Math.sin(angle) * radius,
              5,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(event.text.split(' ')[0], canvas.width / 2 + Math.cos(angle) * (radius + 15), canvas.height / 2 + Math.sin(angle) * (radius + 15));
          });
        }}
        width={800}
        height={600}
        className="w-full h-full bg-gray-950 rounded-lg"
      />
    </div>
  );

  const renderMindMirror = () => (
    <div className="h-full bg-gray-900 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <BrainCircuit className="mr-2 text-purple-400" size={20} />
        Mind Mirror
      </h2>
      {selectedAgent ? (
        <canvas
          ref={canvas => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const traits = {
              consciousness: selectedAgent.consciousness,
              emotional: selectedAgent.emotional / 100,
              curiosity: selectedAgent.curiosity / 100,
              adaptability: selectedAgent.adaptability / 100,
            };
            Object.entries(traits).forEach(([key, value], i) => {
              const angle = (i / 4) * Math.PI * 2;
              const radius = 80 * value;
              ctx.strokeStyle = selectedAgent.dreaming ? '#8A2BE2' : '#4682B4';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, radius, angle, angle + Math.PI / 2);
              ctx.stroke();
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(`${key}: ${(value * 100).toFixed(0)}%`, canvas.width / 2 + Math.cos(angle) * (radius + 20), canvas.height / 2 + Math.sin(angle) * (radius + 20));
            });
          }}
          width={800}
          height={600}
          className="w-full h-full bg-gray-950 rounded-lg"
        />
      ) : (
        <div className="text-center text-gray-500 h-full flex items-center justify-center">
          <p>Select an agent to view their consciousness map</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold flex items-center">
          <CloudLightning className="mr-2 text-purple-400" size={24} />
          Reality Sandbox
          <span className="ml-2 text-sm text-gray-400">v2.0.0</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">HESMS Cognitive Core + PROJECT89 Perception Matrix</p>
      </header>
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {renderSimulationControls()}
          {renderAgentOverview()}
          {renderSystemLog()}
        </div>
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="glitcher" className="h-full flex flex-col">
            <TabsList className="mx-auto bg-gray-800 p-2 rounded-lg">
              <TabsTrigger value="glitcher" className="flex items-center px-4 py-2">
                <Sparkles className="mr-2" size={16} />
                Glitcher
              </TabsTrigger>
              <TabsTrigger value="dreamer" className="flex items-center px-4 py-2">
                <Moon className="mr-2" size={16} />
                Dream Weaver
              </TabsTrigger>
              <TabsTrigger value="sync" className="flex items-center px-4 py-2">
                <GitMerge className="mr-2" size={16} />
                Sync Detector
              </TabsTrigger>
              <TabsTrigger value="mind" className="flex items-center px-4 py-2">
                <BrainCircuit className="mr-2" size={16} />
                Mind Mirror
              </TabsTrigger>
            </TabsList>
            <TabsContent value="glitcher" className="flex-1 overflow-hidden mt-4 rounded-lg border border-gray-700">
              <RealityGlitcher simulation={simulationRef.current} collectiveGlitchSystem={glitchSystemRef.current} />
            </TabsContent>
            <TabsContent value="dreamer" className="flex-1 overflow-hidden mt-4 rounded-lg border border-gray-700">
              <DreamWeaver agents={agents} simulation={simulationRef.current} />
            </TabsContent>
            <TabsContent value="sync" className="flex-1 overflow-hidden mt-4 rounded-lg border border-gray-700">
              {renderSynchronicityDetector()}
            </TabsContent>
            <TabsContent value="mind" className="flex-1 overflow-hidden mt-4 rounded-lg border border-gray-700">
              {renderMindMirror()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {renderAgentForm()}
    </div>
  );
};

export default RealitySandbox;
