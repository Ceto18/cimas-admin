import ProjectForm from "@/modules/projects/components/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo proyecto",
  description: "Registro de un nuevo proyecto de CIMAS.",
};

export default function CreateProjectPage() {
  return <ProjectForm mode="create" />;
}