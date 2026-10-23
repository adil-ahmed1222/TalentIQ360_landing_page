import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Award,
  Bell,
  Briefcase,
  Building2,
  CreditCard,
  FolderKanban,
  GitCompare,
  Hash,
  Kanban,
  LayoutDashboard,
  Linkedin,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  Plus,
  Search,
  Send,
  Shield,
  Sparkles,
  Users,
  Waypoints,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  answerDemoQuestion,
  departmentName,
  DEMO_INTEGRATIONS,
  DEMO_PROMPTS,
  openingTitle,
  projectName,
  talentDemo,
  teamName,
  type DemoCandidate,
  type DemoPerson,
} from "@/data/talent-demo";

type DemoView =
  | "chat"
  | "talent"
  | "employees"
  | "teams"
  | "departments"
  | "projects"
  | "promotion"
  | "skills"
  | "matcher"
  | "compare"
  | "candidates"
  | "pipeline"
  | "github"
  | "jira"
  | "clickup"
  | "excel"
  | "linkedin"
  | "slack"
  | "organization"
  | "users"
  | "permissions"
  | "billing";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };
type Conversation = { id: string; title: string; messages: ChatMessage[] };

const NAV: {
  label: string;
  items: { id: DemoView; label: string; icon: typeof Users; hint?: string }[];
}[] = [
  { label: "Talent IQ", items: [{ id: "chat", label: "Chat", icon: MessageSquare }] },
  {
    label: "Workforce",
    items: [
      { id: "talent", label: "Talent Intelligence", icon: Sparkles },
      { id: "employees", label: "Employees", icon: Users },
      { id: "teams", label: "Teams", icon: Waypoints },
      { id: "departments", label: "Departments", icon: Building2 },
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "promotion", label: "Promotion Readiness", icon: Award },
      { id: "skills", label: "Skills Intelligence", icon: LayoutDashboard },
    ],
  },
  {
    label: "Hiring",
    items: [
      { id: "matcher", label: "Job Matcher", icon: Briefcase },
      { id: "compare", label: "People Compare", icon: GitCompare },
      { id: "candidates", label: "Candidate Search", icon: Search },
      { id: "pipeline", label: "Hiring Pipeline", icon: Kanban },
    ],
  },
  {
    label: "Integrations",
    items: [
      { id: "github", label: "GitHub", icon: Hash },
      { id: "jira", label: "Jira", icon: Kanban },
      { id: "clickup", label: "ClickUp", icon: FolderKanban },
      { id: "excel", label: "Excel", icon: LayoutDashboard },
      { id: "linkedin", label: "LinkedIn", icon: Linkedin },
      { id: "slack", label: "Slack", icon: Hash, hint: "Soon" },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "organization", label: "Organization", icon: Building2 },
      { id: "users", label: "Users", icon: Users },
      { id: "permissions", label: "Permissions", icon: Shield },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
];

const CHIPS: { label: string; view: DemoView }[] = [
  { label: "Executive Dashboard", view: "talent" },
  { label: "AI Intelligence", view: "chat" },
  { label: "GitHub", view: "github" },
  { label: "Employees", view: "employees" },
  { label: "Job matcher", view: "matcher" },
  { label: "Compare", view: "compare" },
];

const fieldClass =
  "h-11 w-full min-w-0 rounded-lg border border-white/10 bg-black/30 px-3 text-base text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("");
}

function tone(id: string) {
  const tones = [
    "bg-primary/25 text-highlight",
    "bg-violet-500/20 text-violet-100",
    "bg-sky-500/20 text-sky-100",
    "bg-indigo-500/25 text-indigo-100",
  ];
  const index = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % tones.length;
  return tones[index] ?? tones[0];
}

function statusOf(person: DemoPerson) {
  if (person.flightRisk) return "Retention attention";
  if (person.promotionReady) return "Promotion ready";
  if (person.internalMobility) return "Mobility candidate";
  return "No change flagged";
}

function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

export function DemoWorkspace({ onConnect }: { onConnect: () => void }) {
  const [view, setView] = useState<DemoView>("talent");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notices, setNotices] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [historyQuery, setHistoryQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    {
      id: "conv-snapshot",
      title: "Workforce snapshot",
      messages: [
        { id: "seed-user", role: "user", text: "Summarize department performance." },
        {
          id: "seed-assistant",
          role: "assistant",
          text: answerDemoQuestion("Summarize department performance."),
        },
      ],
    },
  ]);
  const [activeId, setActiveId] = useState("conv-snapshot");
  const [historyOpen, setHistoryOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const searchId = useId();
  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    if (!mobileNav && !notices) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNav(false);
        setNotices(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNav, notices]);

  const peopleHits = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return talentDemo.people
      .filter((person) =>
        matches(`${person.name} ${person.title} ${departmentName(person.departmentId)}`, q),
      )
      .slice(0, 6);
  }, [query]);

  function openView(next: DemoView) {
    setView(next);
    setMobileNav(false);
    setHistoryOpen(false);
    setNotices(false);
  }

  function ask(prompt: string) {
    setDraft(prompt);
    setNote("");
    openView("chat");
    window.setTimeout(() => document.getElementById("demo-composer")?.focus(), 0);
  }

  function openPerson(id: string) {
    setSelectedId(id);
    openView("employees");
  }

  function newChat() {
    const id = `conv-${conversations.length + 1}`;
    setConversations((list) => [{ id, title: "New chat", messages: [] }, ...list]);
    setActiveId(id);
    setDraft("");
    setNote("");
    openView("chat");
  }

  function send() {
    const text = draft.trim();
    if (!text || busy || !active) {
      if (!text) setNote("Enter a question first.");
      return;
    }
    const conversationId = active.id;
    const userId = `user-${active.messages.length + 1}-${conversationId}`;
    setDraft("");
    setNote("");
    setBusy(true);
    setConversations((list) =>
      list.map((item) =>
        item.id === conversationId
          ? {
              ...item,
              title: item.messages.length === 0 ? text.slice(0, 48) : item.title,
              messages: [...item.messages, { id: userId, role: "user", text }],
            }
          : item,
      ),
    );
    timer.current = window.setTimeout(() => {
      setConversations((list) =>
        list.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                messages: [
                  ...item.messages,
                  {
                    id: `assistant-${item.messages.length + 1}`,
                    role: "assistant",
                    text: answerDemoQuestion(text),
                  },
                ],
              }
            : item,
        ),
      );
      setBusy(false);
    }, 650);
  }

  const history = conversations.filter(
    (item) =>
      !historyQuery.trim() ||
      matches(
        `${item.title} ${item.messages.map((message) => message.text).join(" ")}`,
        historyQuery,
      ),
  );

  return (
    <div className="tiq-demo relative mt-6 min-w-0 max-w-full overflow-x-clip rounded-2xl border text-foreground md:mt-10">
      <div className="flex min-w-0 flex-col items-stretch md:flex-row md:items-start">
        <Sidebar
          view={view}
          collapsed={collapsed}
          sheet={false}
          onOpen={openView}
          onClose={() => setMobileNav(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="tiq-surface sticky top-[4.75rem] z-20 flex min-h-14 min-w-0 items-center gap-2 border-b px-2 py-2 sm:px-3">
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
              aria-label={mobileNav ? "Close demonstration menu" : "Open demonstration menu"}
              aria-expanded={mobileNav}
              onClick={() => setMobileNav((value) => !value)}
            >
              {mobileNav ? <X className="size-4" /> : <PanelLeftOpen className="size-4" />}
            </button>
            <button
              type="button"
              className="hidden size-11 shrink-0 place-items-center rounded-lg hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:grid"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>
            <p className="hidden min-w-0 truncate text-sm text-muted-foreground lg:block">
              <span className="text-foreground">Talent Intelligence</span> /{" "}
              {NAV.flatMap((group) => group.items).find((item) => item.id === view)?.label}
            </p>
            <div className="relative ml-auto min-w-0 flex-1 md:max-w-xs">
              <label htmlFor={searchId} className="sr-only">
                Search demonstration talent
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id={searchId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search talent, teams, projects..."
                className={cn(fieldClass, "pl-9")}
              />
              {query.trim() && (
                <ul className="tiq-elevated absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border p-1 shadow-xl">
                  {peopleHits.length === 0 && (
                    <li className="px-3 py-2 text-sm text-muted-foreground">
                      No sample profiles match.
                    </li>
                  )}
                  {peopleHits.map((person) => (
                    <li key={person.id}>
                      <button
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        onClick={() => openPerson(person.id)}
                      >
                        {person.name}
                        <span className="block text-xs text-muted-foreground">
                          {person.title} · {departmentName(person.departmentId)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label htmlFor="demo-org" className="sr-only">
              Demonstration organization
            </label>
            <select
              id="demo-org"
              className="hidden h-11 max-w-40 rounded-lg border border-white/10 bg-black/30 px-2 text-sm lg:block"
              defaultValue="demo"
            >
              <option value="demo">TalentIQ360 demo</option>
            </select>
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-lg hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Demonstration activity"
              aria-expanded={notices}
              onClick={() => setNotices((value) => !value)}
            >
              <Bell className="size-4" />
            </button>
            <span className="hidden shrink-0 items-center gap-2 text-xs lg:inline-flex">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-[11px] font-bold",
                  tone("user-avery"),
                )}
              >
                AC
              </span>
              <span className="leading-tight">
                <span className="block font-semibold">Avery Cole</span>
                <span className="text-muted-foreground">Demo admin</span>
              </span>
            </span>
          </header>
          {mobileNav && (
            <Sidebar
              view={view}
              collapsed={false}
              sheet
              onOpen={openView}
              onClose={() => setMobileNav(false)}
            />
          )}
          {notices && (
            <div
              className="tiq-elevated border-b px-4 py-3"
              role="region"
              aria-label="Demonstration activity"
            >
              <ul className="space-y-2 text-sm">
                {talentDemo.activities.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Sample events from {talentDemo.source}. Not a live feed.
              </p>
            </div>
          )}
          <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain border-b border-white/10 px-3 py-2">
            {CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => openView(chip.view)}
                className={cn(
                  "min-h-11 shrink-0 rounded-lg px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  view === chip.view ? "tiq-selected" : "text-muted-foreground hover:bg-white/5",
                )}
                aria-current={view === chip.view ? "page" : undefined}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
            {view === "chat" && (
              <div
                className={cn(
                  "min-w-0 w-full shrink-0 flex-col border-white/10 bg-black/20 lg:w-64 lg:border-r",
                  historyOpen ? "flex" : "hidden lg:flex",
                )}
              >
                <div className="p-3">
                  <button
                    type="button"
                    onClick={newChat}
                    className="tiq-action flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Plus className="size-4" /> New chat
                  </button>
                  <label htmlFor="history-search" className="sr-only">
                    Search conversations
                  </label>
                  <input
                    id="history-search"
                    value={historyQuery}
                    onChange={(event) => setHistoryQuery(event.target.value)}
                    placeholder="Search conversations"
                    className={cn(fieldClass, "mt-3")}
                  />
                </div>
                <ul className="min-h-0 px-2 pb-3 lg:max-h-[calc(100dvh-16rem)] lg:overflow-y-auto">
                  {history.length === 0 && (
                    <li className="px-2 text-sm text-muted-foreground">No conversations match.</li>
                  )}
                  {history.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveId(item.id);
                          setHistoryOpen(false);
                        }}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
                          item.id === activeId ? "bg-white/10" : "hover:bg-white/5",
                        )}
                        aria-current={item.id === activeId ? "true" : undefined}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div
              className={cn(
                "min-w-0 flex-1 p-3 sm:p-4",
                view === "chat" && historyOpen && "hidden lg:block",
              )}
            >
              {view === "chat" ? (
                <ChatPane
                  active={active}
                  busy={busy}
                  draft={draft}
                  note={note}
                  historyOpen={historyOpen}
                  onToggleHistory={() => setHistoryOpen((value) => !value)}
                  onDraft={setDraft}
                  onNote={setNote}
                  onSend={send}
                  onAsk={ask}
                />
              ) : (
                <DemoViewBody
                  view={view}
                  query={query}
                  selectedId={selectedId}
                  onConnect={onConnect}
                  onAsk={ask}
                  onOpen={openView}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  view,
  collapsed,
  sheet,
  onOpen,
  onClose,
}: {
  view: DemoView;
  collapsed: boolean;
  sheet: boolean;
  onOpen: (view: DemoView) => void;
  onClose: () => void;
}) {
  const body = (
    <nav aria-label="Demonstration" className="flex min-h-0 flex-col">
      <div className="flex items-center gap-2 px-2.5 py-3">
        <img
          src="/images/talentiq-logo.png"
          alt="TalentIQ360"
          width={617}
          height={719}
          draggable={false}
          className="h-9 w-auto max-w-11 shrink-0 object-contain"
        />
        <span className={cn("truncate text-sm font-bold", collapsed && "md:sr-only")}>
          Talent IQ
        </span>
        <button
          type="button"
          className="ml-auto grid size-11 place-items-center rounded-lg md:hidden"
          aria-label="Close demonstration menu"
          onClick={onClose}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="space-y-4 px-2 pb-3">
        {NAV.map((group) => (
          <div key={group.label}>
            <p
              className={cn(
                "px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground",
                collapsed && "md:sr-only",
              )}
            >
              {group.label}
            </p>
            <ul>
              {group.items.map((item) => {
                const Icon = item.icon;
                const current = view === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(item.id)}
                      aria-current={current ? "page" : undefined}
                      title={item.label}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        current ? "tiq-selected" : "text-foreground/80 hover:bg-white/5",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className={cn("min-w-0 flex-1 truncate", collapsed && "md:sr-only")}>
                        {item.label}
                      </span>
                      {item.hint && (
                        <span
                          className={cn(
                            "rounded-full border border-white/15 px-1.5 text-[10px]",
                            collapsed && "md:hidden",
                          )}
                        >
                          {item.hint}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p
        className={cn(
          "border-t border-white/10 px-3 py-3 text-[11px] text-muted-foreground",
          collapsed && "md:sr-only",
        )}
      >
        Demo data — not live
      </p>
    </nav>
  );
  if (sheet) {
    return (
      <div className="tiq-surface max-h-[min(70dvh,32rem)] overflow-y-auto overscroll-contain border-b md:hidden">
        {body}
      </div>
    );
  }
  return (
    <aside
      className={cn(
        "tiq-surface sticky top-[4.75rem] z-10 hidden max-h-[calc(100dvh-5.5rem)] shrink-0 flex-col self-start overflow-y-auto overscroll-y-auto border-r md:flex",
        collapsed ? "md:w-16" : "md:w-56 lg:w-60",
      )}
    >
      {body}
    </aside>
  );
}

function ChatPane({
  active,
  busy,
  draft,
  note,
  historyOpen,
  onToggleHistory,
  onDraft,
  onNote,
  onSend,
  onAsk,
}: {
  active: Conversation | undefined;
  busy: boolean;
  draft: string;
  note: string;
  historyOpen: boolean;
  onToggleHistory: () => void;
  onDraft: (value: string) => void;
  onNote: (value: string) => void;
  onSend: () => void;
  onAsk: (prompt: string) => void;
}) {
  const messages = active?.messages ?? [];
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">AI Workspace</h2>
          <p className="text-xs text-muted-foreground">
            Simulated answers from the demonstration dataset. Nothing here queries a live workforce.
          </p>
        </div>
        <button
          type="button"
          className="min-h-11 rounded-lg border border-white/10 px-3 text-sm lg:hidden"
          aria-expanded={historyOpen}
          onClick={onToggleHistory}
        >
          {historyOpen ? "Hide chats" : "Chats"}
        </button>
      </div>
      <div className="flex-1" aria-live="polite">
        {messages.length === 0 ? (
          <div className="grid min-h-72 place-items-center text-center">
            <div>
              <h3 className="font-display text-3xl font-bold">How can I help today?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Type a command or ask a question about the demonstration organization.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((message) => (
              <li
                key={message.id}
                className={cn(
                  "max-w-[95%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "user" ? "ml-auto bg-primary/20" : "bg-white/[0.04]",
                )}
              >
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {message.role === "user" ? "You" : "Simulated answer"}
                </span>
                {message.text}
              </li>
            ))}
            {busy && (
              <li className="text-sm text-muted-foreground">Preparing a simulated answer…</li>
            )}
          </ul>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {DEMO_PROMPTS.slice(0, 4).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onAsk(prompt)}
            className="min-h-11 rounded-full border border-white/10 px-3 text-left text-xs hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {prompt}
          </button>
        ))}
      </div>
      <form
        className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <label htmlFor="demo-composer" className="sr-only">
          Ask about the demonstration
        </label>
        <textarea
          id="demo-composer"
          value={draft}
          rows={3}
          onChange={(event) => onDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask TalentAI a question about the demonstration..."
          className="min-h-24 w-full resize-y bg-transparent text-base outline-none"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Attachments are not available in this demonstration"
            onClick={() => onNote("File attachments are not available in this demonstration.")}
          >
            <Paperclip className="size-4" />
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Use a suggested prompt"
            onClick={() => onAsk(DEMO_PROMPTS[0] ?? "")}
          >
            <LayoutDashboard className="size-4" />
          </button>
          <button
            type="submit"
            disabled={busy}
            className="tiq-action ml-auto inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          >
            <Send className="size-4" /> {busy ? "Sending" : "Send"}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {note}
        </p>
        {note && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {note}
          </p>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">
          Answers stay inside this browser session and are marked simulated.
        </p>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Find talent", "Compare", "Staff project", "Insights"].map((label) => (
          <button
            key={label}
            type="button"
            className="min-h-11 rounded-full border border-white/10 px-3 text-sm hover:bg-white/5"
            onClick={() =>
              onAsk(
                label === "Find talent"
                  ? (DEMO_PROMPTS[0] ?? "")
                  : label === "Compare"
                    ? (DEMO_PROMPTS[2] ?? "")
                    : label === "Staff project"
                      ? (DEMO_PROMPTS[4] ?? "")
                      : (DEMO_PROMPTS[6] ?? ""),
              )
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoViewBody({
  view,
  query,
  selectedId,
  onConnect,
  onAsk,
  onOpen,
}: {
  view: DemoView;
  query: string;
  selectedId: string | null;
  onConnect: () => void;
  onAsk: (prompt: string) => void;
  onOpen: (view: DemoView) => void;
}) {
  if (view === "talent") return <TalentView onAsk={onAsk} onOpen={onOpen} />;
  if (view === "employees") return <PeopleView query={query} selectedId={selectedId} />;
  if (view === "teams") return <TeamsView />;
  if (view === "departments") return <DepartmentsView />;
  if (view === "projects") return <ProjectsView onAsk={onAsk} />;
  if (view === "promotion") return <PromotionView />;
  if (view === "skills") return <SkillsView />;
  if (view === "matcher") return <MatcherView />;
  if (view === "compare") return <CompareView />;
  if (view === "candidates") return <CandidatesView query={query} />;
  if (view === "pipeline") return <PipelineView />;
  if (view === "organization" || view === "users" || view === "permissions" || view === "billing")
    return <AdminView view={view} />;
  return <IntegrationView id={view} onConnect={onConnect} />;
}

function TalentView({
  onAsk,
  onOpen,
}: {
  onAsk: (prompt: string) => void;
  onOpen: (view: DemoView) => void;
}) {
  const { kpis, departments, people, skills, activities } = talentDemo;
  const top = people.filter((person) => person.score >= 90);
  const flight = people.filter((person) => person.flightRisk);
  const mobile = people.filter((person) => person.internalMobility);
  const cards = [
    {
      label: "High performers",
      value: String(kpis.highPerformers),
      detail: "Score 90 or above",
      href: "demo-top",
    },
    {
      label: "Promotion ready",
      value: String(kpis.promotionReady),
      detail: "Ready for expanded scope",
      href: "demo-promotion",
    },
    {
      label: "Internal mobility",
      value: String(kpis.mobility),
      detail: "High readiness with capacity",
      href: "demo-mobility",
    },
    {
      label: "Flight risk",
      value: String(kpis.flightRisk),
      detail: "Requires manager attention",
      href: "demo-flight",
      warn: true,
    },
    {
      label: "Active employees",
      value: String(kpis.active),
      detail: "All demonstration employees are marked active",
      href: "demo-departments",
    },
    {
      label: "Average performance score",
      value: `${kpis.averageScore}/100`,
      detail: "Weighted by department headcount",
      href: "demo-distribution",
    },
    {
      label: "Skills coverage",
      value: `${kpis.skillsCoverage}%`,
      detail: "Weighted across departments",
      href: "demo-skills",
    },
    {
      label: "Workforce capacity",
      value: `${kpis.capacityPct}%`,
      detail: "Weighted workload, October in the trend",
      href: "demo-capacity",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-highlight">
            Talent Intelligence · Demo Data
          </p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            See capability before the résumé.
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Illustrative performance, mobility, and readiness signals for one fictional
            organization. Not a customer result, and not a measure of a person’s worth.
          </p>
        </div>
        <span className="rounded-full border border-primary/40 px-2.5 py-1 text-[10px] font-bold text-highlight">
          DEMO MODE — Illustrative Data
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() =>
              document
                .getElementById(card.href)
                ?.scrollIntoView({ block: "start", behavior: "auto" })
            }
            className="tiq-card rounded-xl border p-4 text-left hover:border-[var(--brand-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              {card.label}
              <span aria-hidden="true">↗</span>
            </span>
            <span
              className={cn(
                "mt-3 block font-display text-3xl font-bold",
                card.warn && "text-red-300",
              )}
            >
              {card.value}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">{card.detail}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
        <Panel
          id="demo-departments"
          title="Workforce strength map"
          detail="Delivery completion and average score by department. Headcount sums to 248."
        >
          <DemoChart
            label={`Department delivery: ${departments.map((item) => `${item.shortName} ${item.deliveryPct}%`).join(", ")}`}
          >
            <BarChart
              data={departments.map((item) => ({
                name: item.shortName,
                Delivery: item.deliveryPct,
                Score: item.averageScore,
              }))}
              layout="vertical"
              margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,.08)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9aa4bf", fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tick={{ fill: "#d5dbed", fontSize: 11 }}
              />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Bar dataKey="Delivery" fill="#315fff" radius={3} isAnimationActive={false} />
              <Bar dataKey="Score" fill="#703bff" radius={3} isAnimationActive={false} />
            </BarChart>
          </DemoChart>
        </Panel>
        <Panel
          id="demo-top"
          title="Top performers"
          detail={`${top.length} named profiles in the 90–100 band. Department totals count ${kpis.highPerformers}.`}
        >
          <ul className="space-y-3">
            {top.map((person) => (
              <PersonLine key={person.id} person={person} />
            ))}
          </ul>
        </Panel>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          id="demo-distribution"
          title="Performance distribution"
          detail="Bands sum to the 248 demonstration employees. The top band matches the high-performer total."
        >
          <DemoChart
            label={talentDemo.scoreBands.map((band) => `${band.label} ${band.count}`).join(", ")}
          >
            <BarChart
              data={talentDemo.scoreBands.map((band) => ({ name: band.label, People: band.count }))}
            >
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#d5dbed", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9aa4bf", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="People" fill="#315fff" radius={3} isAnimationActive={false} />
            </BarChart>
          </DemoChart>
        </Panel>
        <Panel
          id="demo-capacity"
          title="Workforce capacity trend"
          detail="Illustrative utilization. October matches the 86% capacity KPI."
        >
          <DemoChart
            label={talentDemo.capacityTrend
              .map((item) => `${item.month} ${item.capacityPct}%`)
              .join(", ")}
          >
            <LineChart data={[...talentDemo.capacityTrend]}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#d5dbed", fontSize: 11 }} />
              <YAxis domain={[70, 100]} tick={{ fill: "#9aa4bf", fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Line
                type="monotone"
                dataKey="capacityPct"
                name="Capacity %"
                stroke="#20d5ff"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </DemoChart>
        </Panel>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          id="demo-skills"
          title="Skills-gap analysis"
          detail={`Coverage versus a ${talentDemo.skillsTarget}% demonstration target. Weighted coverage is ${kpis.skillsCoverage}%.`}
        >
          <ul className="space-y-3">
            {skills.map((item) => (
              <li key={item.id}>
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>
                    {item.coverage}% · gap {item.gap}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/10" aria-hidden="true">
                  <div
                    className="tiq-meter h-full rounded-full"
                    style={{ width: `${item.coverage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          id="demo-flight"
          title="Retention-risk insights"
          detail={`${flight.length} of ${kpis.flightRisk} flags are named profiles. This is not a prediction that someone will leave.`}
        >
          <ul className="space-y-3">
            {flight.map((person) => (
              <li key={person.id} className="text-sm">
                <strong>{person.name}</strong>, {person.title}. {person.nextAction}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          id="demo-promotion"
          title="Promotion readiness"
          detail={`${kpis.promotionReady} people are marked promotion-ready in department totals.`}
        >
          <button
            type="button"
            className="min-h-11 text-sm text-highlight underline-offset-2 hover:underline"
            onClick={() => onOpen("promotion")}
          >
            Open the promotion sample
          </button>
        </Panel>
        <Panel
          id="demo-mobility"
          title="Internal mobility recommendations"
          detail={`${kpis.mobility} department-level candidates. Named sample: ${mobile.map((person) => person.name).join(", ")}.`}
        >
          <button
            type="button"
            className="min-h-11 text-sm text-highlight underline-offset-2 hover:underline"
            onClick={() => onAsk(DEMO_PROMPTS[4] ?? "")}
          >
            Ask the simulated workspace about staffing
          </button>
        </Panel>
      </div>
      <Panel title="Recent activity" detail="Sample events, not a live activity feed.">
        <ul className="space-y-2 text-sm">
          {activities.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

const tipStyle = {
  background: "#14182a",
  border: "1px solid #242b40",
  borderRadius: 8,
  fontSize: 12,
};

function DemoChart({ label, children }: { label: string; children: ReactElement }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div className="h-56 min-w-0 overflow-hidden" role="img" aria-label={label}>
      {ready ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="grid h-full place-items-center text-xs text-muted-foreground">
          Loading chart…
        </div>
      )}
    </div>
  );
}

function Panel({
  id,
  title,
  detail,
  children,
}: {
  id?: string;
  title: string;
  detail?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="tiq-card min-w-0 scroll-mt-28 rounded-xl border p-4">
      <h3 className="font-display text-sm font-bold">{title}</h3>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PersonLine({ person }: { person: DemoPerson }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold",
          tone(person.id),
        )}
        aria-hidden="true"
      >
        {initials(person.name)}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{person.name}</p>
        <p className="text-xs text-muted-foreground">
          {person.title} · {departmentName(person.departmentId)} · score {person.score}
        </p>
        <p className="text-xs">
          {statusOf(person)}. {person.nextAction}
        </p>
      </div>
    </div>
  );
}

function PeopleView({ query, selectedId }: { query: string; selectedId: string | null }) {
  const rows = talentDemo.people.filter(
    (person) =>
      !query.trim() ||
      matches(
        `${person.name} ${person.title} ${departmentName(person.departmentId)} ${teamName(person.teamId)}`,
        query,
      ),
  );
  return (
    <Page
      title="Employees"
      text={`${talentDemo.kpis.headcount} people in the demonstration organization. ${talentDemo.people.length} named profiles are shown. Scores support a conversation; they do not measure worth.`}
    >
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No sample profiles match that search.</p>
      )}
      <div className="grid gap-3 lg:hidden">
        {rows.map((person) => (
          <article
            key={person.id}
            className={cn(
              "rounded-xl border border-white/10 p-4",
              person.id === selectedId && "border-primary",
            )}
          >
            <PersonLine person={person} />
            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <Stat label="Skills" value={`${person.skillsCoverage}%`} />
              <Stat label="Capacity" value={`${person.capacityPct}%`} />
              <Stat label="Project" value={projectName(person.projectId)} />
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden max-w-full overflow-x-auto lg:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Named demonstration employees</caption>
          <thead className="text-muted-foreground">
            <tr className="border-b border-white/10">
              <th className="py-2 pr-3 font-medium">Name</th>
              <th className="py-2 pr-3 font-medium">Title</th>
              <th className="py-2 pr-3 font-medium">Department</th>
              <th className="py-2 pr-3 font-medium">Score</th>
              <th className="py-2 pr-3 font-medium">Skills</th>
              <th className="py-2 pr-3 font-medium">Readiness</th>
              <th className="py-2 font-medium">Next action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((person) => (
              <tr
                key={person.id}
                className={cn(
                  "border-b border-white/10",
                  person.id === selectedId && "bg-primary/10",
                )}
              >
                <th className="py-3 pr-3 text-left font-semibold">{person.name}</th>
                <td className="py-3 pr-3">{person.title}</td>
                <td className="py-3 pr-3">{departmentName(person.departmentId)}</td>
                <td className="py-3 pr-3">{person.score}</td>
                <td className="py-3 pr-3">{person.skillsCoverage}%</td>
                <td className="py-3 pr-3">{statusOf(person)}</td>
                <td className="py-3">{person.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

function TeamsView() {
  return (
    <Page
      title="Teams"
      text="Team headcount adds up to each department, and the departments add up to 248."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {talentDemo.teams.map((team) => (
          <li key={team.id} className="rounded-xl border border-white/10 p-4">
            <h3 className="font-semibold">{team.name}</h3>
            <p className="text-sm text-muted-foreground">{departmentName(team.departmentId)}</p>
            <p className="mt-2 font-display text-2xl font-bold">{team.headcount}</p>
            <p className="text-xs text-muted-foreground">People in this named team</p>
          </li>
        ))}
      </ul>
    </Page>
  );
}

function DepartmentsView() {
  return (
    <Page title="Departments" text="These six departments are the source of the dashboard totals.">
      <div className="grid gap-3 md:grid-cols-2">
        {talentDemo.departments.map((item) => (
          <article key={item.id} className="rounded-xl border border-white/10 p-4">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="mt-1 font-display text-2xl font-bold">
              {item.headcount}{" "}
              <span className="text-sm font-medium text-muted-foreground">people</span>
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Stat label="Score" value={String(item.averageScore)} />
              <Stat label="Delivery" value={`${item.deliveryPct}%`} />
              <Stat label="Skills" value={`${item.skillsCoverage}%`} />
              <Stat label="Capacity" value={`${item.capacityPct}%`} />
              <Stat label="High performers" value={String(item.highPerformers)} />
              <Stat label="Retention flags" value={String(item.flightRisk)} />
            </dl>
          </article>
        ))}
      </div>
    </Page>
  );
}

function ProjectsView({ onAsk }: { onAsk: (prompt: string) => void }) {
  return (
    <Page
      title="Projects"
      text={`${talentDemo.staffed} of ${talentDemo.kpis.headcount} demonstration employees are assigned to these named projects. The rest are not given a project in this sample.`}
    >
      <ul className="space-y-4">
        {talentDemo.projects.map((project) => (
          <li key={project.id}>
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{project.name}</span>
              <span>{project.deliveryPct}%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10" aria-hidden="true">
              <div
                className="tiq-meter h-full rounded-full"
                style={{ width: `${project.deliveryPct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {departmentName(project.departmentId)} · {project.headcount} people ·{" "}
              {project.openRoles} open {project.openRoles === 1 ? "role" : "roles"}
            </p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 min-h-11 text-sm text-highlight underline-offset-2 hover:underline"
        onClick={() => onAsk(DEMO_PROMPTS[4] ?? "")}
      >
        Ask who to discuss for Atlas
      </button>
    </Page>
  );
}

function PromotionView() {
  const sample = talentDemo.people.filter((person) => person.promotionReady);
  return (
    <Page
      title="Promotion readiness"
      text={`${talentDemo.kpis.promotionReady} people are marked promotion-ready. ${sample.length} named profiles are shown. Readiness is not a promotion decision.`}
    >
      <ul className="space-y-3">
        {sample.map((person) => (
          <li key={person.id}>
            <PersonLine person={person} />
          </li>
        ))}
      </ul>
    </Page>
  );
}

function SkillsView() {
  return (
    <Page
      title="Skills intelligence"
      text={`Weighted coverage is ${talentDemo.kpis.skillsCoverage}%. The widest gap is ${talentDemo.lowestSkill.name} at ${talentDemo.lowestSkill.coverage}%, against a ${talentDemo.skillsTarget}% demonstration target.`}
    >
      <ul className="space-y-3">
        {talentDemo.skills.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 text-sm">
            <span>{item.name}</span>
            <span>
              {item.coverage}% coverage · {item.gap} point gap
            </span>
          </li>
        ))}
      </ul>
    </Page>
  );
}

function MatcherView() {
  const first = talentDemo.openings[0];
  const [openingId, setOpeningId] = useState(first?.id ?? "");
  const opening = talentDemo.openings.find((item) => item.id === openingId) ?? first;
  const candidates = talentDemo.candidates.filter(
    (candidate) => candidate.openingId === opening?.id,
  );
  const staff = talentDemo.people
    .filter((person) => person.departmentId === opening?.departmentId)
    .slice(0, 4);
  if (!opening)
    return (
      <Page title="Job Matcher" text="No demonstration openings are available.">
        {null}
      </Page>
    );
  return (
    <Page
      title="Job Matcher"
      text="Matches come from the demonstration openings and named profiles. This is not a live applicant search and not a hiring decision."
    >
      <label htmlFor="opening" className="text-sm font-medium">
        Opening
      </label>
      <select
        id="opening"
        className={cn(fieldClass, "mt-2 max-w-md")}
        value={openingId}
        onChange={(event) => setOpeningId(event.target.value)}
      >
        {talentDemo.openings.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title} · {departmentName(item.departmentId)}
          </option>
        ))}
      </select>
      <h3 className="mt-5 text-sm font-bold">Candidates for {opening.title}</h3>
      <CandidateList items={candidates} empty="No sample candidates are in this opening." />
      <h3 className="mt-5 text-sm font-bold">
        Named employees in {departmentName(opening.departmentId)}
      </h3>
      <ul className="mt-2 space-y-3">
        {staff.map((person) => (
          <li key={person.id}>
            <PersonLine person={person} />
          </li>
        ))}
      </ul>
    </Page>
  );
}

function CompareView() {
  const [leftId, setLeftId] = useState(talentDemo.people[0]?.id ?? "");
  const [rightId, setRightId] = useState(talentDemo.people[1]?.id ?? "");
  const left = talentDemo.people.find((person) => person.id === leftId);
  const right = talentDemo.people.find((person) => person.id === rightId);
  return (
    <Page
      title="People Compare"
      text="Side-by-side view of two named demonstration profiles. The difference is arithmetic on illustrative scores, not a judgment."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <PersonSelect id="compare-a" label="First profile" value={leftId} onChange={setLeftId} />
        <PersonSelect id="compare-b" label="Second profile" value={rightId} onChange={setRightId} />
      </div>
      {left && right && left.id === right.id && (
        <p className="mt-4 text-sm">Choose two different sample profiles.</p>
      )}
      {left && right && left.id !== right.id && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <CompareCard person={left} />
          <CompareCard person={right} />
          <div className="sm:col-span-2 text-sm text-muted-foreground">
            Score difference: {Math.abs(left.score - right.score)} points. Skills difference:{" "}
            {Math.abs(left.skillsCoverage - right.skillsCoverage)} points.
          </div>
        </dl>
      )}
    </Page>
  );
}

function CandidatesView({ query }: { query: string }) {
  const rows = talentDemo.candidates.filter(
    (candidate) =>
      !query.trim() ||
      matches(
        `${candidate.name} ${candidate.title} ${openingTitle(candidate.openingId)} ${candidate.stage}`,
        query,
      ),
  );
  return (
    <Page
      title="Candidate search"
      text={`${talentDemo.candidates.length} fictional candidates. Stage counts in the pipeline are counted from this same list.`}
    >
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No sample candidates match that search.</p>
      )}
      <CandidateList items={rows} empty="" />
    </Page>
  );
}

function PipelineView() {
  return (
    <Page
      title="Hiring pipeline"
      text={`${talentDemo.candidates.length} candidates across ${talentDemo.stages.length} stages. Each column count is the number of cards in it.`}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {talentDemo.stages.map((stage) => {
          const items = talentDemo.candidates.filter(
            (candidate) => candidate.stage === stage.stage,
          );
          return (
            <section key={stage.stage} className="rounded-xl border border-white/10 p-3">
              <h3 className="text-sm font-bold">
                {stage.stage} <span className="text-muted-foreground">{items.length}</span>
              </h3>
              <ul className="mt-3 space-y-2">
                {items.map((candidate) => (
                  <li key={candidate.id} className="rounded-lg bg-white/[0.04] p-2 text-sm">
                    <span className="block font-semibold">{candidate.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {openingTitle(candidate.openingId)} ·{" "}
                      {candidate.score === null ? "Not assessed" : `Score ${candidate.score}`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Page>
  );
}

function IntegrationView({ id, onConnect }: { id: DemoView; onConnect: () => void }) {
  const item = DEMO_INTEGRATIONS.find((entry) => entry.id === id);
  const unavailable = item?.state === "unavailable";
  return (
    <Page
      title={item?.name ?? "Integration"}
      text={
        unavailable
          ? "Slack is not available in this demonstration, so there is nothing to configure."
          : `${item?.name ?? "This system"} is not connected. No profiles, repositories, issues, tasks, or files are invented here.`
      }
    >
      <p className="text-sm">Status: {unavailable ? "Not available yet" : "Not connected"}</p>
      {unavailable ? (
        <button
          type="button"
          disabled
          className="mt-4 min-h-11 rounded-lg border border-white/10 px-4 text-sm opacity-60"
        >
          Slack is not available
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="tiq-action mt-4 min-h-11 rounded-lg px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Discuss connecting {item?.name}
        </button>
      )}
    </Page>
  );
}

function AdminView({ view }: { view: "organization" | "users" | "permissions" | "billing" }) {
  if (view === "organization") {
    return (
      <Page
        title="Organization"
        text="This profile describes the fictional demonstration organization. It is not your company."
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          <Stat label="Name" value={talentDemo.organization} />
          <Stat label="Employees" value={String(talentDemo.kpis.headcount)} />
          <Stat label="Period" value={talentDemo.period} />
          <Stat label="Source" value={talentDemo.source} />
        </dl>
      </Page>
    );
  }
  if (view === "users") {
    return (
      <Page
        title="Users"
        text="These seats are fictional and cannot sign in. Authentication on this site is unchanged."
      >
        <ul className="space-y-3">
          {talentDemo.users.map((user) => (
            <li key={user.id} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full text-[11px] font-bold",
                  tone(user.id),
                )}
              >
                {initials(user.name)}
              </span>
              <span>
                <span className="block font-semibold">{user.name}</span>
                <span className="text-muted-foreground">
                  {user.role} · {user.email}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Page>
    );
  }
  if (view === "permissions") {
    return (
      <Page
        title="Permissions"
        text="This matrix describes the demonstration only. It does not grant or remove access."
      >
        <ul className="space-y-3 text-sm">
          <li>
            <strong>Demo admin.</strong> Can view every sample panel and open a contact inquiry.
          </li>
          <li>
            <strong>Demo analyst.</strong> Can view dashboards and named profiles.
          </li>
          <li>
            <strong>Demo recruiter.</strong> Can view the sample hiring pipeline.
          </li>
        </ul>
      </Page>
    );
  }
  return (
    <Page
      title="Billing"
      text="No subscription is active inside this demonstration, and no invoices are shown."
    >
      <p className="text-sm">
        Plan checkout stays on the pricing section and is a separate one-time payment. It does not
        turn this demo into a live workspace.
      </p>
      <a
        href="#pricing"
        className="tiq-action mt-4 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        View plans
      </a>
    </Page>
  );
}

function Page({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-highlight">Demo Data</p>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{text}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="break-words font-medium">{value}</dd>
    </div>
  );
}

function PersonSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className={cn(fieldClass, "mt-2")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {talentDemo.people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function CompareCard({ person }: { person: DemoPerson }) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <PersonLine person={person} />
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <Stat label="Skills" value={`${person.skillsCoverage}%`} />
        <Stat label="Capacity" value={`${person.capacityPct}%`} />
      </dl>
    </div>
  );
}

function CandidateList({ items, empty }: { items: readonly DemoCandidate[]; empty: string }) {
  if (items.length === 0)
    return empty ? <p className="mt-2 text-sm text-muted-foreground">{empty}</p> : null;
  return (
    <ul className="mt-2 space-y-2">
      {items.map((candidate) => (
        <li key={candidate.id} className="rounded-xl border border-white/10 p-3 text-sm">
          <span className="font-semibold">{candidate.name}</span>
          <span className="mt-1 block text-muted-foreground">
            {candidate.title} · {openingTitle(candidate.openingId)} · {candidate.stage} ·{" "}
            {candidate.score === null ? "Not assessed" : `Illustrative score ${candidate.score}`}
          </span>
        </li>
      ))}
    </ul>
  );
}
