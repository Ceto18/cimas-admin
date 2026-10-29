import type {
  Metadata,
} from "next";

import SocialNetworkProfileForm from "@/modules/social-networks/components/SocialNetworkProfileForm";

export const metadata: Metadata = {
  title:
    "Nueva red social",
  description:
    "Agrega una nueva red social de CIMAS.",
};

export default function CreateSocialNetworkPage() {
  return (
    <SocialNetworkProfileForm
      mode="create"
    />
  );
}