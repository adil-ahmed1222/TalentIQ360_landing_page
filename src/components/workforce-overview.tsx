import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DemoWorkspace } from "@/components/demo-workspace";
import { resolveWorkforceStatus } from "@/data/workforce-demo";

export function WorkforceOverview({ onConnect }: { onConnect: () => void }) {
  const [showDemo, setShowDemo] = useState(true);
  const status = resolveWorkforceStatus();
  const showingDemo = status === "DEMO MODE" && showDemo;

  return (
    <section className="tiq-demo-section section-divider py-16 md:py-24 xl:py-32">
      <div className="mx-auto w-[min(100%-2rem,1440px)] md:w-[min(100%-3rem,1440px)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/images/talentiq-logo.png"
                alt=""
                width={1024}
                height={917}
                draggable={false}
                className="h-12 w-auto object-contain"
              />
              <p className="eyebrow mb-0">Workforce overview</p>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight text-balance">
              A labeled product demonstration, until a source is connected.
            </h2>
            <p className="text-muted-foreground mt-5 text-base md:text-lg leading-relaxed">
              GitHub, Jira, ClickUp, Excel, LinkedIn, and Slack are not connected, so this workspace
              cannot show your organization. Every figure below comes from one fictional company and
              is marked Demo Data.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="glass"
              onClick={onConnect}
              className="h-auto min-h-11 whitespace-normal"
            >
              Connect integrations
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowDemo((value) => !value)}
              className="h-auto min-h-11 whitespace-normal"
            >
              {showingDemo ? "Exit demo mode" : "View demonstration"}
            </Button>
          </div>
        </div>

        {showingDemo ? (
          <DemoWorkspace onConnect={onConnect} />
        ) : (
          <div className="glass-panel mt-10 grid min-h-72 place-items-center rounded-2xl p-8 text-center">
            <div>
              <p className="font-display text-lg font-semibold">
                Demo mode is off, and no live source is connected.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                There is no authorized workforce feed to display. Turn the demonstration back on to
                see the illustrative workspace. Status: {status}.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
