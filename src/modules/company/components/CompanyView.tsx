"use client";

import {
  useEffect,
} from "react";

import {
  handleApiError,
} from "@/utils/api-error";

import {
  useCompanyStore,
} from "../store/useCompanyStore";

export default function CompanyView() {
  const company =
    useCompanyStore(
      (state) =>
        state.company
    );

  const isLoading =
    useCompanyStore(
      (state) =>
        state.isLoading
    );

  const fetchCompany =
    useCompanyStore(
      (state) =>
        state.fetchCompany
    );

  useEffect(() => {
    fetchCompany(1).catch(
      (error) => {
        handleApiError(error);
      }
    );
  }, [fetchCompany]);

  if (
    isLoading &&
    !company
  ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No se encontró información de la empresa.
        </p>
      </div>
    );
  }

  const orderedValues =
    [...company.values].sort(
      (a, b) =>
        a.position -
        b.position
    );

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Empresa
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Información institucional
          registrada para CIMAS.
        </p>
      </div>

      {/* INFORMACIÓN GENERAL */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Información general
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Datos principales de la empresa.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Título
          </p>

          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {company.title}
          </p>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Descripción
          </p>

          <p className="whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-gray-300">
            {company.description}
          </p>
        </div>
      </div>

      {/* MISIÓN Y VISIÓN */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* MISIÓN */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Misión
            </h2>
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-gray-300">
            {company.mission}
          </p>
        </div>

        {/* VISIÓN */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Visión
            </h2>
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-gray-300">
            {company.vision}
          </p>
        </div>
      </div>

      {/* VALORES */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Valores
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Principios institucionales
            de la empresa.
          </p>
        </div>

        {orderedValues.length >
        0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedValues.map(
              (
                value,
                index
              ) => (
                <div
                  key={value.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {value.name}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay valores registrados.
          </p>
        )}
      </div>
    </div>
  );
}