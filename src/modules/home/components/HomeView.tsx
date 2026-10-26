"use client";

import { useState } from "react";

import { homeMock } from "../data/home.mock";

export default function HomeView() {
  const [title, setTitle] = useState(homeMock.title);
  const [subtitle, setSubtitle] = useState(homeMock.subtitle);
  const [banners, setBanners] = useState(homeMock.banners);

  const handleRemoveBanner = (id: number) => {
    setBanners((current) =>
      current
        .filter((banner) => banner.id !== id)
        .map((banner, index) => ({
          ...banner,
          order: index + 1,
        }))
    );
  };

  const handleSave = () => {
    console.log({
      title,
      subtitle,
      banners,
    });
  };

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Inicio
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Administra el contenido principal de la portada de CIMAS.
        </p>
      </div>

      {/* INFORMACIÓN PRINCIPAL */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Información principal
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define el título y subtítulo que se mostrarán en la portada.
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
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ingrese el título principal"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
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
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Ingrese el subtítulo"
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* BANNERS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Banners
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra las imágenes del carrusel de fondo de la portada.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 focus:ring-3 focus:ring-brand-500/20"
          >
            Agregar imagen
          </button>
        </div>

        {banners.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex aspect-video items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="px-4 text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {banner.name}
                    </p>

                    <p className="mt-1 break-all text-xs text-gray-400 dark:text-gray-500">
                      {banner.image}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {banner.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Posición {banner.order}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(banner.id)}
                    className="text-sm font-medium text-error-500 transition hover:text-error-600 dark:text-error-400 dark:hover:text-error-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aún no hay imágenes agregadas al carrusel.
            </p>
          </div>
        )}
      </div>

      {/* ACCIONES */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600 focus:ring-3 focus:ring-brand-500/20"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}