"use client";

import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Link } from "@/i18n/navigation";

import { handleApiError } from "@/utils/api-error";
import { showSuccess } from "@/utils/toast";

import { useCertificationStore } from "../store/useCertificationStore";

export default function CertificationsView() {
    const certifications =
        useCertificationStore(
            (state) =>
                state.certifications
        );

    const pagination =
        useCertificationStore(
            (state) => state.pagination
        );

    const isLoading =
        useCertificationStore(
            (state) => state.isLoading
        );

    const deletingCertificationId =
        useCertificationStore(
            (state) =>
                state.deletingCertificationId
        );

    const fetchCertifications =
        useCertificationStore(
            (state) =>
                state.fetchCertifications
        );

    const deleteCertification =
        useCertificationStore(
            (state) =>
                state.deleteCertification
        );

    const [
        certificationToDelete,
        setCertificationToDelete,
    ] = useState<{
        id: number;
        name: string;
    } | null>(null);

    useEffect(() => {
        fetchCertifications().catch(
            (error) => {
                handleApiError(error);
            }
        );
    }, [fetchCertifications]);

    const handlePageChange = (
        page: number
    ) => {
        fetchCertifications(page).catch(
            (error) => {
                handleApiError(error);
            }
        );
    };

    const handleDelete =
        async () => {
            if (
                !certificationToDelete
            ) {
                return;
            }

            try {
                await deleteCertification(
                    certificationToDelete.id
                );

                showSuccess(
                    "Certificación eliminada correctamente."
                );

                setCertificationToDelete(
                    null
                );
            } catch (error) {
                handleApiError(error);
            }
        };

    return (
        <>
            <div className="space-y-6">
                {/* CABECERA */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Certificaciones
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Administra las
                            certificaciones de CIMAS.
                        </p>
                    </div>

                    <Link
                        href="/certifications/create"
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        Nueva certificación
                    </Link>
                </div>

                {/* TABLA */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/5">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Certificación
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Área
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Descripción
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Archivo
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="px-5 py-10 text-center"
                                        >
                                            <div className="flex justify-center">
                                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : certifications.length ===
                                    0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            No hay certificaciones
                                            registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    certifications.map(
                                        (certification) => (
                                            <TableRow
                                                key={
                                                    certification.id
                                                }
                                            >
                                                <TableCell className="px-5 py-4 text-start sm:px-6">
                                                    <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                                        {
                                                            certification.name
                                                        }
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                                    {
                                                        certification.area
                                                    }
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                                    <span className="block max-w-[340px] truncate">
                                                        {
                                                            certification.description
                                                        }
                                                    </span>
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-start">
                                                    {certification.file_url ? (
                                                        <a
                                                            href={
                                                                certification.file_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                                        >
                                                            Ver PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            Sin archivo
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-end">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/certifications/${certification.id}/edit`}
                                                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                                        >
                                                            Editar
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                deletingCertificationId ===
                                                                certification.id
                                                            }
                                                            onClick={() =>
                                                                setCertificationToDelete(
                                                                    {
                                                                        id:
                                                                            certification.id,
                                                                        name:
                                                                            certification.name,
                                                                    }
                                                                )
                                                            }
                                                            className="rounded-lg border border-error-200 px-3 py-2 text-xs font-medium text-error-600 transition hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-error-500/30 dark:text-error-400 dark:hover:bg-error-500/10"
                                                        >
                                                            {deletingCertificationId ===
                                                                certification.id
                                                                ? "Eliminando..."
                                                                : "Eliminar"}
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINACIÓN */}
                    {pagination &&
                        pagination.last_page >
                        1 && (
                            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Página{" "}
                                    {
                                        pagination.current_page
                                    }{" "}
                                    de{" "}
                                    {
                                        pagination.last_page
                                    }
                                </p>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.prev_page_url
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.current_page -
                                                1
                                            )
                                        }
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        Anterior
                                    </button>

                                    {pagination.links
                                        .filter(
                                            (link) =>
                                                link.page !== null
                                        )
                                        .map((link) => (
                                            <button
                                                key={
                                                    link.label
                                                }
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        link.page
                                                    ) {
                                                        handlePageChange(
                                                            link.page
                                                        );
                                                    }
                                                }}
                                                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${link.active
                                                        ? "bg-brand-500 text-white"
                                                        : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                                    }`}
                                            >
                                                {
                                                    link.label
                                                }
                                            </button>
                                        ))}

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.next_page_url
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.current_page +
                                                1
                                            )
                                        }
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {/* MODAL ELIMINAR */}
            {certificationToDelete && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Eliminar certificación
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                            ¿Estás seguro de
                            eliminar{" "}
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                {
                                    certificationToDelete.name
                                }
                            </span>
                            ?
                        </p>

                        <p className="mt-2 text-sm text-error-500">
                            Esta acción no se puede
                            deshacer.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={
                                    deletingCertificationId !==
                                    null
                                }
                                onClick={() =>
                                    setCertificationToDelete(
                                        null
                                    )
                                }
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                disabled={
                                    deletingCertificationId !==
                                    null
                                }
                                onClick={handleDelete}
                                className="inline-flex h-10 min-w-28 items-center justify-center rounded-lg bg-error-500 px-4 text-sm font-medium text-white hover:bg-error-600 disabled:opacity-50"
                            >
                                {deletingCertificationId
                                    ? "Eliminando..."
                                    : "Sí, eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}