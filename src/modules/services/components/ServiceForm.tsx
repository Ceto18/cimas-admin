"use client";

import Form from "@/components/form/Form";
import DropZone from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

import { Link, useRouter } from "@/i18n/navigation";

import { handleApiError } from "@/utils/api-error";
import { showError, showSuccess } from "@/utils/toast";

import { useServiceStore } from "../store/useServiceStore";

import { FormEvent, useEffect, useState } from "react";

interface ServiceFormProps {
    mode: "create" | "edit";
    serviceId?: number;
}

export default function ServiceForm({
    mode,
    serviceId,
}: ServiceFormProps) {
    const router = useRouter();

    const currentService = useServiceStore(
        (state) => state.currentService
    );

    const isSaving = useServiceStore(
        (state) => state.isSaving
    );

    const isLoadingService = useServiceStore(
        (state) => state.isLoadingService
    );

    const createService = useServiceStore(
        (state) => state.createService
    );

    const updateService = useServiceStore(
        (state) => state.updateService
    );

    const fetchService = useServiceStore(
        (state) => state.fetchService
    );

    const clearCurrentService = useServiceStore(
        (state) => state.clearCurrentService
    );

    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");

    const [image, setImage] =
        useState<File | null>(null);

    const isEditMode = mode === "edit";

    /*
     * Cargar servicio al editar.
     */
    useEffect(() => {
        if (!isEditMode) {
            clearCurrentService();
            return;
        }

        if (!serviceId) {
            return;
        }

        fetchService(serviceId).catch((error) => {
            handleApiError(error);
        });

        return () => {
            clearCurrentService();
        };
    }, [
        isEditMode,
        serviceId,
        fetchService,
        clearCurrentService,
    ]);

    /*
     * Completar campos al editar.
     */
    useEffect(() => {
        if (!isEditMode || !currentService) {
            return;
        }

        setTitle(
            currentService.title ?? ""
        );

        setDescription(
            currentService.description ?? ""
        );
    }, [
        isEditMode,
        currentService,
    ]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!title.trim()) {
            showError(
                "El título es obligatorio."
            );
            return;
        }

        if (!description.trim()) {
            showError(
                "La descripción es obligatoria."
            );
            return;
        }

        /*
         * Al crear sí exigimos imagen.
         * En editar puede mantenerse la actual.
         */
        if (!isEditMode && !image) {
            showError(
                "Selecciona una imagen para el servicio."
            );
            return;
        }

        const payload = {
            title: title.trim(),
            description:
                description.trim(),
            image,
        };

        try {
            if (isEditMode) {
                if (!serviceId) {
                    showError(
                        "No se encontró el servicio."
                    );
                    return;
                }

                await updateService(
                    serviceId,
                    payload
                );

                showSuccess(
                    "Servicio actualizado correctamente."
                );
            } else {
                await createService(
                    payload
                );

                showSuccess(
                    "Servicio creado correctamente."
                );
            }

            setImage(null);

            router.replace("/services");
            router.refresh();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (
        isEditMode &&
        isLoadingService &&
        !currentService
    ) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* CABECERA */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {isEditMode
                            ? "Editar servicio"
                            : "Nuevo servicio"}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isEditMode
                            ? "Actualiza la información del servicio seleccionado."
                            : "Registra un nuevo servicio ofrecido por CIMAS."}
                    </p>
                </div>

                <Link
                    href="/services"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                >
                    Volver
                </Link>
            </div>

            <Form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* DATOS */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Información del servicio
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Ingresa los datos principales del servicio.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label>
                                    Título
                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <Input
                                    type="text"
                                    placeholder="Ej. Servicio de instalación"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target.value
                                        )
                                    }
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <Label>
                                    Descripción
                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    disabled={isSaving}
                                    placeholder="Describe el servicio ofrecido..."
                                    className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* IMAGEN */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Imagen del servicio
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Selecciona la imagen principal que representará el servicio.
                            </p>
                        </div>

                        {/* IMAGEN ACTUAL */}
                        {isEditMode &&
                            currentService?.image_url &&
                            !image && (
                                <div className="mb-6">
                                    <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Imagen actual
                                    </p>

                                    <div className="max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
                                        <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                src={
                                                    currentService.image_url
                                                }
                                                alt={
                                                    currentService.title
                                                }
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-3">
                                            <p className="text-theme-xs font-medium text-gray-800 dark:text-white/90">
                                                Imagen actual del servicio
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        Si seleccionas una nueva imagen, reemplazará a la actual.
                                    </p>
                                </div>
                            )}

                        <DropZone
                            label={
                                isEditMode
                                    ? "Nueva imagen"
                                    : "Imagen del servicio"
                            }
                            value={
                                image ? [image] : []
                            }
                            onChange={(files) => {
                                setImage(
                                    files[0] ?? null
                                );
                            }}
                            maxFiles={1}
                            disabled={isSaving}
                        />
                    </div>

                    {/* ACCIONES */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/services"
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                        >
                            Cancelar
                        </Link>

                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSaving}
                            className="min-w-40"
                        >
                            {isSaving
                                ? "Guardando..."
                                : isEditMode
                                    ? "Actualizar servicio"
                                    : "Guardar servicio"}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}