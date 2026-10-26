export interface Certification {
  id: number;
  uuid: string;
  name: string;
  description: string;
  area: string;
  file_url: string | null;
}

export interface CertificationPayload {
  name: string;
  description: string;
  area: string;
  file?: File | null;
}

export interface CertificationResponse {
  success: boolean;
  message: string;
  data: Certification;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface CertificationPagination {
  current_page: number;
  data: Certification[];
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

export interface CertificationsResponse {
  success: boolean;
  message: string;
  data: CertificationPagination;
}