import axios from "axios";

import { showError } from "@/utils/toast";

type LaravelErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<LaravelErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.errors) {
      const firstError = Object.values(data.errors)
        .flat()
        .find(Boolean);

      if (firstError) {
        return firstError;
      }
    }

    if (data?.message) {
      return data.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
};

export const handleApiError = (error: unknown) => {
  const message = getApiErrorMessage(error);

  showError(message);

  return message;
};