import { useRef, useEffect } from 'react';
import { EventLogItem } from './data';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface EventLogProps {
  logs: EventLogItem[];
}

export function EventLog({ logs }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#1E1E1E] rounded-lg border border-gray-800 p-4 h-full flex flex-col font-mono text-xs overflow-hidden">
      <h3 className="text-gray-400 font-bold uppercase mb-2 tracking-wider sticky top-0 bg-[#1E1E1E] z-10 pb-2 border-b border-gray-800 flex justify-between">
        <span>System Log</span>
        <span className="text-[10px] text-gray-500">Auto-Scroll: ON</span>
      </h3>
      
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={clsx(
                "p-2 rounded border-l-2 flex items-start gap-2",
                log.type === 'danger' ? 'bg-red-500/10 border-red-500 text-red-200' :
                log.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-200' :
                'bg-gray-800/50 border-gray-600 text-gray-300'
              )}
            >
              <span className="text-gray-500 font-bold opacity-60">[{log.timestamp}]</span>
              <span>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
