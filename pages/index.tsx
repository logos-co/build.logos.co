import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "@components/Link";
import TextLink from "@components/TextLink";
import Button from "@components/Button";
import ScrollEntrance from "@components/ScrollEntrance";
import SiteLayout from "@components/SiteLayout";
import cx from "classnames";
import type { GetStaticProps } from "next";

/*  Page  */

export default function Home() {
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border border-current/20 mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Testnet
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
                        Leverage the interface to the parallel society and test out the applications available in Alpha Release.
                      </p>
                    </div>
                  </Link>

                  {/* Run a Node  terminal style */}
                  <Link
                    to="https://github.com/logos-co/logos-docs/blob/main/docs/blockchain/quickstart-guide-for-the-logos-blockchain-node.md"
                    target="_blank"
                    className="group col-span-6 md:col-span-7 rounded-[16px] overflow-hidden relative transition-all hover:shadow-sm min-h-[280px] flex flex-col theme-dark"
                    style={{ background: "var(--color-dark-green)" }}
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
                        Participate in the network by becoming a node, and connecting to the testnet in minutes to engage with the protocol.
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
                    to="https://github.com/logos-co/logos-app"
                    target="_blank"
                    className="group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px]"
                    style={{ background: "var(--color-grey)" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Scaffold boilerplate</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="body-tiny opacity-50">
                      Start with a production-ready template.
                    </p>
                  </Link>

                  {/* Sample apps */}
                  <Link
                    to="https://github.com/logos-co/eth-lez-atomic-swaps/"
                    target="_blank"
                    className="group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px]"
                    style={{ background: "var(--color-tan)" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Sample apps</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    {/* App tiles */}
                    <div className="flex gap-1.5">
                      {[
                        { name: "Atomic Swaps", icon: "" },
                        { name: "Multisig", icon: "" },
                        { name: "Explorer", icon: "" },
                      ].map((app, i) => (
                        <div
                          key={app.name}
                          className="flex-1 rounded-[6px] bg-bg/40 p-2 flex flex-col items-center gap-1.5 transition-all group-hover:bg-bg/70 group-hover:-translate-y-0.5"
                          style={{ transitionDelay: `${i * 60}ms` }}
                        >
                          <span className="text-base opacity-40 transition-opacity group-hover:opacity-70" style={{ transitionDelay: `${i * 60}ms` }}>{app.icon}</span>
                          <span className="text-[9px] opacity-40 text-center leading-tight">{app.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="body-tiny opacity-50">
                      Real-world examples to learn from.
                    </p>
                  </Link>

                  {/* Workshops & Tutorials */}
                  <Link
                    to="https://www.youtube.com/@LogosNetwork"
                    target="_blank"
                    className="group col-span-3 md:col-span-4 rounded-[16px] overflow-hidden relative transition-all hover:shadow-sm min-h-[140px] flex flex-col text-white"
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
                  <Link
                    to="https://discord.gg/logosnetwork"
                    target="_blank"
                    className="group col-span-3 md:col-span-4 rounded-[16px] p-gutter flex flex-col justify-between gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[140px]"
                    style={{ background: "var(--color-light-blue)" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h6 sans transition-transform group-hover:-translate-y-0.5">Developer support</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    {/* Discord icon */}
                    <svg width="28" height="22" viewBox="0 0 71 55" fill="currentColor" className="opacity-20 absolute bottom-4 right-4">
                      <path d="M60.1 4.9A58.5 58.5 0 0 0 45.4.2a.2.2 0 0 0-.2.1 40.8 40.8 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37.4 37.4 0 0 0 25.4.3a.2.2 0 0 0-.2-.1A58.4 58.4 0 0 0 10.6 4.9a.2.2 0 0 0-.1.1C1.5 18.7-.9 32.2.3 45.5v.2a58.9 58.9 0 0 0 17.7 9a.2.2 0 0 0 .3-.1 42.1 42.1 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.7.2.2 0 0 1 0-.4l1.1-.9a.2.2 0 0 1 .2 0 42 42 0 0 0 35.8 0 .2.2 0 0 1 .2 0l1.1.9a.2.2 0 0 1 0 .4 36.4 36.4 0 0 1-5.5 2.7.2.2 0 0 0-.1.3 47.2 47.2 0 0 0 3.6 5.9.2.2 0 0 0 .3.1A58.7 58.7 0 0 0 70.5 45.7v-.2c1.4-15-2.3-28.1-9.8-39.7a.2.2 0 0 0-.1 0ZM23.7 37.3c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.3 3.1 6.3 7-2.8 7-6.3 7Zm23.3 0c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.3 3.1 6.3 7-2.8 7-6.3 7Z" />
                    </svg>
                    <p className="body-tiny opacity-50">
                      Discord, office hours, and the research forum.
                    </p>
                  </Link>

                  {/*  PHASE 04: GET INCUBATED  */}
                  <div className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">04</span>
                    <h3 className="h4 sans pb-1">Get Incubated</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Prizes  premium card */}
                  <Link
                    to="/prize"
                    className="group col-span-6 rounded-[16px] p-gutter flex flex-col justify-between gap-12 overflow-hidden relative transition-all hover:shadow-sm min-h-[240px] theme-dark"
                    style={{ background: "var(--color-dark-green)" }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="h4 sans transition-transform group-hover:-translate-y-0.5 flex items-center gap-2"><img src="/mark.svg" alt="" className="h-[0.7em] brightness-0 invert" />Prizes</span>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <div>
                      <p className="body-tiny opacity-40 max-w-[24em]">
                        Compete for prizes by building on the Logos execution layer. Ship code, win funding.
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

                  {/*  PHASE 05: GET SUPPORT  */}
                  <div className="col-span-6 md:col-span-12 flex items-end gap-4 mt-gutter pb-2">
                    <span className="font-mono text-[3rem] md:text-[4.5rem] leading-none font-light opacity-[0.07] select-none">?</span>
                    <h3 className="h4 sans pb-1">Get Support</h3>
                    <div className="flex-1 h-px bg-current opacity-10 mb-3" />
                  </div>

                  {/* Developer Office Hours */}
                  {/* Developer Office Hours */}
                  <Link
                    to="https://discord.gg/logosnetwork"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-row gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[200px] border"
                  >
                    <div className="flex flex-col justify-between gap-4 flex-1 min-w-0">
                      <div>
                        <span className="h5 sans transition-transform group-hover:-translate-y-0.5 block">Developer office hours</span>
                      </div>
                      <p className="body-tiny opacity-60">
                        Join weekly live sessions with the engineering team. Ask questions, get unblocked, and share what you're building.
                      </p>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    {/* Animated calendar */}
                    <div className="flex items-center justify-center shrink-0">
                      <div className="w-[72px] rounded-[6px] border border-current/10 overflow-hidden bg-current/[0.02] group-hover:bg-current/[0.04] transition-colors">
                        <div className="h-2 bg-teal/20 group-hover:bg-teal/40 transition-colors" />
                        <div className="grid grid-cols-7 gap-px p-1.5">
                          {[...Array(21)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                i === 10
                                  ? "bg-teal/50 group-hover:bg-teal group-hover:scale-150"
                                  : "bg-current/[0.06] group-hover:bg-current/[0.12]"
                              }`}
                              style={{ transitionDelay: `${i * 15}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Speak to a Core Contributor */}
                  <Link
                    to="https://cal.com/team/logos-onboarding/intro"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-row gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[200px] border"
                  >
                    <div className="flex flex-col justify-between gap-4 flex-1 min-w-0">
                      <div>
                        <span className="h5 sans transition-transform group-hover:-translate-y-0.5 block">Speak to a core contributor</span>
                      </div>
                      <p className="body-tiny opacity-60">
                        Get direct guidance from the people building the Logos stack. Book a call with a core contributor.
                      </p>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    {/* Animated video call mockup */}
                    <div className="flex items-center justify-center shrink-0">
                      <div className="w-[90px]">
                        <div className="rounded-[8px] border border-current/10 overflow-hidden bg-current/[0.02] group-hover:bg-current/[0.04] transition-colors">
                          <div className="flex items-center gap-1 px-2 py-1 border-b border-current/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/40 group-hover:bg-green-500/70 transition-colors" />
                            <span className="text-[8px] opacity-20 font-mono">Live</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 p-2">
                            {[0,1,2,3].map((i) => (
                              <div
                                key={i}
                                className="aspect-square rounded-[4px] bg-current/[0.04] group-hover:bg-current/[0.08] flex items-center justify-center transition-all group-hover:-translate-y-0.5"
                                style={{ transitionDelay: `${i * 80}ms` }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-15 group-hover:opacity-30 transition-opacity" style={{ transitionDelay: `${i * 80}ms` }}>
                                  <circle cx="12" cy="8" r="4" />
                                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                                </svg>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Logos Community Forum */}
                  <Link
                    to="https://forum.logos.co/"
                    target="_blank"
                    className="group col-span-6 md:col-span-4 rounded-[16px] p-gutter flex flex-row gap-4 overflow-hidden relative transition-all hover:shadow-sm min-h-[200px] border"
                  >
                    <div className="flex flex-col justify-between gap-4 flex-1 min-w-0">
                      <div>
                        <span className="h5 sans transition-transform group-hover:-translate-y-0.5 block">Logos community forum</span>
                      </div>
                      <p className="body-tiny opacity-60">
                        Discuss research, ask technical questions, and connect with the broader Logos community.
                      </p>
                      <span className="h6 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    {/* Animated forum threads */}
                    <div className="flex items-center justify-center shrink-0">
                      <div className="w-[100px] space-y-1.5">
                        {[
                          { w: "85%", delay: 0 },
                          { w: "70%", delay: 80 },
                          { w: "90%", delay: 160 },
                          { w: "60%", delay: 240 },
                        ].map((row, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-1.5 py-1 rounded-[4px] bg-current/[0.02] group-hover:bg-current/[0.05] transition-all group-hover:translate-x-0.5"
                            style={{ transitionDelay: `${row.delay}ms` }}
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-current/[0.06] group-hover:bg-current/[0.12] shrink-0 transition-colors" style={{ transitionDelay: `${row.delay}ms` }} />
                            <div
                              className="h-[3px] rounded-full bg-current/[0.06] group-hover:bg-current/[0.12] transition-colors"
                              style={{ width: row.w, transitionDelay: `${row.delay}ms` }}
                            />
                            <div className="ml-auto flex gap-0.5">
                              <div className="w-1 h-1 rounded-full bg-current/[0.08] group-hover:bg-teal/30 transition-colors" style={{ transitionDelay: `${row.delay + 100}ms` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
                          Logos Basecamp is a complete distribution that bundles the kernel, the default modules, and UI packages into a usable product. It allows the user to easily interact with simple apps built on the various modules.
                        </p>
                        <div className="my-gutter flex flex-wrap gap-[8px]">
                          {[
                            { label: "Wallet", icon: "M21 4H3v16h18V4zM3 8h18" },
                            { label: "Chat Interface", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
                            { label: "Filesharing Tool", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" },
                            { label: "Explorer", icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z" },
                          ].map((item) => (
                            <span
                              key={item.label}
                              className="body sans px-[10px] py-[8px] rounded-full flex gap-[8px] items-center shrink-0"
                              style={{ background: "var(--color-grey)", boxShadow: "inset 0 0 0 1px rgba(21,37,33,0.06)" }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                                <path d={item.icon} />
                              </svg>
                              {item.label}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button
                            to="https://github.com/logos-co/logos-app/releases"
                            target="_blank"
                            className="secondary"
                            arrow
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

    </SiteLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
