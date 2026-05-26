import React from "react";
import Image from "next/image";
import Link from "@components/Link";
import TextLink from "@components/TextLink";
import Logo, { Logomark } from "@components/Logo";
import cx from "classnames";

/* ─────────────────────── Header ─────────────────────────────── */

export const SiteHeader = () => (
  <div className="sticky top-0 z-[11] h-0">
    <header className="main-header bg-bg h-header-height-expanded transition-all">
      <div className="px-margin grid grid-cols-2 gap-gutter items-center h-full">
        <div className="h-full flex items-center">
          <TextLink to="/" underlined={false}>
            Logos
          </TextLink>
        </div>
        <div className="flex items-center h-full justify-end">
          <div className="w-header-logo-width">
            <Link to="/" title="Go to homepage" className="block">
              <Logomark className="flex items-center" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  </div>
);

/* ─────────────────────── Footer ─────────────────────────────── */

const footerLists = [
  {
    links: [
      { label: "Work With Us", to: "https://free.technology/jobs", external: true },
    ],
  },
  {
    links: [
      { label: "Twitter", to: "https://x.com/Logos_network", external: true },
      { label: "Discord", to: "https://discord.gg/logosnetwork", external: true },
      { label: "YouTube", to: "https://www.youtube.com/@Logos_network", external: true },
      { label: "Blog", to: "https://press.logos.co/", external: true },
      { label: "GitHub", to: "https://github.com/logos-co", external: true },
    ],
  },
];

const footerLists2 = [
  {
    links: [
      { label: "Logos Research", to: "https://research.logos.co/", external: true },
    ],
  },
];

const FooterLinkList = ({ title, links }: { title?: string; links: { label: string; to: string; external?: boolean }[] }) => (
  <div>
    {title && <h6 className="mb-[4px]">{title}</h6>}
    <ul className="body-tiny">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            target={link.external ? "_blank" : undefined}
            className="transition-none! group cursor-pointer inline-block align-top py-[2px]"
          >
            <span className="animate-underline underlined py-[2px]">
              {link.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const SiteFooter = () => (
  <footer className="theme-dark">
    <div className="px-margin pt-margin pb-v-space-sm">
      <div className="grid gap-x-gutter gap-y-v-space grid-cols-4 md:grid-cols-6">
        {/* Footer image */}
        <div className="md:row-span-2 md:col-span-2 lg:col-span-1">
          <div className="relative aspect-video overflow-hidden rounded">
            <Image
              src="/footer.avif"
              alt=""
              width={300}
              height={170}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Logo + tagline */}
        <div className="col-span-full col-start-3 row-start-1 md:col-start-4 md:row-start-1">
          <div className="md:grid gap-x-gutter md:grid-cols-3">
            <div className="w-[65px] mb-8 md:mb-0">
              <Logo />
            </div>
            <p className="body serif text-balance md:col-start-3 max-w-[12em] md:max-w-full">
              Pioneering a new era of freedom.
            </p>
          </div>
        </div>

        {/* Work + Social */}
        {footerLists.map((list, index) => (
          <div
            key={index}
            className={cx({
              "md:row-start-2": true,
              "col-start-3 md:col-start-6": index % 2 !== 0,
              "col-start-1 md:col-start-4": index % 2 === 0,
            })}
          >
            <FooterLinkList links={list.links} />
          </div>
        ))}

        {/* Research */}
        {footerLists2.map((list, index) => (
          <div key={index} className="col-start-1 md:col-start-4 md:row-start-3">
            <FooterLinkList links={list.links} />
          </div>
        ))}
      </div>
    </div>
  </footer>
);

/* ─────────────────────── Layout ─────────────────────────────── */

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="Layout">
      <SiteHeader />
      <main
        id="content"
        className="flex w-full min-h-screen"
        style={{
          paddingTop: "calc(var(--spacing-header-height-expanded) + var(--spacing-gutter))",
        }}
      >
        <div className="grow w-full">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
