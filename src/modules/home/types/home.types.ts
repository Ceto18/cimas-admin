export interface HomeImage {
  id: number;
  uuid: string;
  home_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  file_url: string;
}

export interface HomeData {
  id: number;
  uuid: string;
  title: string;
  subtitle: string;
  created_at: string;
  updated_at: string;
  images: HomeImage[];
}

export interface HomeResponse {
  success: boolean;
  message: string;
  data: HomeData;
}

export interface UpdateHomePayload {
  title: string;
  subtitle: string;
  images?: File[];
}