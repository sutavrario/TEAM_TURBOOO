import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { clsx } from 'clsx';
import { TelemetryDataPoint } from './data';

interface TelemetryChartProps {
  data: TelemetryDataPoint[];
  threshold: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-2 rounded shadow-lg text-xs font-mono">
        <p className="text-gray-400">{label}</p>
        <p className="text-emerald-400 font-bold">Strain: {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function TelemetryChart({ data, threshold }: TelemetryChartProps) {
  return (
    <div className="w-full h-full bg-[#1E1E1E] rounded-lg border border-gray-800 p-4 relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Real-Time Vocal Strain Telemetry
        </h3>
        <div className="text-xs text-gray-500 font-mono">
          Threshold: {threshold}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#666" 
              tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666" 
              domain={[-1, 1]} 
              ticks={[-1, -0.5, 0, 0.5, 1]}
              tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={threshold} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: 'DANGER', fill: '#EF4444', fontSize: 10 }} />
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#00E676" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: '#00E676', stroke: '#fff', strokeWidth: 2 }}
              style={{ filter: 'url(#glow)' }}
              isAnimationActive={false} // Disable animation for real-time feel
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grid Overlay for "Tech" feel */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] opacity-20"></div>
    </div>
  );
}
