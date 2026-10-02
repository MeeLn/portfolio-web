export type JourneyMilestone = {
  id: string;
  title: string;
  description: string;
};

export const journey: JourneyMilestone[] = [
  {
    id: "01",
    title: "The beginning",
    description: "Curiosity turns into a first line of code.",
  },
  {
    id: "02",
    title: "Learning the fundamentals",
    description:
      "Building understanding across programming, software, and systems.",
  },
  {
    id: "03",
    title: "Building projects",
    description:
      "Turning ideas into applications through personal and college projects.",
  },
  {
    id: "04",
    title: "Exploring what’s next",
    description: "Continuing to learn, experiment, and make more useful things.",
  },
];
