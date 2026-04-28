import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "@components/Link";
import TextLink from "@components/TextLink";
import Button from "@components/Button";
import ScrollEntrance from "@components/ScrollEntrance";
import SiteLayout from "@components/SiteLayout";
import AnimatedMark from "@components/AnimatedMark";
import cx from "classnames";
import type { GetStaticProps } from "next";
import { trackEvent } from "@/context/UmamiProvider";

/* ── Countdown to next Friday 12:00 UTC ── */
function isLiveNow(): boolean {
  const now = new Date();
  return now.getUTCDay() === 5 && now.getUTCHours() >= 12 && now.getUTCHours() < 13;
}

function getNextFriday12UTC(): Date {
  const now = new Date();
  const utcDay = now.getUTCDay(); // 0=Sun … 5=Fri
  const utcHour = now.getUTCHours();
  let daysUntilFri = (5 - utcDay + 7) % 7;
  // If it's Friday and the session is over (>= 13:00 UTC), jump to next week
  if (daysUntilFri === 0 && utcHour >= 13) {
    daysUntilFri = 7;
  }
  const next = new Date(now);
  next.setUTCDate(now.getUTCDate() + daysUntilFri);
  next.setUTCHours(12, 0, 0, 0);
  return next;
}

function useCountdown() {
  const [state, setState] = useState<{ d: number; h: number; m: number; s: number; live: boolean } | null>(null);

  useEffect(() => {
    function calc() {
      if (isLiveNow()) return { d: 0, h: 0, m: 0, s: 0, live: true };
      const ms = getNextFriday12UTC().getTime() - Date.now();
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
    <div
      className="col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-col gap-4 overflow-hidden relative min-h-[200px] theme-dark"
      style={{ background: "var(--color-dark-green)" }}
    >
      <div>
        <span className="h5 sans block">Developer office hours</span>
        <span className="body-tiny opacity-50 mt-1 block">Every Friday · 12:00 UTC</span>
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
              "DTSTART:20250328T120000Z",
              "DTEND:20250328T130000Z",
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
  { name: "X (Twitter)", desc: "Follow for announcements, updates and threads.", url: "https://x.com/Logos_network" },
  { name: "Community Forum", desc: "Discuss research, ask questions and share ideas.", url: "https://forum.logos.co/" },
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

/* ── Animated Modules Showcase ── */
const MODULES = [
  {
    name: "Blockchain",
    desc: "Advanced privacy for a new era of decentralised applications and social institutions.",
    bg: "var(--color-dark-green)",
  },
  {
    name: "Messaging",
    desc: "Private peer‑to‑peer communication that resists surveillance and censorship.",
    bg: "var(--color-grey-5)",
  },
  {
    name: "Storage",
    desc: "Secure decentralised storage enabling fully decentralised apps and file sharing.",
    bg: "var(--color-grey-2)",
  },
];

const MODULE_CYCLE_MS = 4200;

function ModulesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let accumulated = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      if (!pausedRef.current) accumulated += delta;
      const p = Math.min(accumulated / MODULE_CYCLE_MS, 1);
      setProgress(p);
      if (p >= 1) {
        setActiveIdx((prev) => (prev + 1) % MODULES.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeIdx]);

  const globalProgress = (activeIdx + progress) / MODULES.length;

  return (
    <ul
      className="relative flex flex-col flex-1 justify-between gap-3 pl-4 pr-4"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      style={{ color: "var(--color-grey-6)" }}
    >
      {/* Single vertical track spanning the whole list */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-px overflow-hidden"
        style={{ background: "color-mix(in srgb, currentColor 12%, transparent)" }}
      >
        <div
          className="absolute inset-x-0 top-0 transition-colors duration-500"
          style={{
            height: `${globalProgress * 100}%`,
            background: MODULES[activeIdx].bg,
            opacity: 0.7,
          }}
        />
      </div>

      {MODULES.map((m, idx) => {
        const isActive = idx === activeIdx;
        return (
          <li
            key={m.name}
            onClick={() => setActiveIdx(idx)}
            className="cursor-pointer select-none transition-opacity duration-500"
            style={{ opacity: isActive ? 1 : 0.45 }}
          >
            <div className="flex items-baseline gap-2">
              <span
                aria-hidden="true"
                className="block w-[10px] h-[13px] shrink-0 translate-y-[2px]"
                style={{
                  background: "currentColor",
                  WebkitMaskImage: "url(/mark.svg)",
                  maskImage: "url(/mark.svg)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
              <span className="body-medium mono font-semibold">{m.name}</span>
            </div>

            {/*
              Synchronized expand/collapse via grid-template-rows.
              Because exactly one item is active at a time and the
              old/new transitions run in lockstep, the total list
              height stays effectively constant — so the hero
              watermark below doesn't drift around.
            */}
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-out"
              style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="body-medium mono opacity-60 pl-[18px] pt-1 max-w-[34em]">
                  {m.desc}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
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
        <meta name="description" content="Ideas, resources and everything you need to start building with Logos tech. Explore documentation, contribute to open issues, win prizes and connect with core contributors." />
        <meta name="keywords" content="Logos, builders hub, decentralized apps, blockchain development, Web3, open source, Waku, Codex, Nomos, dApps, developer tools" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Builders Hub | Logos" />
        <meta property="og:description" content="Ideas, resources and everything you need to start building with Logos tech. Explore docs, contribute, win prizes and connect with core contributors." />
        <meta property="og:url" content="https://build.logos.co" />
        <meta property="og:image" content="https://build.logos.co/og.jpg" />
        <meta property="og:site_name" content="Logos Builders Hub" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Logos_network" />
        <meta name="twitter:title" content="Builders Hub | Logos" />
        <meta name="twitter:description" content="Ideas, resources and everything you need to start building with Logos tech. Explore docs, contribute, win prizes and connect with core contributors." />
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

            {/*  Section 1: Hero  */}
            <section
              className="relative overflow-hidden theme-default pb-v-space"
              style={{ paddingTop: "calc(var(--spacing-header-height-expanded) + var(--spacing-gutter))" }}
            >
              {/* Animated brand mark watermark */}
              <AnimatedMark
                className="pointer-events-none select-none absolute right-[10vw] -bottom-[6vw] w-[52vw] max-w-[720px] aspect-[20/26] opacity-[0.22]"
              />

              <div className="relative mx-auto px-[calc(var(--spacing-margin)*1.5)] max-w-site-max-w-margin">
                <ScrollEntrance>
                  {/* Top row: brand image + testnet disclaimer */}
                  <div className="flex items-stretch justify-between gap-gutter mb-v-space-sm">
                    <div className="max-w-[120px] md:max-w-[150px]">
                      <Image
                        src="/header.avif"
                        alt="Logos banner"
                        width={300}
                        height={210}
                        className="w-full h-full object-contain object-left"
                        priority
                      />
                    </div>
                    <div className="hidden md:flex flex-col items-start justify-center gap-3 pl-3 border-l-2 max-w-[26em]" style={{ borderColor: "#FF6B2B" }}>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px] tracking-[0.15em] uppercase font-semibold"
                        style={{ borderColor: "#FF6B2B", color: "#FF6B2B" }}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#FF6B2B" }} />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#FF6B2B" }} />
                        </span>
                        Testnet
                      </span>
                      <p className="body-tiny opacity-70 leading-snug">
                        Not production-ready.<br />
                        Expect breaking changes and data resets.
                      </p>
                      <Link
                        to="https://roadmap.logos.co"
                        target="_blank"
                        className="group inline-flex items-center gap-1"
                        onClick={trackClick("hero_read_roadmap")}
                      >
                        <span className="body-tiny font-mono uppercase tracking-[0.12em] animate-underline">
                          Read Roadmap
                        </span>
                        <span className="body-tiny transition-transform group-hover:translate-x-0.5">&rarr;</span>
                      </Link>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-v-space">
                    <h1 className="h1 text-balance leading-[0.98]">
                      Logos<br />Builders Hub
                    </h1>
                  </div>

                  {/* Intro paragraph + nav cards */}
                  <div className="grid grid-cols-12 gap-gutter items-stretch">
                    <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
                      <p className="body-medium mono text-balance">
                        Logos is an open, modular technology stack for building decentralized, censorship-resistant applications that are built to safeguard your civil liberties.
                      </p>

                      <ModulesShowcase />
                    </div>

                    <div className="col-span-12 md:col-span-7 grid grid-cols-1 xs:grid-cols-2 gap-gutter">
                      {[
                        {
                          num: "01",
                          label: "Participate",
                          desc: "Install Basecamp, run a node and join the network.",
                          href: "#participate",
                          bg: "var(--color-light-blue)",
                        },
                        {
                          num: "02",
                          label: "Get Inspired",
                          desc: "Browse community ideas and contribute.",
                          href: "#get-inspired",
                          bg: "var(--color-tan)",
                        },
                        {
                          num: "03",
                          label: "Build",
                          desc: "Docs, scaffolds, sample apps and workshops.",
                          href: "#build",
                          bg: "var(--color-grey)",
                        },
                        {
                          num: "04",
                          label: "Get Support",
                          desc: "Prizes, RFPs, office hours and contributors.",
                          href: "#get-support",
                          bg: "var(--color-dark-green)",
                          dark: true,
                        },
                      ].map((card) => (
                        <Link
                          key={card.num}
                          to={card.href}
                          className={cx(
                            "group rounded-[16px] p-gutter flex flex-col justify-between gap-6 min-h-[170px] transition-all hover:shadow-sm",
                            card.dark && "theme-dark"
                          )}
                          style={{ background: card.bg }}
                          onClick={trackClick(`hero_nav_${card.num}`)}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-mono text-[11px] tracking-[0.15em] opacity-50">{card.num}</span>
                            <span className="h6 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">&darr;</span>
                          </div>
                          <div>
                            <span className="h5 sans transition-transform group-hover:-translate-y-0.5 block">{card.label}</span>
                            <p className="body-small mono opacity-60 mt-2">{card.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
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

                  {/*  PHASE 01: PARTICIPATE  */}
                  <div id="participate" className="col-span-6 md:col-span-12 flex items-end gap-4 pb-2 scroll-mt-[calc(var(--spacing-header-height-expanded)+var(--spacing-gutter))]">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">01</span>
                    <h3 className="h4 sans pb-1">Participate</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Install Basecamp  with app preview */}
                  <Link
                    to="https://github.com/logos-co/logos-basecamp/releases?q=prerelease%3Afalse&expanded=true"
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
                      <p className="body-small mono opacity-60 mt-2">
                        Leverage the interface to the parallel society and experiment with the applications available in the Alpha Release.
                      </p>
                    </div>
                  </Link>

                  {/* Run a Node  terminal style */}
                  <Link
                    to="https://github.com/logos-co/logos-docs/blob/main/docs/blockchain/quickstart-guide-for-the-logos-blockchain-node.md"
                    target="_blank"
                    className="group col-span-6 md:col-span-7 rounded-[16px] overflow-hidden relative transition-all hover:shadow-sm min-h-[280px] flex flex-col"
                    style={{ background: "var(--color-light-blue)" }}
                    onClick={trackClick("run_node_cli")}
                  >
                    {/* Terminal mock */}
                    <div
                      className="mx-gutter mt-gutter rounded-t-[8px] flex-1 flex flex-col overflow-hidden transition-transform group-hover:-translate-y-1 text-white"
                      style={{ background: "var(--color-dark-green)" }}
                    >
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
                      <p className="body-small mono opacity-60 mt-2">
                        Participate in the network by becoming a node operator. Connect to the testnet in minutes and engage with the protocol.
                      </p>
                    </div>
                  </Link>

                  {/*  PHASE 02: GET INSPIRED  */}
                  {/* Phase label  spans full width */}
                  <div id="get-inspired" className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2 scroll-mt-[calc(var(--spacing-header-height-expanded)+var(--spacing-gutter))]">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">02</span>
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
                    <p className="body-small mono opacity-60 max-w-[28em]">
                      Browse ideas from the community, vote on the ones you love, or propose your own.
                    </p>
                  </Link>

                  {/* Start contributing */}
                  <Link
                    to="/contribute"
                    className="group col-span-6 md:col-span-5 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[280px]"
                    style={{ background: "var(--color-tan)" }}
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
                        <span className="h-1.5 w-14 rounded-full bg-current/10" />
                        <span className="h-1.5 w-16 rounded-full bg-current/10" />
                        <span className="h-1.5 w-12 rounded-full bg-current/10" />
                      </div>
                      {/* Issue rows */}
                      {[
                        { w: "w-[70%]", r: "w-10", tint: true },
                        { w: "w-[55%]", r: "w-12", tint: false },
                        { w: "w-[65%]", r: "w-10", tint: false },
                        { w: "w-[50%]", r: "w-14", tint: false },
                        { w: "w-[60%]", r: "w-10", tint: false },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-2.5 py-1.5 border-b border-current/5 transition-all ${i === 0 ? "group-hover:bg-current/[0.04]" : ""}`}
                          style={{ transitionDelay: `${i * 60}ms` }}
                        >
                          <svg width="8" height="8" viewBox="0 0 16 16" fill="none" className="opacity-30 shrink-0">
                            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="8" cy="8" r="2" fill="currentColor" />
                          </svg>
                          <span
                            className={`h-1.5 ${row.w} rounded-full transition-opacity group-hover:opacity-80 ${row.tint ? "bg-teal/25" : "bg-current/10"}`}
                            style={{ transitionDelay: `${i * 60}ms` }}
                          />
                          <span className={`ml-auto h-1.5 ${row.r} rounded-full bg-current/5 shrink-0`} />
                        </div>
                      ))}
                    </div>
                    <p className="body-small mono opacity-60 max-w-[28em]">
                      Pick up a good first issue and ship your first PR.
                    </p>
                  </Link>

                  {/*  PHASE 03: BUILD  */}
                  <div id="build" className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2 scroll-mt-[calc(var(--spacing-header-height-expanded)+var(--spacing-gutter))]">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">03</span>
                    <h3 className="h4 sans pb-1">Build</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Read the Docs  hero card */}
                  <Link
                    to="https://github.com/logos-co/logos-docs"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 md:row-span-2 rounded-[16px] p-gutter flex flex-col justify-between overflow-hidden relative transition-all hover:shadow-sm min-h-[200px]"
                    style={{ background: "var(--color-grey)" }}
                    onClick={trackClick("read_the_docs")}
                  >
                    <div>
                      <div className="flex items-baseline justify-between mb-6">
                        <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Read the Docs</span>
                        <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </div>
                      <p className="body-small mono opacity-60 max-w-[24em]">
                        Deep-dive into the Logos stack  architecture, modules, APIs and integration guides.
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
                    <p className="body-small mono opacity-50">
                      Start with a boilerplate.
                    </p>
                  </Link>

                  {/* Sample apps */}
                  <button
                    className="group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px] text-left cursor-pointer"
                    style={{ background: "var(--color-grey)" }}
                    onClick={() => {
                      setSampleAppsOpen(true);
                      trackClick("sample_apps")();
                    }}
                  >
                    <div className="flex items-baseline justify-between w-full">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Sample apps</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-small mono opacity-50 mt-auto">
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
                      <p className="body-small mono opacity-70">
                        Live coding sessions and step-by-step guides.
                      </p>
                    </div>
                  </Link>

                  {/* Developer support */}
                  <button
                    className="cursor-pointer group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px] text-left"
                    style={{ background: "var(--color-grey)" }}
                    onClick={() => {
                      setDevSupportOpen(true);
                      trackClick("developer_support")();
                    }}
                  >
                    <div className="flex items-baseline justify-between w-full">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Developer support</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-small mono opacity-50">
                      Discord, X, community forum and the research forum.
                    </p>
                  </button>
                  <DevSupportModal open={devSupportOpen} onClose={() => setDevSupportOpen(false)} />

                  {/*  PHASE 04: GET SUPPORT  */}
                  <div id="get-support" className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2 scroll-mt-[calc(var(--spacing-header-height-expanded)+var(--spacing-gutter))]">
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
                      <p className="body-small mono opacity-40 max-w-[24em]">
                        Compete for prizes by building on the Logos execution layer. Ship code and win support.
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
                    className="group col-span-6 rounded-[16px] p-gutter flex flex-col justify-between gap-12 overflow-hidden relative transition-all hover:shadow-sm min-h-[240px] theme-dark"
                    style={{ background: "var(--color-dark-green)" }}
                    onClick={trackClick("explore_rfps")}
                    >
                    <div className="flex items-baseline justify-between">
                      <span className="h4 sans transition-transform group-hover:-translate-y-0.5">Explore RFPs</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <div>
                      <p className="body-small mono opacity-60 max-w-[24em]">
                        Apply for supported proposals. The Logos RFP Program backs developers building on the stack.
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
                    className="group col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-col gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[200px] theme-dark"
                    style={{ background: "var(--color-dark-green)" }}
                    onClick={trackClick("speak_to_core_contributor")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Speak to a core contributor</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-small mono opacity-60 mt-auto">
                      Get direct guidance from the people building the Logos stack.
                    </p>
                  </Link>

                  {/* Logos Community Forum */}
                  <Link
                    to="https://forum.logos.co/"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-col gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[200px] theme-dark"
                    style={{ background: "var(--color-dark-green)" }}
                    onClick={trackClick("logos_community_forum")}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h5 sans transition-transform group-hover:-translate-y-0.5">Logos community forum</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-small mono opacity-60 mt-auto">
                      Discuss research, ask technical questions and connect with the broader Logos community.
                    </p>
                  </Link>

                </ScrollEntrance>
              </div>
            </section>

            {/*  Section 5: Manifesto Quote (full-bleed)  */}
            <section
              className="relative overflow-hidden text-[#F3EFE0] bg-cover bg-center"
              style={{ backgroundImage: "url(/hero-gradient-1.png)" }}
            >
              {/* Blend into footer green */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--color-dark-green) 60%, transparent) 70%, var(--color-dark-green) 100%)",
                }}
              />
              <div className="relative mx-auto px-margin max-w-site-max-w-margin py-v-space-sm md:py-v-space">
                <div className="grid grid-cols-12 gap-gutter min-h-[320px] md:min-h-[420px]">
                  <blockquote className="col-span-12 md:col-span-7 lg:col-span-6 flex flex-col justify-between gap-v-space-sm">
                    <p className="h2 md:h1 leading-[1.04] text-balance">
                      We don&apos;t need to fight. We already have the <em className="italic">tools</em> to peacefully resist tyranny.
                    </p>
                    <footer className="flex items-center gap-3">
                      <span className="block w-8 h-px bg-current opacity-50" />
                      <cite className="not-italic font-mono text-[11px] tracking-[0.18em] uppercase opacity-70">
                        The Logos Manifesto &middot; 2024
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </section>

    <SampleAppsModal open={sampleAppsOpen} onClose={() => setSampleAppsOpen(false)} />
    </SiteLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
