"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { ArrowUpRight, Gauge, Home, Move3D, ShieldCheck } from "lucide-react";
import { projects } from "@/data/projects";
import { journey } from "@/data/journey";
import {
  hubCamera,
  realmBySection,
  realmCopy,
  worldPortals,
  type RealmId,
} from "@/data/world";
import { useWorldStore } from "@/lib/world-store";

const WorldScene = dynamic(() => import("@/components/world-scene"), {
  ssr: false,
  loading: () => <div className="world-canvas-loading" aria-hidden="true" />,
});

class WorldErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="world-webgl-fallback" role="status">
          3D view unavailable · all portfolio content remains accessible
        </div>
      );
    return this.props.children;
  }
}

const navigation = [
  { realm: "about" as const, label: "Character", section: "about" },
  { realm: "skills" as const, label: "Abilities", section: "skills" },
  { realm: "projects" as const, label: "Missions", section: "projects" },
  { realm: "journey" as const, label: "Journey", section: "journey" },
  { realm: "contact" as const, label: "Contact", section: "contact" },
];

function WorldHud({
  onNavigate,
  onHub,
}: {
  onNavigate: (realm: RealmId, section: string) => void;
  onHub: () => void;
}) {
  const realm = useWorldStore((state) => state.realm);
  const phase = useWorldStore((state) => state.phase);
  const hovered = useWorldStore((state) => state.hovered);
  const selected = useWorldStore((state) => state.selected);
  const quality = useWorldStore((state) => state.quality);
  const setQuality = useWorldStore((state) => state.setQuality);
  const reduceMotion = useWorldStore((state) => state.reduceMotion);
  const setReduceMotion = useWorldStore((state) => state.setReduceMotion);
  const current = realmCopy[realm];
  const hoveredMilestone = journey.find((milestone) => milestone.id === hovered);
  const selectedMilestone = journey.find((milestone) => milestone.id === selected);
  const hoverLabel = hovered
    ? (worldPortals.find((portal) => portal.id === hovered)?.title ??
      projects.find((project) => project.slug === hovered)?.title ??
      (hoveredMilestone
        ? `CHAPTER ${hoveredMilestone.id} · ${hoveredMilestone.title}`
        : hovered === "contact-mail"
          ? "OPEN A CHANNEL · EMAIL"
          : realm === "skills"
            ? `ABILITY NODE / ${hovered}`
            : undefined))
    : undefined;
  const selectedLabel =
    realm === "journey" && selectedMilestone
      ? `CHAPTER ${selectedMilestone.id} · ${selectedMilestone.title}`
      : realm === "skills" && selected
        ? `SELECTED ABILITY / ${selected}`
        : undefined;
  return (
    <>
      <aside className="world-location" aria-live="polite" aria-atomic="true">
        <span className="world-live-dot" />
        <span>
          <small>WORLD / LOCATION</small>
          <strong>{current.label}</strong>
        </span>
        <span className="world-location-detail">
          {hoverLabel ?? selectedLabel ?? current.detail}
        </span>
        {phase === "transitioning" && (
          <span className="world-transition-status">TRAVELING</span>
        )}
      </aside>
      <nav
        className="world-gateways"
        aria-label="World gateways"
        onKeyDown={(event) => {
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
          );
          const currentIndex = controls.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          const direction =
            event.key === "ArrowDown" || event.key === "ArrowRight"
              ? 1
              : event.key === "ArrowUp" || event.key === "ArrowLeft"
                ? -1
                : 0;
          if (direction && controls.length) {
            event.preventDefault();
            controls[
              (currentIndex + direction + controls.length) % controls.length
            ].focus();
          }
        }}
      >
        <span className="world-gateways-label">GATEWAYS</span>
        <button
          type="button"
          className="world-home"
          onClick={onHub}
          aria-label="Return to the world hub"
          title="Return to hub"
        >
          <Home size={15} />
          <span>HUB</span>
        </button>
        {navigation.map((item, index) => (
          <button
            type="button"
            key={item.realm}
            onClick={() => onNavigate(item.realm, item.section)}
            className={
              realm === item.realm ? "world-gateway active" : "world-gateway"
            }
            aria-current={realm === item.realm ? "location" : undefined}
            aria-label={`Travel to ${item.label} realm`}
          >
            <span className="gateway-index">0{index + 1}</span>
            <span>{item.label}</span>
            <ArrowUpRight size={12} />
          </button>
        ))}
        <span className="world-controls-label">WORLD SETTINGS</span>
        <button
          type="button"
          className="world-setting"
          onClick={() =>
            setQuality(
              quality === "auto"
                ? "performance"
                : quality === "performance"
                  ? "cinematic"
                  : "auto",
            )
          }
          aria-label={`Graphics quality: ${quality}. Click to change`}
        >
          <Gauge size={14} />
          <span>{quality.toUpperCase()}</span>
        </button>
        <button
          type="button"
          className="world-setting"
          onClick={() => setReduceMotion(!reduceMotion)}
          aria-pressed={reduceMotion}
        >
          <Move3D size={14} />
          <span>{reduceMotion ? "MOTION REDUCED" : "MOTION ON"}</span>
        </button>
        <span className="world-access-note">
          <ShieldCheck size={12} /> KEYBOARD + TOUCH READY
        </span>
      </nav>
    </>
  );
}

export default function WorldShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const navigate = useCallback(
    (realm: RealmId, section: string) => {
      const portal = worldPortals.find((entry) => entry.id === realm);
      const destination = portal?.destination ?? hubCamera;
      useWorldStore.getState().beginTransition(realm, destination);
      if (pathname !== "/") {
        router.push(`/#${section}`);
        return;
      }
      document.getElementById(section)?.scrollIntoView({
        behavior: useWorldStore.getState().reduceMotion ? "auto" : "smooth",
      });
    },
    [pathname, router],
  );
  const onHub = useCallback(() => navigate("hub", "home"), [navigate]);
  const onProject = useCallback(
    (slug: string) => {
      useWorldStore
        .getState()
        .beginTransition("projects", worldPortals[2].destination, slug);
      router.push(`/projects/${slug}`);
    },
    [router],
  );

  useEffect(() => {
    if (pathname.startsWith("/projects/")) {
      useWorldStore
        .getState()
        .beginTransition("projects", worldPortals[2].destination);
      return;
    }
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    if (!sections.length) return;
    let lastRealm: RealmId | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const realm =
          realmBySection[(visible.target as HTMLElement).id] ?? "hub";
        if (realm === lastRealm) return;
        lastRealm = realm;
        const portal = worldPortals.find((entry) => entry.id === realm);
        const target = portal?.destination ?? hubCamera;
        const current = useWorldStore.getState();
        if (current.realm !== realm) current.beginTransition(realm, target);
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0, 0.12, 0.35] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div
      ref={root}
      className="world-shell"
      data-world-phase={useWorldStore.getState().phase}
    >
      <WorldErrorBoundary>
        <WorldScene
          eventSource={root}
          navigate={navigate}
          onProject={onProject}
        />
      </WorldErrorBoundary>
      <div className="world-content">{children}</div>
      <WorldHud onNavigate={navigate} onHub={onHub} />
    </div>
  );
}
