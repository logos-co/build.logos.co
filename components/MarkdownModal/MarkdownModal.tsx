import React, { useEffect, useMemo, useRef } from "react";
import ReactModal from "react-modal";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { MdClose } from "react-icons/md";
import Button from "@components/Button";

const SPEED = 300;

const styles: ReactModal.Styles = {
  content: {
    // @ts-ignore custom property
    "--speed": `${SPEED}ms`,
    top: undefined,
    left: undefined,
    right: undefined,
    bottom: undefined,
    border: undefined,
    overflow: undefined,
    WebkitOverflowScrolling: undefined,
    borderRadius: "16px",
    background: "var(--color-bg)",
    position: "relative",
    outline: "none",
    transition: `opacity ${SPEED}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    margin: "auto",
    padding: undefined,
    width: "100%",
    maxWidth: "860px",
    maxHeight: "90vh",
  },
  overlay: {
    // @ts-ignore custom property
    "--speed": `${SPEED}ms`,
    zIndex: 12,
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    background: "transparent",
    justifyContent: "center",
    overflow: "auto",
    transition: `background ${SPEED}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    padding: "var(--spacing-margin)",
  },
};

/** Strip YAML frontmatter (--- ... ---) from the top of markdown */
function stripFrontmatter(md: string): string {
  return md.replace(/^---[\s\S]*?---\n*/m, "");
}

/* ── Brand fonts ── */
const serif = "var(--font-main)";     // Rhymes Display — headings
const sans  = "var(--font-secondary)"; // Public Sans   — body
const mono  = "var(--font-mono)";      // Fira Code     — code

/* ── Reusable style fragments ── */
const body: React.CSSProperties = {
  fontFamily: sans,
  fontSize: 14,
  lineHeight: 1.7,
  letterSpacing: 0,
  fontWeight: 400,
  fontStyle: "normal",
  textTransform: "none" as const,
};

const heading = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: serif,
  fontSize: size,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  fontWeight: "normal",
  fontStyle: "normal",
  textTransform: "none" as const,
  margin: "1.5em 0 0.5em",
  ...extra,
});

const subheading = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: sans,
  fontSize: size,
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
  fontWeight: 600,
  fontStyle: "normal",
  textTransform: "none" as const,
  margin: "1.25em 0 0.4em",
  ...extra,
});

const mdComponents: Components = {
  /* ── Headings: serif for h1-h2, sans for h3-h6 ── */
  h1: ({ children }) => (
    <h1 data-ui style={heading(26)}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 data-ui style={heading(22, { paddingBottom: "0.3em", borderBottom: "1px solid rgba(0,0,0,.08)" })}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 data-ui style={subheading(16)}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 data-ui style={subheading(15)}>{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 data-ui style={subheading(14)}>{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 data-ui style={subheading(13, { opacity: 0.7 })}>{children}</h6>
  ),

  /* ── Body text ── */
  p: ({ children }) => (
    <p style={{ ...body, margin: "0 0 0.75em" }}>{children}</p>
  ),

  /* ── Lists ── */
  ul: ({ children }) => (
    <ul style={{ ...body, margin: "0.5em 0", paddingLeft: "1.75em", listStyleType: "disc" }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ ...body, margin: "0.5em 0", paddingLeft: "1.75em", listStyleType: "decimal" }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ ...body, marginBottom: "0.25em" }}>{children}</li>
  ),

  /* ── Blockquote ── */
  blockquote: ({ children }) => (
    <blockquote style={{ ...body, margin: "0.75em 0", padding: "0.5em 1em", borderLeft: "3px solid rgba(0,0,0,.12)", fontStyle: "italic" }}>
      {children}
    </blockquote>
  ),

  /* ── Code ── */
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code style={{ fontFamily: mono, fontSize: 12, lineHeight: 1.6, background: "none", padding: 0 }}>
          {children}
        </code>
      );
    }
    return (
      <code style={{ fontFamily: mono, fontSize: "0.9em", background: "rgba(0,0,0,.05)", padding: "0.15em 0.4em", borderRadius: 4 }}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre style={{ fontFamily: mono, fontSize: 12, lineHeight: 1.6, margin: "0.75em 0", padding: "1em", background: "rgba(0,0,0,.04)", borderRadius: 8, overflowX: "auto" }}>
      {children}
    </pre>
  ),

  /* ── Tables ── */
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "0.75em 0" }}>
      <table style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.5, width: "100%", borderCollapse: "collapse" as const }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, lineHeight: 1.5, padding: "0.5em 0.75em", textAlign: "left" as const, border: "1px solid rgba(0,0,0,.1)", background: "rgba(0,0,0,.03)" }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.5, padding: "0.5em 0.75em", textAlign: "left" as const, border: "1px solid rgba(0,0,0,.1)" }}>
      {children}
    </td>
  ),

  /* ── Links ── */
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 2 }}>
      {children}
    </a>
  ),

  /* ── Misc ── */
  hr: () => <hr style={{ margin: "1.5em 0", border: "none", borderTop: "1px solid rgba(0,0,0,.08)" }} />,
  img: ({ src, alt }) => (
    <img src={src} alt={alt || ""} style={{ maxWidth: "100%", borderRadius: 8, margin: "0.75em 0", display: "block" }} />
  ),
  strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
  input: ({ type, checked, ...props }) => {
    if (type === "checkbox") {
      return <input type="checkbox" checked={checked} readOnly style={{ marginRight: "0.5em" }} />;
    }
    return <input type={type} {...props} />;
  },
};

/* ── Modal ── */

interface MarkdownModalProps {
  open: boolean;
  onClose: () => void;
  markdown: string;
  title?: string;
  githubUrl?: string;
  applyUrl?: string;
}

const MarkdownModal: React.FC<MarkdownModalProps> = ({
  open,
  onClose,
  markdown,
  title,
  githubUrl,
  applyUrl,
}) => {
  const cleanMarkdown = useMemo(() => stripFrontmatter(markdown), [markdown]);

  // Portal into the div that carries the font CSS variable classes
  const parentRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    parentRef.current = document.querySelector("[class*='--font-main']") || document.body;
  }, []);

  useEffect(() => {
    if (open) {
      document.body.classList.add("ReactModal__Body--open");
    } else {
      document.body.classList.remove("ReactModal__Body--open");
    }
    return () => document.body.classList.remove("ReactModal__Body--open");
  }, [open]);

  return (
    <ReactModal
      isOpen={open}
      style={styles}
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      closeTimeoutMS={SPEED}
      contentLabel={title || "Specification"}
      ariaHideApp={false}
      parentSelector={() => parentRef.current || document.body}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b bg-[var(--color-bg)] rounded-t-[16px]">
        <span className="h5 sans truncate pr-4">{title || "Specification"}</span>
        <div className="flex items-center gap-3">
          {applyUrl && (
            <Button to={applyUrl} target="_blank" arrow>
              Submit Proposal
            </Button>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="body-tiny opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              View on GitHub &rarr;
            </a>
          )}
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close modal"
          >
            <MdClose size={22} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: "calc(90vh - 70px)" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {cleanMarkdown}
        </ReactMarkdown>
      </div>
    </ReactModal>
  );
};

export default MarkdownModal;
