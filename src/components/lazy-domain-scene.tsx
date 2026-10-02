"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const DomainCanvas = dynamic(() => import("@/components/domain-canvas"), {
  ssr: false,
});

export default function LazyDomainScene() {
  const container = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  const handleReady = useCallback(() => setWebglReady(true), []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "260px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className={`domain-canvas-shell${webglReady ? " ready" : ""}`}
      aria-hidden="true"
    >
      {entered && <DomainCanvas onReady={handleReady} />}
    </div>
  );
}
