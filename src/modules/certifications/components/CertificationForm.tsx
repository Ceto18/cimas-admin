"use client";

import {
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

import { Link, useRouter } from "@/i18n/navigation";

import { handleApiError } from "@/utils/api-error";
import {
    showError,
    showSuccess,
} from "@/utils/toast";

import { useCertificationStore } from "../store/useCertificationStore";

interface CertificationFormProps {
    mode: "create" | "edit";
    certificationId?: number;
}

export default function CertificationForm({
    mode,
    certificationId,
}: CertificationFormProps) {
    const router = useRouter();

    const currentCertification =
        useCertificationStore(
            (state) =>
                state.currentCertification
        );

    const isSaving =
        useCertificationStore(
            (state) => state.isSaving
        );

    const isLoadingCertification =
        useCertificationStore(
            (state) =>
                state.isLoadingCertification
        );

    const createCertification =
        useCertificationStore(
            (state) =>
                state.createCertification
        );

    const updateCertification =
        useCertificationStore(
            (state) =>
                state.updateCertification
        );

    const fetchCertification =
        useCertificationStore(
            (state) =>
                state.fetchCertification
        );

    const clearCurrentCertification =
        useCertificationStore(
            (state) =>
                state.clearCurrentCertification
        );

    const [name, setName] =
        useState("");

    const [area, setArea] =
        useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [file, setFile] =
        useState<File | null>(null);

    const fileInputRef =
        useRef<HTMLInputElement | null>(
            null
        );

    const isEditMode =
        mode === "edit";

    const resetForm = () => {
        setName("");
        setArea("");
        setDescription("");
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }

        clearCurrentCertification();
    };

    useEffect(() => {
        if (!isEditMode) {
            clearCurrentCertification();

            setName("");
            setArea("");
            setDescription("");
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value =
                    "";
            }

            return;
        }

        if (!certificationId) {
            return;
        }

        fetchCertification(
            certificationId
        ).catch((error) => {
            handleApiError(error);
        });

        return () => {
            clearCurrentCertification();
        };
    }, [
        isEditMode,
        certificationId,
        fetchCertification,
        clearCurrentCertification,
    ]);

    useEffect(() => {
        if (
            !isEditMode ||
            !currentCertification
        ) {
            return;
        }

        setName(
            currentCertification.name ?? ""
        );

        setArea(
            currentCertification.area ?? ""
        );

        setDescription(
            currentCertification.description ??
            ""
        );

        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }
    }, [
        isEditMode,
        currentCertification,
    ]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (
            selectedFile.type !==
            "application/pdf"
        ) {
            showError(
                "Solo se permiten archivos PDF."
            );

            event.target.value = "";

            setFile(null);

            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!name.trim()) {
            showError(
                "El nombre es obligatorio."
            );
            return;
        }

        if (!area.trim()) {
            showError(
                "El área es obligatoria."
            );
            return;
        }

        if (!description.trim()) {
            showError(
                "La descripción es obligatoria."
            );
            return;
        }

        if (!isEditMode && !file) {
            showError(
                "Selecciona el archivo PDF de la certificación."
            );
            return;
        }

        const payload = {
            name: name.trim(),
            area: area.trim(),
            description:
                description.trim(),
            file,
        };

        try {
            if (isEditMode) {
                if (!certificationId) {
                    showError(
                        "No se encontró la certificación."
                    );

                    return;
                }

                await updateCertification(
                    certificationId,
                    payload
                );

                showSuccess(
                    "Certificación actualizada correctamente."
                );
            } else {
                await createCertification(
                    payload
                );

                showSuccess(
                    "Certificación creada correctamente."
                );
            }

            resetForm();

            router.replace(
                "/certifications"
            );

            router.refresh();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (
        isEditMode &&
        isLoadingCertification &&
        !currentCertification
    ) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {isEditMode
                            ? "Editar certificación"
                            : "Nueva certificación"}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isEditMode
                            ? "Actualiza la información de la certificación seleccionada."
                            : "Registra una nueva certificación de CIMAS."}
                    </p>
                </div>

                <Link
                    href="/certifications"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                >
                    Volver
                </Link>
            </div>

            <Form
                onSubmit={handleSubmit}
            >
                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Información de la certificación
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Ingresa los datos principales de la certificación.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label>
                                    Nombre
                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <Input
                                    type="text"
                                    placeholder="Ej. ISO 9001:2015"
                                    value={name}
                                    onChange={(
                                        event
                                    ) =>
                                        setName(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        isSaving
                                    }
                                />
                            </div>

                            <div>
                                <Label>
                                    Área
                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <Input
                                    type="text"
                                    placeholder="Ej. Calidad"
                                    value={area}
                                    onChange={(
                                        event
                                    ) =>
                                        setArea(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        isSaving
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label>
                                    Descripción
                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <textarea
                                    rows={5}
                                    value={
                                        description
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDescription(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    placeholder="Describe brevemente la certificación..."
                                    className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Documento
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Adjunta el documento PDF correspondiente a la certificación.
                            </p>
                        </div>

                        {isEditMode &&
                            currentCertification?.file_url &&
                            !file && (
                                <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        Archivo actual
                                    </p>

                                    <a
                                        href={
                                            currentCertification.file_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center text-sm font-medium text-brand-500 hover:text-brand-600"
                                    >
                                        Ver documento actual
                                    </a>

                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Si seleccionas otro PDF,
                                        reemplazará al documento actual.
                                    </p>
                                </div>
                            )}

                        <div>
                            <Label>
                                {isEditMode
                                    ? "Nuevo archivo PDF"
                                    : "Archivo PDF"}

                                {!isEditMode && (
                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                )}
                            </Label>

                            <input
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                accept="application/pdf,.pdf"
                                disabled={
                                    isSaving
                                }
                                onChange={
                                    handleFileChange
                                }
                                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent text-sm text-gray-700 file:me-4 file:border-0 file:border-e file:border-gray-200 file:bg-gray-50 file:px-4 file:py-3 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:file:border-gray-700 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
                            />

                            {file && (
                                <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {
                                            file.name
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {(
                                            file.size /
                                            1024 /
                                            1024
                                        ).toFixed(
                                            2
                                        )}{" "}
                                        MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/certifications"
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                        >
                            Cancelar
                        </Link>

                        <Button
                            type="submit"
                            size="sm"
                            disabled={
                                isSaving
                            }
                            className="min-w-44"
                        >
                            {isSaving
                                ? "Guardando..."
                                : isEditMode
                                    ? "Actualizar certificación"
                                    : "Guardar certificación"}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}