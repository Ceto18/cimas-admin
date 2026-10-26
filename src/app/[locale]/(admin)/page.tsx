import HomeView from "@/modules/home/components/HomeView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Gestión de la portada principal de CIMAS.",
};

export default function HomePage() {
  return <HomeView />;
}