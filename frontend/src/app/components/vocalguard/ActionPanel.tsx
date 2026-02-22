import { motion } from 'motion/react';
import { FileText, Flag } from 'lucide-react';

interface ActionPanelProps {
  onExport: () => void;
  onMarker: () => void;
}

export function ActionPanel({ onExport, onMarker }: ActionPanelProps) {
  return (
    <div className="bg-[#1E1E1E] rounded-lg border border-gray-800 p-4 font-mono text-sm space-y-4">
      <h3 className="text-gray-400 font-bold uppercase mb-2 tracking-wider">Session Actions</h3>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onExport}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-gray-200 transition-colors"
      >
        <FileText size={16} />
        Export Session Log
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onMarker}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500 text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <Flag size={16} />
        Add Marker
      </motion.button>
    </div>
  );
}
