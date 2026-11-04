import { create } from "zustand";

import {
  createSocialNetworkProfile,
  deleteSocialNetworkProfile,
  getSocialNetworkProfileByUuid,
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

  pagination: SocialNetworkProfilePagination | null;

  currentProfile: SocialNetworkProfile | null;

  isLoading: boolean;
  isLoadingNetworks: boolean;
  isLoadingProfile: boolean;
  isSaving: boolean;

  deletingProfileUuid: string | null;

  fetchSocialNetworks: () => Promise<void>;

  fetchProfiles: (page?: number) => Promise<void>;

  fetchProfile: (profileUuid: string) => Promise<void>;

  createProfile: (
    payload: SocialNetworkProfilePayload
  ) => Promise<SocialNetworkProfile>;

  updateProfile: (
    profileUuid: string,
    payload: SocialNetworkProfilePayload
  ) => Promise<SocialNetworkProfile>;

  deleteProfile: (profileUuid: string) => Promise<void>;

  clearCurrentProfile: () => void;
}

export const useSocialNetworkStore =
  create<SocialNetworkState>((set, get) => ({
    socialNetworks: [],

    profiles: [],

    pagination: null,

    currentProfile: null,

    isLoading: false,

    isLoadingNetworks: false,

    isLoadingProfile: false,

    isSaving: false,

    deletingProfileUuid: null,

    fetchSocialNetworks: async () => {
      set({
        isLoadingNetworks: true,
      });

      try {
        const response = await getSocialNetworks();

        set({
          socialNetworks: response.data,
        });
      } finally {
        set({
          isLoadingNetworks: false,
        });
      }
    },

    fetchProfiles: async (page = 1) => {
      set({
        isLoading: true,
      });

      try {
        const response = await getSocialNetworkProfiles(page);

        set({
          profiles: response.data.data,
          pagination: response.data,
        });
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    fetchProfile: async (profileUuid) => {
      set({
        isLoadingProfile: true,
        currentProfile: null,
      });

      try {
        const response =
          await getSocialNetworkProfileByUuid(profileUuid);

        set({
          currentProfile: response.data,
        });
      } finally {
        set({
          isLoadingProfile: false,
        });
      }
    },

    createProfile: async (payload) => {
      set({
        isSaving: true,
      });

      try {
        const response =
          await createSocialNetworkProfile(payload);

        return response.data;
      } finally {
        set({
          isSaving: false,
        });
      }
    },

    updateProfile: async (profileUuid, payload) => {
      set({
        isSaving: true,
      });

      try {
        const response =
          await updateSocialNetworkProfile(
            profileUuid,
            payload
          );

        set({
          currentProfile: response.data,
        });

        return response.data;
      } finally {
        set({
          isSaving: false,
        });
      }
    },

    deleteProfile: async (profileUuid) => {
      set({
        deletingProfileUuid: profileUuid,
      });

      try {
        await deleteSocialNetworkProfile(profileUuid);

        const currentPage =
          get().pagination?.current_page ?? 1;

        const shouldGoBack =
          get().profiles.length === 1 &&
          currentPage > 1;

        await get().fetchProfiles(
          shouldGoBack
            ? currentPage - 1
            : currentPage
        );
      } finally {
        set({
          deletingProfileUuid: null,
        });
      }
    },

    clearCurrentProfile: () => {
      set({
        currentProfile: null,
      });
    },
  }));