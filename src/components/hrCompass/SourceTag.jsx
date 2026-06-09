const sourceColors = {
  'Federal Law':       'bg-blue-50 text-blue-700 border border-blue-200',
  'Arizona State Law': 'bg-orange-50 text-orange-700 border border-orange-200',
  'Company Policy':    'bg-purple-50 text-purple-700 border border-purple-200',
  'Benefits':          'bg-green-50 text-green-700 border border-green-200',
  'Payroll':           'bg-amber-50 text-amber-700 border border-amber-200',
  'Onboarding':        'bg-teal-50 text-teal-700 border border-teal-200',
};

export default function SourceTag({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {sources.map((src) => (
        <span
          key={src}
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${sourceColors[src.trim()] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}
        >
          {src.trim()}
        </span>
      ))}
    </div>
  );
}

export function parseSourceFromText(text) {
  const match = text.match(/SOURCE:\s*(.+)$/m);
  if (!match) return { cleanText: text, sources: [] };

  const sources = match[1].split(',').map((s) => s.trim()).filter(Boolean);
  const cleanText = text.replace(/SOURCE:\s*.+$/m, '').trim();
  return { cleanText, sources };
}
