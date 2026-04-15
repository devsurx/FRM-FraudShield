export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050706]">
      <div className="absolute inset-0 bg-grid bg-[size:54px_54px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(71,255,157,0.16),transparent_26%)]" />

      <div className="relative mx-6 flex max-w-xl flex-col items-center rounded-[32px] border border-emerald-300/[0.12] bg-[linear-gradient(180deg,rgba(10,14,12,0.96),rgba(6,8,7,0.96))] px-8 py-10 text-center shadow-glow splash-enter">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent splash-scan" />

        <img
          src="/frm-logo.png"
          alt="Fraud Risk Management System logo"
          className="h-36 w-36 rounded-3xl object-cover logo-float"
        />

        <p className="mt-6 text-xs uppercase tracking-[0.45em] text-emerald-100/55">
          Fraud Risk Management System
        </p>
        <h1 className="mt-3 max-w-md text-4xl font-semibold leading-tight text-zinc-50">
          Secure. Prevent. Protect.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-300/72">
          Initializing real-time UPI monitoring, decision support, and analyst
          investigation workspace.
        </p>

        <div className="mt-8 h-1.5 w-52 overflow-hidden rounded-full bg-white/6">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-200 splash-loader" />
        </div>
      </div>
    </div>
  );
}
