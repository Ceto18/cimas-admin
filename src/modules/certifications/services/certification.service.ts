import api from "@/lib/api/api";

import type {
  CertificationPayload,
  CertificationResponse,
  CertificationsResponse,
} from "../types/certification.types";

const CERTIFICATIONS_ENDPOINT =
  "admin/certifications";

const buildCertificationFormData = (
  payload: CertificationPayload
): FormData => {
  const formData = new FormData();

  formData.append(
    "name",
    payload.name
  );

  formData.append(
    "description",
    payload.description
  );

  formData.append(
    "area",
    payload.area
  );

  if (payload.file) {
    formData.append(
      "file",
      payload.file
    );
  }

  return formData;
};

export async function getCertifications(
  page = 1,
  perPage = 10
): Promise<CertificationsResponse> {
  const { data } =
    await api.get<CertificationsResponse>(
      CERTIFICATIONS_ENDPOINT,
      {
        params: {
          page,
          per_page: perPage,
        },
      }
    );

  return data;
}

export async function getCertificationById(
  certificationId: number
): Promise<CertificationResponse> {
  const { data } =
    await api.get<CertificationResponse>(
      `${CERTIFICATIONS_ENDPOINT}/${certificationId}`
    );

  return data;
}

export async function createCertification(
  payload: CertificationPayload
): Promise<CertificationResponse> {
  const formData =
    buildCertificationFormData(payload);

  const { data } =
    await api.post<CertificationResponse>(
      CERTIFICATIONS_ENDPOINT,
      formData
    );

  return data;
}

export async function updateCertification(
  certificationId: number,
  payload: CertificationPayload
): Promise<CertificationResponse> {
  const formData =
    buildCertificationFormData(payload);

  const { data } =
    await api.post<CertificationResponse>(
      `${CERTIFICATIONS_ENDPOINT}/${certificationId}`,
      formData
    );

  return data;
}

export async function deleteCertification(
  certificationId: number
): Promise<void> {
  await api.delete(
    `${CERTIFICATIONS_ENDPOINT}/${certificationId}`
  );
}