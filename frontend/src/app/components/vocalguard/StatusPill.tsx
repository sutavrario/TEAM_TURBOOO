import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

interface StatusPillProps {
  status: 'nominal' | 'critical';
}

export function StatusPill({ status }: StatusPillProps) {
  const isCritical = status === 'critical';

  return (
    <motion.div
      className={twMerge(
        "rounded-full px-6 py-2 border flex items-center justify-center font-bold tracking-wider",
        isCritical 
          ? "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
          : "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
      )}
      animate={isCritical ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
      transition={isCritical ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
    >
      {isCritical ? "CRITICAL - VOCAL STRAIN" : "SYSTEM NOMINAL - HEALTHY"}
    </motion.div>
  );
}
