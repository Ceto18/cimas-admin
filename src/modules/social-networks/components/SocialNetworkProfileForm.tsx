"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
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
    useSocialNetworkStore,
} from "../store/useSocialNetworkStore";

interface SocialNetworkProfileFormProps {
    mode: "create" | "edit";
    profileId?: number;
}

export default function SocialNetworkProfileForm({
    mode,
    profileId,
}: SocialNetworkProfileFormProps) {
    const router =
        useRouter();

    const socialNetworks =
        useSocialNetworkStore(
            (state) =>
                state.socialNetworks
        );

    const currentProfile =
        useSocialNetworkStore(
            (state) =>
                state.currentProfile
        );

    const isLoadingNetworks =
        useSocialNetworkStore(
            (state) =>
                state.isLoadingNetworks
        );

    const isLoadingProfile =
        useSocialNetworkStore(
            (state) =>
                state.isLoadingProfile
        );

    const isSaving =
        useSocialNetworkStore(
            (state) =>
                state.isSaving
        );

    const fetchSocialNetworks =
        useSocialNetworkStore(
            (state) =>
                state.fetchSocialNetworks
        );

    const fetchProfile =
        useSocialNetworkStore(
            (state) =>
                state.fetchProfile
        );

    const createProfile =
        useSocialNetworkStore(
            (state) =>
                state.createProfile
        );

    const updateProfile =
        useSocialNetworkStore(
            (state) =>
                state.updateProfile
        );

    const clearCurrentProfile =
        useSocialNetworkStore(
            (state) =>
                state.clearCurrentProfile
        );

    const [
        socialNetworkUuid,
        setSocialNetworkUuid,
    ] = useState("");

    const [
        nickname,
        setNickname,
    ] = useState("");

    const [
        url,
        setUrl,
    ] = useState("");

    const isEditMode =
        mode === "edit";

    const networkOptions =
        socialNetworks.map(
            (network) => ({
                value:
                    network.uuid,

                label:
                    network.name,
            })
        );

    const resetForm = () => {
        setSocialNetworkUuid("");
        setNickname("");
        setUrl("");

        clearCurrentProfile();
    };

    useEffect(() => {
        fetchSocialNetworks().catch(
            (error) => {
                handleApiError(error);
            }
        );
    }, [
        fetchSocialNetworks,
    ]);

    useEffect(() => {
        if (!isEditMode) {
            resetForm();
            return;
        }

        if (!profileId) {
            return;
        }

        fetchProfile(
            profileId
        ).catch((error) => {
            handleApiError(error);
        });

        return () => {
            clearCurrentProfile();
        };
    }, [
        isEditMode,
        profileId,
        fetchProfile,
        clearCurrentProfile,
    ]);

    useEffect(() => {
        if (
            !isEditMode ||
            !currentProfile
        ) {
            return;
        }

        setSocialNetworkUuid(
            currentProfile
                .social_network_uuid ??
            currentProfile
                .social_network
                ?.uuid ??
            ""
        );

        setNickname(
            currentProfile.nickname ??
            ""
        );

        setUrl(
            currentProfile.url ??
            ""
        );
    }, [
        isEditMode,
        currentProfile,
    ]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!socialNetworkUuid) {
            showError(
                "Selecciona una red social."
            );

            return;
        }

        if (!nickname.trim()) {
            showError(
                "El nombre es obligatorio."
            );

            return;
        }

        if (!url.trim()) {
            showError(
                "El enlace o contacto es obligatorio."
            );

            return;
        }

        const payload = {
            social_network_uuid:
                socialNetworkUuid,

            nickname:
                nickname.trim(),

            url:
                url.trim(),
        };

        try {
            if (isEditMode) {
                if (!profileId) {
                    showError(
                        "No se encontró el perfil."
                    );

                    return;
                }

                await updateProfile(
                    profileId,
                    payload
                );

                showSuccess(
                    "Red social actualizada correctamente."
                );
            } else {
                await createProfile(
                    payload
                );

                showSuccess(
                    "Red social agregada correctamente."
                );
            }

            resetForm();

            router.replace(
                "/social-networks"
            );

            router.refresh();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (
        isEditMode &&
        isLoadingProfile &&
        !currentProfile
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
                            ? "Editar red social"
                            : "Nueva red social"}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isEditMode
                            ? "Actualiza la información del perfil seleccionado."
                            : "Agrega un nuevo canal de contacto o red social de CIMAS."}
                    </p>
                </div>

                <Link
                    href="/social-networks"
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
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Información del perfil
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Configura el canal y la información que se mostrará públicamente.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label>
                                    Red social

                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <Select
                                    options={
                                        networkOptions
                                    }
                                    placeholder={
                                        isLoadingNetworks
                                            ? "Cargando..."
                                            : "Selecciona una red social"
                                    }
                                    value={
                                        socialNetworkUuid
                                    }
                                    onChange={
                                        setSocialNetworkUuid
                                    }
                                    disabled={
                                        isSaving ||
                                        isLoadingNetworks
                                    }
                                />
                            </div>

                            <div>
                                <Label>
                                    Nombre visible

                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <Input
                                    type="text"
                                    placeholder="Ej. WhatsApp CIMAS"
                                    value={
                                        nickname
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNickname(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        isSaving
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label>
                                    Enlace o contacto

                                    <span className="text-error-500">
                                        {" "}
                                        *
                                    </span>
                                </Label>

                                <Input
                                    type="text"
                                    placeholder="Ej. https://linkedin.com/... o contacto@cimas.com"
                                    value={
                                        url
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setUrl(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        isSaving
                                    }
                                />

                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Puedes ingresar una URL, correo electrónico, teléfono o usuario,
                                    dependiendo del tipo seleccionado.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/social-networks"
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                        >
                            Cancelar
                        </Link>

                        <Button
                            type="submit"
                            size="sm"
                            disabled={
                                isSaving ||
                                isLoadingNetworks
                            }
                            className="min-w-40"
                        >
                            {isSaving
                                ? "Guardando..."
                                : isEditMode
                                    ? "Actualizar"
                                    : "Guardar"}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}