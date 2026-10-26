import type { Metadata } from "next";

import CertificationForm from "@/modules/certifications/components/CertificationForm";

export const metadata: Metadata = {
    title: "Editar certificación",
    description:
        "Edición de certificaciones de CIMAS.",
};

export default async function EditCertificationPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    return (
        <CertificationForm
            mode="edit"
            certificationId={Number(id)}
        />
    );
}