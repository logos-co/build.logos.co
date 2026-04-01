import type { ContributionStats } from "./index";

const CONTRIBUTIONS_API_URL =
  "https://hasura.bi.status.im/api/rest/contributions/count_all";
const BI_GRAPHQL_API_URL = "https://hasura.bi.status.im/v1/graphql";

export async function fetchContributionStats(): Promise<ContributionStats | null> {
  const daysAgo120 = new Date(Date.now() - 120 * 86_400_000)
    .toISOString()
    .split("T")[0];

  const [contribRes, circlesRes] = await Promise.allSettled([
    fetch(CONTRIBUTIONS_API_URL),
    fetch(BI_GRAPHQL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query CountDistinctCities {
          stg_external_circle_circle_event_aggregate(where: { end_at: { _gte: "${daysAgo120}" } }) {
            aggregate { count(distinct: true, columns: location_city) }
          }
        }`,
      }),
    }),
  ]);

  let stats: ContributionStats | null = null;

  if (contribRes.status === "fulfilled" && contribRes.value.ok) {
    const data = await contribRes.value.json();
    const row =
      data?.stg_external_contributors_agg_total_ext_contributions?.[0];
    if (row) {
      stats = {
        contributions: row.total_commits?.toLocaleString() ?? "—",
        contributors:
          row.total_external_collaborators?.toLocaleString() ?? "—",
        repositories: row.total_repositories?.toLocaleString() ?? "—",
      };
    }
  }

  if (stats && circlesRes.status === "fulfilled" && circlesRes.value.ok) {
    const data = await circlesRes.value.json();
    const count =
      data?.data?.stg_external_circle_circle_event_aggregate?.aggregate?.count;
    if (count != null) stats.circles = count.toLocaleString();
  }

  return stats;
}
