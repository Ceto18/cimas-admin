import api from "@/lib/api/api";

import type {
  HomeResponse,
  UpdateHomePayload,
} from "../types/home.types";

const HOME_ID = 1;

export async function getHome(): Promise<HomeResponse> {
  const { data } = await api.get<HomeResponse>(
    `admin/home/${HOME_ID}`
  );

  return data;
}

export async function updateHome(
  payload: UpdateHomePayload
): Promise<HomeResponse> {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("subtitle", payload.subtitle);

  payload.images?.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });

  const { data } = await api.post<HomeResponse>(
    `admin/home/${HOME_ID}`,
    formData
  );

  return data;
}

export async function deleteHomeImage(
  imageId: number
): Promise<void> {
  await api.delete(
    `admin/home/${HOME_ID}/images/${imageId}`
  );
}