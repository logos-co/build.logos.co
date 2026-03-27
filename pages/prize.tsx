import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import TextLink from "@components/TextLink";
import Button from "@components/Button";
import ScrollEntrance from "@components/ScrollEntrance";
import SiteLayout from "@components/SiteLayout";
import MarkdownModal from "@components/MarkdownModal";
import cx from "classnames";
import { fetchPrizes, type PrizeData } from "@/lib/prizes";
import { trackEvent } from "@/context/UmamiProvider";

/* ───────────── Prize Grid Card ──────────────────────────────── */

const PrizeCard = ({
  prize,
  onOpen,
}: {
  prize: PrizeData;
  onOpen: (prize: PrizeData) => void;
}) => (
  <div>
    <button
      onClick={() => onOpen(prize)}
      className="p-gutter border rounded-[12px] h-full flex flex-col gap-gutter aspect-square transition-[background] hover:bg-main! text-left w-full cursor-pointer"
    >
      <div className="w-full grow space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="body-tiny opacity-60">{prize.number}</span>
          {prize.status && !prize.status.toLowerCase().includes("open") && (
            <span
              className={cx("body-tiny px-2 py-[2px] rounded-full", {
                "bg-yellow-100 text-yellow-800":
                  prize.status.toLowerCase().includes("draft"),
                "bg-blue-100 text-blue-800":
                  prize.status.toLowerCase().includes("completed"),
              })}
            >
              {prize.status.split(" - ")[0].replace(/^draft$/i, "Draft")}
            </span>
          )}
        </div>
        <p className="h5 sans text-balance max-w-[14em]">{prize.title}</p>
        <div className="flex gap-3 flex-wrap">
          {prize.effort && (
            <span className="body-tiny opacity-60">Effort: {prize.effort}</span>
          )}
          {prize.prize && prize.prize !== "TBD" && (
            <span className="body-tiny opacity-60">Prize: ${prize.prize}</span>
          )}
        </div>
        <div className="mt-gutter">
          <Button as="span" className="secondary" arrow>
            Learn More
          </Button>
        </div>
      </div>
      {prize.overview && (
        <div className="w-full flex items-end">
          <p className="body-tiny max-w-[26em]">{prize.overview}</p>
        </div>
      )}
    </button>
  </div>
);

/* ───────────── Prize List Row ───────────────────────────────── */

const PrizeRow = ({
  index,
  prize,
  onOpen,
}: {
  index: number;
  prize: PrizeData;
  onOpen: (prize: PrizeData) => void;
}) => (
  <li className={cx("theme-light-grey", { "bg-[#1525210D]!": index % 2 !== 0 })}>
    <div className="px-margin py-gutter flex gap-y-gutter flex-wrap lg:grid lg:grid-cols-12 lg:gap-x-gutter lg:min-h-[70px]">
      <div className="grow sm:grow-0 flex gap-1 items-baseline sm:w-[calc(50%-var(--spacing-gutter)/2)] sm:mr-gutter lg:col-span-1 lg:mr-0 lg:w-full">
        <span className="body grow-0 shrink-0 w-[2em]">
          {prize.number.replace("LP-", "")}
        </span>
      </div>
      <div className="grow sm:grow-0 flex gap-1 items-baseline lg:col-span-3 lg:w-full">
        <span className="body serif">{prize.title}</span>
      </div>
      <div className="order-3 w-full lg:order-2 lg:col-span-4 sm:pl-[calc(50%+var(--spacing-gutter)/2)] lg:pl-0">
        <p className="text-balance body-tiny whitespace-pre-wrap max-w-[32em]">
          {prize.overview}
        </p>
      </div>
      <div className="order-2 lg:order-3 lg:col-span-2">
        <div className="flex gap-2 flex-wrap">
          {prize.effort && (
            <span className="body-tiny opacity-60">Effort: {prize.effort}</span>
          )}
          {prize.status && (
            <span className="body-tiny opacity-60">· {prize.status.split(" - ")[0]}</span>
          )}
        </div>
      </div>
      <div className="order-4 lg:order-4 lg:col-span-2">
        <TextLink onClick={() => onOpen(prize)} arrow>
          View Prize
        </TextLink>
      </div>
    </div>
  </li>
);

/* ──────────────────────── Page ──────────────────────────────── */

export default function PrizePage() {
  const { asPath } = useRouter();
  const [prizes, setPrizes] = useState<PrizeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [modalPrize, setModalPrize] = useState<PrizeData | null>(null);

  useEffect(() => {
    fetchPrizes()
      .then(setPrizes)
      .catch((err) => console.error("Failed to fetch prizes:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      <Head>
        <title>Prizes | Logos Builders Hub</title>
        <meta name="description" content="Compete for prizes by building on the Logos execution layer. Browse the Lambda Prize program and ship code to win support." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prizes | Logos Builders Hub" />
        <meta property="og:description" content="Compete for prizes by building on the Logos execution layer. Browse the Lambda Prize program and ship code to win support." />
        <meta property="og:url" content="https://build.logos.co/prize" />
        <meta property="og:image" content="https://build.logos.co/og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Logos_network" />
        <meta name="twitter:title" content="Prizes | Logos Builders Hub" />
        <meta name="twitter:description" content="Compete for prizes by building on the Logos execution layer. Ship code, win support." />
        <link rel="canonical" href="https://build.logos.co/prize" />
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
                      Prizes
                    </h1>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <p className="body-tiny max-w-[26em] text-balance">
                      The Logos Lambda Prize program offers competitive prizes
                      for building on the Logos stack. Browse all prizes below.
                    </p>
                  </div>
                  <div className="col-span-3 flex items-center justify-end">
                    <Button
                      to="https://github.com/logos-co/lambda-prize"
                      target="_blank"
                      arrow
                      onClick={() =>
                        trackEvent("prize_view_repo", { source: asPath })
                      }
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

            {/* ── Prize Content ── */}
            <section className="pb-v-space theme-default">
              {view === "grid" ? (
                <div className="mx-auto px-margin max-w-site-max-w-margin">
                  <ScrollEntrance className="grid gap-x-gutter gap-y-v-space-sm grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                    {prizes.map((prize) => (
                      <PrizeCard key={prize.number} prize={prize} onOpen={setModalPrize} />
                    ))}
                  </ScrollEntrance>
                </div>
              ) : (
                <ScrollEntrance>
                  <ol>
                    {prizes.map((prize, i) => (
                      <PrizeRow key={prize.number} index={i} prize={prize} onOpen={setModalPrize} />
                    ))}
                  </ol>
                </ScrollEntrance>
              )}
              {loading && (
                <div className="px-margin py-v-space text-center">
                  <p className="body-tiny opacity-60">Loading prizes...</p>
                </div>
              )}
              {!loading && prizes.length === 0 && (
                <div className="px-margin py-v-space text-center">
                  <p className="body-tiny opacity-60">No prizes found.</p>
                </div>
              )}
            </section>

            {/* ── Markdown Modal ── */}
            <MarkdownModal
              open={!!modalPrize}
              onClose={() => setModalPrize(null)}
              markdown={modalPrize?.rawMarkdown || ""}
              title={modalPrize ? `${modalPrize.number}: ${modalPrize.title}` : ""}
              githubUrl={modalPrize?.githubUrl}
            />
    </SiteLayout>
  );
}

