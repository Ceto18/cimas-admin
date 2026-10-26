import ServiceForm from "@/modules/services/components/ServiceForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Editar servicio",
    description: "Edición de servicio de CIMAS.",
};

export default async function EditServicePage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    return (
        <ServiceForm
            mode="edit"
            serviceId={Number(id)}
        />
    );
}