interface OrganizationProps {
  name: string;
  url: string;
  logo: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  socialLinks?: string[];
}

interface LocalBusinessProps extends OrganizationProps {
  priceRange?: string;
  openingHours?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceProps {
  name: string;
  description: string;
  provider: string;
  url: string;
  image?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  email,
  phone,
  address,
  socialLinks,
}: OrganizationProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.country,
      },
    }),
    ...(socialLinks && socialLinks.length > 0 && { sameAs: socialLinks }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessJsonLd({
  name,
  url,
  logo,
  description,
  email,
  phone,
  address,
  socialLinks,
  priceRange,
  openingHours,
}: LocalBusinessProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name,
    url,
    logo,
    image: logo,
    description,
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(priceRange && { priceRange }),
    ...(openingHours && { openingHours }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 36.7161,
        longitude: 2.9833,
      },
    }),
    ...(socialLinks && socialLinks.length > 0 && { sameAs: socialLinks }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceJsonLd({ name, description, provider, url, image }: ServiceProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
    url,
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/projects?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
