"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { handleApiError } from "@/utils/api-error";
import { showError, showSuccess } from "@/utils/toast";

import { useHomeStore } from "../store/useHomeStore";

export default function HomeView() {
  const home = useHomeStore((state) => state.home);

  const isLoading = useHomeStore((state) => state.isLoading);
  const isSaving = useHomeStore((state) => state.isSaving);
  const deletingImageId = useHomeStore(
    (state) => state.deletingImageId
  );

  const fetchHome = useHomeStore((state) => state.fetchHome);
  const updateHome = useHomeStore((state) => state.updateHome);
  const deleteImage = useHomeStore((state) => state.deleteImage);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchHome().catch((error) => {
      handleApiError(error);
    });
  }, [fetchHome]);

  useEffect(() => {
    if (!home) {
      return;
    }

    setTitle(home.title);
    setSubtitle(home.subtitle);
  }, [home]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const handleImagesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setNewImages(files);

    setPreviews(
      files.map((file) => URL.createObjectURL(file))
    );
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setNewImages((current) =>
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

  const handleDeleteCurrentImage = async (
    imageId: number
  ) => {
    try {
      await deleteImage(imageId);

      showSuccess("La imagen se eliminó correctamente.");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      showError("El título es obligatorio.");
      return;
    }

    if (!subtitle.trim()) {
      showError("El subtítulo es obligatorio.");
      return;
    }

    try {
      await updateHome({
        title: title.trim(),
        subtitle: subtitle.trim(),
        images: newImages,
      });

      showSuccess(
        "La información de inicio se actualizó correctamente."
      );

      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      setNewImages([]);
      setPreviews([]);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading && !home) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Inicio
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Administra el contenido principal de la portada de CIMAS.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Información principal
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define el título y subtítulo que aparecerán en la portada.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="home-title"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Título
            </label>

            <input
              id="home-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              disabled={isSaving}
              placeholder="Ingrese el título principal"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="home-subtitle"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subtítulo
            </label>

            <textarea
              id="home-subtitle"
              rows={4}
              value={subtitle}
              onChange={(event) =>
                setSubtitle(event.target.value)
              }
              disabled={isSaving}
              placeholder="Ingrese el subtítulo"
              className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Banners
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Imágenes que se muestran en el carrusel principal de la portada.
          </p>
        </div>

        {home?.images && home.images.length > 0 ? (
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Imágenes actuales
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {home.images
                .slice()
                .sort((a, b) => a.position - b.position)
                .map((image) => (
                  <div
                    key={image.uuid}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={image.file_url}
                        alt={`Banner ${image.position}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Banner {image.position}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Posición {image.position}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={deletingImageId === image.id}
                        onClick={() =>
                          handleDeleteCurrentImage(image.id)
                        }
                        className="text-sm font-medium text-error-500 transition hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingImageId === image.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No hay imágenes registradas actualmente.
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="home-images"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Agregar imágenes
          </label>

          <input
            id="home-images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            disabled={isSaving}
            onChange={handleImagesChange}
            className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:me-4 file:border-0 file:bg-gray-100 file:px-4 file:py-3 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
          />
        </div>

        {previews.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nuevas imágenes
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {previews.map((preview, index) => (
                <div
                  key={preview}
                  className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={preview}
                      alt={`Nueva imagen ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                      {newImages[index]?.name}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveNewImage(index)
                      }
                      className="text-sm font-medium text-error-500 hover:text-error-600"
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-11 min-w-36 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}