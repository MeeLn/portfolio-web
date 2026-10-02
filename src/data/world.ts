export type RealmId =
  "hub" | "about" | "skills" | "projects" | "journey" | "contact";

export type CameraDestination = {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  duration: number;
};

export type WorldPortal = {
  id: RealmId;
  title: string;
  section: string;
  position: [number, number, number];
  accent: string;
  destination: CameraDestination;
};

const destination = (
  id: string,
  position: [number, number, number],
  target: [number, number, number],
): CameraDestination => ({ id, position, target, fov: 42, duration: 1.15 });

export const hubCamera = destination("hub", [0, 0.35, 11], [0, 0, 0]);

export const worldPortals: WorldPortal[] = [
  {
    id: "about",
    title: "CHARACTER REALM",
    section: "about",
    position: [-4.7, 0.15, 0],
    accent: "#83c9ff",
    destination: destination("about", [-1.4, 0.2, 8.5], [-3.4, 0.1, 0]),
  },
  {
    id: "skills",
    title: "ABILITY REALM",
    section: "skills",
    position: [-2.35, -0.35, -0.6],
    accent: "#a69af2",
    destination: destination("skills", [-0.5, 0, 8.2], [-1.8, 0, 0]),
  },
  {
    id: "projects",
    title: "MISSION REALM",
    section: "projects",
    position: [0, 0.2, -1.1],
    accent: "#69d6ee",
    destination: destination("projects", [0, 0.25, 7.5], [0, 0.1, 0]),
  },
  {
    id: "journey",
    title: "PROGRESSION REALM",
    section: "journey",
    position: [2.35, -0.35, -0.6],
    accent: "#b9a0ff",
    destination: destination("journey", [0.5, 0, 8.2], [1.8, 0, 0]),
  },
  {
    id: "contact",
    title: "CONNECTION REALM",
    section: "contact",
    position: [4.7, 0.15, 0],
    accent: "#83c9ff",
    destination: destination("contact", [1.4, 0.2, 8.5], [3.4, 0.1, 0]),
  },
];

export const realmBySection: Record<string, RealmId> = {
  home: "hub",
  about: "about",
  skills: "skills",
  projects: "projects",
  analytics: "projects",
  journey: "journey",
  domain: "skills",
  shadow: "journey",
  contact: "contact",
};

export const realmCopy: Record<RealmId, { label: string; detail: string }> = {
  hub: { label: "SPAWN HUB", detail: "Choose a gateway to begin exploring." },
  about: { label: "CHARACTER REALM", detail: "The person behind the code." },
  skills: {
    label: "ABILITY REALM",
    detail: "A growing toolkit, unlocked by building.",
  },
  projects: {
    label: "MISSION REALM",
    detail: "Personal and college projects.",
  },
  journey: {
    label: "PROGRESSION REALM",
    detail: "The story is still being written.",
  },
  contact: { label: "CONNECTION REALM", detail: "Open a channel to Milan." },
};
