import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildDemoOverview, resolveWorkforceStatus } from '@/data/workforce-demo';

const overview = buildDemoOverview();

export function WorkforceOverview({ onConnect }: { onConnect: () => void }) {
  const [showDemo, setShowDemo] = useState(true);
  const status = resolveWorkforceStatus();
  const showingDemo = status === 'DEMO MODE' && showDemo;

  return (
    <section className="section-divider py-24 md:py-32">
      <div className="section-wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Workforce overview</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">A labeled demonstration, until a source is connected.</h2>
            <p className="text-muted-foreground mt-5 text-base md:text-lg leading-relaxed">GitHub, Jira, and ClickUp are not connected in this environment, so this view cannot show your organization. The figures below are one consistent demonstration dataset.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="glass" onClick={onConnect}>Connect integrations</Button>
            <Button variant="ghost" onClick={() => setShowDemo((value) => !value)}>{showingDemo ? 'Exit demo mode' : 'View demonstration'}</Button>
          </div>
        </div>

        <div className="glass-panel mt-10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="min-h-12 border-b border-border flex flex-wrap items-center gap-3 px-5 py-3 text-xs text-muted-foreground">
            <LayoutDashboard className="size-4 text-highlight" />
            <span>Workforce overview</span>
            <span className="ml-auto rounded-full border border-primary/40 px-2.5 py-1 text-[10px] font-bold tracking-wide text-highlight">{showingDemo ? 'DEMO MODE — Illustrative Data' : status}</span>
          </div>

          {showingDemo ? <DemoBoard /> : (
            <div className="grid place-items-center p-8 text-center min-h-72">
              <div>
                <p className="font-display text-lg font-semibold">Demo mode is off, and no live source is connected.</p>
                <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">There is no authorized GitHub, Jira, or ClickUp feed to display. Turn the demonstration back on to see the illustrative dataset.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DemoBoard() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
        <Stat label="Employees" value={String(overview.headcount)} detail={`${overview.active} active in the demonstration`} source={overview.source} />
        <Stat label="Average signal" value={String(overview.averageScore)} detail="Illustrative score, not a measure of worth" source={overview.source} />
        <Stat label="Capacity" value={`${overview.capacityPct}%`} detail="Mean workload across the demonstration team" source={overview.source} />
        <Stat label="Tasks" value={String(overview.tasksCompleted)} detail={`${overview.tasksPending} still open`} source={overview.source} />
      </div>
      <div className="grid lg:grid-cols-[1.4fr_.8fr] gap-4 px-4">
        <div className="rounded-xl bg-secondary/60 border border-border p-5">
          <div className="flex justify-between gap-3 text-sm font-semibold"><span>Tasks completed</span><span className="text-xs font-medium text-muted-foreground">{overview.period}</span></div>
          <div className="flex items-end gap-2 h-36 pt-7" role="img" aria-label={`Demonstration task completions by month: ${overview.months.map((month) => `${month.month} ${month.completed}`).join(', ')}`}>
            {overview.months.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <div className="w-full bg-primary/70 rounded-t-sm" style={{ height: `${Math.round((month.completed / overview.maxMonth) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-3">{overview.months.map((month) => <span key={month.month}>{month.month}</span>)}</div>
          <p className="text-[11px] text-muted-foreground mt-3">Source: {overview.source}. These six months add up to the {overview.tasksCompleted} completed tasks in the table.</p>
        </div>
        <div className="rounded-xl bg-secondary/60 border border-border p-5">
          <div className="text-sm font-semibold">Project delivery</div>
          <ul className="mt-4 space-y-4">
            {overview.projects.map((project) => (
              <li key={project.name}>
                <div className="flex justify-between text-xs"><span>{project.name}</span><span>{project.progressPct}%</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-background" aria-hidden="true"><div className="h-full rounded-full bg-primary" style={{ width: `${project.progressPct}%` }} /></div>
                <p className="text-[11px] text-muted-foreground mt-1">{project.done} completed, {project.open} open, {project.people} people. Source: {overview.source}.</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-4 py-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm text-left">
          <caption className="text-left text-sm font-semibold pb-3">Demonstration people and assignments</caption>
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-3 font-medium">Name</th>
              <th scope="col" className="py-2 pr-3 font-medium">Role</th>
              <th scope="col" className="py-2 pr-3 font-medium">Project</th>
              <th scope="col" className="py-2 pr-3 font-medium">Score</th>
              <th scope="col" className="py-2 pr-3 font-medium">Capacity</th>
              <th scope="col" className="py-2 pr-3 font-medium">Completed</th>
              <th scope="col" className="py-2 font-medium">Open</th>
            </tr>
          </thead>
          <tbody>
            {overview.ranked.map((person) => (
              <tr key={person.name} className="border-b border-border">
                <th scope="row" className="py-3 pr-3 font-semibold text-left">{person.name}</th>
                <td className="py-3 pr-3">{person.role}</td>
                <td className="py-3 pr-3">{person.project}</td>
                <td className="py-3 pr-3">{person.score}</td>
                <td className="py-3 pr-3">{person.capacityPct}%</td>
                <td className="py-3 pr-3">{person.tasksDone}</td>
                <td className="py-3">{person.tasksOpen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 pb-4 text-xs text-muted-foreground">Demo Mode — Illustrative Data for {overview.organization}, {overview.period}. These people, scores, and tasks are not a customer, and they are not live GitHub, Jira, or ClickUp activity. A score here is not a measure of a person's worth.</p>
    </div>
  );
}

function Stat({ label, value, detail, source }: { label: string; value: string; detail: string; source: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-4 border border-border">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-2xl font-display font-bold mt-2">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{detail}</div>
      <div className="text-[10px] text-highlight mt-2">Source: {source}</div>
    </div>
  );
}
