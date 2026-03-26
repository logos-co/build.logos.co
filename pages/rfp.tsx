import React, { useState, useEffect } from "react";
import Head from "next/head";
import TextLink from "@components/TextLink";
import Button from "@components/Button";
import ScrollEntrance from "@components/ScrollEntrance";
import SiteLayout from "@components/SiteLayout";
import MarkdownModal from "@components/MarkdownModal";
import cx from "classnames";
import { fetchRfps, type RfpData } from "@/lib/rfps";

/* ───────────── RFP Grid Card ────────────────────────────────── */

const RfpCard = ({
  rfp,
  onOpen,
}: {
  rfp: RfpData;
  onOpen: (rfp: RfpData) => void;
}) => (
  <div>
    <button
      onClick={() => onOpen(rfp)}
      className="p-gutter border rounded-[12px] h-full flex flex-col gap-gutter aspect-square transition-[background] hover:bg-main! text-left w-full cursor-pointer"
    >
      <div className="w-full grow space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="body-tiny opacity-60">{rfp.number}</span>
          {rfp.status && (
            <span
              className={cx("body-tiny px-2 py-[2px] rounded-full", {
                "bg-green-100 text-green-800": rfp.status.toLowerCase().includes("open"),
                "bg-yellow-100 text-yellow-800": rfp.status.toLowerCase().includes("draft"),
                "bg-blue-100 text-blue-800": rfp.status.toLowerCase().includes("completed") || rfp.status.toLowerCase().includes("closed"),
              })}
            >
              {rfp.status}
            </span>
          )}
        </div>
        <p className="h5 sans text-balance max-w-[14em]">{rfp.title}</p>
        {rfp.category && (
          <span className="body-tiny opacity-60">{rfp.category}</span>
        )}
        <div className="mt-gutter">
          <Button as="span" className="secondary" arrow>
            Learn More
          </Button>
        </div>
      </div>
      {rfp.summary && (
        <div className="w-full flex items-end">
          <p className="body-tiny max-w-[26em]">{rfp.summary}</p>
        </div>
      )}
    </button>
  </div>
);

/* ───────────── RFP List Row ─────────────────────────────────── */

const RfpRow = ({
  index,
  rfp,
  onOpen,
}: {
  index: number;
  rfp: RfpData;
  onOpen: (rfp: RfpData) => void;
}) => (
  <li className={cx("theme-light-grey", { "bg-[#1525210D]!": index % 2 !== 0 })}>
    <div className="px-margin py-gutter flex gap-y-gutter flex-wrap lg:grid lg:grid-cols-12 lg:gap-x-gutter lg:min-h-[70px]">
      <div className="grow sm:grow-0 flex gap-1 items-baseline sm:w-[calc(50%-var(--spacing-gutter)/2)] sm:mr-gutter lg:col-span-1 lg:mr-0 lg:w-full">
        <span className="body grow-0 shrink-0 w-[2em]">
          {rfp.number.replace("RFP-", "")}
        </span>
      </div>
      <div className="grow sm:grow-0 flex gap-1 items-baseline lg:col-span-3 lg:w-full">
        <span className="body serif">{rfp.title}</span>
      </div>
      <div className="order-3 w-full lg:order-2 lg:col-span-4 sm:pl-[calc(50%+var(--spacing-gutter)/2)] lg:pl-0">
        <p className="text-balance body-tiny whitespace-pre-wrap max-w-[32em]">
          {rfp.summary}
        </p>
      </div>
      <div className="order-2 lg:order-3 lg:col-span-2">
        <div className="flex gap-2 flex-wrap">
          {rfp.category && (
            <span className="body-tiny opacity-60">{rfp.category}</span>
          )}
          {rfp.status && (
            <span className="body-tiny opacity-60">· {rfp.status}</span>
          )}
        </div>
      </div>
      <div className="order-4 lg:order-4 lg:col-span-2">
        <TextLink as="button" onClick={() => onOpen(rfp)} arrow>
          View RFP
        </TextLink>
      </div>
    </div>
  </li>
);

/* ──────────────────────── Page ──────────────────────────────── */

export default function RfpPage() {
  const [rfps, setRfps] = useState<RfpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [modalRfp, setModalRfp] = useState<RfpData | null>(null);

  useEffect(() => {
    fetchRfps()
      .then(setRfps)
      .catch((err) => console.error("Failed to fetch RFPs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      <Head>
        <title>RFPs | Logos Builders Hub</title>
        <meta name="description" content="Apply for funded proposals. The Logos RFP Program backs developers building on the decentralized tech stack." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="RFPs | Logos Builders Hub" />
        <meta property="og:description" content="Apply for funded proposals. The Logos RFP Program backs developers building on the decentralized tech stack." />
        <meta property="og:url" content="https://build.logos.co/rfp" />
        <meta property="og:image" content="https://build.logos.co/og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Logos_network" />
        <meta name="twitter:title" content="RFPs | Logos Builders Hub" />
        <meta name="twitter:description" content="Apply for funded proposals. The Logos RFP Program backs developers building on the stack." />
        <link rel="canonical" href="https://build.logos.co/rfp" />
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
                  <div className="col-span-5">
                    <h1 className="h2 text-balance flex items-center gap-3">
                      <img src="/mark.svg" alt="" className="h-[0.8em]" />
                      RFPs
                    </h1>
                  </div>
                  <div className="col-span-4 flex flex-col justify-center gap-2">
                    <p className="body-tiny max-w-[26em] text-balance">
                      The Logos RFP Program supports developers to build
                      applications on the Logos Stack. Browse all open requests
                      for proposals below.
                    </p>
                    <TextLink to="https://github.com/logos-co/rfp/blob/master/TERMS_AND_CONDITIONS.md" target="_blank" arrow>
                      Terms and Conditions
                    </TextLink>
                  </div>
                  <div className="col-span-3 flex items-center justify-end">
                    <Button
                      to="https://github.com/logos-co/rfp"
                      target="_blank"
                      arrow
                    >
                      View the Repo
                    </Button>
                  </div>
                </ScrollEntrance>

                {/* ── View Toggle ── */}
                <div className="mt-v-space-sm flex items-center gap-3">
                  <button
                    onClick={() => setView("grid")}
                    className={cx("h6 cursor-pointer pb-1", {
                      "animate-underline underlined": view === "grid",
                      "opacity-50": view !== "grid",
                    })}
                  >
                    GRID
                  </button>
                  <span className="h6 opacity-30">/</span>
                  <button
                    onClick={() => setView("list")}
                    className={cx("h6 cursor-pointer pb-1", {
                      "animate-underline underlined": view === "list",
                      "opacity-50": view !== "list",
                    })}
                  >
                    List
                  </button>
                </div>
              </div>
            </section>

            {/* ── RFP Content ── */}
            <section className="pb-v-space theme-default">
              {view === "grid" ? (
                <div className="mx-auto px-margin max-w-site-max-w-margin">
                  <ScrollEntrance className="grid gap-x-gutter gap-y-v-space-sm grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                    {rfps.map((rfp) => (
                      <RfpCard key={rfp.number} rfp={rfp} onOpen={setModalRfp} />
                    ))}
                  </ScrollEntrance>
                </div>
              ) : (
                <ScrollEntrance>
                  <ol>
                    {rfps.map((rfp, i) => (
                      <RfpRow key={rfp.number} index={i} rfp={rfp} onOpen={setModalRfp} />
                    ))}
                  </ol>
                </ScrollEntrance>
              )}
              {loading && (
                <div className="px-margin py-v-space text-center">
                  <p className="body-tiny opacity-60">Loading RFPs...</p>
                </div>
              )}
              {!loading && rfps.length === 0 && (
                <div className="px-margin py-v-space text-center">
                  <p className="body-tiny opacity-60">No RFPs found.</p>
                </div>
              )}
            </section>

            {/* ── Markdown Modal ── */}
            <MarkdownModal
              open={!!modalRfp}
              onClose={() => setModalRfp(null)}
              markdown={modalRfp?.rawMarkdown || ""}
              title={modalRfp ? `${modalRfp.number}: ${modalRfp.title}` : ""}
              githubUrl={modalRfp?.githubUrl}
              applyUrl="https://github.com/logos-co/rfp/issues/new?template=proposal.yml"
            />
    </SiteLayout>
  );
}

