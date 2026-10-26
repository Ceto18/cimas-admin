"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import {
  UploadIcon,
  TrashBinIcon,
  EyeIcon,
} from "@/icons";

interface FileWithPreview extends File {
  preview?: string;
}

interface DropZoneProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
}

export default function DropZone({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  label = "Fotografías",
}: DropZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [previewImage, setPreviewImage] =
    useState<FileWithPreview | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const filesRef = useRef<FileWithPreview[]>([]);

  /*
   * Sincroniza el value recibido por ProjectForm.
   */
  useEffect(() => {
    setFiles((currentFiles) => {
      currentFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      return value.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        })
      );
    });
  }, [value]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) {
        return;
      }

      const availableSlots = maxFiles - files.length;

      if (availableSlots <= 0) {
        return;
      }

      const filesToAdd = acceptedFiles.slice(
        0,
        availableSlots
      );

      const updatedFiles = [
        ...files,
        ...filesToAdd.map((file) =>
          Object.assign(file, {
            preview: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : undefined,
          })
        ),
      ];

      setFiles(updatedFiles);

      onChange?.(
        updatedFiles.map((file) => file as File)
      );
    },
    [
      disabled,
      files,
      maxFiles,
      onChange,
    ]
  );

  const removeFile = (index: number) => {
    if (disabled) {
      return;
    }

    setFiles((currentFiles) => {
      const target = currentFiles[index];

      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }

      const updatedFiles = currentFiles.filter(
        (_, currentIndex) =>
          currentIndex !== index
      );

      onChange?.(
        updatedFiles.map((file) => file as File)
      );

      return updatedFiles;
    });
  };

  const clearFiles = () => {
    if (disabled) {
      return;
    }

    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setFiles([]);
    onChange?.([]);
  };

  const handleOpenPreview = (
    file: FileWithPreview
  ) => {
    setPreviewImage(file);
    openModal();
  };

  const handleClosePreview = () => {
    closeModal();
    setPreviewImage(null);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    onDrop,
    disabled: disabled || files.length >= maxFiles,

    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },

    maxSize,
    maxFiles,
  });

  const getBorderColor = () => {
    if (disabled || files.length >= maxFiles) {
      return "cursor-not-allowed border-gray-300 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800";
    }

    if (isDragReject) {
      return "border-error-500 bg-error-50/60 dark:bg-error-950/20";
    }

    if (isDragAccept) {
      return "border-brand-500 bg-brand-50/60 dark:bg-brand-950/20";
    }

    if (isFocused) {
      return "border-brand-500 ring-2 ring-brand-500/20 bg-gray-50 dark:bg-gray-900";
    }

    return "border-gray-300 bg-gray-50 hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </h5>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG o WEBP. Máximo {maxFiles} imágenes.
          </p>
        </div>

        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {files.length} / {maxFiles}
        </span>
      </div>

      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed p-7 text-center transition-all duration-200 outline-hidden lg:p-10 ${getBorderColor()}`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          <div className="mb-4 flex size-15 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <UploadIcon className="size-6 text-current" />
          </div>

          <h4 className="mb-2 text-theme-xl font-semibold text-gray-800 dark:text-white/90">
            {files.length >= maxFiles
              ? "Máximo de imágenes alcanzado"
              : isDragReject
                ? "Archivo no permitido"
                : isDragAccept
                  ? "Suelta las imágenes aquí"
                  : isDragActive
                    ? "Suelta los archivos aquí"
                    : "Arrastra y suelta las imágenes"}
          </h4>

          <p className="mb-4 max-w-80 text-sm text-gray-600 dark:text-gray-400">
            {files.length >= maxFiles
              ? `Ya seleccionaste las ${maxFiles} imágenes permitidas.`
              : "Arrastra imágenes JPG, PNG o WEBP aquí, o selecciónalas desde tu equipo."}
          </p>

          {files.length < maxFiles && !disabled && (
            <span className="text-theme-sm font-medium text-brand-500 underline hover:text-brand-600">
              Seleccionar archivos
            </span>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
              Imágenes seleccionadas ({files.length})
            </h5>

            {!disabled && (
              <button
                type="button"
                onClick={clearFiles}
                className="text-theme-xs font-medium text-error-500 hover:text-error-600 dark:text-error-400"
              >
                Quitar todas
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs transition hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {file.preview ? (
                    <Image
                      src={file.preview}
                      alt={file.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <UploadIcon className="size-8" />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-900/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {file.preview && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenPreview(file);
                        }}
                        className="flex size-8 items-center justify-center rounded-full bg-white/90 text-gray-800 backdrop-blur-xs transition hover:bg-white dark:bg-gray-800/90 dark:text-white"
                        title="Ver imagen"
                      >
                        <EyeIcon className="size-4" />
                      </button>
                    )}

                    {!disabled && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeFile(index);
                        }}
                        className="flex size-8 items-center justify-center rounded-full bg-white/90 text-error-500 backdrop-blur-xs transition hover:bg-white dark:bg-gray-800/90 dark:text-error-400"
                        title="Eliminar imagen"
                      >
                        <TrashBinIcon className="size-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  <p
                    className="truncate text-theme-xs font-medium text-gray-800 dark:text-white/90"
                    title={file.name}
                  >
                    {file.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleClosePreview}
        className="max-w-2xl p-6 sm:p-8"
      >
        {previewImage && (
          <div>
            <div className="mb-4">
              <h4 className="text-theme-lg font-semibold text-gray-800 dark:text-white/90">
                Vista previa
              </h4>

              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {previewImage.name} •{" "}
                {formatFileSize(previewImage.size)}
              </p>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
              {previewImage.preview && (
                <Image
                  src={previewImage.preview}
                  alt={previewImage.name}
                  fill
                  unoptimized
                  className="object-contain"
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}