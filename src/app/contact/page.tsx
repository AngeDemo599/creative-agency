import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Newin Agency pour discuter de votre projet. Nous sommes là pour vous accompagner dans votre stratégie de communication et marketing digital.",
  openGraph: {
    title: "Contact | Newin Agency",
    description: "Contactez Newin Agency pour discuter de votre projet de communication, branding ou marketing digital.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "https://newin.dz" },
          { name: "Contact", url: "https://newin.dz/contact" },
        ]}
      />
      <ContactPageClient />
    </>
  );
}
