import { Panel, SmallButton } from "./ui";

export default function CasesSection({
  advanceCase,
  cases,
  severityStyles,
  statusStyles,
  sectionRef,
  className = "",
}) {
  return (
    <section ref={sectionRef} className={`mt-6 ${className}`}>
      <Panel
        title="Case Management"
        eyebrow="Investigation lifecycle"
        description="Cases move through a simple state machine so you can demonstrate the end-to-end analyst workflow from alert creation to closure."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {cases.map((item) => (
            <div key={item.id} className="rounded-3xl border border-emerald-300/[0.06] bg-black/18 p-4 lift-hover">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold text-zinc-50">{item.id}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${severityStyles[item.priority]}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300/74">
                    {item.customer} | Linked to {item.linkedAlert}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500/90">{item.disposition}</p>
                </div>
                <div className="text-sm text-zinc-200/85">
                  <p>{item.investigator}</p>
                  <p className={statusStyles[item.status]}>{item.status}</p>
                  <p className="text-zinc-500/90">Updated {item.updatedAt}</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-300/[0.08] bg-emerald-300/[0.04] px-4 py-3 text-sm text-zinc-200/90">
                Next action: {item.nextAction}
              </div>
              <div className="mt-4">
                <SmallButton
                  label={item.status === "Closed" ? "Closed" : "Advance case"}
                  onClick={() => advanceCase(item.id)}
                  disabled={item.status === "Closed"}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
