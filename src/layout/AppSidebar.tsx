"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils";
import Image from "next/image";
import React from "react";

import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  UserCircleIcon,
} from "../icons/index";

import {
  Share2,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    label: "Inicio",
    icon: <GridIcon />,
    path: "/",
  },
  {
    label: "Proyectos",
    icon: <BoxCubeIcon />,
    path: "/projects",
  },
  {
    label: "Servicios",
    icon: <ListIcon />,
    path: "/services",
  },
  {
    label: "Certificaciones",
    icon: <PageIcon />,
    path: "/certifications",
  },
  {
    label: "Redes sociales",
    icon: <Share2 size={20} />,
    path: "/social-networks",
  },
  {
    label: "Empresa",
    icon: <UserCircleIcon />,
    path: "/company",
  },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
  } = useSidebar();

  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return (
      pathname === path ||
      pathname.startsWith(
        `${path}/`
      )
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out xl:mt-0 rtl:right-0 rtl:left-auto rtl:border-r-0 rtl:border-l dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded ||
        isMobileOpen
          ? "w-72.5"
          : isHovered
            ? "w-72.5"
            : "w-22.5"
      } ${
        isMobileOpen
          ? "translate-x-0"
          : "-translate-x-full rtl:translate-x-full"
      } xl:translate-x-0 xl:rtl:translate-x-0`}
      onMouseEnter={() => {
        if (!isExpanded) {
          setIsHovered(
            true
          );
        }
      }}
      onMouseLeave={() =>
        setIsHovered(
          false
        )
      }
    >
      {/* LOGO */}
      <div
        className={`flex py-8 ${
          !isExpanded &&
          !isHovered
            ? "xl:justify-center"
            : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded ||
          isHovered ||
          isMobileOpen ? (
            <>
              <Image
                src="/images/logo/logo-100-dark.png"
                alt="CIMAS Ingenieros"
                width={180}
                height={60}
                priority
                className="h-auto max-w-[180px] object-contain dark:hidden"
              />

              <Image
                src="/images/logo/logo-100-white.png"
                alt="CIMAS Ingenieros"
                width={180}
                height={60}
                priority
                className="hidden h-auto max-w-[180px] object-contain dark:block"
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo.png"
              alt="CIMAS"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
          )}
        </Link>
      </div>

      {/* NAVEGACIÓN */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {(isExpanded ||
                isHovered ||
                isMobileOpen) && (
                <h2 className="mb-4 text-xs font-medium uppercase leading-5 text-gray-400">
                  Gestión
                </h2>
              )}

              <ul className="flex flex-col gap-1">
                {navItems.map(
                  (
                    item
                  ) => {
                    const active =
                      isActive(
                        item.path
                      );

                    return (
                      <li
                        key={
                          item.path
                        }
                      >
                        <Link
                          href={
                            item.path
                          }
                          className={cn(
                            "group menu-item",
                            active
                              ? "menu-item-active"
                              : "menu-item-inactive",
                            !isExpanded &&
                              !isHovered
                              ? "lg:justify-center"
                              : "lg:justify-start"
                          )}
                        >
                          <span
                            className={cn(
                              active
                                ? "menu-item-icon-active"
                                : "menu-item-icon-inactive"
                            )}
                          >
                            {
                              item.icon
                            }
                          </span>

                          {(isExpanded ||
                            isHovered ||
                            isMobileOpen) && (
                            <span className="menu-item-text">
                              {
                                item.label
                              }
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;