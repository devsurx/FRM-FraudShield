import {
  lazy,
  startTransition,
  Suspense,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import AlertsSection from "./components/AlertsSection";
import CasesSection from "./components/CasesSection";
import MonitoringSection from "./components/MonitoringSection";
import SplashScreen from "./components/SplashScreen";
import {
  ActionButton,
  ChartCard,
  DecisionRow,
  MetricCard,
  Panel,
  QueueLine,
  StatTile,
} from "./components/ui";
import {
  buildAlertFromTransaction,
  buildCaseFromAlert,
  buildFraudTrend,
  buildRiskDistribution,
  buildRulePerformance,
  findTransactionByAlert,
  generateSimulatedTransaction,
  getOpenQueues,
  getRiskLabel,
  nextCaseStatus,
  pickAnalyst,
  randomReason,
} from "./lib/frmEngine";

const AnalyticsSection = lazy(() => import("./AnalyticsSection"));

const navItems = [
  { id: "overview", label: "Command Center" },
  { id: "alerts", label: "Alerts" },
  { id: "cases", label: "Cases" },
  { id: "analytics", label: "Analytics" },
];

const severityStyles = {
  Low: "bg-emerald-300/[0.08] text-emerald-100 ring-1 ring-inset ring-emerald-300/[0.1]",
  Medium: "bg-lime-300/[0.08] text-lime-100 ring-1 ring-inset ring-lime-300/[0.1]",
  High: "bg-green-300/[0.08] text-green-100 ring-1 ring-inset ring-green-300/[0.1]",
  Critical: "bg-emerald-200/[0.1] text-emerald-50 ring-1 ring-inset ring-emerald-200/[0.14]",
};

const statusStyles = {
  Approved: "text-emerald-200",
  Blocked: "text-rose-200",
  Alerted: "text-amber-100",
  "Under Review": "text-cyan-200",
  Open: "text-amber-100",
  Escalated: "text-rose-200",
  Monitoring: "text-cyan-200",
  Closed: "text-slate-300",
  Investigating: "text-amber-100",
  "Pending Bank Action": "text-cyan-200",
  "Awaiting Customer Callback": "text-slate-100",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function FunctionalApp() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cases, setCases] = useState([]);
  const [liveMode, setLiveMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");
  const [riskFilter, setRiskFilter] = useState("All");
  const [alertFilter, setAlertFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFeed, setActivityFeed] = useState([
    "Workspace initialized with an empty live queue.",
    "Use the simulation controls to start the stream.",
    "Real-time monitoring is ready for analyst actions.",
  ]);
  const deferredSearch = useDeferredValue(searchQuery);
  const overviewRef = useRef(null);
  const alertsRef = useRef(null);
  const casesRef = useRef(null);
  const analyticsRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!liveMode) return undefined;
    const timer = setInterval(() => {
      ingestTransaction(Math.random() > 0.55 ? "risky" : "normal", true);
    }, 9000);
    return () => clearInterval(timer);
  }, [liveMode, transactions.length, alerts.length, cases.length]);

  const visibleTransactions = transactions.filter((txn) => {
    const matchesRisk = riskFilter === "All" || getRiskLabel(txn.risk) === riskFilter;
    const q = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      txn.id.toLowerCase().includes(q) ||
      txn.user.toLowerCase().includes(q) ||
      txn.payee.toLowerCase().includes(q) ||
      txn.upiId.toLowerCase().includes(q);
    return matchesRisk && matchesSearch;
  });

  const visibleAlerts = alerts.filter((alert) => {
    if (alertFilter === "All") return true;
    return alert.severity === alertFilter;
  });

  const highRiskTransactions = transactions.filter((txn) => txn.risk >= 75).length;
  const openAlerts = alerts.filter((alert) => alert.status !== "Closed").length;
  const activeCases = cases.filter((item) => item.status !== "Closed").length;
  const blockedValue = transactions
    .filter((txn) => txn.status === "Blocked")
    .reduce((sum, txn) => sum + txn.amount, 0);
  const riskDistribution = buildRiskDistribution(transactions);
  const fraudTrend = buildFraudTrend(transactions, alerts);
  const rulePerformance = buildRulePerformance(transactions);
  const queueSnapshot = getOpenQueues(alerts);

  function logActivity(message) {
    setActivityFeed((prev) => [message, ...prev].slice(0, 6));
  }

  function ingestTransaction(kind, automated = false) {
    const eventIndex = Date.now() % 100000;
    const transaction = generateSimulatedTransaction(kind, eventIndex);
    const alert = buildAlertFromTransaction(transaction, eventIndex);

    startTransition(() => {
      setTransactions((prev) => [transaction, ...prev].slice(0, 18));
      if (alert) setAlerts((prev) => [alert, ...prev].slice(0, 12));
    });

    logActivity(
      `${automated ? "Live mode" : "Manual ingest"} added ${transaction.id} with ${transaction.risk} risk.`,
    );
  }

  function assignAlert(alertId) {
    setAlerts((prev) =>
      prev.map((alert, index) =>
        alert.id === alertId
          ? { ...alert, assignee: pickAnalyst(index + transactions.length), status: "Open" }
          : alert,
      ),
    );
    logActivity(`Alert ${alertId} was assigned to a fraud analyst.`);
  }

  function escalateAlert(alertId) {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: alert.status === "Escalated" ? "Monitoring" : "Escalated",
              queue: alert.status === "Escalated" ? "Behavioral" : "Priority UPI",
              reason:
                alert.status === "Escalated"
                  ? alert.reason
                  : `${alert.reason} + ${randomReason(alert.score)}`,
            }
          : alert,
      ),
    );
    logActivity(`Alert ${alertId} was pushed through escalation.`);
  }

  function createCase(alertId) {
    if (cases.some((item) => item.linkedAlert === alertId)) return;
    const alert = alerts.find((item) => item.id === alertId);
    const transaction = alert ? findTransactionByAlert(alert, transactions) : null;
    if (!alert || !transaction) return;

    const newCase = buildCaseFromAlert(alert, transaction, cases.length + transactions.length);
    setCases((prev) => [newCase, ...prev]);
    setAlerts((prev) => prev.map((item) => (item.id === alertId ? { ...item, status: "Escalated" } : item)));
    logActivity(`Created ${newCase.id} from ${alertId} for ${transaction.user}.`);
  }

  function advanceCase(caseId) {
    setCases((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? {
              ...item,
              status: nextCaseStatus(item.status),
              disposition:
                nextCaseStatus(item.status) === "Closed"
                  ? "Closed after analyst decision"
                  : item.disposition,
              updatedAt: new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
            }
          : item,
      ),
    );
    logActivity(`Case ${caseId} moved to the next workflow stage.`);
  }

  function jumpTo(section) {
    setActiveNav(section);
    const refMap = { overview: overviewRef, alerts: alertsRef, cases: casesRef, analytics: analyticsRef };
    refMap[section].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="relative overflow-hidden text-mist">
      {showSplash ? <SplashScreen /> : null}
      <div className="absolute inset-0 -z-10 bg-grid bg-[size:44px_44px] opacity-20" />
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
        <aside className="mb-4 flex w-full flex-col justify-between rounded-[24px] border border-emerald-300/[0.08] bg-[linear-gradient(180deg,rgba(12,16,14,0.94),rgba(8,11,10,0.92))] p-5 shadow-glow backdrop-blur section-enter lg:mb-0 lg:mr-6 lg:min-h-[calc(100vh-2rem)] lg:w-[280px]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/frm-logo.png"
                alt="FRM logo"
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-emerald-300/[0.12]"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-100/55">Fraud Risk Monitoring</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-50">FRM Command Center</h1>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300/72">
              Real-time UPI surveillance, alert triage, and analyst decision support in one operating surface.
            </p>
            <nav className="mt-8 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpTo(item.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    activeNav === item.id
                      ? "border-emerald-300/[0.14] bg-emerald-300/[0.07] text-emerald-50 shadow-[0_0_22px_rgba(71,255,157,0.06)]"
                      : "border-white/6 bg-black/18 text-zinc-200 hover:border-emerald-300/[0.1] hover:bg-emerald-300/[0.045]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-emerald-100/45">-&gt;</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-emerald-300/[0.08] bg-emerald-300/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/55">Live posture</p>
              <p className="mt-2 text-3xl font-semibold text-slate-50">{highRiskTransactions >= 4 ? "Elevated" : "Stable"}</p>
              <p className="mt-2 text-sm text-zinc-300/72">{highRiskTransactions} high-risk transactions in stream.</p>
            </div>
            <div className="rounded-3xl border border-white/6 bg-black/16 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/50">Live ingest</p>
                  <p className="mt-1 text-sm text-zinc-200">{liveMode ? "Streaming" : "Paused"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLiveMode((prev) => !prev)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold ${
                    liveMode
                      ? "border border-emerald-300/[0.12] bg-emerald-300/[0.08] text-emerald-50"
                      : "border border-white/6 bg-white/[0.04] text-zinc-200"
                  }`}
                >
                  {liveMode ? "Pause" : "Start"}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header ref={overviewRef} className="rounded-[24px] border border-emerald-300/[0.08] bg-[linear-gradient(180deg,rgba(12,16,14,0.9),rgba(8,11,10,0.86))] p-5 shadow-glow backdrop-blur section-enter">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-100/55">UPI fraud control room</p>
                <h2 className="mt-2 text-4xl font-semibold text-slate-50">Detect. Prioritize. Investigate.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300/72">
                  The frontend is now stateful: transactions can be ingested, alerts can be worked, and cases can be progressed.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ActionButton label="Simulate normal txn" onClick={() => ingestTransaction("normal")} />
                <ActionButton label="Simulate risky txn" onClick={() => ingestTransaction("risky")} emphasis />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <MetricCard label="Transactions" value={transactions.length} detail="Visible in stream" />
              <MetricCard label="High risk" value={highRiskTransactions} detail="75+ score band" />
              <MetricCard label="Open alerts" value={openAlerts} detail="Requiring action" />
              <MetricCard label="Active cases" value={activeCases} detail="Under investigation" />
              <MetricCard label="Blocked value" value={formatCurrency(blockedValue)} detail="Potential loss prevented" />
            </div>
          </header>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <MonitoringSection
              formatCurrency={formatCurrency}
              getRiskLabel={getRiskLabel}
              riskFilter={riskFilter}
              setRiskFilter={setRiskFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              severityStyles={severityStyles}
              statusStyles={statusStyles}
              transactions={visibleTransactions}
            />
            <div className="space-y-6 section-enter-delayed">
              <Panel title="Decision Engine" eyebrow="Operating logic" description="A simple browser-side ruleset powers the demo scoring and queueing model.">
                <div className="space-y-4">
                  <DecisionRow title="Low risk" score="0-39" action="Approve and retain event context" />
                  <DecisionRow title="Medium risk" score="40-74" action="Generate watch alert for analyst review" />
                  <DecisionRow title="High risk" score="75-100" action="Escalate, hold, or create a case" />
                </div>
              </Panel>
              <Panel title="Queue Snapshot" eyebrow="Analyst load" description="Queue counts react to your alert actions and case creation.">
                <div className="space-y-4">
                  {queueSnapshot.map((queue) => (
                    <QueueLine key={queue.name} name={queue.name} load={`${queue.open} open`} fill={`${Math.min(100, queue.open * 14 + 12)}%`} />
                  ))}
                </div>
              </Panel>
              <Panel title="Activity Feed" eyebrow="Analyst actions" description="A lightweight audit trail of recent operator actions.">
                <div className="space-y-3">
                  {activityFeed.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/6 bg-black/16 p-3 text-sm text-zinc-300/78">{item}</div>
                  ))}
                </div>
              </Panel>
            </div>
          </section>

          <div ref={alertsRef} className="section-enter-delayed">
            <AlertsSection
              alertFilter={alertFilter}
              setAlertFilter={setAlertFilter}
              alerts={visibleAlerts}
              cases={cases}
              assignAlert={assignAlert}
              createCase={createCase}
              escalateAlert={escalateAlert}
              severityStyles={severityStyles}
              statusStyles={statusStyles}
            />
          </div>

          <CasesSection
            advanceCase={advanceCase}
            cases={cases}
            severityStyles={severityStyles}
            statusStyles={statusStyles}
            sectionRef={casesRef}
            className="section-enter-delayed-2"
          />

          <div ref={analyticsRef} className="section-enter-delayed-2">
            <Suspense fallback={<section className="mt-6 rounded-[24px] border border-emerald-300/[0.08] bg-[linear-gradient(180deg,rgba(12,16,14,0.9),rgba(8,11,10,0.86))] p-6 shadow-glow backdrop-blur"><p className="text-xs uppercase tracking-[0.35em] text-emerald-100/55">Analytics</p><h2 className="mt-2 text-2xl font-semibold text-slate-50">Loading intelligence modules...</h2><div className="mt-5 h-32 rounded-3xl border border-white/6 bg-black/16" /></section>}>
              <AnalyticsSection
                Panel={Panel}
                ChartCard={ChartCard}
                StatTile={StatTile}
                fraudTrend={fraudTrend}
                riskDistribution={riskDistribution}
                rulePerformance={rulePerformance}
                analystSla={`${Math.max(2, Math.min(9, openAlerts + 1))}m ${String(8 + activeCases).padStart(2, "0")}s`}
                falsePositiveRate={`${Math.max(8, 24 - highRiskTransactions)}%`}
                confirmedPrevention={formatCurrency(blockedValue)}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
