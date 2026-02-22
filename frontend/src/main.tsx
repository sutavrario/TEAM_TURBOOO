import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LineChart, Line, YAxis, XAxis, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";
import { Activity, AlertTriangle, Mic2, BrainCircuit } from "lucide-react";

// Make sure this matches where your CSS file is!
import "./styles/index.css"; 

function App() {
  const [liveData, setLiveData] = useState([]);
  const [latest, setLatest] = useState({ Pitch_Hz: 0, Strain_Score: 0, Is_Anomaly: 1 });
  const [status, setStatus] = useState("waiting");
  const [advice, setAdvice] = useState("Warming up AI Coach...");

  // --- PIPELINE 1: FAST GRAPH DATA ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8001/api/data"); 
        const json = await res.json();
        
        if (json.status === "active" && json.data.length > 0) {
          setLiveData(json.data);
          setLatest(json.data[json.data.length - 1]);
        }
        setStatus(json.status);
      } catch (error) {
        setStatus("error");
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // --- PIPELINE 2: SLOW LLM ADVICE ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8001/api/advice"); 
        const json = await res.json();
        
        if (json.advice) {
          setAdvice(json.advice);
        }
      } catch (error) {
        console.error("Waiting for LLM...");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isCritical = latest.Is_Anomaly === -1;
  const statusColor = isCritical ? "bg-red-500" : "bg-emerald-500";
  const glowColor = isCritical ? "shadow-red-500/50" : "shadow-emerald-500/50";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8 font-mono">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VocalGuard</h1>
          <p className="text-gray-400 text-sm mt-1">Live Telemetry & AI Coaching</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full border border-gray-800 bg-[#1E1E1E] shadow-lg ${glowColor} transition-colors duration-300`}>
          <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`} />
          <span className={`font-bold ${isCritical ? "text-red-500" : "text-emerald-500"}`}>
            {isCritical ? "CRITICAL: STRAIN" : "SYSTEM NOMINAL"}
          </span>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4 text-gray-400">
            <span className="text-sm font-semibold uppercase">Current Pitch</span>
            <Mic2 size={20} />
          </div>
          <div className="text-4xl font-bold">{Math.round(latest.Pitch_Hz)} <span className="text-xl text-gray-500">Hz</span></div>
        </div>

        <div className={`bg-[#1E1E1E] p-6 rounded-xl border ${isCritical ? 'border-red-500/50' : 'border-gray-800'} transition-colors duration-300`}>
          <div className="flex justify-between items-start mb-4 text-gray-400">
            <span className="text-sm font-semibold uppercase">Strain Index</span>
            {isCritical ? <AlertTriangle size={20} className="text-red-500" /> : <Activity size={20} className="text-emerald-500" />}
          </div>
          <div className={`text-4xl font-bold ${isCritical ? "text-red-500" : "text-emerald-500"}`}>
            {latest.Strain_Score.toFixed(2)}
          </div>
        </div>

        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-blue-900/50 shadow-[0_0_15px_rgba(30,58,138,0.2)]">
          <div className="flex justify-between items-start mb-2 text-gray-400">
            <span className="text-sm font-semibold uppercase text-blue-400">AI Vocal Coach</span>
            <BrainCircuit size={20} className="text-blue-400" />
          </div>
          <div className="text-sm text-gray-200 mt-2 font-medium leading-relaxed min-h-[3rem] flex items-center">
            {advice}
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
        <h2 className="text-lg font-semibold text-gray-300 mb-6 uppercase tracking-wider">Live Strain Graph</h2>
        {status === "error" || status === "waiting" ? (
          <div className="h-[400px] flex items-center justify-center text-gray-500 border border-dashed border-gray-700 rounded-lg">
            Waiting for Python Backend... 
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveData}>
                <XAxis dataKey="Timestamp" hide />
                <YAxis domain={[-1.5, 0.5]} stroke="#525252" />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', color: '#fff' }} />
                <ReferenceLine y={-0.5} stroke="#FF1744" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="Strain_Score" stroke={isCritical ? "#FF1744" : "#00E676"} strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// THE MAGIC LINE: This takes the App blueprint above and injects it into your index.html
createRoot(document.getElementById("root")!).render(<App />);