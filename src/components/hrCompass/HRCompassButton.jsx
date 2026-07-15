import { Compass } from 'lucide-react';

export default function HRCompassButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 text-white px-4 py-3 shadow-[0_1px_2px_rgb(6_95_70/0.4),inset_0_1px_0_rgb(255_255_255/0.2)] transition-all hover:shadow-glow hover:-translate-y-0.5"
    >
      <Compass className="w-5 h-5" />
      <span className="text-sm font-medium">HR Compass</span>
    </button>
  );
}
