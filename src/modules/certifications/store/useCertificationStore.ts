import { create } from "zustand";

import {
  createCertification as createCertificationRequest,
  deleteCertification as deleteCertificationRequest,
  getCertificationById,
  getCertifications,
  updateCertification as updateCertificationRequest,
} from "../services/certification.service";

import type {
  Certification,
  CertificationPagination,
  CertificationPayload,
} from "../types/certification.types";

interface CertificationState {
  certifications: Certification[];

  pagination:
    | CertificationPagination
    | null;

  currentCertification:
    | Certification
    | null;

  isLoading: boolean;
  isLoadingCertification: boolean;
  isSaving: boolean;

  deletingCertificationId:
    | number
    | null;

  fetchCertifications: (
    page?: number
  ) => Promise<void>;

  fetchCertification: (
    certificationId: number
  ) => Promise<void>;

  createCertification: (
    payload: CertificationPayload
  ) => Promise<Certification>;

  updateCertification: (
    certificationId: number,
    payload: CertificationPayload
  ) => Promise<Certification>;

  deleteCertification: (
    certificationId: number
  ) => Promise<void>;

  clearCurrentCertification: () => void;
}

export const useCertificationStore =
  create<CertificationState>(
    (set, get) => ({
      certifications: [],
      pagination: null,
      currentCertification: null,

      isLoading: false,
      isLoadingCertification: false,
      isSaving: false,

      deletingCertificationId:
        null,

      fetchCertifications: async (
        page = 1
      ) => {
        set({
          isLoading: true,
        });

        try {
          const response =
            await getCertifications(
              page,
              10
            );

          set({
            certifications:
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

      fetchCertification: async (
        certificationId
      ) => {
        set({
          isLoadingCertification:
            true,
        });

        try {
          const response =
            await getCertificationById(
              certificationId
            );

          set({
            currentCertification:
              response.data,
          });
        } finally {
          set({
            isLoadingCertification:
              false,
          });
        }
      },

      createCertification: async (
        payload
      ) => {
        set({
          isSaving: true,
        });

        try {
          const response =
            await createCertificationRequest(
              payload
            );

          return response.data;
        } finally {
          set({
            isSaving: false,
          });
        }
      },

      updateCertification: async (
        certificationId,
        payload
      ) => {
        set({
          isSaving: true,
        });

        try {
          const response =
            await updateCertificationRequest(
              certificationId,
              payload
            );

          set({
            currentCertification:
              response.data,
          });

          return response.data;
        } finally {
          set({
            isSaving: false,
          });
        }
      },

      deleteCertification: async (
        certificationId
      ) => {
        set({
          deletingCertificationId:
            certificationId,
        });

        try {
          await deleteCertificationRequest(
            certificationId
          );

          const currentPage =
            get().pagination
              ?.current_page ?? 1;

          await get().fetchCertifications(
            currentPage
          );

          if (
            get().certifications
              .length === 0 &&
            currentPage > 1
          ) {
            await get().fetchCertifications(
              currentPage - 1
            );
          }
        } finally {
          set({
            deletingCertificationId:
              null,
          });
        }
      },

      clearCurrentCertification:
        () => {
          set({
            currentCertification:
              null,
          });
        },
    })
  );