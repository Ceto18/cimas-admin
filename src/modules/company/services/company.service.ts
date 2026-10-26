import api from "@/lib/api/api";

import type {
  CompanyResponse,
} from "../types/company.types";

const COMPANY_ENDPOINT = "admin/company";

export async function getCompany(
  companyId = 1
): Promise<CompanyResponse> {
  const { data } =
    await api.get<CompanyResponse>(
      `${COMPANY_ENDPOINT}/${companyId}`
    );

  return data;
}