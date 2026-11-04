import type { Metadata } from "next";

import SocialNetworkProfileForm from "@/modules/social-networks/components/SocialNetworkProfileForm";

export const metadata: Metadata = {
    title: "Editar red social",
    description: "Actualiza la información de una red social de CIMAS.",
};

interface EditSocialNetworkPageProps {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}

export default async function EditSocialNetworkPage({
    params,
}: EditSocialNetworkPageProps) {
    const { id } = await params;

    return (
        <SocialNetworkProfileForm
            mode="edit"
            profileUuid={id}
        />
    );
}