"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import {
    Plus,
    Trash2,
} from "lucide-react";

import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

import {
    Link,
    useRouter,
} from "@/i18n/navigation";

import {
    handleApiError,
} from "@/utils/api-error";

import {
    showError,
    showSuccess,
} from "@/utils/toast";

import {
    useCompanyStore,
} from "../store/useCompanyStore";

interface FormValue {
    name: string;
}

export default function CompanyForm() {
    const router =
        useRouter();

    const company =
        useCompanyStore(
            (state) =>
                state.company
        );

    const isLoading =
        useCompanyStore(
            (state) =>
                state.isLoading
        );

    const isSaving =
        useCompanyStore(
            (state) =>
                state.isSaving
        );

    const fetchCompany =
        useCompanyStore(
            (state) =>
                state.fetchCompany
        );

    const updateCompany =
        useCompanyStore(
            (state) =>
                state.updateCompany
        );

    const [title, setTitle] =
        useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [mission, setMission] =
        useState("");

    const [vision, setVision] =
        useState("");

    const [values, setValues] =
        useState<FormValue[]>([]);

    useEffect(() => {
        fetchCompany(1).catch(
            (error) => {
                handleApiError(error);
            }
        );
    }, [fetchCompany]);

    useEffect(() => {
        if (!company) {
            return;
        }

        setTitle(
            company.title ?? ""
        );

        setDescription(
            company.description ?? ""
        );

        setMission(
            company.mission ?? ""
        );

        setVision(
            company.vision ?? ""
        );

        setValues(
            [...company.values]
                .sort(
                    (a, b) =>
                        a.position -
                        b.position
                )
                .map((value) => ({
                    name:
                        value.name,
                }))
        );
    }, [company]);

    const handleAddValue = () => {
        setValues(
            (current) => [
                ...current,
                {
                    name: "",
                },
            ]
        );
    };

    const handleValueChange = (
        index: number,
        value: string
    ) => {
        setValues(
            (current) =>
                current.map(
                    (
                        item,
                        currentIndex
                    ) =>
                        currentIndex ===
                        index
                            ? {
                                ...item,
                                name: value,
                            }
                            : item
                )
        );
    };

    const handleRemoveValue = (
        index: number
    ) => {
        setValues(
            (current) =>
                current.filter(
                    (
                        _,
                        currentIndex
                    ) =>
                        currentIndex !==
                        index
                )
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!company) {
            showError(
                "No se encontró la empresa."
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

        if (!mission.trim()) {
            showError(
                "La misión es obligatoria."
            );
            return;
        }

        if (!vision.trim()) {
            showError(
                "La visión es obligatoria."
            );
            return;
        }

        const hasEmptyValue =
            values.some(
                (value) =>
                    !value.name.trim()
            );

        if (hasEmptyValue) {
            showError(
                "Completa todos los valores o elimina los campos vacíos."
            );
            return;
        }

        const formattedValues =
            values.map(
                (value, index) => ({
                    name:
                        value.name.trim(),
                    position:
                        index + 1,
                })
            );

        try {
            await updateCompany(
                company.id,
                {
                    title:
                        title.trim(),

                    description:
                        description.trim(),

                    mission:
                        mission.trim(),

                    vision:
                        vision.trim(),

                    values:
                        formattedValues,
                }
            );

            showSuccess(
                "Información de la empresa actualizada correctamente."
            );

            router.replace(
                "/company"
            );

            router.refresh();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (
        isLoading &&
        !company
    ) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No se encontró información de la empresa.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* CABECERA */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Editar empresa
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Actualiza la información institucional de CIMAS.
                    </p>
                </div>

                <Link
                    href="/company"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                >
                    Volver
                </Link>
            </div>

            <Form
                onSubmit={
                    handleSubmit
                }
            >
                <div className="space-y-6">
                    {/* INFORMACIÓN GENERAL */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Información general
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Ingresa los datos principales de la empresa.
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
                                    value={title}
                                    disabled={
                                        isSaving
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setTitle(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Título institucional"
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
                                    rows={6}
                                    value={
                                        description
                                    }
                                    disabled={
                                        isSaving
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
                                    placeholder="Descripción de la empresa..."
                                    className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* MISIÓN Y VISIÓN */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                            <Label>
                                Misión

                                <span className="text-error-500">
                                    {" "}
                                    *
                                </span>
                            </Label>

                            <textarea
                                rows={7}
                                value={
                                    mission
                                }
                                disabled={
                                    isSaving
                                }
                                onChange={(
                                    event
                                ) =>
                                    setMission(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Misión de la empresa..."
                                className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                            />
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                            <Label>
                                Visión

                                <span className="text-error-500">
                                    {" "}
                                    *
                                </span>
                            </Label>

                            <textarea
                                rows={7}
                                value={
                                    vision
                                }
                                disabled={
                                    isSaving
                                }
                                onChange={(
                                    event
                                ) =>
                                    setVision(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Visión de la empresa..."
                                className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    {/* VALORES */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Valores
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Agrega o elimina los valores institucionales.
                                </p>
                            </div>

                            <Button
                                type="button"
                                size="sm"
                                disabled={
                                    isSaving
                                }
                                onClick={
                                    handleAddValue
                                }
                            >
                                <Plus
                                    size={16}
                                />

                                Agregar valor
                            </Button>
                        </div>

                        {values.length > 0 ? (
                            <div className="space-y-4">
                                {values.map(
                                    (
                                        value,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="flex flex-col gap-3 sm:flex-row sm:items-end"
                                        >
                                            <div className="flex-1">
                                                <Label>
                                                    Valor{" "}
                                                    {index +
                                                        1}
                                                </Label>

                                                <Input
                                                    type="text"
                                                    value={
                                                        value.name
                                                    }
                                                    disabled={
                                                        isSaving
                                                    }
                                                    placeholder="Ej. Responsabilidad"
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleValueChange(
                                                            index,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                disabled={
                                                    isSaving
                                                }
                                                onClick={() =>
                                                    handleRemoveValue(
                                                        index
                                                    )
                                                }
                                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-error-200 px-4 text-sm font-medium text-error-500 transition hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-error-500/30 dark:hover:bg-error-500/10"
                                            >
                                                <Trash2
                                                    size={16}
                                                />

                                                Eliminar
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No hay valores registrados.
                                </p>

                                <button
                                    type="button"
                                    disabled={
                                        isSaving
                                    }
                                    onClick={
                                        handleAddValue
                                    }
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-500 transition hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Plus
                                        size={16}
                                    />

                                    Agregar primer valor
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ACCIONES */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/company"
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
                                : "Guardar cambios"}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}