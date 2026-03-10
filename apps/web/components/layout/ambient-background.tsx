export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.1),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(125,141,158,0.08),transparent_22%),linear-gradient(180deg,var(--background)_0%,var(--surface)_44%,#f6f1ea_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.12),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(143,162,181,0.08),transparent_24%),linear-gradient(180deg,var(--background)_0%,#151a1f_52%,#101315_100%)]" />
      <div className="absolute left-1/2 top-[-140px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-[rgba(196,162,123,0.08)] blur-[140px] dark:bg-[rgba(196,162,123,0.08)]" />
      <div className="absolute bottom-[-120px] right-[-60px] h-[360px] w-[360px] rounded-full bg-[rgba(125,141,158,0.06)] blur-[150px] dark:bg-[rgba(143,162,181,0.08)]" />
      <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(112,104,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(112,104,94,0.04)_1px,transparent_1px)] [background-size:44px_44px] dark:opacity-[0.08]" />
    </div>
  );
}
