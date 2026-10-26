import type { HomeContent } from "../types/home.types";

export const homeMock: HomeContent = {
  title: "Ingeniería que construye confianza",
  subtitle:
    "Diseñamos y ejecutamos soluciones para transformar retos complejos en infraestructura que perdura.",
  banners: [
    {
      id: 1,
      name: "Banner principal",
      image: "/images/cimas/banner-1.jpg",
      order: 1,
    },
    {
      id: 2,
      name: "Banner secundario",
      image: "/images/cimas/banner-2.jpg",
      order: 2,
    },
    {
      id: 3,
      name: "Banner adicional",
      image: "/images/cimas/banner-3.jpg",
      order: 3,
    },
  ],
};