export type PrizeData = {
  number: string;
  title: string;
  status: string;
  circle: string;
  overview: string;
  effort: string;
  prize: string;
  githubUrl: string;
  rawMarkdown: string;
};

export async function parsePrizeMarkdown(
  raw: string,
  filename: string,
  htmlUrl: string
): Promise<PrizeData | null> {
  const number = filename.match(/^(LP-\d+)/)?.[1] || "";
  if (!number || number === "LP-0000") return null;

  // Title from H1: # LP-XXXX: <Title> [STATUS]
  const h1Match = raw.match(/^#\s+LP-\d+:\s*(.+)/m);
  let title = h1Match?.[1]?.replace(/\[.*?\]\s*$/, "").trim() || filename;

  // Status from inline code line or H1 bracket
  const statusLineMatch = raw.match(/\*\*`Status[:\s]*([^`]+)`\*\*/i);
  let status = statusLineMatch?.[1]?.trim() || "";
  if (!status) {
    const bracketMatch = raw.match(/^#\s+LP-\d+:.*\[([^\]]+)\]/m);
    status = bracketMatch?.[1]?.trim() || "";
  }

  // Logos Circle
  const circleMatch = raw.match(/\*\*`Logos Circle[:\s]*([^`]+)`\*\*/i);
  const circle = circleMatch?.[1]?.trim() || "N/A";

  // Overview section
  let overview = "";
  const overviewMatch = raw.match(
    /##\s*Overview\s*\n+([\s\S]*?)(?=\n##)/i
  );
  if (overviewMatch) {
    overview = overviewMatch[1]
      .split("\n")
      .map((l) => l.replace(/^>\s?/, "").trim())
      .filter((l) => Boolean(l) && !l.startsWith("TODO"))
      .join(" ")
      .slice(0, 300);
  }

  // Prize Structure
  const prizeAmountMatch = raw.match(
    /\*\*Total Prize:?\*\*[:\s]*\$?([\w,. ]+)/i
  );
  const prize = prizeAmountMatch?.[1]?.trim() || "TBD";

  const effortMatch = raw.match(
    /\*\*Effort:?\*\*[:\s]*([\w/ ]+)/i
  );
  const effort = effortMatch?.[1]?.trim() || "";

  return { number, title, status, circle, overview, effort, prize, githubUrl: htmlUrl, rawMarkdown: raw };
}

export async function fetchPrizes(): Promise<PrizeData[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (typeof process !== "undefined" && process.env?.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  const listRes = await fetch(
    "https://api.github.com/repos/logos-co/lambda-prize/contents/prizes",
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
      !f.name.startsWith("LP-0000") &&
      f.name.startsWith("LP-")
  );

  const prizes: PrizeData[] = [];

  for (const file of mdFiles) {
    const rawRes = await fetch(file.download_url);
    const raw = await rawRes.text();
    const parsed = await parsePrizeMarkdown(raw, file.name, file.html_url);
    if (parsed && !parsed.status.toLowerCase().includes("draft")) prizes.push(parsed);
  }

  prizes.sort((a, b) => a.number.localeCompare(b.number));
  return prizes;
}
