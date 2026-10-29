import type {
  Metadata,
} from "next";

import CompanyForm from "@/modules/company/components/CompanyForm";

export const metadata: Metadata = {
  title: "Editar empresa",
  description:
    "Actualiza la información institucional de CIMAS.",
};

export default function CompanyEditPage() {
  return <CompanyForm />;
}