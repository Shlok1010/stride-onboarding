const phaseColors = {
  preboarding: 'bg-purple-50 text-purple-700 border border-purple-200',
  day1:        'bg-blue-50 text-blue-700 border border-blue-200',
  first30:     'bg-teal-50 text-teal-700 border border-teal-200',
  days31to60:  'bg-amber-50 text-amber-700 border border-amber-200',
  days61to90:  'bg-green-50 text-green-700 border border-green-200',
  complete:    'bg-gray-50 text-gray-600 border border-gray-200',
};

const phaseLabels = {
  preboarding: 'Pre-boarding',
  day1:        'Day 1',
  first30:     'First 30 Days',
  days31to60:  'Days 31–60',
  days61to90:  'Days 61–90',
  complete:    'Complete',
};

const categoryColors = {
  compliance: 'bg-red-50 text-red-700 border border-red-200',
  it:         'bg-blue-50 text-blue-700 border border-blue-200',
  culture:    'bg-pink-50 text-pink-700 border border-pink-200',
  training:   'bg-indigo-50 text-indigo-700 border border-indigo-200',
  admin:      'bg-gray-50 text-gray-600 border border-gray-200',
  social:     'bg-teal-50 text-teal-700 border border-teal-200',
};

export function PhaseBadge({ phase, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${phaseColors[phase] || phaseColors.preboarding} ${className}`}>
      {phaseLabels[phase] || phase}
    </span>
  );
}

export function CategoryBadge({ category, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[category] || categoryColors.admin} ${className}`}>
      {category}
    </span>
  );
}

export function RiskBadge({ score }) {
  const map = {
    1: 'bg-green-50 text-green-700 border border-green-200',
    2: 'bg-amber-50 text-amber-700 border border-amber-200',
    3: 'bg-red-50 text-red-700 border border-red-200',
  };
  const labels = { 1: 'Low Risk', 2: 'Medium Risk', 3: 'At Risk' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[score] || map[1]}`}>
      {labels[score] || 'Unknown'}
    </span>
  );
}
