"use client";

import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({
    children,
}: AuthGuardProps) {
    const router = useRouter();

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const hasHydrated = useAuthStore(
        (state) => state.hasHydrated
    );

    useEffect(() => {
        if (!hasHydrated) {
            return;
        }

        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [hasHydrated, isAuthenticated, router]);

    if (!hasHydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}