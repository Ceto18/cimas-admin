import { create } from "zustand";

import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "../services/service.service";

import type {
  Service,
  ServicePagination,
  ServicePayload,
} from "../types/service.types";

interface ServiceState {
  services: Service[];
  pagination: ServicePagination | null;
  currentService: Service | null;

  isLoading: boolean;
  isLoadingService: boolean;
  isSaving: boolean;

  deletingServiceId: number | null;

  fetchServices: (
    page?: number
  ) => Promise<void>;

  fetchService: (
    serviceId: number
  ) => Promise<void>;

  createService: (
    payload: ServicePayload
  ) => Promise<Service>;

  updateService: (
    serviceId: number,
    payload: ServicePayload
  ) => Promise<Service>;

  deleteService: (
    serviceId: number
  ) => Promise<void>;

  clearCurrentService: () => void;
}

export const useServiceStore =
  create<ServiceState>(
    (set, get) => ({
      services: [],
      pagination: null,
      currentService: null,

      isLoading: false,
      isLoadingService: false,
      isSaving: false,

      deletingServiceId: null,

      fetchServices: async (
        page = 1
      ) => {
        set({
          isLoading: true,
        });

        try {
          const response =
            await getServices(page);

          set({
            services:
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

      fetchService: async (
        serviceId
      ) => {
        set({
          isLoadingService: true,
        });

        try {
          const response =
            await getServiceById(
              serviceId
            );

          set({
            currentService:
              response.data,
          });
        } finally {
          set({
            isLoadingService: false,
          });
        }
      },

      createService: async (
        payload
      ) => {
        set({
          isSaving: true,
        });

        try {
          const response =
            await createService(
              payload
            );

          return response.data;
        } finally {
          set({
            isSaving: false,
          });
        }
      },

      updateService: async (
        serviceId,
        payload
      ) => {
        set({
          isSaving: true,
        });

        try {
          const response =
            await updateService(
              serviceId,
              payload
            );

          set({
            currentService:
              response.data,
          });

          return response.data;
        } finally {
          set({
            isSaving: false,
          });
        }
      },

      deleteService: async (
        serviceId
      ) => {
        set({
          deletingServiceId:
            serviceId,
        });

        try {
          await deleteService(
            serviceId
          );

          const currentPage =
            get().pagination
              ?.current_page ?? 1;

          await get().fetchServices(
            currentPage
          );

          if (
            get().services.length ===
              0 &&
            currentPage > 1
          ) {
            await get().fetchServices(
              currentPage - 1
            );
          }
        } finally {
          set({
            deletingServiceId:
              null,
          });
        }
      },

      clearCurrentService: () => {
        set({
          currentService: null,
        });
      },
    })
  );