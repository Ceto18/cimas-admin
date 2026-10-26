import { create } from "zustand";

import {
  createProject,
  deleteProjectPhoto,
  getProjectById,
  getProjects,
  updateProject,
} from "../services/project.service";

import type {
  Project,
  ProjectPagination,
  ProjectPayload,
} from "../types/project.types";

interface ProjectState {
  projects: Project[];
  pagination: ProjectPagination | null;
  currentProject: Project | null;

  isLoading: boolean;
  isLoadingProject: boolean;
  isSaving: boolean;
  deletingPhotoId: number | null;

  fetchProjects: (page?: number) => Promise<void>;

  fetchProject: (
    projectId: number
  ) => Promise<void>;

  createProject: (
    payload: ProjectPayload
  ) => Promise<Project>;

  updateProject: (
    projectId: number,
    payload: ProjectPayload
  ) => Promise<Project>;

  deletePhoto: (
    projectId: number,
    photoId: number
  ) => Promise<void>;

  clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectState>(
  (set, get) => ({
    projects: [],
    pagination: null,
    currentProject: null,

    isLoading: false,
    isLoadingProject: false,
    isSaving: false,
    deletingPhotoId: null,

    fetchProjects: async (page = 1) => {
      set({
        isLoading: true,
      });

      try {
        const response = await getProjects(page);

        set({
          projects: response.data.data,
          pagination: response.data,
        });
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    fetchProject: async (projectId) => {
      set({
        isLoadingProject: true,
      });

      try {
        const response =
          await getProjectById(projectId);

        set({
          currentProject: response.data,
        });
      } finally {
        set({
          isLoadingProject: false,
        });
      }
    },

    createProject: async (payload) => {
      set({
        isSaving: true,
      });

      try {
        const response =
          await createProject(payload);

        return response.data;
      } finally {
        set({
          isSaving: false,
        });
      }
    },

    updateProject: async (
      projectId,
      payload
    ) => {
      set({
        isSaving: true,
      });

      try {
        const response =
          await updateProject(
            projectId,
            payload
          );

        set({
          currentProject: response.data,
        });

        return response.data;
      } finally {
        set({
          isSaving: false,
        });
      }
    },

    deletePhoto: async (
      projectId,
      photoId
    ) => {
      set({
        deletingPhotoId: photoId,
      });

      try {
        await deleteProjectPhoto(
          projectId,
          photoId
        );

        await get().fetchProject(projectId);
      } finally {
        set({
          deletingPhotoId: null,
        });
      }
    },

    clearCurrentProject: () => {
      set({
        currentProject: null,
      });
    },
  })
);