export type RfpData = {
  number: string;
  title: string;
  category: string;
  summary: string;
  githubUrl: string;
  status: string;
  tier: string;
  rawMarkdown: string;
};

export async function parseRfpMarkdown(
  raw: string,
  filename: string,
  htmlUrl: string
): Promise<RfpData | null> {
  const number = filename.match(/^(RFP-\d+)/)?.[1] || "";
  if (!number || number === "RFP-000") return null;

  const titleMatch = raw.match(/^#\s+(.+)/m);
  let title =
    titleMatch?.[1]?.replace(/^RFP-\d+[:\s\-—]+/, "").trim() || filename;

  const categoryMatch =
    raw.match(/\*\*Category\*\*[:\s]*(.+)/i) ||
    raw.match(/Category[:\s|]*([^\n|]+)/i);
  const category = categoryMatch?.[1]?.replace(/[`*]/g, "").trim() || "";

  const statusMatch =
    raw.match(/\*\*Status\*\*[:\s]*(.+)/i) ||
    raw.match(/Status[:\s|]*([^\n|]+)/i);
  const status = statusMatch?.[1]?.replace(/[`*]/g, "").trim() || "open";

  const tierMatch =
    raw.match(/\*\*Tier\*\*[:\s]*(.+)/i) ||
    raw.match(/Tier[:\s|]*([^\n|]+)/i);
  const tier = tierMatch?.[1]?.replace(/[`*]/g, "").trim() || "";

  let summary = "";
  const overviewMatch = raw.match(
    /##\s*(?:🧭\s*)?Overview\s*\n+([\s\S]*?)(?=\n##)/i
  );
  if (overviewMatch) {
    summary = overviewMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ")
      .slice(0, 200);
  }
  if (!summary) {
    const lines = raw
      .split("\n")
      .filter(
        (l) =>
          l.trim() &&
          !l.startsWith("#") &&
          !l.startsWith("|") &&
          !l.startsWith("---") &&
          !l.startsWith("**")
      );
    summary = lines.slice(0, 3).join(" ").slice(0, 200);
  }

  return { number, title, category, summary, githubUrl: htmlUrl, status, tier, rawMarkdown: raw };
}

export async function fetchRfps(): Promise<RfpData[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (typeof process !== "undefined" && process.env?.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  const listRes = await fetch(
    "https://api.github.com/repos/logos-co/rfp/contents/RFPs",
    { headers }
  );
  const files = await listRes.json();

  if (!Array.isArray(files)) {
    console.warn("GitHub API returned unexpected response:", files);
    return [];
  }

  const mdFiles = files.filter(
    (f: any) =>
      f.name.endsWith(".md") &&
      !f.name.startsWith("RFP-000") &&
      f.name.startsWith("RFP-")
  );

  const rfps: RfpData[] = [];

  for (const file of mdFiles) {
    const rawRes = await fetch(file.download_url);
    const raw = await rawRes.text();
    const parsed = await parseRfpMarkdown(raw, file.name, file.html_url);
    if (parsed) rfps.push(parsed);
  }

  rfps.sort((a, b) => a.number.localeCompare(b.number));
  return rfps;
}
