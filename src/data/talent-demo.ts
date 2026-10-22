export const DEMO_SOURCE = "Demonstration dataset";

export type DemoDepartment = {
  id: string;
  name: string;
  shortName: string;
  headcount: number;
  highPerformers: number;
  promotionReady: number;
  mobility: number;
  flightRisk: number;
  averageScore: number;
  skillsCoverage: number;
  capacityPct: number;
  deliveryPct: number;
};

export type DemoTeam = {
  id: string;
  departmentId: string;
  name: string;
  headcount: number;
};

export type DemoProject = {
  id: string;
  name: string;
  departmentId: string;
  headcount: number;
  deliveryPct: number;
  openRoles: number;
};

export type DemoPerson = {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  teamId: string;
  projectId: string;
  score: number;
  skillsCoverage: number;
  capacityPct: number;
  promotionReady: boolean;
  internalMobility: boolean;
  flightRisk: boolean;
  nextAction: string;
};

export type DemoOpening = {
  id: string;
  title: string;
  departmentId: string;
  projectId: string;
};

export type DemoCandidate = {
  id: string;
  name: string;
  title: string;
  openingId: string;
  stage: "Applied" | "Screen" | "Interview" | "Offer" | "Hired";
  score: number | null;
};

export type DemoUser = {
  id: string;
  name: string;
  role: string;
  email: string;
};

const DEPARTMENTS: readonly DemoDepartment[] = [
  {
    id: "engineering",
    name: "Engineering",
    shortName: "Engineering",
    headcount: 92,
    highPerformers: 16,
    promotionReady: 7,
    mobility: 9,
    flightRisk: 2,
    averageScore: 88,
    skillsCoverage: 86,
    capacityPct: 86,
    deliveryPct: 81,
  },
  {
    id: "sales",
    name: "Sales",
    shortName: "Sales",
    headcount: 48,
    highPerformers: 8,
    promotionReady: 4,
    mobility: 5,
    flightRisk: 2,
    averageScore: 84,
    skillsCoverage: 74,
    capacityPct: 91,
    deliveryPct: 76,
  },
  {
    id: "marketing",
    name: "Marketing",
    shortName: "Marketing",
    headcount: 28,
    highPerformers: 4,
    promotionReady: 2,
    mobility: 3,
    flightRisk: 1,
    averageScore: 87,
    skillsCoverage: 80,
    capacityPct: 78,
    deliveryPct: 83,
  },
  {
    id: "hr",
    name: "Human Resources",
    shortName: "HR",
    headcount: 18,
    highPerformers: 2,
    promotionReady: 1,
    mobility: 2,
    flightRisk: 0,
    averageScore: 90,
    skillsCoverage: 88,
    capacityPct: 72,
    deliveryPct: 79,
  },
  {
    id: "operations",
    name: "Operations",
    shortName: "Operations",
    headcount: 36,
    highPerformers: 4,
    promotionReady: 3,
    mobility: 3,
    flightRisk: 2,
    averageScore: 82,
    skillsCoverage: 77,
    capacityPct: 94,
    deliveryPct: 88,
  },
  {
    id: "finance",
    name: "Finance",
    shortName: "Finance",
    headcount: 26,
    highPerformers: 2,
    promotionReady: 1,
    mobility: 2,
    flightRisk: 0,
    averageScore: 90,
    skillsCoverage: 85,
    capacityPct: 80,
    deliveryPct: 91,
  },
];

const TEAMS: readonly DemoTeam[] = [
  { id: "eng-platform", departmentId: "engineering", name: "Platform", headcount: 34 },
  { id: "eng-product", departmentId: "engineering", name: "Product", headcount: 28 },
  { id: "eng-data", departmentId: "engineering", name: "Data", headcount: 30 },
  { id: "sales-enterprise", departmentId: "sales", name: "Enterprise", headcount: 22 },
  { id: "sales-commercial", departmentId: "sales", name: "Commercial", headcount: 26 },
  { id: "mkt-brand", departmentId: "marketing", name: "Brand", headcount: 12 },
  { id: "mkt-growth", departmentId: "marketing", name: "Growth", headcount: 16 },
  { id: "hr-people", departmentId: "hr", name: "People operations", headcount: 18 },
  { id: "ops-delivery", departmentId: "operations", name: "Delivery", headcount: 20 },
  { id: "ops-support", departmentId: "operations", name: "Support", headcount: 16 },
  { id: "fin-control", departmentId: "finance", name: "Control", headcount: 14 },
  { id: "fin-planning", departmentId: "finance", name: "Planning", headcount: 12 },
];

const PROJECTS: readonly DemoProject[] = [
  {
    id: "atlas",
    name: "Atlas",
    departmentId: "engineering",
    headcount: 41,
    deliveryPct: 82,
    openRoles: 2,
  },
  {
    id: "lumen",
    name: "Lumen",
    departmentId: "engineering",
    headcount: 18,
    deliveryPct: 84,
    openRoles: 0,
  },
  {
    id: "northstar",
    name: "Northstar",
    departmentId: "sales",
    headcount: 16,
    deliveryPct: 74,
    openRoles: 1,
  },
  {
    id: "signal",
    name: "Signal",
    departmentId: "marketing",
    headcount: 10,
    deliveryPct: 80,
    openRoles: 0,
  },
  {
    id: "compass",
    name: "Compass",
    departmentId: "hr",
    headcount: 6,
    deliveryPct: 77,
    openRoles: 1,
  },
  {
    id: "harbor",
    name: "Harbor",
    departmentId: "operations",
    headcount: 22,
    deliveryPct: 68,
    openRoles: 1,
  },
  {
    id: "ledger",
    name: "Ledger",
    departmentId: "finance",
    headcount: 12,
    deliveryPct: 91,
    openRoles: 0,
  },
];

const PEOPLE: readonly DemoPerson[] = [
  {
    id: "emp-priya",
    name: "Priya Shah",
    title: "Data Lead",
    departmentId: "engineering",
    teamId: "eng-data",
    projectId: "lumen",
    score: 94,
    skillsCoverage: 91,
    capacityPct: 70,
    promotionReady: true,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Sponsor a staff-level scope review",
  },
  {
    id: "emp-sara",
    name: "Sara Nguyen",
    title: "Brand Lead",
    departmentId: "marketing",
    teamId: "mkt-brand",
    projectId: "signal",
    score: 93,
    skillsCoverage: 90,
    capacityPct: 58,
    promotionReady: true,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Discuss marketing leadership scope",
  },
  {
    id: "emp-lina",
    name: "Lina Costa",
    title: "Product Manager",
    departmentId: "engineering",
    teamId: "eng-product",
    projectId: "atlas",
    score: 92,
    skillsCoverage: 88,
    capacityPct: 64,
    promotionReady: true,
    internalMobility: true,
    flightRisk: false,
    nextAction: "Review product leadership scope",
  },
  {
    id: "emp-hana",
    name: "Hana Idris",
    title: "People Partner",
    departmentId: "hr",
    teamId: "hr-people",
    projectId: "compass",
    score: 91,
    skillsCoverage: 89,
    capacityPct: 66,
    promotionReady: true,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Lead the next hiring calibration",
  },
  {
    id: "emp-omar",
    name: "Omar Haddad",
    title: "Account Executive",
    departmentId: "sales",
    teamId: "sales-enterprise",
    projectId: "northstar",
    score: 91,
    skillsCoverage: 76,
    capacityPct: 81,
    promotionReady: false,
    internalMobility: true,
    flightRisk: false,
    nextAction: "Pair with a solutions partner on the next pursuit",
  },
  {
    id: "emp-amina",
    name: "Amina Rahman",
    title: "Platform Engineer",
    departmentId: "engineering",
    teamId: "eng-platform",
    projectId: "atlas",
    score: 90,
    skillsCoverage: 87,
    capacityPct: 72,
    promotionReady: false,
    internalMobility: true,
    flightRisk: false,
    nextAction: "Invite to a cross-team design review",
  },
  {
    id: "emp-noah",
    name: "Noah Keller",
    title: "Finance Partner",
    departmentId: "finance",
    teamId: "fin-planning",
    projectId: "ledger",
    score: 90,
    skillsCoverage: 86,
    capacityPct: 68,
    promotionReady: false,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Keep on the current planning cycle",
  },
  {
    id: "emp-elena",
    name: "Elena Voss",
    title: "Controller",
    departmentId: "finance",
    teamId: "fin-control",
    projectId: "ledger",
    score: 88,
    skillsCoverage: 84,
    capacityPct: 80,
    promotionReady: false,
    internalMobility: false,
    flightRisk: false,
    nextAction: "No scope change this cycle",
  },
  {
    id: "emp-yusuf",
    name: "Yusuf Rahman",
    title: "Solutions Engineer",
    departmentId: "engineering",
    teamId: "eng-platform",
    projectId: "atlas",
    score: 86,
    skillsCoverage: 83,
    capacityPct: 74,
    promotionReady: false,
    internalMobility: true,
    flightRisk: false,
    nextAction: "Match to the Atlas platform work",
  },
  {
    id: "emp-ravi",
    name: "Ravi Menon",
    title: "Growth Manager",
    departmentId: "marketing",
    teamId: "mkt-growth",
    projectId: "signal",
    score: 85,
    skillsCoverage: 81,
    capacityPct: 77,
    promotionReady: false,
    internalMobility: true,
    flightRisk: false,
    nextAction: "Consider a short sales rotation",
  },
  {
    id: "emp-farah",
    name: "Farah Nasser",
    title: "Recruiter",
    departmentId: "hr",
    teamId: "hr-people",
    projectId: "compass",
    score: 84,
    skillsCoverage: 86,
    capacityPct: 71,
    promotionReady: false,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Support the senior engineering search",
  },
  {
    id: "emp-chloe",
    name: "Chloe Park",
    title: "Enterprise Seller",
    departmentId: "sales",
    teamId: "sales-enterprise",
    projectId: "northstar",
    score: 83,
    skillsCoverage: 72,
    capacityPct: 88,
    promotionReady: false,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Coach discovery calls",
  },
  {
    id: "emp-ingrid",
    name: "Ingrid Solberg",
    title: "Commercial Lead",
    departmentId: "sales",
    teamId: "sales-commercial",
    projectId: "northstar",
    score: 80,
    skillsCoverage: 70,
    capacityPct: 84,
    promotionReady: false,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Review the commercial pipeline",
  },
  {
    id: "emp-tomasz",
    name: "Tomasz Wojcik",
    title: "Operations Analyst",
    departmentId: "operations",
    teamId: "ops-delivery",
    projectId: "harbor",
    score: 78,
    skillsCoverage: 75,
    capacityPct: 73,
    promotionReady: false,
    internalMobility: false,
    flightRisk: false,
    nextAction: "Shadow the Harbor retrospective",
  },
  {
    id: "emp-malik",
    name: "Malik Okonkwo",
    title: "Support Lead",
    departmentId: "operations",
    teamId: "ops-support",
    projectId: "harbor",
    score: 74,
    skillsCoverage: 68,
    capacityPct: 86,
    promotionReady: false,
    internalMobility: false,
    flightRisk: true,
    nextAction: "Review after-hours load with the manager",
  },
  {
    id: "emp-jonah",
    name: "Jonah Ellis",
    title: "Delivery Manager",
    departmentId: "operations",
    teamId: "ops-delivery",
    projectId: "harbor",
    score: 72,
    skillsCoverage: 70,
    capacityPct: 91,
    promotionReady: false,
    internalMobility: false,
    flightRisk: true,
    nextAction: "Manager check-in on workload",
  },
];

const OPENINGS: readonly DemoOpening[] = [
  {
    id: "job-senior-eng",
    title: "Senior Engineer",
    departmentId: "engineering",
    projectId: "atlas",
  },
  {
    id: "job-platform",
    title: "Platform Engineer",
    departmentId: "engineering",
    projectId: "atlas",
  },
  {
    id: "job-support",
    title: "Support Specialist",
    departmentId: "operations",
    projectId: "harbor",
  },
  { id: "job-ae", title: "Account Executive", departmentId: "sales", projectId: "northstar" },
  { id: "job-people", title: "People Partner", departmentId: "hr", projectId: "compass" },
];

const CANDIDATES: readonly DemoCandidate[] = [
  {
    id: "can-mei",
    name: "Mei Lin",
    title: "Product Designer",
    openingId: "job-platform",
    stage: "Applied",
    score: null,
  },
  {
    id: "can-ivan",
    name: "Ivan Petrov",
    title: "Data Analyst",
    openingId: "job-senior-eng",
    stage: "Applied",
    score: null,
  },
  {
    id: "can-amira",
    name: "Amira Saleh",
    title: "Marketing Manager",
    openingId: "job-ae",
    stage: "Applied",
    score: null,
  },
  {
    id: "can-rosa",
    name: "Rosa Alvarez",
    title: "Commercial Associate",
    openingId: "job-ae",
    stage: "Applied",
    score: null,
  },
  {
    id: "can-chris",
    name: "Chris Adeyemi",
    title: "Senior Engineer",
    openingId: "job-senior-eng",
    stage: "Screen",
    score: 81,
  },
  {
    id: "can-helena",
    name: "Helena Costa",
    title: "Finance Analyst",
    openingId: "job-ae",
    stage: "Screen",
    score: 76,
  },
  {
    id: "can-daniel",
    name: "Daniel Okeke",
    title: "Engineering Manager",
    openingId: "job-senior-eng",
    stage: "Screen",
    score: 84,
  },
  {
    id: "can-leila",
    name: "Leila Haddad",
    title: "Senior Engineer",
    openingId: "job-senior-eng",
    stage: "Interview",
    score: 88,
  },
  {
    id: "can-owen",
    name: "Owen Blake",
    title: "Support Specialist",
    openingId: "job-support",
    stage: "Interview",
    score: 74,
  },
  {
    id: "can-kenji",
    name: "Kenji Sato",
    title: "Platform Engineer",
    openingId: "job-platform",
    stage: "Interview",
    score: 86,
  },
  {
    id: "can-samir",
    name: "Samir Qureshi",
    title: "Account Executive",
    openingId: "job-ae",
    stage: "Offer",
    score: 83,
  },
  {
    id: "can-nora",
    name: "Nora Berg",
    title: "People Partner",
    openingId: "job-people",
    stage: "Hired",
    score: 85,
  },
];

const USERS: readonly DemoUser[] = [
  { id: "user-avery", name: "Avery Cole", role: "Demo admin", email: "avery.cole@example.com" },
  {
    id: "user-quinn",
    name: "Quinn Adeyemi",
    role: "Demo analyst",
    email: "quinn.adeyemi@example.com",
  },
  {
    id: "user-noor",
    name: "Noor El-Sayed",
    role: "Demo recruiter",
    email: "noor.elsayed@example.com",
  },
];

const SCORE_BANDS = [
  { id: "band-90", label: "90–100", count: 36 },
  { id: "band-80", label: "80–89", count: 148 },
  { id: "band-70", label: "70–79", count: 57 },
  { id: "band-low", label: "Below 70", count: 7 },
] as const;

const CAPACITY_TREND = [
  { month: "May", capacityPct: 78 },
  { month: "Jun", capacityPct: 80 },
  { month: "Jul", capacityPct: 82 },
  { month: "Aug", capacityPct: 83 },
  { month: "Sep", capacityPct: 85 },
  { month: "Oct", capacityPct: 86 },
] as const;

export const DEMO_PROMPTS = [
  "Find our highest-performing employees.",
  "Identify employees ready for promotion.",
  "Compare candidates for a senior engineering role.",
  "Analyze skills gaps across departments.",
  "Recommend employees for an upcoming project.",
  "Identify workforce retention risks.",
  "Summarize department performance.",
  "Find employees with skills matching a project.",
] as const;

export const PIPELINE_STAGES = ["Applied", "Screen", "Interview", "Offer", "Hired"] as const;

export const DEMO_INTEGRATIONS = [
  { id: "github", name: "GitHub", state: "disconnected" },
  { id: "jira", name: "Jira", state: "disconnected" },
  { id: "clickup", name: "ClickUp", state: "disconnected" },
  { id: "excel", name: "Excel", state: "disconnected" },
  { id: "linkedin", name: "LinkedIn", state: "disconnected" },
  { id: "slack", name: "Slack", state: "unavailable" },
] as const;

function sumBy<T>(items: readonly T[], read: (item: T) => number) {
  return items.reduce((sum, item) => sum + read(item), 0);
}

function weighted(items: readonly DemoDepartment[], read: (item: DemoDepartment) => number) {
  const headcount = sumBy(items, (item) => item.headcount);
  return Math.round(sumBy(items, (item) => item.headcount * read(item)) / headcount);
}

function must<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Missing demonstration record: ${label}`);
  return value;
}

function buildTalentDemo() {
  const headcount = sumBy(DEPARTMENTS, (item) => item.headcount);
  const highPerformers = sumBy(DEPARTMENTS, (item) => item.highPerformers);
  const promotionReady = sumBy(DEPARTMENTS, (item) => item.promotionReady);
  const mobility = sumBy(DEPARTMENTS, (item) => item.mobility);
  const flightRisk = sumBy(DEPARTMENTS, (item) => item.flightRisk);
  const averageScore = weighted(DEPARTMENTS, (item) => item.averageScore);
  const skillsCoverage = weighted(DEPARTMENTS, (item) => item.skillsCoverage);
  const capacityPct = weighted(DEPARTMENTS, (item) => item.capacityPct);
  const departmentById = new Map(DEPARTMENTS.map((item) => [item.id, item]));
  const teamById = new Map(TEAMS.map((item) => [item.id, item]));
  const projectById = new Map(PROJECTS.map((item) => [item.id, item]));
  const openingById = new Map(OPENINGS.map((item) => [item.id, item]));

  for (const team of TEAMS) must(departmentById.get(team.departmentId), team.departmentId);
  for (const project of PROJECTS)
    must(departmentById.get(project.departmentId), project.departmentId);
  for (const person of PEOPLE) {
    const team = must(teamById.get(person.teamId), person.teamId);
    const project = must(projectById.get(person.projectId), person.projectId);
    if (team.departmentId !== person.departmentId || project.departmentId !== person.departmentId) {
      throw new Error(`${person.name} is linked outside their department.`);
    }
  }
  for (const opening of OPENINGS) {
    const project = must(projectById.get(opening.projectId), opening.projectId);
    if (project.departmentId !== opening.departmentId)
      throw new Error(`${opening.title} is linked outside its department.`);
  }
  for (const candidate of CANDIDATES)
    must(openingById.get(candidate.openingId), candidate.openingId);

  for (const department of DEPARTMENTS) {
    const teams = TEAMS.filter((team) => team.departmentId === department.id);
    if (sumBy(teams, (team) => team.headcount) !== department.headcount) {
      throw new Error(`${department.name} team headcount does not match the department.`);
    }
    const namedHigh = PEOPLE.filter(
      (person) => person.departmentId === department.id && person.score >= 90,
    ).length;
    const namedPromo = PEOPLE.filter(
      (person) => person.departmentId === department.id && person.promotionReady,
    ).length;
    const namedFlight = PEOPLE.filter(
      (person) => person.departmentId === department.id && person.flightRisk,
    ).length;
    if (
      namedHigh > department.highPerformers ||
      namedPromo > department.promotionReady ||
      namedFlight > department.flightRisk
    ) {
      throw new Error(`${department.name} sample profiles exceed the department totals.`);
    }
  }

  for (const department of DEPARTMENTS) {
    const assigned = sumBy(
      PROJECTS.filter((project) => project.departmentId === department.id),
      (project) => project.headcount,
    );
    if (assigned > department.headcount)
      throw new Error(`${department.name} projects exceed department headcount.`);
  }

  if (sumBy(PROJECTS, (project) => project.openRoles) !== OPENINGS.length) {
    throw new Error("Open roles do not match the demonstration openings.");
  }
  if (sumBy(PROJECTS, (project) => project.headcount) > headcount) {
    throw new Error("Project staffing exceeds the demonstration organization.");
  }
  if (
    sumBy(SCORE_BANDS, (band) => band.count) !== headcount ||
    SCORE_BANDS[0]?.count !== highPerformers
  ) {
    throw new Error("Score bands do not match the demonstration organization.");
  }
  const latestCapacity = CAPACITY_TREND[CAPACITY_TREND.length - 1];
  if (!latestCapacity || latestCapacity.capacityPct !== capacityPct) {
    throw new Error("Capacity trend does not end on the current utilization.");
  }

  const kpis = {
    headcount,
    active: headcount,
    highPerformers,
    promotionReady,
    mobility,
    flightRisk,
    averageScore,
    skillsCoverage,
    capacityPct,
  };
  const expected = {
    headcount: 248,
    active: 248,
    highPerformers: 36,
    promotionReady: 18,
    mobility: 24,
    flightRisk: 7,
    averageScore: 87,
    skillsCoverage: 82,
    capacityPct: 86,
  };
  for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
    if (kpis[key] !== expected[key])
      throw new Error(`Demonstration ${key} is ${kpis[key]}, expected ${expected[key]}.`);
  }

  const stages = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: CANDIDATES.filter((candidate) => candidate.stage === stage).length,
  }));
  if (sumBy(stages, (stage) => stage.count) !== CANDIDATES.length) {
    throw new Error("Pipeline counts do not match candidates.");
  }

  const skillsTarget = 90;
  const skills = DEPARTMENTS.map((department) => ({
    id: department.id,
    name: department.name,
    coverage: department.skillsCoverage,
    gap: Math.max(0, skillsTarget - department.skillsCoverage),
  }));
  const lowestSkill = [...skills].sort(
    (a, b) => a.coverage - b.coverage || a.name.localeCompare(b.name),
  )[0];
  if (!lowestSkill) throw new Error("Skills comparison is empty.");

  return {
    source: DEMO_SOURCE,
    organization: "Demonstration organization",
    period: "May–Oct 2026",
    kpis,
    departments: DEPARTMENTS,
    teams: TEAMS,
    projects: PROJECTS,
    people: [...PEOPLE].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    openings: OPENINGS,
    candidates: CANDIDATES,
    users: USERS,
    stages,
    skills,
    skillsTarget,
    lowestSkill,
    scoreBands: SCORE_BANDS,
    capacityTrend: CAPACITY_TREND,
    staffed: sumBy(PROJECTS, (project) => project.headcount),
    activities: [
      { id: "act-priya", text: "Priya Shah is one of the named profiles in the 90–100 band." },
      { id: "act-jonah", text: "Jonah Ellis is a named profile in the retention-attention group." },
      { id: "act-leila", text: "Leila Haddad is in the Interview stage for Senior Engineer." },
      {
        id: "act-sales",
        text: "Sales has the widest skills gap versus the 90% demonstration target.",
      },
      {
        id: "act-harbor",
        text: "Harbor is the named project with the lowest delivery completion.",
      },
    ],
  };
}

export const talentDemo = buildTalentDemo();

export function departmentName(id: string) {
  return must(
    talentDemo.departments.find((item) => item.id === id),
    id,
  ).name;
}

export function teamName(id: string) {
  return must(
    talentDemo.teams.find((item) => item.id === id),
    id,
  ).name;
}

export function projectName(id: string) {
  return must(
    talentDemo.projects.find((item) => item.id === id),
    id,
  ).name;
}

export function openingTitle(id: string) {
  return must(
    talentDemo.openings.find((item) => item.id === id),
    id,
  ).title;
}

const SIMULATED =
  "Simulated answer from the demonstration dataset. No live employee records and no AI provider were queried.";

export function answerDemoQuestion(question: string) {
  const q = question.toLowerCase();
  const { kpis, people, departments, candidates, openings, projects, skills, lowestSkill } =
    talentDemo;
  const names = (items: readonly { name: string }[]) => items.map((item) => item.name).join(", ");

  if (q.includes("promotion")) {
    const sample = people.filter((person) => person.promotionReady);
    return `${SIMULATED} ${kpis.promotionReady} people are marked promotion-ready across departments. Named sample: ${names(sample)}. A score is decision support, not a measure of worth, and it does not guarantee a promotion.`;
  }
  if (q.includes("retention") || q.includes("flight") || q.includes("risk")) {
    const sample = people.filter((person) => person.flightRisk);
    return `${SIMULATED} ${kpis.flightRisk} people are flagged for a manager retention conversation. Named sample: ${names(sample)}. ${sample.map((person) => `${person.name}: ${person.nextAction}`).join(" ")} This is not a medical or attrition prediction.`;
  }
  if (q.includes("skill")) {
    return `${SIMULATED} Weighted skills coverage is ${kpis.skillsCoverage}%. The widest gap versus the ${talentDemo.skillsTarget}% target is ${lowestSkill.name} at ${lowestSkill.coverage}% coverage. ${skills.map((item) => `${item.name} ${item.coverage}%`).join(", ")}.`;
  }
  if (q.includes("senior") || q.includes("candidate") || q.includes("compare")) {
    const role = openings.find((item) => item.id === "job-senior-eng");
    const shortlist = candidates.filter((candidate) => candidate.openingId === "job-senior-eng");
    return `${SIMULATED} The demonstration opening is ${role?.title ?? "Senior Engineer"}. Pipeline sample: ${shortlist.map((candidate) => `${candidate.name} (${candidate.stage}${candidate.score === null ? ", not assessed" : `, illustrative score ${candidate.score}`})`).join("; ")}. This is not a hiring decision.`;
  }
  if (q.includes("project") || q.includes("staff") || q.includes("recommend")) {
    const atlas = projects.find((project) => project.id === "atlas");
    const matches = people.filter(
      (person) => person.projectId === "atlas" || person.internalMobility,
    );
    return `${SIMULATED} Atlas is a named engineering project with ${atlas?.headcount ?? 0} of the ${kpis.headcount} demonstration employees and ${atlas?.deliveryPct ?? 0}% completion. Sample people to discuss for staffing: ${names(matches)}. Availability still has to be confirmed by a manager.`;
  }
  if (q.includes("department") || q.includes("summar")) {
    return `${SIMULATED} ${kpis.headcount} employees. Average score ${kpis.averageScore}/100, weighted by headcount. ${departments.map((item) => `${item.name}: ${item.headcount} people, score ${item.averageScore}, delivery ${item.deliveryPct}%`).join("; ")}.`;
  }
  if (q.includes("high") || q.includes("perform") || q.includes("talent")) {
    const sample = people.filter((person) => person.score >= 90);
    return `${SIMULATED} ${kpis.highPerformers} people sit in the 90–100 band. Named sample, sorted by illustrative score: ${sample.map((person) => `${person.name} (${person.score})`).join(", ")}.`;
  }
  return `${SIMULATED} The demonstration organization has ${kpis.headcount} people, ${kpis.highPerformers} in the high-performer band, ${kpis.promotionReady} promotion-ready, ${kpis.mobility} internal-mobility candidates, and ${kpis.flightRisk} flagged for retention attention. Average score ${kpis.averageScore}/100. Ask about promotion, skills, retention, departments, or staffing.`;
}
