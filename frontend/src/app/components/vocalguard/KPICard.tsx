import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  color: 'emerald' | 'cyan' | 'red';
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ label, value, unit, color, icon, trend }: KPICardProps) {
  const colorMap = {
    emerald: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    cyan: 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5',
    red: 'text-red-500 border-red-500/20 bg-red-500/5',
  };

  return (
    <motion.div
      className={twMerge(
        "bg-[#1E1E1E] rounded-lg p-6 flex flex-col justify-between border h-32 relative overflow-hidden",
        colorMap[color]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-400 text-sm font-mono uppercase tracking-wider">{label}</span>
        <div className={twMerge("p-2 rounded-full bg-white/5", colorMap[color].split(' ')[0])}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 z-10">
        <span className="text-4xl font-mono font-bold tracking-tight text-white">{value}</span>
        {unit && <span className="text-gray-500 font-mono text-sm">{unit}</span>}
      </div>

      {/* Decorative gradient blob */}
      <div 
        className={twMerge(
          "absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-20",
          color === 'red' ? 'bg-red-500' : color === 'cyan' ? 'bg-cyan-500' : 'bg-emerald-500'
        )} 
      />
    </motion.div>
  );
}
