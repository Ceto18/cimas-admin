import { create } from "zustand";

import {
  getCompany,
} from "../services/company.service";

import type {
  Company,
} from "../types/company.types";

interface CompanyState {
  company: Company | null;

  isLoading: boolean;

  fetchCompany: (
    companyId?: number
  ) => Promise<void>;

  clearCompany: () => void;
}

export const useCompanyStore =
  create<CompanyState>((set) => ({
    company: null,

    isLoading: false,

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

    clearCompany: () => {
      set({
        company: null,
      });
    },
  }));