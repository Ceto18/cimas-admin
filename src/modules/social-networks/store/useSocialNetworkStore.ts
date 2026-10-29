import {
  create,
} from "zustand";

import {
  createSocialNetworkProfile,
  deleteSocialNetworkProfile,
  getSocialNetworkProfileById,
  getSocialNetworkProfiles,
  getSocialNetworks,
  updateSocialNetworkProfile,
} from "../services/social-network.service";

import type {
  SocialNetwork,
  SocialNetworkProfile,
  SocialNetworkProfilePagination,
  SocialNetworkProfilePayload,
} from "../types/social-network.types";

interface SocialNetworkState {
  socialNetworks: SocialNetwork[];

  profiles: SocialNetworkProfile[];

  pagination:
    | SocialNetworkProfilePagination
    | null;

  currentProfile:
    | SocialNetworkProfile
    | null;

  isLoading: boolean;

  isLoadingNetworks: boolean;

  isLoadingProfile: boolean;

  isSaving: boolean;

  deletingProfileId:
    | number
    | null;

  fetchSocialNetworks:
    () => Promise<void>;

  fetchProfiles:
    (page?: number) => Promise<void>;

  fetchProfile:
    (profileId: number) => Promise<void>;

  createProfile:
    (
      payload: SocialNetworkProfilePayload
    ) => Promise<SocialNetworkProfile>;

  updateProfile:
    (
      profileId: number,
      payload: SocialNetworkProfilePayload
    ) => Promise<SocialNetworkProfile>;

  deleteProfile:
    (profileId: number) => Promise<void>;

  clearCurrentProfile:
    () => void;
}

export const useSocialNetworkStore =
  create<SocialNetworkState>(
    (set, get) => ({
      socialNetworks: [],

      profiles: [],

      pagination: null,

      currentProfile: null,

      isLoading: false,

      isLoadingNetworks: false,

      isLoadingProfile: false,

      isSaving: false,

      deletingProfileId: null,

      fetchSocialNetworks: async () => {
        set({
          isLoadingNetworks: true,
        });

        try {
          const response =
            await getSocialNetworks();

          set({
            socialNetworks:
              response.data,
          });
        } finally {
          set({
            isLoadingNetworks: false,
          });
        }
      },

      fetchProfiles: async (
        page = 1
      ) => {
        set({
          isLoading: true,
        });

        try {
          const response =
            await getSocialNetworkProfiles(
              page
            );

          set({
            profiles:
              response.data.data,

            pagination:
              response.data,
          });
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      fetchProfile: async (
        profileId
      ) => {
        set({
          isLoadingProfile: true,
        });

        try {
          const response =
            await getSocialNetworkProfileById(
              profileId
            );

          set({
            currentProfile:
              response.data,
          });
        } finally {
          set({
            isLoadingProfile: false,
          });
        }
      },

      createProfile: async (
        payload
      ) => {
        set({
          isSaving: true,
        });

        try {
          const response =
            await createSocialNetworkProfile(
              payload
            );

          return response.data;
        } finally {
          set({
            isSaving: false,
          });
        }
      },

      updateProfile: async (
        profileId,
        payload
      ) => {
        set({
          isSaving: true,
        });

        try {
          const response =
            await updateSocialNetworkProfile(
              profileId,
              payload
            );

          set({
            currentProfile:
              response.data,
          });

          return response.data;
        } finally {
          set({
            isSaving: false,
          });
        }
      },

      deleteProfile: async (
        profileId
      ) => {
        set({
          deletingProfileId:
            profileId,
        });

        try {
          await deleteSocialNetworkProfile(
            profileId
          );

          const currentPage =
            get().pagination
              ?.current_page ?? 1;

          await get().fetchProfiles(
            currentPage
          );
        } finally {
          set({
            deletingProfileId:
              null,
          });
        }
      },

      clearCurrentProfile: () => {
        set({
          currentProfile: null,
        });
      },
    })
  );