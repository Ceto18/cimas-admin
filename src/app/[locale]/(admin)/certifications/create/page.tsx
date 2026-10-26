import type { Metadata } from "next";

import CertificationForm from "@/modules/certifications/components/CertificationForm";

export const metadata: Metadata = {
  title: "Nueva certificación",
  description:
    "Registro de certificaciones de CIMAS.",
};

export default function CreateCertificationPage() {
  return (
    <CertificationForm mode="create" />
  );
}