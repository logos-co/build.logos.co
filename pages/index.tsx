import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "@components/Link";
import TextLink from "@components/TextLink";
import Button from "@components/Button";
import ScrollEntrance from "@components/ScrollEntrance";
import SiteLayout from "@components/SiteLayout";
import cx from "classnames";
import type { GetStaticProps } from "next";
import { trackEvent } from "@/context/UmamiProvider";

/* ── Countdown to next Friday 13:00 UTC ── */
function isLiveNow(): boolean {
  const now = new Date();
  return now.getUTCDay() === 5 && now.getUTCHours() >= 13 && now.getUTCHours() < 14;
}

function getNextFriday13UTC(): Date {
  const now = new Date();
  const utcDay = now.getUTCDay(); // 0=Sun … 5=Fri
  const utcHour = now.getUTCHours();
  let daysUntilFri = (5 - utcDay + 7) % 7;
  // If it's Friday and the session is over (>= 14:00 UTC), jump to next week
  if (daysUntilFri === 0 && utcHour >= 14) {
    daysUntilFri = 7;
  }
  const next = new Date(now);
  next.setUTCDate(now.getUTCDate() + daysUntilFri);
  next.setUTCHours(13, 0, 0, 0);
  return next;
}

function useCountdown() {
  const [state, setState] = useState<{ d: number; h: number; m: number; s: number; live: boolean } | null>(null);

  useEffect(() => {
    function calc() {
      if (isLiveNow()) return { d: 0, h: 0, m: 0, s: 0, live: true };
      const ms = getNextFriday13UTC().getTime() - Date.now();
      if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0, live: false };
      const s = Math.floor(ms / 1000) % 60;
      const m = Math.floor(ms / 60000) % 60;
      const h = Math.floor(ms / 3600000) % 24;
      const d = Math.floor(ms / 86400000);
      return { d, h, m, s, live: false };
    }
    setState(calc());
    const id = setInterval(() => setState(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return state;
}

/* ── Office Hours Card ── */
const OFFICE_HOURS_URL = "https://meet.jit.si/FolkMemorialsRiskNext";

function OfficeHoursCard() {
  const { asPath } = useRouter();
  const cd = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  const live = cd?.live ?? false;

  return (
    <div className="col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-col gap-4 overflow-hidden relative min-h-[200px] border">
      <div>
        <span className="h5 sans block">Developer office hours</span>
        <span className="body-tiny opacity-50 mt-1 block">Every Friday · 13:00 UTC</span>
      </div>

      {/* Live indicator or Countdown */}
      {cd && (
        live ? (
          <div className="flex items-center gap-2 mt-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="h4 sans">Live Now</span>
          </div>
        ) : (
          <div className="flex gap-3 mt-auto">
            {[
              { val: cd.d, label: "days" },
              { val: cd.h, label: "hrs" },
              { val: cd.m, label: "min" },
              { val: cd.s, label: "sec" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="h4 sans tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {pad(val)}
                </span>
                <span className="body-tiny opacity-40">{label}</span>
              </div>
            ))}
          </div>
        )
      )}

      <div className="flex gap-2 mt-auto">
        {live && (
          <Link
            to={OFFICE_HOURS_URL}
            target="_blank"
            onClick={() => trackEvent("office_hours_join_call", { source: asPath })}
          >
            <Button as="span" arrow>
              Join Call
            </Button>
          </Link>
        )}
        <button
          onClick={() => {
            trackEvent("office_hours_add_calendar", { source: asPath });
            const ics = [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "PRODID:-//Logos//Office Hours//EN",
              "BEGIN:VEVENT",
              "DTSTART:20250328T130000Z",
              "DTEND:20250328T140000Z",
              "RRULE:FREQ=WEEKLY;BYDAY=FR",
              "SUMMARY:Logos Developer Office Hours",
              "DESCRIPTION:Weekly office hours with the Logos engineering team.\\nJoin: " + OFFICE_HOURS_URL,
              "URL:" + OFFICE_HOURS_URL,
              "END:VEVENT",
              "END:VCALENDAR",
            ].join("\r\n");
            const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "logos-office-hours.ics";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="cursor-pointer"
        >
          <Button as="span" arrow>
            Add to Calendar
          </Button>
        </button>
      </div>
    </div>
  );
}

/* ── Sample Apps Modal ── */
const SAMPLE_APPS = [
  { name: "Scaffold", desc: "Boilerplate to start building on LEZ.", url: "https://github.com/logos-co/logos-scaffold" },
  { name: "Atomic Swaps", desc: "Trustless cross-chain atomic swap implementation.", url: "https://github.com/logos-co/eth-lez-atomic-swaps" },
  { name: "Multisig", desc: "Multi-signature module for the Logos execution zone.", url: "https://github.com/logos-co/lez-multisig" },
];

function SampleAppsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-[var(--color-bg)] rounded-[16px] w-full max-w-[480px] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="h5 sans">Sample Apps</span>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-full hover:bg-black/5 transition-colors" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="space-y-3">
          {SAMPLE_APPS.map((app) => (
            <Link
              key={app.name}
              to={app.url}
              target="_blank"
              className="group flex items-center justify-between p-4 rounded-[10px] border transition-colors hover:bg-main!"
            >
              <div>
                <span className="h6 sans block">{app.name}</span>
                <p className="body-tiny opacity-50 mt-1">{app.desc}</p>
              </div>
              <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">&rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Developer Support Modal ── */
const SUPPORT_LINKS = [
  { name: "Discord", desc: "Chat with the community and get real-time help.", url: "https://discord.gg/logosnetwork" },
  { name: "X (Twitter)", desc: "Follow for announcements, updates, and threads.", url: "https://x.com/Logos_network" },
  { name: "Community Forum", desc: "Discuss research, ask questions, and share ideas.", url: "https://forum.logos.co/" },
  { name: "Research Forum", desc: "Deep-dive into Logos research topics and technical discussions.", url: "https://forum.research.logos.co/" },
];

function DevSupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-margin" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-[var(--color-bg)] rounded-[16px] w-full max-w-[480px] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="h5 sans">Developer Support</span>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-full hover:bg-black/5 transition-colors" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="space-y-3">
          {SUPPORT_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.url}
              target="_blank"
              className="group flex items-center justify-between p-4 rounded-[10px] border transition-colors hover:bg-main!"
            >
              <div>
                <span className="h6 sans block">{link.name}</span>
                <p className="body-tiny opacity-50 mt-1">{link.desc}</p>
              </div>
              <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">&rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/*  Page  */

export default function Home() {
  const { asPath } = useRouter();
  const [sampleAppsOpen, setSampleAppsOpen] = useState(false);
  const [devSupportOpen, setDevSupportOpen] = useState(false);

  const trackClick = (eventName: string) => () => {
    trackEvent(eventName, { source: asPath });
  };

  return (
    <SiteLayout>
      <Head>
        <title>Builder Hub | Logos</title>
        <meta name="description" content="Ideas, resources, and everything you need to start building with Logos tech. Explore documentation, contribute to open issues, win prizes, and connect with core contributors." />
        <meta name="keywords" content="Logos, builders hub, decentralized apps, blockchain development, Web3, open source, Waku, Codex, Nomos, dApps, developer tools" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Builders Hub | Logos" />
        <meta property="og:description" content="Ideas, resources, and everything you need to start building with Logos tech. Explore docs, contribute, win prizes, and connect with core contributors." />
        <meta property="og:url" content="https://build.logos.co" />
        <meta property="og:image" content="https://build.logos.co/og.jpg" />
        <meta property="og:site_name" content="Logos Builders Hub" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Logos_network" />
        <meta name="twitter:title" content="Builders Hub | Logos" />
        <meta name="twitter:description" content="Ideas, resources, and everything you need to start building with Logos tech. Explore docs, contribute, win prizes, and connect with core contributors." />
        <meta name="twitter:image" content="https://build.logos.co/og.jpg" />

        {/* Canonical */}
        <link rel="canonical" href="https://build.logos.co" />
      </Head>
      <Link
        to="#content"
        className="sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white"
      >
        Skip to content
      </Link>

            {/*  Section 1: Banner Strip  */}
            <section className="pb-half-v-space theme-default" style={{ paddingTop: "calc(var(--spacing-header-height-expanded) + var(--spacing-gutter))" }}>
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <div className="grid gap-gutter grid-cols-2">
                  <div className="grid gap-gutter grid-cols-5 xl:grid-cols-6">
                    <div className="col-span-3 sm:col-span-2 xl:col-span-1">
                      <div className="max-w-[150px]">
                        <Image
                          src="/header.avif"
                          alt="Logos banner"
                          width={300}
                          height={210}
                          className="w-full h-auto"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <p className="body-tiny max-w-[26em] text-right">
                      Ideas, resources, and everything you need to start building with Logos tech today.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/*  Section 2: Page Title  */}
            <section className="pt-half-v-space pb-half-v-space theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin text-center">
                <ScrollEntrance>
                  <span className="group relative inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full mb-4 cursor-default" style={{ background: "#FF6B2B", color: "#fff" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Testnet Live
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[260px] rounded-lg px-3 py-2 text-xs font-sans font-normal leading-snug text-white bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      This is a testnet environment and is not production-ready. Expect breaking changes and possible data resets.
                    </span>
                  </span>
                  <h2 className="h2 text-balance">
                    Logos<br />Builders Hub
                  </h2>
                </ScrollEntrance>
              </div>
            </section>

            {/*  Section 3: Builder Journey  */}
            <section className="pt-half-v-space pb-half-v-space theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <ScrollEntrance className="flex items-baseline justify-between mb-v-space-sm">
                  <h2 className="h3 text-balance">Start your builder journey</h2>
                  <Link
                    to="https://discord.gg/logosnetwork"
                    target="_blank"
                    className="group flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:bg-dark-green hover:text-bg shrink-0"
                    onClick={trackClick("discord_need_help")}
                  >
                    <svg width="16" height="12" viewBox="0 0 71 55" fill="currentColor">
                      <path d="M60.1 4.9A58.5 58.5 0 0 0 45.4.2a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37.4 37.4 0 0 0 25.4.3a.2.2 0 0 0-.2-.1A58.4 58.4 0 0 0 10.6 4.9a.2.2 0 0 0-.1.1C1.5 18.7-.9 32.2.3 45.5v.2a58.9 58.9 0 0 0 17.7 9a.2.2 0 0 0 .3-.1 42.1 42.1 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.7.2.2 0 0 1 0-.4l1.1-.9a.2.2 0 0 1 .2 0 42 42 0 0 0 35.8 0 .2.2 0 0 1 .2 0l1.1.9a.2.2 0 0 1 0 .4 36.4 36.4 0 0 1-5.5 2.7.2.2 0 0 0-.1.3 47.2 47.2 0 0 0 3.6 5.9.2.2 0 0 0 .3.1A58.7 58.7 0 0 0 70.5 45.7v-.2c1.4-15-2.3-28.1-9.8-39.7a.2.2 0 0 0-.1 0ZM23.7 37.3c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.3 3.1 6.3 7-2.8 7-6.3 7Zm23.3 0c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.3 3.1 6.3 7-2.8 7-6.3 7Z" />
                    </svg>
                    <span className="body-tiny font-medium">Need Help?</span>
                  </Link>
                </ScrollEntrance>

                {/*  Full bento grid  */}
                <ScrollEntrance className="grid grid-cols-6 md:grid-cols-12 gap-gutter">

                  {/*  PHASE 01: GET INSPIRED  */}
                  {/* Phase label  spans full width */}
                  <div className="col-span-6 md:col-span-12 flex items-end gap-4 pb-2">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">01</span>
                    <h3 className="h4 sans pb-1">Get Inspired</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Featured card  community ideas */}
                  <Link
                    to="https://github.com/logos-co/ideas"
                    target="_blank"
                    className="group col-span-6 md:col-span-7 rounded-[16px] p-gutter flex flex-col justify-between gap-6 overflow-hidden relative transition-all hover:shadow-sm min-h-[280px]"
                    style={{ background: "var(--color-tan)" }}
                    onClick={trackClick("explore_community_ideas")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Explore community ideas</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0 transition-transform">&rarr;</span>
                    </div>
                    {/* Mini idea cards with scrolling on hover */}
                    <div className="relative flex-1 flex items-center overflow-hidden hover-start">
                      <div className="flex gap-2 shrink-0 animate-scroll-left">
                        {[
                          { title: "Privacy-preserving location tracker", tag: "Privacy" },
                          { title: "Decentralized hiring platform", tag: "Social" },
                          { title: "Decentralised GitHub alternative", tag: "DevTools" },
                          { title: "P2P marketplace with shielded payments", tag: "DeFi" },
                          { title: "Anonymous voting system", tag: "Governance" },
                          { title: "Encrypted group messaging", tag: "Social" },
                          { title: "Privacy-preserving location tracker", tag: "Privacy" },
                          { title: "Decentralized hiring platform", tag: "Social" },
                          { title: "Decentralised GitHub alternative", tag: "DevTools" },
                          { title: "P2P marketplace with shielded payments", tag: "DeFi" },
                          { title: "Anonymous voting system", tag: "Governance" },
                          { title: "Encrypted group messaging", tag: "Social" },
                        ].map((idea, i) => (
                          <div
                            key={`${idea.title}-${i}`}
                            className="w-[260px] h-[120px] shrink-0 rounded-[8px] bg-bg/50 p-3 flex flex-col justify-between gap-3"
                          >
                            <p className="body-tiny font-medium leading-tight line-clamp-3">{idea.title}</p>
                            <span className="body-tiny opacity-60 px-1.5 py-0.5 rounded-full bg-current/5 self-start">{idea.tag}</span>
                          </div>
                        ))}
                      </div>
                      {/* Fade edges */}
                      <div
                        className="absolute top-0 left-0 w-8 h-full pointer-events-none z-[1]"
                        style={{ background: "linear-gradient(to right, var(--color-tan), transparent)" }}
                      />
                      <div
                        className="absolute top-0 right-0 w-16 h-full pointer-events-none z-[1]"
                        style={{ background: "linear-gradient(to right, transparent, var(--color-tan))" }}
                      />
                    </div>
                    <p className="body-tiny opacity-60 max-w-[28em]">
                      Browse ideas from the community, vote on the ones you love, or propose your own.
                    </p>
                  </Link>

                  {/* Start contributing */}
                  <Link
                    to="/contribute"
                    className="group col-span-6 md:col-span-5 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative border transition-all hover:shadow-sm min-h-[280px]"
                    onClick={trackClick("start_contributing_github_issues")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Start contributing with GitHub issues</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0 transition-transform">&rarr;</span>
                    </div>
                    {/* Mini issue board mockup */}
                    <div className="flex-1 flex flex-col rounded-[8px] border border-current/10 overflow-hidden font-mono text-[10px]">
                      {/* Toolbar */}
                      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-current/[0.03] border-b border-current/10">
                        <span className="px-1.5 py-0.5 rounded bg-dark-green text-bg text-[9px]">All</span>
                        <span className="opacity-30">blockchain</span>
                        <span className="opacity-30">messaging</span>
                        <span className="opacity-30">storage</span>
                      </div>
                      {/* Issue rows */}
                      {[
                        { title: "Add retry logic to discovery", repo: "messaging", color: "text-teal" },
                        { title: "Fix pagination in REST API", repo: "storage", color: "" },
                        { title: "Update quickstart docs", repo: "blockchain", color: "" },
                        { title: "Improve error messages", repo: "messaging", color: "" },
                        { title: "Add unit tests for validator", repo: "blockchain", color: "" },
                      ].map((row, i) => (
                        <div
                          key={row.title}
                          className={`flex items-center gap-2 px-2.5 py-1.5 border-b border-current/5 transition-all ${i === 0 ? "group-hover:bg-current/[0.04]" : ""}`}
                          style={{ transitionDelay: `${i * 60}ms` }}
                        >
                          <svg width="8" height="8" viewBox="0 0 16 16" fill="none" className="opacity-30 shrink-0">
                            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="8" cy="8" r="2" fill="currentColor" />
                          </svg>
                          <span className={`truncate opacity-50 transition-opacity group-hover:opacity-70 ${row.color}`} style={{ transitionDelay: `${i * 60}ms` }}>{row.title}</span>
                          <span className="ml-auto opacity-20 shrink-0">{row.repo}</span>
                        </div>
                      ))}
                    </div>
                    <p className="body-tiny opacity-60 max-w-[28em]">
                      Pick up a good first issue and ship your first PR.
                    </p>
                  </Link>

                  {/*  PHASE 02: TRY  */}
                  <div className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">02</span>
                    <h3 className="h4 sans pb-1">Participate</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Install Basecamp  with app preview */}
                  <Link
                    to="https://github.com/logos-co/logos-app/releases"
                    target="_blank"
                    className="group col-span-6 md:col-span-5 rounded-[16px] overflow-hidden relative transition-all hover:shadow-sm min-h-[280px] flex flex-col"
                    style={{ background: "var(--color-light-blue)" }}
                    onClick={trackClick("install_logos_basecamp")}
                  >
                    {/* App screenshot */}
                    <div className="mx-gutter mt-gutter flex-1 overflow-hidden rounded-t-[12px] transition-transform group-hover:-translate-y-1">
                      <img src="/basecamp.png" alt="Logos Basecamp" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="p-gutter">
                      <div className="flex items-baseline justify-between">
                        <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Install Logos Basecamp</span>
                        <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </div>
                      <p className="body-tiny opacity-60 mt-2">
                        Leverage the interface to the parallel society and experiment with the applications available in the Alpha Release.
                      </p>
                    </div>
                  </Link>

                  {/* Run a Node  terminal style */}
                  <Link
                    to="https://github.com/logos-co/logos-docs/blob/main/docs/blockchain/quickstart-guide-for-the-logos-blockchain-node.md"
                    target="_blank"
                    className="group col-span-6 md:col-span-7 rounded-[16px] overflow-hidden relative transition-all hover:shadow-sm min-h-[280px] flex flex-col theme-dark"
                    style={{ background: "var(--color-dark-green)" }}
                    onClick={trackClick("run_node_cli")}
                  >
                    {/* Terminal mock */}
                    <div className="mx-gutter mt-gutter rounded-t-[8px] bg-white/5 flex-1 flex flex-col overflow-hidden transition-transform group-hover:-translate-y-1">
                      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <span className="text-[10px] opacity-20 ml-2 font-mono">terminal</span>
                      </div>
                      <div className="p-4 font-mono text-xs space-y-1 flex-1">
                        <p className="opacity-60"><span className="opacity-40">$</span> curl -s http://localhost:8080/network/info | jq</p>
                        <p className="opacity-40">{"{"}</p>
                        <p className="opacity-40">  &quot;listen_addresses&quot;: [</p>
                        <p className="opacity-40">    &quot;/ip4/127.0.0.1/udp/3000/quic-v1&quot;,</p>
                        <p className="opacity-40">    &quot;/ip4/172.18.0.2/udp/3000/quic-v1&quot;</p>
                        <p className="opacity-40">  ],</p>
                        <p className="opacity-40">  &quot;peer_id&quot;: <span className="text-teal opacity-70">&quot;12D3Koo...RWmwmt&quot;</span>,</p>
                        <p className="opacity-40">  &quot;n_peers&quot;: <span className="text-teal opacity-70">4</span>,</p>
                        <p className="opacity-40">  &quot;n_connections&quot;: <span className="text-teal opacity-70">7</span>,</p>
                        <p className="opacity-40">  &quot;n_pending_connections&quot;: <span className="text-teal opacity-70">3</span></p>
                        <p className="opacity-40">{"}"}</p>
                        <p className="opacity-60 mt-2"><span className="opacity-40">$</span> <span className="inline-block w-[5px] h-[10px] bg-teal/70 opacity-0 group-hover:animate-blink" /></p>
                      </div>
                    </div>
                    <div className="p-gutter">
                      <div className="flex items-baseline justify-between">
                        <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Run a Node using CLI</span>
                        <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </div>
                      <p className="body-tiny opacity-40 mt-2">
                        Participate in the network by becoming a node operator. Connect to the testnet in minutes and engage with the protocol.
                      </p>
                    </div>
                  </Link>

                  {/*  PHASE 03: BUILD  */}
                  <div className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">03</span>
                    <h3 className="h4 sans pb-1">Build</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Read the Docs  hero card */}
                  <Link
                    to="https://github.com/logos-co/logos-docs"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 md:row-span-2 rounded-[16px] p-gutter flex flex-col justify-between overflow-hidden relative transition-all hover:shadow-sm border min-h-[200px]"
                    onClick={trackClick("read_the_docs")}
                  >
                    <div>
                      <div className="flex items-baseline justify-between mb-6">
                        <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Read the Docs</span>
                        <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </div>
                      <p className="body-tiny opacity-60 max-w-[24em]">
                        Deep-dive into the Logos stack  architecture, modules, APIs, and integration guides.
                      </p>
                    </div>
                    {/* Code snippet visual */}
                    <div className="font-mono text-[10px] opacity-20 space-y-1 mt-8 transition-opacity group-hover:opacity-35">
                      <p>{"import { Blockchain } from '@logos/blockchain'"}</p>
                      <p>{"import { Storage } from '@logos/storage'"}</p>
                      <p>{"import { Messaging } from '@logos/messaging'"}</p>
                      <p className="opacity-50">{"// Build something great"}</p>
                    </div>
                  </Link>

                  {/* Scaffold */}
                  <Link
                    to="https://github.com/logos-co/logos-scaffold"
                    target="_blank"
                    className="group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px]"
                    style={{ background: "var(--color-grey)" }}
                    onClick={trackClick("scaffold_boilerplate")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Scaffold boilerplate</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-tiny opacity-50">
                      Start with a boilerplate.
                    </p>
                  </Link>

                  {/* Sample apps */}
                  <button
                    className="group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px] text-left cursor-pointer"
                    style={{ background: "var(--color-tan)" }}
                    onClick={() => {
                      setSampleAppsOpen(true);
                      trackClick("sample_apps")();
                    }}
                  >
                    <div className="flex items-baseline justify-between w-full">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Sample apps</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    {/* App tiles */}
                    <div className="flex gap-1.5">
                      {SAMPLE_APPS.map((app, i) => (
                        <div
                          key={app.name}
                          className="flex-1 rounded-[6px] bg-bg/40 p-2 flex flex-col items-center gap-1.5 transition-all group-hover:bg-bg/70 group-hover:-translate-y-0.5"
                          style={{ transitionDelay: `${i * 60}ms` }}
                        >
                          <span className="text-[9px] opacity-40 text-center leading-tight">{app.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="body-tiny opacity-50">
                      Real-world examples to learn from.
                    </p>
                  </button>

                  {/* Workshops & Tutorials */}
                  <Link
                    to="https://www.youtube.com/@LogosNetwork"
                    target="_blank"
                    className="group col-span-3 md:col-span-4 rounded-[16px] overflow-hidden relative transition-all hover:shadow-sm min-h-[140px] flex flex-col text-white"
                    onClick={trackClick("workshops_tutorials")}
                  >
                    {/* GIF background */}
                    <img
                      src="/workshop.gif"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-[1] p-gutter flex flex-col justify-between flex-1 gap-6">
                      <div className="flex items-baseline justify-between">
                        <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Workshops &amp; tutorials</span>
                        <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </div>
                      <p className="body-tiny opacity-70">
                        Live coding sessions and step-by-step guides.
                      </p>
                    </div>
                  </Link>

                  {/* Developer support */}
                  <button
                    className="cursor-pointer group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px] text-left"
                    style={{ background: "var(--color-light-blue)" }}
                    onClick={() => {
                      setDevSupportOpen(true);
                      trackClick("developer_support")();
                    }}
                  >
                    <div className="flex items-baseline justify-between w-full">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Developer support</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-tiny opacity-50">
                      Discord, X, community forum, and the research forum.
                    </p>
                  </button>
                  <DevSupportModal open={devSupportOpen} onClose={() => setDevSupportOpen(false)} />

                  {/*  PHASE 04: GET SUPPORT  */}
                  <div className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">04</span>
                    <h3 className="h4 sans pb-1">Get Support</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Prizes  premium card */}
                  <Link
                    to="/prize"
                    className="group col-span-6 rounded-[16px] p-gutter flex flex-col justify-between gap-12 overflow-hidden relative transition-all hover:shadow-sm min-h-[240px] theme-dark"
                    style={{ background: "var(--color-dark-green)" }}
                    onClick={trackClick("prizes")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h4 sans transition-transform group-hover:-translate-y-0.5 flex items-center gap-2"><img src="/mark.svg" alt="" className="h-[0.7em] brightness-0 invert" />Prizes</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <div>
                      <p className="body-tiny opacity-40 max-w-[24em]">
                        Compete for prizes by building on the Logos execution layer. Ship code, win support.
                      </p>
                    </div>
                    {/* Large mark watermark */}
                    <img src="/mark.svg" alt="" className="absolute -bottom-8 -right-8 w-[14rem] select-none opacity-[0.06] brightness-0 invert transition-transform group-hover:scale-110 group-hover:-translate-y-2" />
                    {/* Floating orbs */}
                    <div className="absolute top-8 right-8 w-20 h-20 rounded-full border border-white/[0.06] transition-transform group-hover:scale-110" />
                    <div className="absolute top-16 right-20 w-8 h-8 rounded-full bg-teal/10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>

                  {/* RFPs  premium card */}
                  <Link
                    to="/rfp"
                    className="group col-span-6 rounded-[16px] p-gutter flex flex-col justify-between gap-12 overflow-hidden relative transition-all hover:shadow-sm min-h-[240px]"
                    style={{ background: "var(--color-tan)" }}
                    onClick={trackClick("explore_rfps")}
                    >
                    <div className="flex items-baseline justify-between">
                      <span className="h4 sans transition-transform group-hover:-translate-y-0.5">Explore RFPs</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <div>
                      <p className="body-tiny opacity-60 max-w-[24em]">
                        Apply for funded proposals. The Logos RFP Program backs developers building on the stack.
                      </p>
                    </div>
                    {/* Decorative layers */}
                    <div className="absolute top-6 right-6 w-24 h-16 rounded-[8px] border border-current/[0.06] rotate-3 transition-transform group-hover:rotate-6 group-hover:-translate-y-1" />
                    <div className="absolute top-10 right-10 w-24 h-16 rounded-[8px] border border-current/[0.04] -rotate-2 transition-transform group-hover:-rotate-4 group-hover:translate-y-1" />
                    <div className="absolute top-14 right-14 w-24 h-16 rounded-[8px] bg-current/[0.02] transition-transform group-hover:translate-x-1" />
                  </Link>

                  {/* Developer Office Hours */}
                  <OfficeHoursCard />

                  {/* Speak to a Core Contributor */}
                  <Link
                    to="https://cal.com/team/logos-onboarding/intro"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-col gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[200px] border"
                    onClick={trackClick("speak_to_core_contributor")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Speak to a core contributor</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-tiny opacity-60 mt-auto">
                      Get direct guidance from the people building the Logos stack. Book a call with a core contributor.
                    </p>
                  </Link>

                  {/* Logos Community Forum */}
                  <Link
                    to="https://forum.logos.co/"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-col gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[200px] border"
                    onClick={trackClick("logos_community_forum")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Logos community forum</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-tiny opacity-60 mt-auto">
                      Discuss research, ask technical questions, and connect with the broader Logos community.
                    </p>
                  </Link>

                </ScrollEntrance>
              </div>
            </section>

            {/*  Section 4: Useful Documentation Links  */}
            <section className="pt-half-v-space pb-v-space theme-default">
              <div className="mx-auto px-[calc(var(--spacing-margin)*2)] max-w-site-max-w-margin">
                <ScrollEntrance>
                  <h2 className="h3 text-balance">Useful documentation links</h2>
                  <p className="body-tiny opacity-60 mt-2 mb-v-space-sm">
                    Understand the core concepts of the Logos network and its technology stack.
                  </p>
                </ScrollEntrance>

                <ScrollEntrance className="grid grid-cols-1 md:grid-cols-3 gap-x-gutter gap-y-gutter">
                  {/* Column 1: Introductions */}
                  <div className="rounded-[16px] p-gutter" style={{ background: "var(--color-grey)" }}>
                    <h3 className="h5 sans mb-4">Introductions</h3>
                    <ul className="space-y-4">
                      {[
                        { title: "What is Logos", desc: "An introduction to the Logos modular technology stack", to: "https://github.com/logos-co/logos-docs?tab=readme-ov-file#what-is-logos" },
                        { title: "Logos App", desc: "Build and run the all-in-one Logos application", to: "https://github.com/logos-co/logos-docs?tab=readme-ov-file#logos-app" },
                        { title: "Logos Execution Zone", desc: "The compute and state layer for decentralized apps", to: "https://github.com/logos-co/logos-docs?tab=readme-ov-file#logos-execution-zone" },
                        { title: "Architecture overview", desc: "How blockchain, messaging, and storage fit together", to: "https://github.com/logos-co/logos-docs?tab=readme-ov-file#logos" },
                        { title: "Documentation status", desc: "What's live now and what to expect next", to: "https://github.com/logos-co/logos-docs?tab=readme-ov-file#documentation-status-and-timeline" },
                      ].map((item) => (
                        <li key={item.title}>
                          <Link to={item.to} target="_blank" className="group cursor-pointer">
                            <span className="body-tiny text-teal animate-underline">{item.title}</span>
                            <p className="body-tiny opacity-50 mt-0.5">{item.desc}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: Guides & Journeys */}
                  <div className="rounded-[16px] p-gutter" style={{ background: "var(--color-grey)" }}>
                    <h3 className="h5 sans mb-4">Guides &amp; journeys</h3>
                    <ul className="space-y-4">
                      {[
                        { title: "Build and run Logos App", desc: "Build from source and launch with all modules loaded", to: "https://github.com/logos-co/logos-docs/blob/main/docs/core/journeys/build-and-run-logos-app-alpha-to-access-testnet-v0.1-uis.md" },
                        { title: "Start a blockchain node", desc: "Set up and run a Logos blockchain node from the CLI", to: "https://github.com/logos-co/logos-docs/blob/main/docs/blockchain/quickstart-guide-for-the-logos-blockchain-node.md" },
                        { title: "Set up a wallet", desc: "Install and configure a wallet for the Execution Zone", to: "https://github.com/logos-co/logos-docs/blob/main/docs/apps/wallet/journeys/quickstart-for-the-logos-execution-zone-wallet.md" },
                        { title: "Transfer native tokens", desc: "Send and receive native tokens between wallets", to: "https://github.com/logos-co/logos-docs/blob/main/docs/apps/wallet/journeys/transfer-native-tokens-on-the-logos-execution-zone.md" },
                        { title: "Create custom tokens", desc: "Mint your own tokens and transfer them on-chain", to: "https://github.com/logos-co/logos-docs/blob/main/docs/apps/wallet/journeys/create-and-transfer-custom-tokens-on-the-logos-execution-zone.md" },
                        { title: "Create an AMM liquidity pool", desc: "Set up and interact with an automated market maker", to: "https://github.com/logos-co/logos-docs/blob/main/docs/apps/sample-apps/journeys/create-and-use-an-amm-liquidity-pool-on-the-logos-execution-zone.md" },
                        { title: "Run node in headless mode", desc: "Operate a Logos node without a graphical interface", to: "https://github.com/logos-co/logos-docs/blob/main/docs/core/journeys/run-logos-node-in-headless-mode.md" },
                      ].map((item) => (
                        <li key={item.title}>
                          <Link to={item.to} target="_blank" className="group cursor-pointer">
                            <span className="body-tiny text-teal animate-underline">{item.title}</span>
                            <p className="body-tiny opacity-50 mt-0.5">{item.desc}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: The Stack — Blockchain */}
                  <div className="rounded-[16px] p-gutter" style={{ background: "var(--color-grey)" }}>
                    <h3 className="h5 sans mb-4">Blockchain</h3>
                    <ul className="space-y-4">
                      {[
                        { title: "Blockchain overview", desc: "Decentralized compute, data availability, and consensus", to: "https://github.com/logos-co/logos-docs/tree/main/docs/blockchain" },
                        { title: "Start a blockchain node", desc: "Set up and run a node from the CLI", to: "https://github.com/logos-co/logos-docs/blob/main/docs/blockchain/quickstart-guide-for-the-logos-blockchain-node.md" },
                      ].map((item) => (
                        <li key={item.title}>
                          <Link to={item.to} target="_blank" className="group cursor-pointer">
                            <span className="body-tiny text-teal animate-underline">{item.title}</span>
                            <p className="body-tiny opacity-50 mt-0.5">{item.desc}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 4: The Stack — Messaging */}
                  <div className="rounded-[16px] p-gutter" style={{ background: "var(--color-grey)" }}>
                    <h3 className="h5 sans mb-4">Messaging</h3>
                    <ul className="space-y-4">
                      {[
                        { title: "Delivery Module API", desc: "Send and receive messages from your application", to: "https://github.com/logos-co/logos-docs/blob/main/docs/messaging/journeys/use-the-logos-delivery-module-api-from-an-app.md" },
                        { title: "Chat Module API", desc: "Enable chat functionality in your application", to: "https://github.com/logos-co/logos-docs/blob/main/docs/messaging/journeys/use-the-logos-chat-module-api-from-an-app.md" },
                        { title: "AnonComms Mixnet", desc: "Discover nodes and send messages anonymously", to: "https://github.com/logos-co/logos-docs/blob/main/docs/connect/anoncomms/journeys/discover-nodes-and-send-messages-via-the-anoncomms-mixnet-demo-app.md" },
                      ].map((item) => (
                        <li key={item.title}>
                          <Link to={item.to} target="_blank" className="group cursor-pointer">
                            <span className="body-tiny text-teal animate-underline">{item.title}</span>
                            <p className="body-tiny opacity-50 mt-0.5">{item.desc}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 5: The Stack — Storage */}
                  <div className="rounded-[16px] p-gutter" style={{ background: "var(--color-grey)" }}>
                    <h3 className="h5 sans mb-4">Storage</h3>
                    <ul className="space-y-4">
                      {[
                        { title: "Storage module API", desc: "Store and retrieve data from your application", to: "https://logos-storage-docs.netlify.app/tutorials/storage-module/" },
                        { title: "Simple Filesharing App", desc: "Walk through storing and retrieving files", to: "https://logos-storage-docs.netlify.app/tutorials/libstorage/" },
                      ].map((item) => (
                        <li key={item.title}>
                          <Link to={item.to} target="_blank" className="group cursor-pointer">
                            <span className="body-tiny text-teal animate-underline">{item.title}</span>
                            <p className="body-tiny opacity-50 mt-0.5">{item.desc}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollEntrance>
              </div>
            </section>

            {/*  Section 5: Install Logos Basecamp  */}
            <section className="pt-half-v-space pb-v-space theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <ScrollEntrance>
                  <div className="grid md:grid-cols-12 gap-x-gutter gap-y-v-space-sm items-center p-gutter rounded-[21vw] md:rounded-[13vw] pb-v-space-sm md:pb-gutter" style={{ background: "var(--color-grey)" }}>
                    {/* Image */}
                    <div className="md:col-span-5 md:order-1">
                      <div className="overflow-hidden rounded-[calc(21vw-var(--spacing-gutter))] md:rounded-[calc(13vw-var(--spacing-gutter))]">
                        <img
                          src="/basecamp.avif"
                          alt="Install Logos Basecamp"
                          className="w-full object-cover aspect-square"
                        />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="md:col-span-7 md:order-2 md:grid md:grid-cols-7 md:gap-gutter">
                      <div className="md:col-start-2 md:col-span-5 flex flex-col justify-center gap-4 text-center md:text-left items-center md:items-start">
                        <h2 className="h3 text-balance">Install Logos Basecamp.</h2>
                        <p className="body max-w-[28em]">
                          Logos Basecamp is a complete distribution that bundles the kernel, the default modules, and UI packages into a usable interface. It allows the user to easily interact with simple apps built on the various modules.
                        </p>
                        <div className="mt-4">
                          <Button
                            to="https://github.com/logos-co/logos-app/releases"
                            target="_blank"
                            className="secondary"
                            arrow
                            onClick={trackClick("install_logos_basecamp_section")}
                          >
                            Install
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollEntrance>
              </div>
            </section>

    <SampleAppsModal open={sampleAppsOpen} onClose={() => setSampleAppsOpen(false)} />
    </SiteLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
