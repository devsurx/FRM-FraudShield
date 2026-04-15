import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pieColors = ["#5cf0a5", "#34d399", "#1f9d68", "#86efac"];

const tooltipStyle = {
  background: "#0a0f0d",
  border: "1px solid rgba(71,255,157,0.1)",
  borderRadius: "16px",
  color: "#e7f2ec",
};

function AnalyticsSection({
  Panel,
  ChartCard,
  StatTile,
  fraudTrend,
  riskDistribution,
  rulePerformance,
  analystSla,
  falsePositiveRate,
  confirmedPrevention,
}) {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <Panel
        title="Fraud Analytics"
        eyebrow="Pattern intelligence"
        description="The analytics surface helps the fraud team understand where risk is rising, which controls are paying off, and how intervention effectiveness changes through the day."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Alert surge by hour">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={fraudTrend}>
                <defs>
                  <linearGradient id="alertsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5cf0a5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5cf0a5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(71, 255, 157, 0.06)" vertical={false} />
                <XAxis dataKey="hour" stroke="#7dd3a8" />
                <YAxis stroke="#7dd3a8" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="alerts"
                  stroke="#5cf0a5"
                  fill="url(#alertsFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke="#34d399"
                  fill="url(#blockedFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Risk distribution">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell
                      key={entry.band}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-300/72">
              {riskDistribution.map((entry, index) => (
                <div key={entry.band} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  {entry.band} score band
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </Panel>

      <Panel
        title="Rule Effectiveness"
        eyebrow="Control tuning"
        description="A production FRM lives or dies by rule quality. These controls show hit volume and how often those hits turn into meaningful action."
      >
        <ChartCard title="Hits and conversion">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={rulePerformance}>
              <CartesianGrid stroke="rgba(71, 255, 157, 0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#7dd3a8"
                tickLine={false}
                angle={-18}
                height={70}
              />
              <YAxis stroke="#7dd3a8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="hits" fill="#5cf0a5" radius={[10, 10, 0, 0]} />
              <Bar dataKey="conversion" fill="#34d399" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatTile label="Analyst SLA" value={analystSla} tone="cyan" />
          <StatTile label="False positive rate" value={falsePositiveRate} tone="amber" />
          <StatTile label="Confirmed prevention" value={confirmedPrevention} tone="rose" />
        </div>
      </Panel>
    </section>
  );
}

export default AnalyticsSection;
