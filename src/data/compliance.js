// Compliance deadlines are hand-authored per hire, mirroring the legal
// requirements covered in src/lib/hrCompassContext.js so the two features
// read as connected rather than bolted on.
export const complianceItems = [
  // EMP-001 Marcus Reid — started 2026-06-02, day 6 — all current
  { id: 'CMP-001', employeeId: 'EMP-001', item: 'Form I-9 Section 2', dueDate: '2026-06-05', status: 'complete', source: 'Federal Law', note: 'Verified by Priya Nair on Day 3.' },
  { id: 'CMP-002', employeeId: 'EMP-001', item: 'E-Verify Case Creation', dueDate: '2026-06-05', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-003', employeeId: 'EMP-001', item: 'Federal W-4', dueDate: '2026-06-02', status: 'complete', source: 'Payroll' },
  { id: 'CMP-004', employeeId: 'EMP-001', item: 'Arizona Form A-4', dueDate: '2026-06-02', status: 'complete', source: 'Arizona State Law' },

  // EMP-002 Priya Nair — started 2026-05-19, day 20 — all current
  { id: 'CMP-005', employeeId: 'EMP-002', item: 'Form I-9 Section 2', dueDate: '2026-05-22', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-006', employeeId: 'EMP-002', item: 'E-Verify Case Creation', dueDate: '2026-05-22', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-007', employeeId: 'EMP-002', item: 'Federal W-4', dueDate: '2026-05-19', status: 'complete', source: 'Payroll' },
  { id: 'CMP-008', employeeId: 'EMP-002', item: 'Arizona Form A-4', dueDate: '2026-05-19', status: 'complete', source: 'Arizona State Law' },

  // EMP-003 Derek Thompson — started 2026-06-02, day 6 — overdue I-9/E-Verify, reinforces his at-risk story
  { id: 'CMP-009', employeeId: 'EMP-003', item: 'Form I-9 Section 2', dueDate: '2026-06-05', status: 'overdue', source: 'Federal Law', note: 'Not yet verified — 4 days past deadline. Federal penalties apply for late I-9 verification.' },
  { id: 'CMP-010', employeeId: 'EMP-003', item: 'E-Verify Case Creation', dueDate: '2026-06-05', status: 'overdue', source: 'Federal Law', note: 'Blocked until I-9 Section 2 is complete.' },
  { id: 'CMP-011', employeeId: 'EMP-003', item: 'Federal W-4', dueDate: '2026-06-02', status: 'complete', source: 'Payroll' },
  { id: 'CMP-012', employeeId: 'EMP-003', item: 'Arizona Form A-4', dueDate: '2026-06-02', status: 'complete', source: 'Arizona State Law' },

  // EMP-004 Sofia Reyes — started 2026-05-05, day 34 — all current
  { id: 'CMP-013', employeeId: 'EMP-004', item: 'Form I-9 Section 2', dueDate: '2026-05-08', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-014', employeeId: 'EMP-004', item: 'E-Verify Case Creation', dueDate: '2026-05-08', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-015', employeeId: 'EMP-004', item: 'Federal W-4', dueDate: '2026-05-05', status: 'complete', source: 'Payroll' },
  { id: 'CMP-016', employeeId: 'EMP-004', item: 'Arizona Form A-4', dueDate: '2026-05-05', status: 'complete', source: 'Arizona State Law' },

  // EMP-005 James Okonkwo — starts 2026-06-09 (today), preboarding — upcoming items
  { id: 'CMP-017', employeeId: 'EMP-005', item: 'Form I-9 Section 2', dueDate: '2026-06-12', status: 'due-soon', source: 'Federal Law', note: 'Must be completed within 3 business days of start.' },
  { id: 'CMP-018', employeeId: 'EMP-005', item: 'E-Verify Case Creation', dueDate: '2026-06-12', status: 'upcoming', source: 'Federal Law' },
  { id: 'CMP-019', employeeId: 'EMP-005', item: 'Federal W-4', dueDate: '2026-06-09', status: 'due-soon', source: 'Payroll' },
  { id: 'CMP-020', employeeId: 'EMP-005', item: 'Arizona Form A-4', dueDate: '2026-06-09', status: 'due-soon', source: 'Arizona State Law' },

  // EMP-006 Lisa Chen — complete phase — all current
  { id: 'CMP-021', employeeId: 'EMP-006', item: 'Form I-9 Section 2', dueDate: '2026-04-24', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-022', employeeId: 'EMP-006', item: 'E-Verify Case Creation', dueDate: '2026-04-24', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-023', employeeId: 'EMP-006', item: 'Federal W-4', dueDate: '2026-04-21', status: 'complete', source: 'Payroll' },
  { id: 'CMP-024', employeeId: 'EMP-006', item: 'Arizona Form A-4', dueDate: '2026-04-21', status: 'complete', source: 'Arizona State Law' },

  // EMP-007 Andre Williams — started 2026-05-27, day 12 — one due-soon item for texture
  { id: 'CMP-025', employeeId: 'EMP-007', item: 'Form I-9 Section 2', dueDate: '2026-05-30', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-026', employeeId: 'EMP-007', item: 'E-Verify Case Creation', dueDate: '2026-05-30', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-027', employeeId: 'EMP-007', item: 'Federal W-4', dueDate: '2026-05-27', status: 'complete', source: 'Payroll' },
  { id: 'CMP-028', employeeId: 'EMP-007', item: 'OSHA 30 Recertification', dueDate: '2026-06-13', status: 'due-soon', source: 'Arizona State Law', note: 'Safety Coordinator role requires current certification on file.' },

  // EMP-008 Maya Patel — started 2026-06-02, day 6 — all current
  { id: 'CMP-029', employeeId: 'EMP-008', item: 'Form I-9 Section 2', dueDate: '2026-06-05', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-030', employeeId: 'EMP-008', item: 'E-Verify Case Creation', dueDate: '2026-06-05', status: 'complete', source: 'Federal Law' },
  { id: 'CMP-031', employeeId: 'EMP-008', item: 'Federal W-4', dueDate: '2026-06-02', status: 'complete', source: 'Payroll' },
  { id: 'CMP-032', employeeId: 'EMP-008', item: 'Arizona Form A-4', dueDate: '2026-06-02', status: 'complete', source: 'Arizona State Law' },
];

export function getComplianceForEmployee(employeeId) {
  return complianceItems.filter((c) => c.employeeId === employeeId);
}

export function getFlaggedCompliance() {
  return complianceItems.filter((c) => c.status === 'overdue' || c.status === 'due-soon');
}
