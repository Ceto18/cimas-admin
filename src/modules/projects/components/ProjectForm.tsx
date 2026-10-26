"use client";

import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

import { Link, useRouter } from "@/i18n/navigation";

import { handleApiError } from "@/utils/api-error";
import { showError, showSuccess } from "@/utils/toast";

import { useProjectStore } from "../store/useProjectStore";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

interface ProjectFormProps {
    mode: "create" | "edit";
    projectId?: number;
}

export default function ProjectForm({
    mode,
    projectId,
}: ProjectFormProps) {
    const router = useRouter();

    const currentProject = useProjectStore(
        (state) => state.currentProject
    );

    const isSaving = useProjectStore(
        (state) => state.isSaving
    );

    const isLoadingProject = useProjectStore(
        (state) => state.isLoadingProject
    );

    const deletingPhotoId = useProjectStore(
        (state) => state.deletingPhotoId
    );

    const createProject = useProjectStore(
        (state) => state.createProject
    );

    const updateProject = useProjectStore(
        (state) => state.updateProject
    );

    const fetchProject = useProjectStore(
        (state) => state.fetchProject
    );

    const deletePhoto = useProjectStore(
        (state) => state.deletePhoto
    );

    const clearCurrentProject = useProjectStore(
        (state) => state.clearCurrentProject
    );

    const [typeProjectId, setTypeProjectId] = useState("1");
    const [institution, setInstitution] = useState("");
    const [year, setYear] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [photos, setPhotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const isEditMode = mode === "edit";

    useEffect(() => {
        if (!isEditMode || !projectId) {
            return;
        }

        fetchProject(projectId).catch((error) => {
            handleApiError(error);
        });

        return () => {
            clearCurrentProject();
        };
    }, [
        isEditMode,
        projectId,
        fetchProject,
        clearCurrentProject,
    ]);

    useEffect(() => {
        if (!isEditMode || !currentProject) {
            return;
        }

        setTypeProjectId(
            String(currentProject.type_project_id)
        );

        setInstitution(currentProject.institution ?? "");
        setYear(String(currentProject.year ?? ""));
        setTitle(currentProject.title ?? "");
        setDescription(currentProject.description ?? "");
    }, [isEditMode, currentProject]);

    useEffect(() => {
        return () => {
            previews.forEach((preview) => {
                URL.revokeObjectURL(preview);
            });
        };
    }, [previews]);

    const handlePhotosChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(
            event.target.files ?? []
        );

        if (selectedFiles.length === 0) {
            return;
        }

        const currentPhotosCount =
            isEditMode && currentProject
                ? currentProject.photos?.length ?? 0
                : 0;

        const totalPhotos =
            currentPhotosCount + selectedFiles.length;

        if (totalPhotos > 5) {
            showError(
                `Solo puedes tener un máximo de 5 imágenes. Actualmente tienes ${currentPhotosCount}.`
            );

            event.target.value = "";
            return;
        }

        const invalidFile = selectedFiles.find(
            (file) =>
                ![
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                ].includes(file.type)
        );

        if (invalidFile) {
            showError(
                "Solo se permiten imágenes JPG, PNG o WEBP."
            );

            event.target.value = "";
            return;
        }

        previews.forEach((preview) => {
            URL.revokeObjectURL(preview);
        });

        setPhotos(selectedFiles);

        setPreviews(
            selectedFiles.map((file) =>
                URL.createObjectURL(file)
            )
        );
    };

    const handleRemoveNewPhoto = (index: number) => {
        URL.revokeObjectURL(previews[index]);

        setPhotos((current) =>
            current.filter(
                (_, currentIndex) => currentIndex !== index
            )
        );

        setPreviews((current) =>
            current.filter(
                (_, currentIndex) => currentIndex !== index
            )
        );
    };

    const handleDeleteCurrentPhoto = async (
        photoId: number
    ) => {
        if (!projectId) {
            return;
        }

        try {
            await deletePhoto(projectId, photoId);

            showSuccess("La imagen se eliminó correctamente.");
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!typeProjectId) {
            showError("Selecciona el tipo de proyecto.");
            return;
        }

        if (!institution.trim()) {
            showError("La institución es obligatoria.");
            return;
        }

        if (!year.trim()) {
            showError("El año es obligatorio.");
            return;
        }

        if (!title.trim()) {
            showError("El título es obligatorio.");
            return;
        }

        if (!description.trim()) {
            showError("La descripción es obligatoria.");
            return;
        }

        const payload = {
            type_project_id: Number(typeProjectId),
            institution: institution.trim(),
            year: year.trim(),
            title: title.trim(),
            description: description.trim(),
            photos,
        };

        try {
            if (isEditMode) {
                if (!projectId) {
                    showError("No se encontró el proyecto.");
                    return;
                }

                await updateProject(projectId, payload);

                showSuccess("Proyecto actualizado correctamente.");
            } else {
                await createProject(payload);

                showSuccess("Proyecto creado correctamente.");
            }

            previews.forEach((preview) => {
                URL.revokeObjectURL(preview);
            });

            setPhotos([]);
            setPreviews([]);

            router.replace("/projects");
            router.refresh();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isEditMode && isLoadingProject && !currentProject) {
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
                            ? "Editar proyecto"
                            : "Nuevo proyecto"}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isEditMode
                            ? "Actualiza la información del proyecto seleccionado."
                            : "Registra una nueva experiencia o proyecto realizado por CIMAS."}
                    </p>
                </div>

                <Link
                    href="/projects"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                >
                    Volver
                </Link>
            </div>

            <Form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Información del proyecto
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Ingresa los datos principales del proyecto.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label>
                                    Tipo de proyecto
                                    <span className="text-error-500"> *</span>
                                </Label>

                                <select
                                    value={typeProjectId}
                                    onChange={(event) =>
                                        setTypeProjectId(event.target.value)
                                    }
                                    disabled={isSaving}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                >
                                    <option value="1">
                                        Tipo de proyecto 1
                                    </option>
                                </select>
                            </div>

                            <div>
                                <Label>
                                    Año
                                    <span className="text-error-500"> *</span>
                                </Label>

                                <Input
                                    type="number"
                                    placeholder="Ej. 2026"
                                    value={year}
                                    onChange={(event) =>
                                        setYear(event.target.value)
                                    }
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label>
                                    Institución
                                    <span className="text-error-500"> *</span>
                                </Label>

                                <Input
                                    type="text"
                                    placeholder="Ej. Municipalidad de Lima"
                                    value={institution}
                                    onChange={(event) =>
                                        setInstitution(event.target.value)
                                    }
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label>
                                    Título del proyecto
                                    <span className="text-error-500"> *</span>
                                </Label>

                                <Input
                                    type="text"
                                    placeholder="Ingrese el título del proyecto"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label>
                                    Descripción
                                    <span className="text-error-500"> *</span>
                                </Label>

                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    disabled={isSaving}
                                    placeholder="Describe brevemente el proyecto realizado..."
                                    className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Fotografías
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Puedes mantener hasta 5 imágenes por proyecto.
                            </p>
                        </div>

                        {isEditMode &&
                            currentProject?.photos &&
                            currentProject.photos.length > 0 && (
                                <div className="mb-6">
                                    <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Imágenes actuales
                                    </p>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {currentProject.photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                                            >
                                                <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <img
                                                        src={photo.file_url}
                                                        alt="Imagen del proyecto"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between gap-3 px-4 py-3">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        Imagen actual
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            deletingPhotoId === photo.id
                                                        }
                                                        onClick={() =>
                                                            handleDeleteCurrentPhoto(photo.id)
                                                        }
                                                        className="text-sm font-medium text-error-500 transition hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {deletingPhotoId === photo.id
                                                            ? "Eliminando..."
                                                            : "Eliminar"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        <div>
                            <label
                                htmlFor="project-photos"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {isEditMode
                                    ? "Agregar nuevas imágenes"
                                    : "Seleccionar imágenes"}
                            </label>

                            <input
                                id="project-photos"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                disabled={isSaving}
                                onChange={handlePhotosChange}
                                className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:me-4 file:border-0 file:bg-gray-100 file:px-4 file:py-3 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
                            />

                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Formatos permitidos: JPG, PNG y WEBP.
                                </p>

                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {(currentProject?.photos?.length ?? 0) +
                                        photos.length}{" "}
                                    / 5
                                </p>
                            </div>
                        </div>

                        {previews.length > 0 && (
                            <div className="mt-6">
                                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nuevas imágenes
                                </p>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {previews.map((preview, index) => (
                                        <div
                                            key={preview}
                                            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                                        >
                                            <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                <img
                                                    src={preview}
                                                    alt={`Vista previa ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between gap-3 px-4 py-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {photos[index]?.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Nueva imagen {index + 1}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={() =>
                                                        handleRemoveNewPhoto(index)
                                                    }
                                                    className="text-sm font-medium text-error-500 transition hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/projects"
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
                                    ? "Actualizar proyecto"
                                    : "Guardar proyecto"}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}