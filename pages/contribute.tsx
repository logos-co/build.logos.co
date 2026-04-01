import React, { useState } from "react";
import Head from "next/head";
import Link from "@components/Link";
import TextLink from "@components/TextLink";
import Button from "@components/Button";
import ScrollEntrance from "@components/ScrollEntrance";
import SiteLayout from "@components/SiteLayout";
import cx from "classnames";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { fetchGoodFirstIssues, type IssueData } from "@/lib/issues";
import ContributionStats, {
  type ContributionStats as ContributionStatsType,
} from "@components/ContributionStats";
import { fetchContributionStats } from "@components/ContributionStats/api";

/* ───────────── Helpers ──────────────────────────────────────── */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

function labelColor(hex: string): React.CSSProperties {
  return {
    background: `#${hex}18`,
    color: `#${hex}`,
    borderColor: `#${hex}30`,
  };
}

/* ──────────────────────── Page ──────────────────────────────── */

export default function ContributePage({
  issues,
  repos,
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [activeRepo, setActiveRepo] = useState<string>("all");

  const filtered =
    activeRepo === "all"
      ? issues
      : issues.filter((i) => i.repo === activeRepo);

  return (
    <SiteLayout>
      <Head>
        <title>Contribute | Logos Builders Hub</title>
        <meta name="description" content="Browse open good first issues across the Logos ecosystem. Pick one and start contributing to decentralized technology." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contribute | Logos Builders Hub" />
        <meta property="og:description" content="Browse open good first issues across the Logos ecosystem. Pick one and start contributing to decentralized technology." />
        <meta property="og:url" content="https://build.logos.co/contribute" />
        <meta property="og:image" content="https://build.logos.co/og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Logos_network" />
        <meta name="twitter:title" content="Contribute | Logos Builders Hub" />
        <meta name="twitter:description" content="Browse open good first issues across the Logos ecosystem. Pick one and start contributing." />
        <link rel="canonical" href="https://build.logos.co/contribute" />
      </Head>
            {/* ── Back Link ── */}
            <section className="theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <TextLink to="/" arrow arrowPosition="left" underlined={false}>
                  BUILDERS HUB
                </TextLink>
              </div>
            </section>

            {/* ── Page Header ── */}
            <section className="pt-v-space-sm pb-half-v-space theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <ScrollEntrance className="grid gap-gutter grid-cols-12">
                  <div className="col-span-12 md:col-span-5">
                    <h1 className="h2 text-balance flex items-center gap-3">
                      <img src="/mark.svg" alt="" className="h-[0.8em]" />
                      Contribute
                    </h1>
                  </div>
                  <div className="col-span-12 md:col-span-4 flex items-center">
                    <p className="body-tiny max-w-[26em] text-balance">
                      Open issues across the Logos ecosystem labeled{" "}
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-current/5">
                        good first issue
                      </span>
                      . Pick one and start contributing.
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-3 flex items-center md:justify-end">
                    <Button
                      to="https://github.com/logos-co"
                      target="_blank"
                      arrow
                    >
                      Logos GitHub
                    </Button>
                  </div>
                </ScrollEntrance>
              </div>
            </section>

            {/* ── Stats ── */}
            {stats && <ContributionStats stats={stats} />}

            {/* ── Issues Table ── */}
            <section className="pb-v-space theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <ScrollEntrance>
                  {/* Table container */}
                  <div className="border rounded-[12px] overflow-hidden font-mono">

                    {/* Table header / toolbar */}
                    <div className="bg-dark-green/[0.03] px-gutter py-3 flex flex-wrap items-center justify-between gap-3 border-b">
                      {/* Repo filter tabs */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => setActiveRepo("all")}
                          className={cx(
                            "text-xs px-2.5 py-1 rounded-md cursor-pointer transition-colors",
                            {
                              "bg-dark-green text-bg font-medium": activeRepo === "all",
                              "hover:bg-dark-green/5 opacity-60 hover:opacity-100": activeRepo !== "all",
                            }
                          )}
                        >
                          All
                          <span className="ml-1.5 opacity-60">{issues.length}</span>
                        </button>
                        {repos.map((repo) => {
                          const count = issues.filter((i) => i.repo === repo).length;
                          return (
                            <button
                              key={repo}
                              onClick={() => setActiveRepo(repo)}
                              className={cx(
                                "text-xs px-2.5 py-1 rounded-md cursor-pointer transition-colors",
                                {
                                  "bg-dark-green text-bg font-medium": activeRepo === repo,
                                  "hover:bg-dark-green/5 opacity-60 hover:opacity-100": activeRepo !== repo,
                                }
                              )}
                            >
                              {repo}
                              <span className="ml-1.5 opacity-60">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Issue count */}
                      <span className="text-xs opacity-40">
                        {filtered.length} open {filtered.length === 1 ? "issue" : "issues"}
                      </span>
                    </div>

                    {/* Table body — issue rows */}
                    {filtered.length > 0 ? (
                      <ul>
                        {filtered.map((issue, i) => (
                          <li key={issue.id} className={cx("border-b last:border-b-0 transition-colors hover:bg-dark-green/[0.02]")}>
                            <Link
                              to={issue.url}
                              target="_blank"
                              className="flex items-start gap-3 px-gutter py-3 cursor-pointer"
                            >
                              {/* Open issue icon */}
                              <div className="mt-0.5 shrink-0">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-40">
                                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                                  <circle cx="8" cy="8" r="2" fill="currentColor" />
                                </svg>
                              </div>

                              {/* Main content */}
                              <div className="flex-1 min-w-0">
                                {/* Title + labels row */}
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                  <span className="text-sm leading-snug hover:text-teal transition-colors font-sans">
                                    {issue.title}
                                  </span>
                                  {issue.labels
                                    .filter((l) => l.name !== "good first issue")
                                    .slice(0, 4)
                                    .map((l) => (
                                      <span
                                        key={l.name}
                                        className="text-[10px] px-2 py-px rounded-full border font-medium leading-relaxed"
                                        style={labelColor(l.color)}
                                      >
                                        {l.name}
                                      </span>
                                    ))}
                                </div>
                                {/* Meta row */}
                                <div className="flex items-center gap-3 mt-1 text-[11px] opacity-40">
                                  <span className="font-mono">{issue.repo}</span>
                                  <span>opened {timeAgo(issue.createdAt)}</span>
                                  <span>by {issue.user}</span>
                                  {issue.comments > 0 && (
                                    <span className="inline-flex items-center gap-1">
                                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="opacity-70">
                                        <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
                                      </svg>
                                      {issue.comments}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-v-space text-center">
                        <p className="body-tiny opacity-60">
                          No issues found{activeRepo !== "all" ? ` in ${activeRepo}` : ""}.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollEntrance>
              </div>
            </section>
    </SiteLayout>
  );
}

/* ─────────────── Fetch issues at build time ──────────────────── */

export const getStaticProps: GetStaticProps<{
  issues: IssueData[];
  repos: string[];
  stats: ContributionStatsType | null;
}> = async () => {
  try {
    const [issues, stats] = await Promise.all([
      fetchGoodFirstIssues(),
      fetchContributionStats(),
    ]);
    const repoSet = new Set(issues.map((i) => i.repo));
    const repos = Array.from(repoSet).sort();
    return { props: { issues, repos, stats } };
  } catch (err) {
    console.error("Failed to fetch issues:", err);
    return { props: { issues: [], repos: [], stats: null } };
  }
};
