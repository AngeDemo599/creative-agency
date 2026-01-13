import { Metadata } from "next";
import prisma from "@/lib/db";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import FAQPageClient from "./FAQPageClient";

export const metadata: Metadata = {
  title: "FAQ - Questions Fréquentes",
  description: "Trouvez les réponses aux questions les plus courantes sur nos services de communication, branding, création graphique et marketing digital.",
  openGraph: {
    title: "FAQ - Questions Fréquentes | Newin Agency",
    description: "Trouvez les réponses aux questions les plus courantes sur nos services de communication et marketing digital.",
    type: "website",
  },
};

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    select: { question: true, answer: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <FAQPageJsonLd
        faqs={faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "https://newin.dz" },
          { name: "FAQ", url: "https://newin.dz/faq" },
        ]}
      />
      <FAQPageClient />
    </>
  );
}
