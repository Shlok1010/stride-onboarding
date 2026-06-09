export const pulseData = [
  // EMP-001 Marcus Reid — 1 week, trending up
  {
    employeeId: "EMP-001",
    week: 1,
    date: "2026-06-06",
    scores: { connected: 7, clarity: 8, supported: 9 },
    avgScore: 8.0,
    note: "Still learning the floor layout but team has been super welcoming. Linda has been great at answering my questions.",
  },

  // EMP-002 Priya Nair — 3 weeks, strong positive trend
  {
    employeeId: "EMP-002",
    week: 1,
    date: "2026-05-23",
    scores: { connected: 6, clarity: 7, supported: 7 },
    avgScore: 6.7,
    note: "Good first week. Still getting my footing. Lots of new faces and systems to learn.",
  },
  {
    employeeId: "EMP-002",
    week: 2,
    date: "2026-05-30",
    scores: { connected: 7, clarity: 8, supported: 8 },
    avgScore: 7.7,
    note: "Starting to feel more comfortable. Chris has been incredibly helpful with the finance processes.",
  },
  {
    employeeId: "EMP-002",
    week: 3,
    date: "2026-06-06",
    scores: { connected: 9, clarity: 9, supported: 9 },
    avgScore: 9.0,
    note: "Really feel like part of the team now. Had a great skip-level with Sandra. Excited about the HRIS project.",
  },

  // EMP-003 Derek Thompson — 1 week, concerning low score (at-risk)
  {
    employeeId: "EMP-003",
    week: 1,
    date: "2026-06-06",
    scores: { connected: 4, clarity: 6, supported: 5 },
    avgScore: 5.0,
    note: "It's a lot to take in. The floor moves fast and I'm not sure I fully understand what I'm supposed to be doing yet.",
  },

  // EMP-004 Sofia Reyes — 5 weeks, excellent trend
  {
    employeeId: "EMP-004",
    week: 1,
    date: "2026-05-09",
    scores: { connected: 7, clarity: 7, supported: 7 },
    avgScore: 7.0,
    note: "Solid first week. ISO processes here are different from aerospace but the principles transfer well.",
  },
  {
    employeeId: "EMP-004",
    week: 2,
    date: "2026-05-16",
    scores: { connected: 7, clarity: 8, supported: 8 },
    avgScore: 7.7,
    note: "Getting into the rhythm. Love the detail orientation of this team.",
  },
  {
    employeeId: "EMP-004",
    week: 3,
    date: "2026-05-23",
    scores: { connected: 8, clarity: 8, supported: 9 },
    avgScore: 8.3,
    note: "Really appreciated the 30-day review with Linda. Clear direction for the next phase.",
  },
  {
    employeeId: "EMP-004",
    week: 4,
    date: "2026-05-30",
    scores: { connected: 8, clarity: 9, supported: 9 },
    avgScore: 8.7,
    note: "Led my first NCR investigation this week. Felt genuinely useful.",
  },
  {
    employeeId: "EMP-004",
    week: 5,
    date: "2026-06-06",
    scores: { connected: 9, clarity: 9, supported: 9 },
    avgScore: 9.0,
    note: "Thriving. Tom introduced me to the supplier audit team. Great connection.",
  },

  // EMP-006 Lisa Chen — 7 weeks, completed, peaked at 9.3
  {
    employeeId: "EMP-006",
    week: 1,
    date: "2026-04-25",
    scores: { connected: 7, clarity: 8, supported: 8 },
    avgScore: 7.7,
    note: "Strong start. The ERP system is more complex than Deloitte's but the team is patient.",
  },
  {
    employeeId: "EMP-006",
    week: 2,
    date: "2026-05-02",
    scores: { connected: 8, clarity: 8, supported: 8 },
    avgScore: 8.0,
    note: "Got my first expense reimbursement through Concur. System works smoothly.",
  },
  {
    employeeId: "EMP-006",
    week: 3,
    date: "2026-05-09",
    scores: { connected: 8, clarity: 9, supported: 9 },
    avgScore: 8.7,
    note: "Closed my first month-end on time. Sandra gave great feedback.",
  },
  {
    employeeId: "EMP-006",
    week: 4,
    date: "2026-05-16",
    scores: { connected: 9, clarity: 9, supported: 9 },
    avgScore: 9.0,
    note: "Starting to own forecasting analysis. This is exactly the in-house role I wanted.",
  },
  {
    employeeId: "EMP-006",
    week: 5,
    date: "2026-05-23",
    scores: { connected: 9, clarity: 10, supported: 9 },
    avgScore: 9.3,
    note: "Presented variance analysis to leadership. Received great feedback. Loving this.",
  },
  {
    employeeId: "EMP-006",
    week: 6,
    date: "2026-05-30",
    scores: { connected: 9, clarity: 10, supported: 9 },
    avgScore: 9.3,
    note: "401k enrolled at Fidelity. Benefits are excellent. Fully settled.",
  },
  {
    employeeId: "EMP-006",
    week: 7,
    date: "2026-06-06",
    scores: { connected: 9, clarity: 10, supported: 9 },
    avgScore: 9.3,
    note: "Onboarding complete! Proud of where I am after 7 weeks.",
  },

  // EMP-007 Andre Williams — 2 weeks, flat
  {
    employeeId: "EMP-007",
    week: 1,
    date: "2026-05-30",
    scores: { connected: 7, clarity: 7, supported: 7 },
    avgScore: 7.0,
    note: "Good first week. Safety culture here is serious — I appreciate that. Getting oriented.",
  },
  {
    employeeId: "EMP-007",
    week: 2,
    date: "2026-06-06",
    scores: { connected: 7, clarity: 7, supported: 8 },
    avgScore: 7.3,
    note: "Making steady progress. Still figuring out which safety programs are mine to own vs. shared with operations.",
  },

  // EMP-008 Maya Patel — 1 week, good
  {
    employeeId: "EMP-008",
    week: 1,
    date: "2026-06-06",
    scores: { connected: 8, clarity: 8, supported: 8 },
    avgScore: 8.0,
    note: "Great first week. The automotive supply chain background translates well here. Meeting the vendors next week!",
  },
];

export const getPulseForEmployee = (employeeId) =>
  pulseData.filter(p => p.employeeId === employeeId).sort((a, b) => a.week - b.week);

export const getLatestPulse = (employeeId) => {
  const history = getPulseForEmployee(employeeId);
  return history[history.length - 1] || null;
};
