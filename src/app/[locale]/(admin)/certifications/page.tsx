import type { Metadata } from "next";

import CertificationsView from "@/modules/certifications/components/CertificationsView";

export const metadata: Metadata = {
  title: "Certificaciones",
  description:
    "Gestión de certificaciones de CIMAS.",
};

export default function CertificationsPage() {
  return (
    <CertificationsView />
  );
}