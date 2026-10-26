"use client";

import Form from "@/components/form/Form";
import DropZone from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { Link, useRouter } from "@/i18n/navigation";

import { handleApiError } from "@/utils/api-error";
import { showError, showSuccess } from "@/utils/toast";

import { useProjectStore } from "../store/useProjectStore";

import { FormEvent, useEffect, useState } from "react";

interface ProjectFormProps {
  mode: "create" | "edit";
  projectId?: number;
}

const PROJECT_TYPE_OPTIONS = [
  {
    value: "1",
    label: "Ejecución de Obra",
  },
  {
    value: "2",
    label: "Supervisión de Obra",
  },
];

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

  const [typeProjectId, setTypeProjectId] = useState("");
  const [institution, setInstitution] = useState("");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [photos, setPhotos] = useState<File[]>([]);

  const isEditMode = mode === "edit";

  /*
   * Cargar proyecto cuando estamos editando.
   */
  useEffect(() => {
    if (!isEditMode) {
      clearCurrentProject();
      return;
    }

    if (!projectId) {
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

  /*
   * Completar formulario con los datos existentes.
   */
  useEffect(() => {
    if (!isEditMode || !currentProject) {
      return;
    }

    setTypeProjectId(
      String(currentProject.type_project_id)
    );

    setInstitution(
      currentProject.institution ?? ""
    );

    setYear(
      String(currentProject.year ?? "")
    );

    setTitle(
      currentProject.title ?? ""
    );

    setDescription(
      currentProject.description ?? ""
    );
  }, [
    isEditMode,
    currentProject,
  ]);

  /*
   * Eliminar fotografía existente.
   */
  const handleDeleteCurrentPhoto = async (
    photoId: number
  ) => {
    if (!projectId) {
      return;
    }

    try {
      await deletePhoto(
        projectId,
        photoId
      );

      showSuccess(
        "La imagen se eliminó correctamente."
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  /*
   * Guardar proyecto.
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!typeProjectId) {
      showError(
        "Selecciona el tipo de proyecto."
      );
      return;
    }

    if (!institution.trim()) {
      showError(
        "La institución es obligatoria."
      );
      return;
    }

    if (!year.trim()) {
      showError(
        "El año es obligatorio."
      );
      return;
    }

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

    const currentPhotosCount =
      isEditMode && currentProject
        ? currentProject.photos?.length ?? 0
        : 0;

    if (
      currentPhotosCount +
        photos.length >
      5
    ) {
      showError(
        "Solo puedes tener un máximo de 5 imágenes."
      );
      return;
    }

    const payload = {
      type_project_id:
        Number(typeProjectId),

      institution:
        institution.trim(),

      year:
        year.trim(),

      title:
        title.trim(),

      description:
        description.trim(),

      photos,
    };

    try {
      if (isEditMode) {
        if (!projectId) {
          showError(
            "No se encontró el proyecto."
          );
          return;
        }

        await updateProject(
          projectId,
          payload
        );

        showSuccess(
          "Proyecto actualizado correctamente."
        );
      } else {
        await createProject(
          payload
        );

        showSuccess(
          "Proyecto creado correctamente."
        );
      }

      setPhotos([]);

      router.replace(
        "/projects"
      );

      router.refresh();
    } catch (error) {
      handleApiError(error);
    }
  };

  /*
   * Loading al obtener el proyecto.
   */
  if (
    isEditMode &&
    isLoadingProject &&
    !currentProject
  ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
      </div>
    );
  }

  const currentPhotosCount =
    isEditMode &&
    currentProject
      ? currentProject.photos?.length ?? 0
      : 0;

  const availablePhotoSlots =
    Math.max(
      0,
      5 - currentPhotosCount
    );

  const totalPhotosCount =
    currentPhotosCount +
    photos.length;

  return (
    <div className="space-y-6">

      {/* CABECERA */}
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

      <Form
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">

          {/* INFORMACIÓN DEL PROYECTO */}
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

              {/* TIPO DE PROYECTO */}
              <div>
                <Label>
                  Tipo de proyecto
                  <span className="text-error-500">
                    {" "}
                    *
                  </span>
                </Label>

                <Select
                  options={PROJECT_TYPE_OPTIONS}
                  placeholder="Selecciona un tipo de proyecto"
                  value={typeProjectId}
                  onChange={setTypeProjectId}
                  disabled={isSaving}
                />
              </div>

              {/* AÑO */}
              <div>
                <Label>
                  Año
                  <span className="text-error-500">
                    {" "}
                    *
                  </span>
                </Label>

                <Input
                  type="number"
                  placeholder="Ej. 2026"
                  value={year}
                  onChange={(event) =>
                    setYear(
                      event.target.value
                    )
                  }
                  disabled={isSaving}
                />
              </div>

              {/* INSTITUCIÓN */}
              <div className="md:col-span-2">
                <Label>
                  Institución
                  <span className="text-error-500">
                    {" "}
                    *
                  </span>
                </Label>

                <Input
                  type="text"
                  placeholder="Ej. Municipalidad de Lima"
                  value={institution}
                  onChange={(event) =>
                    setInstitution(
                      event.target.value
                    )
                  }
                  disabled={isSaving}
                />
              </div>

              {/* TÍTULO */}
              <div className="md:col-span-2">
                <Label>
                  Título del proyecto
                  <span className="text-error-500">
                    {" "}
                    *
                  </span>
                </Label>

                <Input
                  type="text"
                  placeholder="Ingrese el título del proyecto"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  disabled={isSaving}
                />
              </div>

              {/* DESCRIPCIÓN */}
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
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  disabled={isSaving}
                  placeholder="Describe brevemente el proyecto realizado..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

            </div>
          </div>

          {/* FOTOGRAFÍAS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fotografías
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Puedes mantener hasta 5 imágenes por proyecto.
              </p>
            </div>

            {/* IMÁGENES ACTUALES */}
            {isEditMode &&
              currentProject?.photos &&
              currentProject.photos.length >
                0 && (
                <div className="mb-8">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Imágenes actuales
                    </p>

                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {currentPhotosCount} guardadas
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

                    {currentProject.photos.map(
                      (
                        photo,
                        index
                      ) => (
                        <div
                          key={photo.id}
                          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900"
                        >

                          <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-800">

                            <img
                              src={photo.file_url}
                              alt={`Imagen ${
                                index + 1
                              }`}
                              className="h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">

                              <button
                                type="button"
                                disabled={
                                  deletingPhotoId ===
                                    photo.id ||
                                  isSaving
                                }
                                onClick={() =>
                                  handleDeleteCurrentPhoto(
                                    photo.id
                                  )
                                }
                                className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-error-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-error-400 dark:hover:bg-gray-700"
                              >
                                {deletingPhotoId ===
                                photo.id
                                  ? "Eliminando..."
                                  : "Eliminar"}
                              </button>

                            </div>

                          </div>

                          <div className="p-3">

                            <p className="text-theme-xs font-medium text-gray-800 dark:text-white/90">
                              Imagen{" "}
                              {index + 1}
                            </p>

                            {photo.position && (
                              <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                                Posición{" "}
                                {photo.position}
                              </p>
                            )}

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* DROPZONE */}
            {availablePhotoSlots >
            0 ? (
              <DropZone
                label={
                  isEditMode
                    ? "Agregar nuevas imágenes"
                    : "Imágenes del proyecto"
                }
                value={photos}
                onChange={setPhotos}
                maxFiles={
                  availablePhotoSlots
                }
                disabled={
                  isSaving ||
                  deletingPhotoId !==
                    null
                }
              />
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">

                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Máximo de imágenes alcanzado
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  El proyecto ya tiene las 5 imágenes permitidas.
                  Elimina una imagen actual si deseas agregar otra.
                </p>

              </div>
            )}

            {/* CONTADOR */}
            <div className="mt-4 flex justify-end">

              <span
                className={`text-xs font-medium ${
                  totalPhotosCount >=
                  5
                    ? "text-error-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Total:{" "}
                {totalPhotosCount} / 5
              </span>

            </div>

          </div>

          {/* ACCIONES */}
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
              disabled={
                isSaving ||
                deletingPhotoId !==
                  null
              }
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