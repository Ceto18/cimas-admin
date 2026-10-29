"use client";

import {
  useEffect,
} from "react";

import {
  Link,
} from "@/i18n/navigation";

import {
  handleApiError,
} from "@/utils/api-error";

import {
  showSuccess,
} from "@/utils/toast";

import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useSocialNetworkStore,
} from "../store/useSocialNetworkStore";

export default function SocialNetworkProfilesView() {
  const profiles =
    useSocialNetworkStore(
      (state) =>
        state.profiles
    );

  const pagination =
    useSocialNetworkStore(
      (state) =>
        state.pagination
    );

  const isLoading =
    useSocialNetworkStore(
      (state) =>
        state.isLoading
    );

  const deletingProfileId =
    useSocialNetworkStore(
      (state) =>
        state.deletingProfileId
    );

  const fetchProfiles =
    useSocialNetworkStore(
      (state) =>
        state.fetchProfiles
    );

  const deleteProfile =
    useSocialNetworkStore(
      (state) =>
        state.deleteProfile
    );

  useEffect(() => {
    fetchProfiles().catch(
      (error) => {
        handleApiError(error);
      }
    );
  }, [
    fetchProfiles,
  ]);

  const handleDelete = async (
    profileId: number
  ) => {
    try {
      await deleteProfile(
        profileId
      );

      showSuccess(
        "Red social eliminada correctamente."
      );
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
          <Plus
            size={17}
          />

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
                  Nombre
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
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Cargando redes sociales...
                  </td>
                </tr>
              ) : profiles.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No hay redes sociales configuradas.
                  </td>
                </tr>
              ) : (
                profiles.map(
                  (profile) => (
                    <tr
                      key={
                        profile.uuid
                      }
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {profile
                          .social_network
                          ?.name ??
                          "Red social"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {
                          profile.nickname
                        }
                      </td>

                      <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {
                          profile.url
                        }
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {profile.id && (
                            <>
                              <Link
                                href={`/social-networks/${profile.id}/edit`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-brand-500 dark:border-gray-700 dark:hover:bg-gray-800"
                              >
                                <Pencil
                                  size={16}
                                />
                              </Link>

                              <button
                                type="button"
                                disabled={
                                  deletingProfileId ===
                                  profile.id
                                }
                                onClick={() =>
                                  handleDelete(
                                    profile.id!
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-error-50 hover:text-error-500 disabled:opacity-50 dark:border-gray-700"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {pagination &&
          pagination.total >
            0 && (
            <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
              Total:{" "}
              {
                pagination.total
              }
            </div>
          )}
      </div>
    </div>
  );
}