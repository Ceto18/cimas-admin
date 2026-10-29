import type {
  Metadata,
} from "next";

import SocialNetworkProfilesView from "@/modules/social-networks/components/SocialNetworkProfilesView";

export const metadata: Metadata = {
  title:
    "Redes sociales",
  description:
    "Gestiona las redes sociales de CIMAS.",
};

export default function SocialNetworksPage() {
  return (
    <SocialNetworkProfilesView />
  );
}