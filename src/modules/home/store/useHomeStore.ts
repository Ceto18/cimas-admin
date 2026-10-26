import { create } from "zustand";

import {
  deleteHomeImage,
  getHome,
  updateHome,
} from "../services/home.service";

import type {
  HomeData,
  UpdateHomePayload,
} from "../types/home.types";

interface HomeState {
  home: HomeData | null;

  isLoading: boolean;
  isSaving: boolean;
  deletingImageId: number | null;

  fetchHome: () => Promise<void>;
  updateHome: (payload: UpdateHomePayload) => Promise<void>;
  deleteImage: (imageId: number) => Promise<void>;
}

export const useHomeStore = create<HomeState>((set, get) => ({
  home: null,

  isLoading: false,
  isSaving: false,
  deletingImageId: null,

  fetchHome: async () => {
    set({ isLoading: true });

    try {
      const response = await getHome();

      set({
        home: response.data,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateHome: async (payload) => {
    set({ isSaving: true });

    try {
      await updateHome(payload);

      await get().fetchHome();
    } finally {
      set({ isSaving: false });
    }
  },

  deleteImage: async (imageId) => {
    set({
      deletingImageId: imageId,
    });

    try {
      await deleteHomeImage(imageId);

      await get().fetchHome();
    } finally {
      set({
        deletingImageId: null,
      });
    }
  },
}));