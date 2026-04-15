import { EmptyState, Panel } from "./ui";

export default function MonitoringSection({
  formatCurrency,
  getRiskLabel,
  riskFilter,
  setRiskFilter,
  searchQuery,
  setSearchQuery,
  severityStyles,
  statusStyles,
  transactions,
}) {
  return (
    <Panel
      title="Real-Time Monitoring"
      eyebrow="Transaction stream"
      description="Transactions are evaluated in the browser with a simple ruleset. Filter the queue, search by customer or UPI ID, and inspect why the score moved."
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", "High", "Medium", "Low"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setRiskFilter(label)}
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                riskFilter === label
                  ? "border border-emerald-300/[0.12] bg-emerald-300/[0.07] text-emerald-50"
                  : "border border-white/6 bg-white/[0.04] text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search txn, user, payee, or UPI"
          className="w-full rounded-2xl border border-emerald-300/[0.08] bg-black/18 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 lg:max-w-xs"
        />
      </div>

      <div className="space-y-3">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="rounded-3xl border border-emerald-300/[0.06] bg-black/18 p-4 transition hover:border-emerald-300/[0.1] hover:bg-black/22 lift-hover"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/6 bg-white/[0.04] px-3 py-1 text-xs tracking-[0.18em] text-zinc-400/85">
                    {txn.time}
                  </span>
                  <span className="rounded-full border border-emerald-300/[0.08] bg-emerald-300/[0.04] px-3 py-1 text-xs text-emerald-100/75">
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
                <h3 className="mt-3 text-xl font-semibold text-zinc-50">
                  {formatCurrency(txn.amount)} to {txn.payee}
                </h3>
                <p className="mt-1 text-sm text-zinc-300/74">
                  {txn.user} ({txn.upiId}) | {txn.bank} | {txn.city}
                </p>
                <p className="mt-1 text-sm text-zinc-500/90">
                  Device signal: {txn.device}
                </p>
              </div>

              <div className="min-w-[220px]">
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/50">
                  Risk score
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-semibold text-zinc-50">{txn.risk}</span>
                  <span className={`pb-1 text-sm ${statusStyles[txn.status]}`}>
                    {txn.status}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/5">
                  <div
                    className={`h-2 rounded-full ${
                      txn.risk >= 85
                        ? "bg-emerald-200 shadow-[0_0_18px_rgba(71,255,157,0.22)]"
                        : txn.risk >= 60
                          ? "bg-emerald-300/80 shadow-[0_0_16px_rgba(71,255,157,0.18)]"
                          : "bg-emerald-400/60"
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
                  className="rounded-full border border-white/6 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400/85"
                >
                  {rule}
                </span>
              ))}
            </div>
          </div>
        ))}
        {transactions.length === 0 ? (
          <EmptyState text="No transactions match the current filters." />
        ) : null}
      </div>
    </Panel>
  );
}
