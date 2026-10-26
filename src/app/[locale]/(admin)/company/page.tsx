import type {
  Metadata,
} from "next";

import CompanyView from "@/modules/company/components/CompanyView";

export const metadata: Metadata = {
  title: "Empresa",
  description:
    "Información institucional de CIMAS.",
};

export default function CompanyPage() {
  return <CompanyView />;
}