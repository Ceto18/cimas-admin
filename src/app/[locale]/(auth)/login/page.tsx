import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | CIMAS",
  description: "Accede al panel administrativo de CIMAS & Ingenieros E.I.R.L.",
};

export default function SignIn() {
  return <SignInForm />;
}