import { create } from "zustand";
import { hubCamera, type CameraDestination, type RealmId } from "@/data/world";

export type WorldPhase =
  "intro" | "hub" | "transitioning" | "exploring" | "content";

type WorldState = {
  realm: RealmId;
  phase: WorldPhase;
  destination: CameraDestination;
  selected: string | null;
  hovered: string | null;
  quality: "auto" | "performance" | "cinematic";
  reduceMotion: boolean;
  transitionToken: number;
  setRealm: (realm: RealmId) => void;
  beginTransition: (
    realm: RealmId,
    destination: CameraDestination,
    selected?: string,
  ) => number;
  completeTransition: (token: number) => void;
  enterWorld: () => void;
  returnToHub: () => void;
  setHovered: (id: string | null) => void;
  setQuality: (quality: WorldState["quality"]) => void;
  setReduceMotion: (reduce: boolean) => void;
};

export const useWorldStore = create<WorldState>((set, get) => ({
  realm: "hub",
  phase: "intro",
  destination: hubCamera,
  selected: null,
  hovered: null,
  quality: "auto",
  reduceMotion: false,
  transitionToken: 0,
  setRealm: (realm) => set({ realm }),
  beginTransition: (realm, destination, selected: string | null = null) => {
    const transitionToken = get().transitionToken + 1;
    set({
      realm,
      destination,
      selected,
      phase: "transitioning",
      transitionToken,
    });
    return transitionToken;
  },
  completeTransition: (token) => {
    if (get().transitionToken === token) set({ phase: "exploring" });
  },
  enterWorld: () => {
    const state = get();
    state.beginTransition("hub", hubCamera);
  },
  returnToHub: () => {
    const token = get().beginTransition("hub", hubCamera);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/#home");
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    }
    return token;
  },
  setHovered: (hovered) => set({ hovered }),
  setQuality: (quality) => set({ quality }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
}));
