import { create } from "zustand";

import {
  getCompany,
  updateCompany,
} from "../services/company.service";

import type {
  Company,
  CompanyPayload,
} from "../types/company.types";

interface CompanyState {
  company: Company | null;

  isLoading: boolean;
  isSaving: boolean;

  fetchCompany: (
    companyId?: number
  ) => Promise<void>;

  updateCompany: (
    companyId: number,
    payload: CompanyPayload
  ) => Promise<void>;

  clearCompany: () => void;
}

export const useCompanyStore =
  create<CompanyState>((set) => ({
    company: null,

    isLoading: false,
    isSaving: false,

    fetchCompany: async (
      companyId = 1
    ) => {
      set({
        isLoading: true,
      });

      try {
        const response =
          await getCompany(
            companyId
          );

        set({
          company:
            response.data,
        });
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    updateCompany: async (
      companyId,
      payload
    ) => {
      set({
        isSaving: true,
      });

      try {
        const response =
          await updateCompany(
            companyId,
            payload
          );

        set({
          company:
            response.data,
        });
      } finally {
        set({
          isSaving: false,
        });
      }
    },

    clearCompany: () => {
      set({
        company: null,
      });
    },
  }));