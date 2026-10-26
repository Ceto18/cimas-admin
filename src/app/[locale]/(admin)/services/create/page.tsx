import ServiceForm from "@/modules/services/components/ServiceForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo servicio",
  description:
    "Registro de un nuevo servicio de CIMAS.",
};

export default function CreateServicePage() {
  return (
    <ServiceForm mode="create" />
  );
}