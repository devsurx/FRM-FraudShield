import { lazy, Suspense } from "react";
import { alerts, cases, transactions } from "./data/mockData";

const navItems = [
  { id: "overview", label: "Command Center" },
  { id: "alerts", label: "Alerts" },
  { id: "cases", label: "Cases" },
  { id: "analytics", label: "Analytics" },
];

const severityStyles = {
  Low: "bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  Medium: "bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-400/30",
  High: "bg-rose-500/15 text-rose-100 ring-1 ring-inset ring-rose-400/30",
  Critical: "bg-rose-600/20 text-rose-50 ring-1 ring-inset ring-rose-300/40",
};

const statusStyles = {
  Approved: "text-emerald-200",
  Blocked: "text-rose-200",
  Alerted: "text-amber-100",
  "Under Review": "text-cyan-200",
  Open: "text-amber-100",
  Escalated: "text-rose-200",
  Monitoring: "text-cyan-200",
  Investigating: "text-amber-100",
  "Pending Bank Action": "text-cyan-200",
  "Awaiting Customer Callback": "text-slate-100",
};

const AnalyticsSection = lazy(() => import("./AnalyticsSection"));

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const totalMonitored = transactions.length;
  const openAlerts = alerts.filter((alert) => alert.status !== "Monitoring").length;
  const activeCases = cases.filter((item) => item.status !== "Closed").length;
  const blockedValue = transactions
    .filter((txn) => txn.status === "Blocked")
    .reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div className="relative overflow-hidden text-mist">
      <div className="absolute inset-0 -z-10 bg-grid bg-[size:44px_44px] opacity-20" />
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
        <aside className="mb-4 flex w-full flex-col justify-between rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur lg:mb-0 lg:mr-6 lg:min-h-[calc(100vh-2rem)] lg:w-[280px]">
          <div>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
                Fraud Risk Monitoring
              </p>
              <h1 className="mt-3 text-3xl font-bold text-white">
                FRM Command Center
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-200/75">
                Real-time UPI surveillance, alert triage, and analyst decision
                support in one operating surface.
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
                >
                  <span>{item.label}</span>
                  <span className="text-cyan-200/70">-&gt;</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">
              Live posture
            </p>
            <p className="mt-2 text-3xl font-bold text-white">Elevated</p>
            <p className="mt-2 text-sm text-cyan-100/80">
              3 critical interventions pending in the last 15 minutes.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300/75">
                  UPI fraud control room
                </p>
                <h2 className="mt-2 text-4xl font-bold text-white">
                  Detect. Prioritize. Investigate.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200/75">
                  This interface mirrors how an analyst team actually works:
                  live transaction visibility, rule-based risk scoring, queue
                  management, case creation, and fraud trend monitoring.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricCard label="Transactions" value={totalMonitored} detail="Last burst window" />
                <MetricCard label="Open alerts" value={openAlerts} detail="Needing triage" />
                <MetricCard label="Active cases" value={activeCases} detail="Investigator owned" />
                <MetricCard
                  label="Blocked value"
                  value={formatCurrency(blockedValue)}
                  detail="Loss prevented"
                />
              </div>
            </div>
          </header>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <Panel
              title="Real-Time Monitoring"
              eyebrow="Transaction stream"
              description="Every incoming payment is evaluated as it arrives. Analysts can immediately inspect the transaction context, the triggered controls, and the system decision."
            >
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="rounded-3xl border border-white/8 bg-slate-950/45 p-4 transition hover:border-cyan-300/30 hover:bg-slate-900/60"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/8 px-3 py-1 text-xs tracking-[0.18em] text-slate-200/75">
                            {txn.time}
                          </span>
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                            {txn.channel}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              severityStyles[getRiskLabel(txn.risk)]
                            }`}
                          >
                            {getRiskLabel(txn.risk)} risk
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-white">
                          {formatCurrency(txn.amount)} to {txn.payee}
                        </h3>
                        <p className="mt-1 text-sm text-slate-300/80">
                          {txn.user} ({txn.upiId}) | {txn.bank} | {txn.city}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Device signal: {txn.device}
                        </p>
                      </div>

                      <div className="min-w-[180px]">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                          Risk score
                        </p>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-4xl font-bold text-white">{txn.risk}</span>
                          <span className={`pb-1 text-sm ${statusStyles[txn.status]}`}>
                            {txn.status}
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/8">
                          <div
                            className={`h-2 rounded-full ${
                              txn.risk >= 85
                                ? "bg-rose-400"
                                : txn.risk >= 60
                                  ? "bg-amber-300"
                                  : "bg-emerald-300"
                            }`}
                            style={{ width: `${txn.risk}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {txn.ruleHits.map((rule) => (
                        <span
                          key={rule}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200/80"
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="space-y-6">
              <Panel
                title="Decision Engine"
                eyebrow="Operating logic"
                description="The platform blends deterministic controls and prioritization bands so analysts spend time where it matters."
              >
                <div className="space-y-4">
                  <DecisionRow
                    title="Low risk"
                    score="0-39"
                    action="Auto-pass with log retention"
                  />
                  <DecisionRow
                    title="Medium risk"
                    score="40-74"
                    action="Create watch alert and queue for review"
                  />
                  <DecisionRow
                    title="High risk"
                    score="75-100"
                    action="Escalate, block, or convert into case"
                  />
                </div>
              </Panel>

              <Panel
                title="Queue Snapshot"
                eyebrow="Analyst load"
                description="A quick view of the current operating pressure across frontline analysts."
              >
                <div className="space-y-4">
                  <QueueLine name="Priority UPI" load="9 open" fill="78%" />
                  <QueueLine name="Behavioral" load="5 open" fill="46%" />
                  <QueueLine name="Mule Activity" load="3 open" fill="34%" />
                  <QueueLine name="Customer Verification" load="6 open" fill="57%" />
                </div>
              </Panel>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Panel
              title="Alert Workbench"
              eyebrow="Suspicious activity"
              description="Suspicious transactions are surfaced with severity, ownership, and a clear explanation of why the system flagged them."
            >
              <div className="overflow-hidden rounded-3xl border border-white/8">
                <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr_0.7fr] bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.25em] text-slate-300/70">
                  <span>Alert</span>
                  <span>Score</span>
                  <span>Queue</span>
                  <span>Owner</span>
                  <span>Status</span>
                </div>
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="grid grid-cols-1 gap-3 border-t border-white/8 px-4 py-4 text-sm text-slate-100 md:grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr_0.7fr]"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {alert.id} | {alert.transactionId}
                      </p>
                      <p className="mt-1 text-slate-300/75">{alert.reason}</p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs ${
                          severityStyles[alert.severity]
                        }`}
                      >
                        {alert.severity} | {alert.score}
                      </span>
                    </div>
                    <p>{alert.queue}</p>
                    <p>{alert.assignee}</p>
                    <p className={statusStyles[alert.status]}>{alert.status}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="Case Management"
              eyebrow="Investigation lifecycle"
              description="Alerts become cases when human intervention is needed. Each case captures the owner, current disposition, and next operational action."
            >
              <div className="space-y-4">
                {cases.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/8 bg-slate-950/45 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-semibold text-white">
                            {item.id}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              severityStyles[item.priority]
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300/80">
                          {item.customer} | Linked to {item.linkedAlert}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {item.disposition}
                        </p>
                      </div>
                      <div className="text-sm text-slate-200/85">
                        <p>{item.investigator}</p>
                        <p className={statusStyles[item.status]}>{item.status}</p>
                        <p className="text-slate-400">Updated {item.updatedAt}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50/90">
                      Next action: {item.nextAction}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <Suspense
            fallback={
              <section className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300/70">
                  Analytics
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Loading intelligence modules...
                </h2>
                <div className="mt-5 h-32 rounded-3xl border border-white/8 bg-slate-950/40" />
              </section>
            }
          >
            <AnalyticsSection Panel={Panel} ChartCard={ChartCard} StatTile={StatTile} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function Panel({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-300/70">{eyebrow}</p>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300/75">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/45 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

function DecisionRow({ title, score, action }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-200">
          {score}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-300/75">{action}</p>
    </div>
  );
}

function QueueLine({ name, load, fill }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-100">{name}</span>
        <span className="text-slate-400">{load}</span>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-amber-300 to-rose-400"
          style={{ width: fill }}
        />
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/8 bg-slate-950/40 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-200/75">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StatTile({ label, value, tone }) {
  const tones = {
    cyan: "border-cyan-300/20 bg-cyan-400/10 text-cyan-50",
    amber: "border-amber-300/20 bg-amber-400/10 text-amber-50",
    rose: "border-rose-300/20 bg-rose-400/10 text-rose-50",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-[0.24em] opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function getRiskLabel(score) {
  if (score >= 75) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export default App;
