import { useState, useEffect, useCallback, useRef } from 'react';
import { generateInitialData, generateNextDataPoint, EventLogItem, TelemetryDataPoint } from './data';
import { StatusPill } from './StatusPill';
import { KPICard } from './KPICard';
import { TelemetryChart } from './TelemetryChart';
import { EventLog } from './EventLog';
import { ActionPanel } from './ActionPanel';
import { Activity, Volume2, Mic2, Heart } from 'lucide-react';
import { format } from 'date-fns';

export function VocalGuardDashboard() {
  const [isCritical, setIsCritical] = useState(false);
  const [data, setData] = useState<TelemetryDataPoint[]>(generateInitialData(60));
  const [logs, setLogs] = useState<EventLogItem[]>([
    { id: '1', timestamp: format(new Date(), 'HH:mm:ss'), message: 'System Initialized', type: 'info' }
  ]);
  
  // KPI States
  const [pitch, setPitch] = useState(440);
  const [strain, setStrain] = useState(0.85);
  const [volume, setVolume] = useState(85);

  const isCriticalRef = useRef(isCritical);
  useEffect(() => {
    isCriticalRef.current = isCritical;
  }, [isCritical]);

  const addLog = useCallback((message: string, type: EventLogItem['type'] = 'info') => {
    setLogs(prev => {
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: format(new Date(), 'HH:mm:ss'),
            message,
            type
        };
        return [...prev, newLog].slice(-50); // Keep last 50 logs
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let currentStrain = 0;

      // Update Chart Data
      setData(prevData => {
        const lastTime = prevData[prevData.length - 1].time;
        const nextPoint = generateNextDataPoint(lastTime, isCriticalRef.current);
        currentStrain = nextPoint.value;
        return [...prevData.slice(1), nextPoint];
      });

      // Update KPIs
      setStrain(currentStrain);
      
      setPitch(prev => {
        const jitter = Math.floor(Math.random() * 10) - 5;
        // If critical, pitch wavers more
        if (isCriticalRef.current) return prev + (Math.random() * 40 - 20);
        return Math.max(100, Math.min(1000, 440 + jitter)); // hover around 440
      });

      setVolume(prev => {
        const jitter = Math.floor(Math.random() * 5) - 2;
        return Math.max(60, Math.min(110, 85 + jitter));
      });

      // Check thresholds
      if (currentStrain < -0.5 && !isCriticalRef.current) {
          // This would auto-trigger, but for this demo we let the user control the state
          // just log a warning occasionally
          if (Math.random() > 0.8) {
              addLog(`Strain Spike Detected: ${currentStrain.toFixed(2)}`, 'warning');
          }
      }

    }, 200); // Faster update for "Real-Time" feel

    return () => clearInterval(interval);
  }, [addLog]);

  const toggleCriticalMode = () => {
    const newState = !isCritical;
    setIsCritical(newState);
    if (newState) {
      addLog('CRITICAL STRAIN DETECTED - MANUAL OVERRIDE', 'danger');
    } else {
      addLog('System normalized', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 font-sans p-4 md:p-6 flex flex-col h-screen overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Neon Blue Gradient from Left */}
        <div className="absolute inset-y-0 left-0 w-[50vw] bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#00E5FF]/20 via-blue-800/10 to-transparent blur-[100px] opacity-70" />
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_80%)] opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-800 pb-4 shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center text-green-300 font-bold text-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            V
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">VOXGUARD</h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Monitoring: ARTIST X</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
           <button 
             onClick={toggleCriticalMode}
             className="px-4 py-2 bg-gray-900 text-xs text-gray-400 rounded hover:bg-gray-800 transition-colors border border-gray-700 font-mono uppercase tracking-wider hover:text-white"
           >
             Simulate: {isCritical ? 'Normal' : 'Critical'} Event
           </button>
           <StatusPill status={isCritical ? 'critical' : 'nominal'} />
        </div>
      </header>

      {/* KPI Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <KPICard 
          label="Pitch" 
          value={Math.round(pitch)} 
          unit="Hz" 
          color="cyan" 
          icon={<Mic2 size={20} />} 
        />
        <KPICard 
          label="Strain Index" 
          value={strain > 0 ? `+${strain.toFixed(2)}` : `${strain.toFixed(2)}`} 
          color={strain < -0.5 ? 'red' : 'emerald'} 
          icon={<Activity size={20} />} 
        />
        <KPICard 
          label="Volume" 
          value={Math.round(volume)} 
          unit="dB" 
          color="emerald" 
          icon={<Volume2 size={20} />} 
        />
        <KPICard 
          label="Heart / SpO2" 
          value="-- / 98" 
          unit="BPM / %" 
          color="emerald" 
          icon={<Heart size={20} className="opacity-50" />} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 flex-1">
        {/* Main Chart Area (70% -> 8/12 cols) */}
        <div className="lg:col-span-8 h-full min-h-[300px]">
          <TelemetryChart data={data} threshold={-0.5} />
        </div>

        {/* Sidebar (30% -> 4/12 cols) */}
        <div className="lg:col-span-4 h-full flex flex-col gap-6 min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-gray-800 bg-[#1E1E1E]">
             <EventLog logs={logs} />
          </div>
          <div className="shrink-0">
             <ActionPanel 
               onExport={() => addLog('Session Log Exported to CSV', 'info')}
               onMarker={() => addLog(`Marker added at ${format(new Date(), 'HH:mm:ss')}`, 'warning')}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
