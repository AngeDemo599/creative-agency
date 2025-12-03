import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { href: "/services", label: "Branding" },
      { href: "/services", label: "Stratégie" },
      { href: "/services", label: "Social Media" },
      { href: "/services", label: "Site Web" },
    ],
    navigation: [
      { href: "/projects", label: "Projets" },
      { href: "/services", label: "Services" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
    social: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://linkedin.com", label: "LinkedIn" },
      { href: "https://behance.net", label: "Behance" },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo_newin.png"
                alt="Newin Agency"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Nous créons des expériences digitales qui inspirent, engagent et transforment les marques en histoires inoubliables.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 uppercase tracking-wider text-sm">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 uppercase tracking-wider text-sm">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 uppercase tracking-wider text-sm">
              Suivez-nous
            </h4>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Newin Agency. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">
              Politique de confidentialité
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
