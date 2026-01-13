import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://newin.dz"),
  title: {
    default: "Newin Agency | Agence de Communication Créative à Alger",
    template: "%s | Newin Agency",
  },
  description: "Newin est une agence de communication créative et digitale basée à Alger. Branding, Stratégie, Social Media, Site web, Graphisme, Création de contenu et Mailing.",
  keywords: [
    "agence communication Alger",
    "agence digitale Algérie",
    "branding Alger",
    "création site web Algérie",
    "social media manager Alger",
    "graphisme Algérie",
    "agence créative Alger",
    "Newin Agency",
    "marketing digital Algérie",
    "identité visuelle Alger",
  ],
  authors: [{ name: "Newin Agency" }],
  creator: "Newin Agency",
  publisher: "Newin Agency",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo_newin_lettre_w.ico",
    shortcut: "/logo_newin_lettre_w.ico",
    apple: "/logo_newin_lettre_w.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: "https://newin.dz",
    siteName: "Newin Agency",
    title: "Newin Agency | Agence de Communication Créative à Alger",
    description: "Newin est une agence de communication créative et digitale basée à Alger. Branding, Stratégie, Social Media, Site web, Graphisme et plus.",
    images: [
      {
        url: "/logo_newin.png",
        width: 1200,
        height: 630,
        alt: "Newin Agency - Agence de Communication Créative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newin Agency | Agence de Communication Créative à Alger",
    description: "Newin est une agence de communication créative et digitale basée à Alger.",
    images: ["/logo_newin.png"],
    creator: "@newinagency",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <LocalBusinessJsonLd
          name="Newin Agency"
          url="https://newin.dz"
          logo="https://newin.dz/logo_newin.png"
          description="Agence de communication créative et digitale basée à Alger. Branding, Stratégie, Social Media, Site web, Graphisme, Création de contenu."
          email="contact@newin.dz"
          phone="+213 555 123 456"
          address={{
            street: "Bir Khadem",
            city: "Alger",
            region: "Alger",
            postalCode: "16000",
            country: "DZ",
          }}
          socialLinks={[
            "https://www.instagram.com/newin_dz/",
            "https://www.linkedin.com/in/newin-agency-b6191b68/",
            "https://www.facebook.com/newin.dz",
          ]}
          priceRange="$$"
          openingHours={["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"]}
        />
        <WebsiteJsonLd
          name="Newin Agency"
          url="https://newin.dz"
          description="Agence de communication créative et digitale basée à Alger"
        />
      </head>
      <body
        className={`${plusJakarta.className} antialiased bg-[#F7F3F1] text-gray-900`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
