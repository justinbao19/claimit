export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.32),transparent_22%),radial-gradient(circle_at_78%_18%,rgba(191,219,254,0.28),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fafc_42%,#eef2ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(76,29,149,0.28),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.24),transparent_28%),linear-gradient(180deg,#020617_0%,#0b1120_45%,#0f172a_100%)]" />
      <div className="absolute left-1/2 top-0 h-[640px] w-[880px] -translate-x-1/2 rounded-full bg-violet-500/8 blur-[140px] dark:bg-violet-500/10" />
      <div className="absolute bottom-[-120px] right-[-40px] h-[420px] w-[420px] rounded-full bg-cyan-400/8 blur-[140px] dark:bg-cyan-400/10" />
      <div className="absolute inset-0 opacity-[0.26] [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:40px_40px] dark:opacity-[0.18]" />
    </div>
  );
}
