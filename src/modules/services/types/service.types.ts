export interface Service {
  id: number;
  uuid: string;
  title: string;
  description: string;
  image_url: string | null;
}

export interface ServicePayload {
  title: string;
  description: string;
  image?: File | null;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: Service;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ServicePagination {
  current_page: number;
  data: Service[];
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

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: ServicePagination;
}