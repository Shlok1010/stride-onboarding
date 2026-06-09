import { Compass } from 'lucide-react';

export default function HRCompassButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-3 shadow-lift transition-all hover:shadow-glow"
    >
      <Compass className="w-5 h-5" />
      <span className="text-sm font-medium">HR Compass</span>
    </button>
  );
}
