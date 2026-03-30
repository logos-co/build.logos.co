# Analytics – what we track

We use [Umami](https://umami.is/) — a privacy-first, cookie-free analytics tool.
The events are registered on [Umami dashboard](https://umami.bi.status.im/dashboard).

## Automatic (handled by the Umami script)

- **Page views** – every navigation, including SPA route changes.
- **Referrer, browser, OS, device type, country** – derived from the request; no personal data is stored.

## Custom events

All custom events are fired via `trackEvent()` (defined in `context/UmamiProvider.tsx`).
Every event carries a `{ source }` property containing the page path the user was on.

### Homepage (`/`)

| Event name                         | Trigger                              |
| ---------------------------------- | ------------------------------------ |
| `office_hours_join_call`           | "Join Call" button (live office hours) |
| `office_hours_add_calendar`        | "Add to Calendar" button             |
| `discord_need_help`                | Discord "Need help?" link            |
| `explore_community_ideas`          | Community ideas card                 |
| `start_contributing_github_issues` | "Start Contributing" card            |
| `install_logos_basecamp`           | "Install Logos Basecamp" card        |
| `install_logos_basecamp_section`   | Install link in the Basecamp section |
| `run_node_cli`                     | "Run a Node" CLI card                |
| `read_the_docs`                    | Documentation card                   |
| `scaffold_boilerplate`             | Scaffold / boilerplate card          |
| `sample_apps`                      | Sample apps card (opens modal)       |
| `workshops_tutorials`              | Workshops & tutorials card           |
| `developer_support`                | Developer support card (opens modal) |
| `prizes`                           | Prizes card                          |
| `explore_rfps`                     | RFPs card                            |
| `speak_to_core_contributor`        | "Speak to a Core Contributor" card   |
| `logos_community_forum`            | Community forum card                 |

### RFP page (`/rfp`)

| Event name      | Trigger                        |
| --------------- | ------------------------------ |
| `rfp_view_repo` | "View the Repo" link on a card |

### Prize page (`/prize`)

| Event name       | Trigger                        |
| ---------------- | ------------------------------ |
| `prize_view_repo`| "View the Repo" link on a card |

### Actions component (data-driven)

Any action object with `trackUmami: true` fires an event whose name is
`action.umamiEventName` (or a slugified `action.title`), with a `source` of
`action.umamiEventSource` (or the current path if `action.umamiUseCurrentPath` is set).

## Environment variables

| Variable                            | Required | Default                                      | Notes                              |
| ----------------------------------- | -------- | -------------------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL`      | No       | `https://analytic.keycard.tech/script.js`    | Override to use a different Umami instance |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID`      | No       | `abc1c523-6356-4f67-b41e-43334d69b55e`      | Override if the site ID changes    |
| `NEXT_PUBLIC_UMAMI_DATA_DOMAINS`    | No       | `build.logos.co` (production)                | Override if the domain changes     |
| `NEXT_PUBLIC_UMAMI_PROXY_ORIGIN`    | No       | —                                            | Local dev only (`http://localhost:3000`) |
