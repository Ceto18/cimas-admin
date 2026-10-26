import ProjectsView from "@/modules/projects/components/ProjectsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Gestión de proyectos y experiencias de CIMAS.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}