import { EmptyState, GuideStep, Panel, SmallButton } from "./ui";

export default function AlertsSection({
  alertFilter,
  setAlertFilter,
  alerts,
  cases,
  assignAlert,
  createCase,
  escalateAlert,
  severityStyles,
  statusStyles,
}) {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel
        title="Alert Workbench"
        eyebrow="Suspicious activity"
        description="Alerts are now actionable. Assign them, escalate them, or convert them into cases with a single click."
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {["All", "High", "Medium"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setAlertFilter(label)}
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                alertFilter === label
                  ? "border border-emerald-300/[0.12] bg-emerald-300/[0.07] text-emerald-50"
                  : "border border-white/6 bg-white/[0.04] text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => {
            const hasCase = cases.some((item) => item.linkedAlert === alert.id);

            return (
              <div key={alert.id} className="rounded-3xl border border-emerald-300/[0.06] bg-black/18 p-4 lift-hover">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-zinc-50">{alert.id}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          severityStyles[alert.severity]
                        }`}
                      >
                        {alert.severity} | {alert.score}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300/74">
                      {alert.transactionId} | {alert.queue} | {alert.age}
                    </p>
                    <p className="mt-2 text-sm text-zinc-500/90">{alert.reason}</p>
                    <p className="mt-2 text-sm text-zinc-300/72">Owner: {alert.assignee}</p>
                  </div>
                  <div className="text-sm">
                    <p className={statusStyles[alert.status]}>{alert.status}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <SmallButton label="Assign" onClick={() => assignAlert(alert.id)} />
                  <SmallButton label="Escalate" onClick={() => escalateAlert(alert.id)} />
                  <SmallButton
                    label={hasCase ? "Case exists" : "Create case"}
                    onClick={() => createCase(alert.id)}
                    disabled={hasCase}
                  />
                </div>
              </div>
            );
          })}
          {alerts.length === 0 ? <EmptyState text="No alerts in this severity band." /> : null}
        </div>
      </Panel>

      <Panel
        title="Analyst Guide"
        eyebrow="Working pattern"
        description="A simplified walkthrough of how the analyst should use this interface during a suspicious UPI burst."
      >
        <div className="space-y-4">
          <GuideStep
            title="1. Monitor"
            text="Use the transaction filters to isolate the risky band or search for a user, UPI handle, or payee."
          />
          <GuideStep
            title="2. Triage"
            text="Assign alerts that need ownership and escalate anything that looks like active account takeover or mule activity."
          />
          <GuideStep
            title="3. Investigate"
            text="Create a case when the alert requires customer outreach, bank action, or a more formal decision trail."
          />
          <GuideStep
            title="4. Close"
            text="Advance the case status until it is closed and watch the queue and analytics update accordingly."
          />
        </div>
      </Panel>
    </section>
  );
}
