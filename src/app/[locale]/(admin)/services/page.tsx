import ServicesView from "@/modules/services/components/ServicesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Gestión de servicios de CIMAS.",
};

export default function ServicesPage() {
  return <ServicesView />;
}