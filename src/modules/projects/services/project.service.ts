import api from "@/lib/api/api";

import type {
  ProjectPayload,
  ProjectResponse,
  ProjectsResponse,
  ProjectTypesResponse,
} from "../types/project.types";

const PROJECTS_ENDPOINT = "admin/projects";

const buildProjectFormData = (
  payload: ProjectPayload
): FormData => {
  const formData = new FormData();

  formData.append(
    "type_project_id",
    String(payload.type_project_id)
  );

  formData.append(
    "institution",
    payload.institution
  );

  formData.append(
    "year",
    payload.year
  );

  formData.append(
    "title",
    payload.title
  );

  formData.append(
    "description",
    payload.description
  );

  payload.photos?.forEach(
    (photo, index) => {
      formData.append(
        `photos[${index}]`,
        photo
      );
    }
  );

  return formData;
};

export async function getProjectTypes(): Promise<ProjectTypesResponse> {
  const { data } =
    await api.get<ProjectTypesResponse>(
      `${PROJECTS_ENDPOINT}/types`
    );

  return data;
}

export async function getProjects(
  page = 1
): Promise<ProjectsResponse> {
  const { data } =
    await api.get<ProjectsResponse>(
      PROJECTS_ENDPOINT,
      {
        params: {
          page,
        },
      }
    );

  return data;
}

export async function getProjectById(
  projectId: number
): Promise<ProjectResponse> {
  const { data } =
    await api.get<ProjectResponse>(
      `${PROJECTS_ENDPOINT}/${projectId}`
    );

  return data;
}

export async function createProject(
  payload: ProjectPayload
): Promise<ProjectResponse> {
  const formData =
    buildProjectFormData(
      payload
    );

  const { data } =
    await api.post<ProjectResponse>(
      PROJECTS_ENDPOINT,
      formData
    );

  return data;
}

export async function updateProject(
  projectId: number,
  payload: ProjectPayload
): Promise<ProjectResponse> {
  const formData =
    buildProjectFormData(
      payload
    );

  const { data } =
    await api.post<ProjectResponse>(
      `${PROJECTS_ENDPOINT}/${projectId}`,
      formData
    );

  return data;
}

export async function deleteProjectPhoto(
  projectId: number,
  photoId: number
): Promise<void> {
  await api.delete(
    `${PROJECTS_ENDPOINT}/${projectId}/photos/${photoId}`
  );
}