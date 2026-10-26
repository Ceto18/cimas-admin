import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import { Link } from "@/i18n/navigation";

import Image from "next/image";
import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative z-1 min-h-screen bg-white p-6 dark:bg-gray-900 sm:p-0">
            <ThemeProvider>
                <div className="relative flex min-h-screen w-full flex-col justify-center bg-white dark:bg-gray-900 lg:flex-row">
                    {/* FORMULARIO DE LOGIN */}
                    {children}

                    {/* PANEL VISUAL */}
                    <div className="hidden h-screen w-full items-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-gray-950">
                        <div className="relative z-1 flex items-center justify-center">
                            <GridShape />

                            <div className="relative z-10 flex max-w-md flex-col items-center px-8 text-center">
                                <Link href="/login" className="mb-8 block">
                                    <Image
                                        src="/images/logo/cimas-logo.png"
                                        alt="CIMAS & Ingenieros E.I.R.L."
                                        width={260}
                                        height={90}
                                        priority
                                        className="h-auto w-auto max-w-[260px]"
                                    />
                                </Link>

                                <h2 className="mb-4 text-2xl font-semibold text-white">
                                    Panel Administrativo
                                </h2>

                                <p className="max-w-sm text-sm leading-6 text-gray-300">
                                    Gestiona proyectos, servicios, certificaciones y contenido
                                    institucional de CIMAS & Ingenieros E.I.R.L.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CAMBIO DE TEMA */}
                    <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
}