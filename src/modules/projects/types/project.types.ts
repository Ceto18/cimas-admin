export interface ProjectType {
  id: number;
  uuid: string;
  name: string;
}

export interface ProjectTypesResponse {
  success: boolean;
  message: string;
  data: ProjectType[];
}

export interface ProjectPhoto {
  id: number;
  uuid: string;
  project_id?: number;
  position?: number;
  file_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  uuid: string;
  type_project_id: number;
  institution: string;
  year: string;
  title: string;
  description: string;
  photos: ProjectPhoto[];
  type_project: ProjectType;
  created_at: string;
  updated_at: string;
}

export interface ProjectPayload {
  type_project_id: number;
  institution: string;
  year: string;
  title: string;
  description: string;
  photos?: File[];
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ProjectPagination {
  current_page: number;
  data: Project[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: ProjectPagination;
}