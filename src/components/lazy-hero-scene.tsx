"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroCanvas = dynamic(() => import("@/components/hero-canvas"), {
  ssr: false,
});

export default function LazyHeroScene() {
  const root = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className="hero-canvas-shell" aria-hidden="true">
      {entered && <HeroCanvas />}
    </div>
  );
}
