export function Panel({ eyebrow, title, description, children, sectionRef }) {
  return (
    <section
      ref={sectionRef}
      className="rounded-[24px] border border-emerald-300/[0.08] bg-[linear-gradient(180deg,rgba(13,18,16,0.92),rgba(8,11,10,0.9))] p-5 shadow-glow backdrop-blur lift-hover"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/55">{eyebrow}</p>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-50">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300/72">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-emerald-300/[0.07] bg-black/20 px-4 py-3 lift-hover">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-400/75">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-50">{value}</p>
      <p className="mt-1 text-xs text-zinc-500/90">{detail}</p>
    </div>
  );
}

export function DecisionRow({ title, score, action }) {
  return (
    <div className="rounded-2xl border border-emerald-300/[0.06] bg-black/18 p-4 lift-hover">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium text-zinc-100">{title}</h3>
        <span className="rounded-full border border-emerald-300/[0.08] bg-emerald-300/[0.04] px-3 py-1 text-xs text-emerald-100/80">
          {score}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-300/72">{action}</p>
    </div>
  );
}

export function QueueLine({ name, load, fill }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-200">{name}</span>
        <span className="text-zinc-500/90">{load}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-300/80 via-emerald-400/65 to-lime-300/55 shadow-[0_0_18px_rgba(71,255,157,0.18)]"
          style={{ width: fill }}
        />
      </div>
    </div>
  );
}

export function ChartCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-emerald-300/[0.06] bg-black/18 p-4 lift-hover">
      <h3 className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-100/68">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function StatTile({ label, value, tone }) {
  const tones = {
    cyan: "border-emerald-300/[0.08] bg-emerald-300/[0.05] text-zinc-100",
    amber: "border-lime-300/[0.08] bg-lime-300/[0.045] text-zinc-100",
    rose: "border-green-300/[0.08] bg-green-300/[0.045] text-zinc-100",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-[0.24em] opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

export function ActionButton({ label, onClick, emphasis = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        emphasis
          ? "border border-emerald-300/[0.12] bg-emerald-300/[0.08] text-emerald-50 shadow-[0_0_18px_rgba(71,255,157,0.08)] hover:bg-emerald-300/[0.12]"
          : "border border-white/6 bg-white/[0.04] text-zinc-100 hover:border-emerald-300/[0.1] hover:bg-emerald-300/[0.05]"
      }`}
    >
      {label}
    </button>
  );
}

export function SmallButton({ label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
        disabled
          ? "cursor-not-allowed bg-white/5 text-zinc-600"
          : "border border-emerald-300/[0.07] bg-white/[0.04] text-zinc-200 hover:bg-emerald-300/[0.06] hover:text-emerald-50"
      }`}
    >
      {label}
    </button>
  );
}

export function GuideStep({ title, text }) {
  return (
    <div className="rounded-2xl border border-emerald-300/[0.06] bg-black/18 p-4">
      <p className="text-sm font-medium text-zinc-100">{title}</p>
      <p className="mt-2 text-sm text-zinc-300/72">{text}</p>
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-300/[0.08] bg-black/14 p-5 text-sm text-zinc-500/90">
      {text}
    </div>
  );
}
