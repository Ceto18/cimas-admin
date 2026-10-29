export interface SocialNetwork {
  uuid: string;
  name: string;
}

export interface SocialNetworksResponse {
  success: boolean;
  message: string;
  data: SocialNetwork[];
}

export interface SocialNetworkProfileNetwork {
  uuid: string;
  name: string;
}

export interface SocialNetworkProfile {
  id?: number;
  uuid: string;
  social_network_uuid?: string;
  nickname: string;
  url: string;
  social_network?: SocialNetworkProfileNetwork;
  created_at?: string;
  updated_at?: string;
}

export interface SocialNetworkProfilePayload {
  social_network_uuid: string;
  nickname: string;
  url: string;
}

export interface SocialNetworkProfileResponse {
  success: boolean;
  message: string;
  data: SocialNetworkProfile;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface SocialNetworkProfilePagination {
  current_page: number;
  data: SocialNetworkProfile[];
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

export interface SocialNetworkProfilesResponse {
  success: boolean;
  message: string;
  data: SocialNetworkProfilePagination;
}