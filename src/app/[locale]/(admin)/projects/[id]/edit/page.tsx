import ProjectForm from "@/modules/projects/components/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Editar proyecto",
    description: "Edición de proyecto de CIMAS.",
};

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    return (
        <ProjectForm
            mode="edit"
            projectId={Number(id)}
        />
    );
}