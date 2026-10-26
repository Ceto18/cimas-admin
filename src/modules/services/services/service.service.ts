import api from "@/lib/api/api";

import type {
  ServicePayload,
  ServiceResponse,
  ServicesResponse,
} from "../types/service.types";

const SERVICES_ENDPOINT = "admin/services";

const buildServiceFormData = (
  payload: ServicePayload
): FormData => {
  const formData = new FormData();

  formData.append(
    "title",
    payload.title
  );

  formData.append(
    "description",
    payload.description
  );

  if (payload.image) {
    formData.append(
      "image",
      payload.image
    );
  }

  return formData;
};

export async function getServices(
  page = 1
): Promise<ServicesResponse> {
  const { data } =
    await api.get<ServicesResponse>(
      SERVICES_ENDPOINT,
      {
        params: {
          page,
        },
      }
    );

  return data;
}

export async function getServiceById(
  serviceId: number
): Promise<ServiceResponse> {
  const { data } =
    await api.get<ServiceResponse>(
      `${SERVICES_ENDPOINT}/${serviceId}`
    );

  return data;
}

export async function createService(
  payload: ServicePayload
): Promise<ServiceResponse> {
  const formData =
    buildServiceFormData(payload);

  const { data } =
    await api.post<ServiceResponse>(
      SERVICES_ENDPOINT,
      formData
    );

  return data;
}

export async function updateService(
  serviceId: number,
  payload: ServicePayload
): Promise<ServiceResponse> {
  const formData =
    buildServiceFormData(payload);

  const { data } =
    await api.post<ServiceResponse>(
      `${SERVICES_ENDPOINT}/${serviceId}`,
      formData
    );

  return data;
}

export async function deleteService(
  serviceId: number
): Promise<void> {
  await api.delete(
    `${SERVICES_ENDPOINT}/${serviceId}`
  );
}