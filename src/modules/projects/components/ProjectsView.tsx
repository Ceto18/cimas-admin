"use client";

import Image from "next/image";
import { useEffect } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { handleApiError } from "@/utils/api-error";
import { useProjectStore } from "../store/useProjectStore";
import { Link } from "@/i18n/navigation";

export default function ProjectsView() {
    const projects = useProjectStore((state) => state.projects);
    const pagination = useProjectStore((state) => state.pagination);
    const isLoading = useProjectStore((state) => state.isLoading);
    const fetchProjects = useProjectStore((state) => state.fetchProjects);

    useEffect(() => {
        fetchProjects().catch((error) => {
            handleApiError(error);
        });
    }, [fetchProjects]);

    const handlePageChange = (page: number) => {
        fetchProjects(page).catch((error) => {
            handleApiError(error);
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Proyectos
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Administra los proyectos y experiencias de CIMAS.
                    </p>
                </div>

                <Link
                    href="/projects/create"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                    Nuevo proyecto
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/5">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                >
                                    Proyecto
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                >
                                    Institución
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                >
                                    Año
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
                            ) : projects.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        No hay proyectos registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => {
                                    const mainPhoto = project.photos?.[0];

                                    return (
                                        <TableRow key={project.id}>
                                            <TableCell className="px-5 py-4 text-start sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-16 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                                        {mainPhoto?.file_url ? (
                                                            <Image
                                                                src={mainPhoto.file_url}
                                                                alt={project.title}
                                                                width={64}
                                                                height={48}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                                Sin foto
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <span className="block truncate text-theme-sm font-medium text-gray-800 dark:text-white/90">
                                                            {project.title}
                                                        </span>

                                                        <span className="block max-w-[260px] truncate text-theme-xs text-gray-500 dark:text-gray-400">
                                                            {project.description}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                                {project.institution}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                                                {project.year}
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-end">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/projects/${project.id}/edit`}
                                                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                                    >
                                                        Editar
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-error-200 px-3 py-2 text-xs font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/30 dark:text-error-400 dark:hover:bg-error-500/10"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Página {pagination.current_page} de {pagination.last_page}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={!pagination.prev_page_url}
                                onClick={() =>
                                    handlePageChange(pagination.current_page - 1)
                                }
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                Anterior
                            </button>

                            {pagination.links
                                .filter((link) => link.page !== null)
                                .map((link) => (
                                    <button
                                        key={link.label}
                                        type="button"
                                        onClick={() =>
                                            link.page && handlePageChange(link.page)
                                        }
                                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${link.active
                                            ? "bg-brand-500 text-white"
                                            : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        {link.label}
                                    </button>
                                ))}

                            <button
                                type="button"
                                disabled={!pagination.next_page_url}
                                onClick={() =>
                                    handlePageChange(pagination.current_page + 1)
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
    );
}