import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#F7F3F1] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conditions d&apos;Utilisation
          </h1>
          <p className="text-gray-500">
            Dernière mise à jour : Décembre 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              En accédant et en utilisant le site web de Newin Agency, vous acceptez d&apos;être lié par
              ces conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas
              utiliser notre site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Newin Agency est une agence de communication créative et digitale offrant des services de :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Branding et identité visuelle</li>
              <li>Stratégie de communication</li>
              <li>Social Media Management</li>
              <li>Création de sites web</li>
              <li>Graphisme et création de contenu</li>
              <li>Mailing et campagnes digitales</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tout le contenu présent sur ce site (textes, images, logos, graphiques, vidéos) est la
              propriété de Newin Agency ou de ses partenaires. Toute reproduction, distribution ou
              utilisation sans autorisation préalable est interdite.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Utilisation du site</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Vous vous engagez à utiliser ce site de manière légale et à ne pas :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Tenter d&apos;accéder à des zones non autorisées du site</li>
              <li>Utiliser le site à des fins frauduleuses</li>
              <li>Transmettre des virus ou codes malveillants</li>
              <li>Violer les droits de propriété intellectuelle</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation de responsabilité</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Newin Agency s&apos;efforce de fournir des informations exactes et à jour sur ce site.
              Cependant, nous ne garantissons pas l&apos;exactitude, l&apos;exhaustivité ou la pertinence
              des informations fournies. L&apos;utilisation des informations de ce site se fait à vos
              propres risques.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Liens externes</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Notre site peut contenir des liens vers des sites externes. Nous ne sommes pas responsables
              du contenu ou des pratiques de confidentialité de ces sites tiers.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Newin Agency se réserve le droit de modifier ces conditions d&apos;utilisation à tout moment.
              Les modifications prendront effet dès leur publication sur le site. Nous vous encourageons
              à consulter régulièrement cette page.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Droit applicable</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ces conditions d&apos;utilisation sont régies par le droit algérien. Tout litige sera soumis
              à la compétence exclusive des tribunaux d&apos;Alger.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Pour toute question concernant ces conditions d&apos;utilisation, veuillez nous contacter :
            </p>
            <p className="text-gray-600">
              <strong>Email :</strong> contact@newin.agency<br />
              <strong>Adresse :</strong> Alger, Algérie
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
