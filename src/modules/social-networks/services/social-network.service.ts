import api from "@/lib/api/api";

import type {
  SocialNetworkProfilePayload,
  SocialNetworkProfileResponse,
  SocialNetworkProfilesResponse,
  SocialNetworksResponse,
} from "../types/social-network.types";

const SOCIAL_NETWORKS_ENDPOINT =
  "admin/social-networks";

const SOCIAL_NETWORK_PROFILES_ENDPOINT =
  "admin/social-network-profiles";

export async function getSocialNetworks(): Promise<SocialNetworksResponse> {
  const { data } =
    await api.get<SocialNetworksResponse>(
      SOCIAL_NETWORKS_ENDPOINT
    );

  return data;
}

export async function getSocialNetworkProfiles(
  page = 1
): Promise<SocialNetworkProfilesResponse> {
  const { data } =
    await api.get<SocialNetworkProfilesResponse>(
      SOCIAL_NETWORK_PROFILES_ENDPOINT,
      {
        params: {
          page,
        },
      }
    );

  return data;
}

export async function getSocialNetworkProfileById(
  profileId: number
): Promise<SocialNetworkProfileResponse> {
  const { data } =
    await api.get<SocialNetworkProfileResponse>(
      `${SOCIAL_NETWORK_PROFILES_ENDPOINT}/${profileId}`
    );

  return data;
}

export async function createSocialNetworkProfile(
  payload: SocialNetworkProfilePayload
): Promise<SocialNetworkProfileResponse> {
  const { data } =
    await api.post<SocialNetworkProfileResponse>(
      SOCIAL_NETWORK_PROFILES_ENDPOINT,
      payload
    );

  return data;
}

export async function updateSocialNetworkProfile(
  profileId: number,
  payload: SocialNetworkProfilePayload
): Promise<SocialNetworkProfileResponse> {
  const { data } =
    await api.post<SocialNetworkProfileResponse>(
      `${SOCIAL_NETWORK_PROFILES_ENDPOINT}/${profileId}`,
      payload
    );

  return data;
}

export async function deleteSocialNetworkProfile(
  profileId: number
): Promise<void> {
  await api.delete(
    `${SOCIAL_NETWORK_PROFILES_ENDPOINT}/${profileId}`
  );
}