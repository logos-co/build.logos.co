import React from "react";

export type ContributionStats = {
  contributions: string;
  contributors: string;
  repositories: string;
  circles?: string;
};

const STAT_LABELS: { key: keyof ContributionStats; label: string }[] = [
  { key: "contributions", label: "Contributions" },
  { key: "contributors", label: "Contributors" },
  { key: "repositories", label: "Repositories" },
  { key: "circles", label: "Circles" },
];

export default function ContributionStats({
  stats,
}: {
  stats: ContributionStats;
}) {
  const items = STAT_LABELS.filter(({ key }) => stats[key] != null);

  return (
    <section className="pb-v-space-sm theme-default">
      <div className="mx-auto px-margin max-w-site-max-w-margin">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px border rounded-[12px] overflow-hidden">
          {items.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center gap-1 py-gutter bg-dark-green/2"
            >
              <span className="font-mono text-2xl md:text-3xl font-semibold leading-none">
                {stats[key]}
              </span>
              <span className="text-xs opacity-40 uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
