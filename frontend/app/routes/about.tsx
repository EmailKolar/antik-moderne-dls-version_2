import type { Route } from "./+types/about";
import { AboutSection } from "~/components/AboutSection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Antik Moderne" },
    { name: "description", content: "About Antik Moderne" },
  ];
}

export default function About() {
  return <AboutSection />;
}
