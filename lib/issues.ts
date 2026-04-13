import { CONTRIBUTE_ISSUES } from "./contributeIssues";

export type IssueData = {
  id: number;
  title: string;
  url: string;
  repo: string;
  labels: { name: string; color: string }[];
  createdAt: string;
  comments: number;
  user: string;
  userAvatar: string;
};

const ghHeaders = () => ({
  Accept: "application/vnd.github.v3+json",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    : {}),
});

function mapIssue(item: any, repoFallback?: string): IssueData {
  const repoParts = item.repository_url?.split("/") || [];
  const repo = repoParts[repoParts.length - 1] || repoFallback || "";
  return {
    id: item.id,
    title: item.title,
    url: item.html_url,
    repo,
    labels: (item.labels || []).map((l: any) => ({
      name: l.name,
      color: l.color,
    })),
    createdAt: item.created_at,
    comments: item.comments || 0,
    user: item.user?.login || "",
    userAvatar: item.user?.avatar_url || "",
  };
}

async function fetchOrgGoodFirstIssues(): Promise<IssueData[]> {
  const query = encodeURIComponent(
    'org:logos-co label:"good first issue" is:issue is:open'
  );
  const res = await fetch(
    `https://api.github.com/search/issues?q=${query}&per_page=100&sort=created&order=desc`,
    { headers: ghHeaders() }
  );
  const data = await res.json();
  if (!data.items || !Array.isArray(data.items)) {
    console.warn("GitHub Search API returned unexpected response:", data);
    return [];
  }
  return data.items.map((i: any) => mapIssue(i));
}

function parseIssueUrl(
  url: string
): { owner: string; repo: string; number: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: m[3] };
}

async function fetchPinnedIssues(urls: string[]): Promise<IssueData[]> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const parsed = parseIssueUrl(url);
      if (!parsed) throw new Error(`Invalid issue URL: ${url}`);
      const { owner, repo, number } = parsed;
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
        { headers: ghHeaders() }
      );
      if (!res.ok) {
        throw new Error(`GitHub ${res.status} for ${url}`);
      }
      const item = await res.json();
      if (item.state !== "open") return null;
      return mapIssue(item, repo);
    })
  );

  const issues: IssueData[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) issues.push(r.value);
    else if (r.status === "rejected") console.warn(r.reason);
  }
  return issues;
}

export async function fetchGoodFirstIssues(): Promise<IssueData[]> {
  const [orgIssues, pinned] = await Promise.all([
    fetchOrgGoodFirstIssues(),
    fetchPinnedIssues(CONTRIBUTE_ISSUES),
  ]);

  const seen = new Set<number>();
  const merged: IssueData[] = [];
  for (const i of [...orgIssues, ...pinned]) {
    if (seen.has(i.id)) continue;
    seen.add(i.id);
    merged.push(i);
  }
  merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return merged;
}
