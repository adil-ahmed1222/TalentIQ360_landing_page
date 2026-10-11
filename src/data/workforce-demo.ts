export type DemoEmployee = {
  name: string;
  role: string;
  project: string;
  score: number;
  capacityPct: number;
  monthlyDone: readonly number[];
  tasksOpen: number;
};

export const DEMO_MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] as const;

/** Fictional people for the labeled demonstration. Monthly completions are the source of each person's task total. */
export const DEMO_EMPLOYEES: readonly DemoEmployee[] = [
  { name: 'Amina Rahman', role: 'Platform', project: 'Atlas', score: 84, capacityPct: 72, monthlyDone: [2, 3, 3, 3, 4, 3], tasksOpen: 3 },
  { name: 'Omar Haddad', role: 'Platform', project: 'Atlas', score: 79, capacityPct: 81, monthlyDone: [2, 2, 2, 3, 3, 3], tasksOpen: 5 },
  { name: 'Lina Costa', role: 'Product', project: 'Harbor', score: 88, capacityPct: 64, monthlyDone: [1, 2, 2, 2, 2, 3], tasksOpen: 2 },
  { name: 'Jonah Ellis', role: 'Delivery', project: 'Harbor', score: 73, capacityPct: 91, monthlyDone: [1, 1, 1, 2, 2, 2], tasksOpen: 6 },
  { name: 'Priya Shah', role: 'Data', project: 'Lumen', score: 91, capacityPct: 70, monthlyDone: [2, 3, 3, 3, 4, 5], tasksOpen: 2 },
  { name: 'Noah Keller', role: 'Data', project: 'Lumen', score: 77, capacityPct: 68, monthlyDone: [1, 1, 2, 2, 2, 3], tasksOpen: 4 },
  { name: 'Sara Nguyen', role: 'Design', project: 'Atlas', score: 82, capacityPct: 58, monthlyDone: [1, 1, 1, 1, 1, 3], tasksOpen: 1 },
  { name: 'Malik Okonkwo', role: 'Delivery', project: 'Harbor', score: 69, capacityPct: 86, monthlyDone: [2, 1, 1, 0, 0, 3], tasksOpen: 5 },
];

export type WorkforceStatus = 'LIVE DATA' | 'DEMO MODE' | 'PARTIALLY CONNECTED' | 'CONNECTION ERROR';

export function resolveWorkforceStatus(): WorkforceStatus {
  // No GitHub, Jira, or ClickUp client is configured in this app, so there is nothing live to query.
  return 'DEMO MODE';
}

function tasksDone(employee: DemoEmployee) {
  return employee.monthlyDone.reduce((sum, count) => sum + count, 0);
}

export function buildDemoOverview() {
  const employees = DEMO_EMPLOYEES.map((employee) => ({ ...employee, tasksDone: tasksDone(employee) }));
  const headcount = employees.length;
  const tasksCompleted = employees.reduce((sum, employee) => sum + employee.tasksDone, 0);
  const tasksPending = employees.reduce((sum, employee) => sum + employee.tasksOpen, 0);
  const averageScore = Math.round(employees.reduce((sum, employee) => sum + employee.score, 0) / headcount);
  const capacityPct = Math.round(employees.reduce((sum, employee) => sum + employee.capacityPct, 0) / headcount);
  const months = DEMO_MONTHS.map((month, index) => ({
    month,
    completed: employees.reduce((sum, employee) => sum + employee.monthlyDone[index], 0),
  }));
  const monthTotal = months.reduce((sum, month) => sum + month.completed, 0);
  if (monthTotal !== tasksCompleted) {
    throw new Error('Demonstration monthly totals do not match completed tasks.');
  }
  const projectNames = [...new Set(employees.map((employee) => employee.project))];
  const projects = projectNames.map((name) => {
    const members = employees.filter((employee) => employee.project === name);
    const done = members.reduce((sum, employee) => sum + employee.tasksDone, 0);
    const open = members.reduce((sum, employee) => sum + employee.tasksOpen, 0);
    const total = done + open;
    return { name, people: members.length, done, open, progressPct: Math.round((done / total) * 100) };
  });
  const ranked = [...employees].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return {
    organization: 'Demonstration organization',
    period: 'May–Oct 2026',
    source: 'Demonstration dataset',
    headcount,
    active: headcount,
    averageScore,
    capacityPct,
    tasksCompleted,
    tasksPending,
    months,
    maxMonth: Math.max(...months.map((month) => month.completed)),
    projects,
    ranked,
    employees,
  };
}
