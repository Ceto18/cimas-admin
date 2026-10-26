"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";

import axios from "axios";
import { FormEvent, useState } from "react";

export default function SignInForm() {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo electrónico y contraseña.");
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });

      router.replace("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "No se pudo iniciar sesión. Verifica tus credenciales.";

        setError(message);
        return;
      }

      setError("Ocurrió un error inesperado al iniciar sesión.");
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col bg-white dark:bg-gray-900 lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-0">
        <div className="mb-8">

          <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
            Iniciar sesión
          </h1>

          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Ingresa tus credenciales para acceder al panel administrativo.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>
                Correo electrónico
                <span className="text-error-500"> *</span>
              </Label>

              <Input
                type="email"
                placeholder="admin@cimasconstructora.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>
                Contraseña
                <span className="text-error-500"> *</span>
              </Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isLoading}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
              >
                {error}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
            Acceso exclusivo para personal autorizado de CIMAS & Ingenieros
            E.I.R.L.
          </p>
        </div>
      </div>
    </div>
  );
}