export interface CompanyValue {
  id?: number;
  company_id?: number;
  name: string;
  position: number;
}

export interface Company {
  id: number;
  uuid: string;
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: CompanyValue[];
}

export interface CompanyPayload {
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: {
    name: string;
    position: number;
  }[];
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}