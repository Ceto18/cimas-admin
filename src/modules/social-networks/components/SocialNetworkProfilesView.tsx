
"use client";

import { useEffect } from "react";

import {
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Link } from "@/i18n/navigation";

import { handleApiError } from "@/utils/api-error";
import { showSuccess } from "@/utils/toast";

import { useSocialNetworkStore } from "../store/useSocialNetworkStore";

export default function SocialNetworkProfilesView() {
  const profiles = useSocialNetworkStore(
    (state) => state.profiles
  );

  const pagination = useSocialNetworkStore(
    (state) => state.pagination
  );

  const isLoading = useSocialNetworkStore(
    (state) => state.isLoading
  );

  const deletingProfileUuid = useSocialNetworkStore(
    (state) => state.deletingProfileUuid
  );

  const fetchProfiles = useSocialNetworkStore(
    (state) => state.fetchProfiles
  );

  const deleteProfile = useSocialNetworkStore(
    (state) => state.deleteProfile
  );

  useEffect(() => {
    fetchProfiles().catch((error) => {
      handleApiError(error);
    });
  }, [fetchProfiles]);

  const handleDelete = async (
    profileUuid: string
  ) => {
    const confirmed = window.confirm(
      "¿Estás seguro de eliminar esta red social? Esta acción no se puede deshacer."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProfile(profileUuid);

      showSuccess(
        "Red social eliminada correctamente."
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const handlePageChange = async (
    page: number
  ) => {
    if (
      isLoading ||
      !pagination ||
      page < 1 ||
      page > pagination.last_page ||
      page === pagination.current_page
    ) {
      return;
    }

    try {
      await fetchProfiles(page);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Redes sociales
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Administra los canales de contacto y redes sociales de CIMAS.
          </p>
        </div>

        <Link
          href="/social-networks/create"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          <Plus size={17} />
          Agregar red social
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Red social
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nombre / Valor
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Enlace
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Cargando redes sociales...
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No hay redes sociales configuradas.
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr
                    key={profile.uuid}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {profile.social_network_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex flex-col gap-1">
                        <span className="max-w-sm break-words">
                          {profile.nickname}
                        </span>

                        {profile.label && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {profile.label}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {profile.url ? (
                        /^https?:\/\//i.test(profile.url) ? (
                          <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={profile.url}
                            className="inline-flex max-w-xs items-center gap-2 text-brand-500 transition hover:text-brand-600 hover:underline"
                          >
                            <span className="truncate">
                              {profile.url}
                            </span>

                            <ExternalLink
                              size={14}
                              className="shrink-0"
                            />
                          </a>
                        ) : (
                          <span className="block max-w-xs break-all text-gray-600 dark:text-gray-300">
                            {profile.url}
                          </span>
                        )
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          Sin enlace
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/social-networks/${profile.uuid}/edit`}
                          title="Editar"
                          aria-label={`Editar ${profile.social_network_name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-brand-500 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          title="Eliminar"
                          aria-label={`Eliminar ${profile.social_network_name}`}
                          disabled={
                            deletingProfileUuid === profile.uuid
                          }
                          onClick={() =>
                            handleDelete(profile.uuid)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-error-50 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-error-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Total: {pagination.total} registros
            </span>

            {pagination.last_page > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={
                    isLoading ||
                    pagination.current_page <= 1
                  }
                  onClick={() =>
                    handlePageChange(
                      pagination.current_page - 1
                    )
                  }
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Anterior
                </button>

                <span className="whitespace-nowrap text-gray-600 dark:text-gray-400">
                  Página {pagination.current_page} de{" "}
                  {pagination.last_page}
                </span>

                <button
                  type="button"
                  disabled={
                    isLoading ||
                    pagination.current_page >=
                    pagination.last_page
                  }
                  onClick={() =>
                    handlePageChange(
                      pagination.current_page + 1
                    )
                  }
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
