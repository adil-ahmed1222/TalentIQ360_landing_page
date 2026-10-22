export type WorkforceStatus =
  "LIVE DATA" | "DEMO MODE" | "PARTIALLY CONNECTED" | "CONNECTION ERROR";

export function resolveWorkforceStatus(): WorkforceStatus {
  // No GitHub, Jira, ClickUp, Excel, LinkedIn, or Slack client is configured, so the workspace stays on the labeled demonstration.
  return "DEMO MODE";
}
