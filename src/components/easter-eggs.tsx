"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Terminal, X } from "lucide-react";
import Link from "next/link";

const sequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function EasterEggs() {
  const [notice, setNotice] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let position = 0;
    let timer: number | undefined;
    const onKey = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "d" &&
        !event.repeat
      ) {
        event.preventDefault();
        setConsoleOpen(true);
      }
      if (event.key === "Escape") setConsoleOpen(false);
      if (event.key === sequence[position]) {
        position += 1;
        if (position === sequence.length) {
          position = 0;
          setNotice(true);
          document.documentElement.dataset.secret = "awake";
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            setNotice(false);
            delete document.documentElement.dataset.secret;
          }, 3600);
        }
      } else {
        position = event.key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
      delete document.documentElement.dataset.secret;
    };
  }, []);

  useEffect(() => {
    if (!consoleOpen) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const dialog = closeRef.current?.closest<HTMLElement>("[role=dialog]");
      const items = dialog?.querySelectorAll<HTMLElement>(
        "a[href],button:not([disabled])",
      );
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [consoleOpen]);

  return (
    <>
      {notice && (
        <div className="achievement-toast" role="status" aria-live="polite">
          <span className="achievement-mark">MR</span>
          <span>
            <b>HIDDEN PATH UNLOCKED</b>
            <small>Developer system awakened.</small>
          </span>
        </div>
      )}
      {consoleOpen && (
        <div
          className="dev-console-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConsoleOpen(false);
          }}
        >
          <section
            className="dev-console"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dev-console-title"
          >
            <header>
              <span>
                <Terminal size={14} /> DEVELOPER CONSOLE / LOCAL
              </span>
              <button
                ref={closeRef}
                onClick={() => setConsoleOpen(false)}
                aria-label="Close developer console"
              >
                <X size={16} />
              </button>
            </header>
            <h2 id="dev-console-title">System status: online</h2>
            <p>
              <i /> Next.js portfolio interface ready.
            </p>
            <p>
              <i /> Public project archive loaded.
            </p>
            <p>
              <i /> GitHub data requests are optional and may be unavailable.
            </p>
            <Link href="#projects" onClick={() => setConsoleOpen(false)}>
              Open mission archive <ArrowRight size={14} />
            </Link>
            <small>KEY: ALT + SHIFT + D · ESC TO CLOSE</small>
          </section>
        </div>
      )}
    </>
  );
}
