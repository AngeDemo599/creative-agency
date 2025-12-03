import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user with full permissions
  const hashedPassword = await bcrypt.hash("NewinAdmin2024!", 12);
  const allPermissions = JSON.stringify([
    "messages", "services", "projects", "testimonials",
    "faqs", "clients", "categories", "meetings", "users", "settings"
  ]);
  const admin = await prisma.user.upsert({
    where: { email: "admin@newin.dz" },
    update: {
      role: "admin",
      permissions: allPermissions,
    },
    create: {
      email: "admin@newin.dz",
      password: hashedPassword,
      name: "Admin Newin",
      role: "admin",
      permissions: allPermissions,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create Services
  const servicesData = [
    {
      title: "Market Research",
      subtitle: "Études de Marché",
      description: "Nous analysons les tendances du marché et le comportement des consommateurs pour éclairer vos décisions stratégiques.",
      longDescription: "Une bonne stratégie commence par une compréhension approfondie de votre marché. Notre équipe d'analystes réalise des études complètes qui combinent données quantitatives et qualitatives.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      features: [
        { title: "Competitive Analysis", description: "Analyse approfondie de vos concurrents" },
        { title: "Consumer Insights", description: "Compréhension des besoins clients" },
        { title: "Market Trends", description: "Identification des tendances émergentes" },
        { title: "Data Analytics", description: "Analyse de données et reporting" },
      ],
      slug: "market-research",
      order: 1,
    },
    {
      title: "Ads Production",
      subtitle: "Production Publicitaire",
      description: "De la conception créative à la post-production, nous produisons des contenus publicitaires qui captent l'attention.",
      longDescription: "Notre studio de production offre une gamme complète de services publicitaires. Nous accompagnons votre marque de la phase de conception créative jusqu'à la livraison finale.",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop",
      features: [
        { title: "Video Production", description: "Films publicitaires et corporate" },
        { title: "Motion Graphics", description: "Animations et effets visuels" },
        { title: "Commercial Ads", description: "Spots TV et digital" },
        { title: "Social Media Content", description: "Contenus optimisés pour les réseaux" },
      ],
      slug: "ads-production",
      order: 2,
    },
    {
      title: "Branding Strategies",
      subtitle: "Identité de Marque",
      description: "Nous créons des identités de marque uniques et mémorables qui capturent l'essence de votre entreprise.",
      longDescription: "Notre approche du branding va au-delà de la simple création d'un logo. Nous développons une stratégie de marque complète qui définit votre positionnement, votre voix et votre identité visuelle.",
      image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1200&h=800&fit=crop",
      features: [
        { title: "Logo Design", description: "Création de logos distinctifs et mémorables" },
        { title: "Identité Visuelle", description: "Palette de couleurs, typographie et éléments graphiques" },
        { title: "Brand Guidelines", description: "Manuel d'utilisation complet de votre marque" },
        { title: "Brand Strategy", description: "Positionnement et stratégie de communication" },
      ],
      slug: "branding",
      order: 3,
    },
    {
      title: "Social Media",
      subtitle: "Réseaux Sociaux",
      description: "Nous développons des stratégies de contenu engageantes qui connectent votre marque avec votre audience.",
      longDescription: "Les réseaux sociaux sont devenus essentiels pour toute stratégie de marque. Notre équipe développe des stratégies personnalisées pour chaque plateforme.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
      features: [
        { title: "Content Strategy", description: "Planification éditoriale personnalisée" },
        { title: "Community Management", description: "Animation et modération de vos réseaux" },
        { title: "Influencer Marketing", description: "Partenariats avec des créateurs de contenu" },
        { title: "Analytics", description: "Suivi et optimisation des performances" },
      ],
      slug: "social-media",
      order: 4,
    },
    {
      title: "Web Development",
      subtitle: "Développement Web",
      description: "Nous créons des sites web modernes, performants et optimisés pour convertir vos visiteurs en clients.",
      longDescription: "Notre équipe de développeurs crée des sites web qui allient esthétique et performance. Nous utilisons les technologies les plus récentes pour garantir des sites rapides et sécurisés.",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=800&fit=crop",
      features: [
        { title: "Custom Websites", description: "Sites web sur mesure et responsive" },
        { title: "E-commerce", description: "Boutiques en ligne performantes" },
        { title: "Web Applications", description: "Applications web interactives" },
        { title: "CMS Development", description: "Sites administrables facilement" },
      ],
      slug: "web-development",
      order: 5,
    },
    {
      title: "Packaging Design",
      subtitle: "Design de Packaging",
      description: "Nous concevons des emballages qui captivent et séduisent. Du concept à la production.",
      longDescription: "Le packaging est souvent le premier point de contact entre votre produit et vos clients. Notre équipe crée des designs qui communiquent les valeurs de votre marque.",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&h=800&fit=crop",
      features: [
        { title: "Product Packaging", description: "Conception d'emballages produits uniques" },
        { title: "Label Design", description: "Étiquettes attractives et informatives" },
        { title: "Box Design", description: "Boîtes et coffrets sur mesure" },
        { title: "Sustainable Packaging", description: "Solutions d'emballage écologiques" },
      ],
      slug: "packaging",
      order: 6,
    },
  ];

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        ...service,
        features: JSON.stringify(service.features),
      },
    });
  }
  console.log("✅ Services created");

  // Create Projects
  const projectsData = [
    { title: "Luxe Cosmetics", description: "Identité visuelle complète pour une marque de cosmétiques haut de gamme", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=600&fit=crop", category: "Branding", tags: ["Logo", "Identité Visuelle", "Guidelines"], serviceSlug: "branding", order: 1 },
    { title: "Bio Fresh", description: "Design de packaging pour une gamme de produits alimentaires biologiques", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop", category: "Packaging", tags: ["Packaging", "Illustration", "Print"], serviceSlug: "packaging", order: 2 },
    { title: "TechStart", description: "Site web moderne et application mobile pour une startup technologique", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop", category: "Web Design", tags: ["Web", "UI/UX", "Mobile"], serviceSlug: "web-development", order: 3 },
    { title: "Café Arabica", description: "Rebranding complet pour une chaîne de cafés artisanaux", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop", category: "Branding", tags: ["Logo", "Signalétique", "Menu"], serviceSlug: "branding", order: 4 },
    { title: "Fashion Week", description: "Catalogue et supports print pour un événement de mode international", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", category: "Print", tags: ["Catalogue", "Flyers", "Affiches"], serviceSlug: "ads-production", order: 5 },
    { title: "Green Energy", description: "Conception et réalisation de stand pour salon professionnel", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop", category: "Stands", tags: ["Stand", "Signalétique", "PLV"], serviceSlug: "branding", order: 6 },
    { title: "Artisan Bakery", description: "Packaging premium pour une boulangerie artisanale", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop", category: "Packaging", tags: ["Packaging", "Étiquettes", "Sacs"], serviceSlug: "packaging", order: 7 },
    { title: "FinanceApp", description: "Application fintech avec dashboard analytics avancé", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop", category: "Web Design", tags: ["App", "Dashboard", "UI/UX"], serviceSlug: "web-development", order: 8 },
    { title: "Hotel Riviera", description: "Magazine et brochures pour un hôtel de luxe", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", category: "Print", tags: ["Magazine", "Brochure", "Photos"], serviceSlug: "ads-production", order: 9 },
  ];

  for (const project of projectsData) {
    await prisma.project.create({
      data: {
        ...project,
        tags: JSON.stringify(project.tags),
      },
    });
  }
  console.log("✅ Projects created");

  // Create Testimonials
  const testimonialsData = [
    { name: "Ahmed Benali", role: "CEO", company: "TechVision", content: "Newin Agency a transformé notre identité visuelle. Leur créativité et professionnalisme sont exceptionnels.", rating: 5, order: 1 },
    { name: "Sarah Mansouri", role: "Marketing Director", company: "FashionHub", content: "Une équipe talentueuse qui comprend vraiment les besoins de ses clients. Résultats au-delà de nos attentes.", rating: 5, order: 2 },
    { name: "Karim Hadj", role: "Founder", company: "StartupDZ", content: "Collaboration excellente du début à la fin. Je recommande vivement leurs services.", rating: 5, order: 3 },
  ];

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log("✅ Testimonials created");

  // Create FAQs
  const faqsData = [
    { question: "Qu'est-ce que Newin Agency?", answer: "Newin Agency est une agence créative spécialisée dans le branding, le marketing digital, la production publicitaire et le design de packaging.", category: "General", order: 1 },
    { question: "Où êtes-vous situés?", answer: "Nous sommes basés en Algérie et travaillons avec des clients sur tout le territoire national ainsi qu'à l'international.", category: "General", order: 2 },
    { question: "Quels services proposez-vous?", answer: "Nous offrons une gamme complète de services créatifs: branding et identité visuelle, production publicitaire, marketing digital, design de packaging, développement web et gestion des réseaux sociaux.", category: "Services", order: 1 },
    { question: "Comment sont calculés vos tarifs?", answer: "Nos tarifs sont établis sur mesure en fonction de la complexité du projet, des délais et des livrables attendus. Nous proposons toujours un devis détaillé après avoir discuté de vos besoins spécifiques.", category: "Tarifs & Délais", order: 1 },
    { question: "Quels sont vos délais de réalisation?", answer: "Les délais varient selon le type et l'ampleur du projet. Un logo peut prendre 2-3 semaines, tandis qu'une identité de marque complète peut nécessiter 6-8 semaines.", category: "Tarifs & Délais", order: 2 },
  ];

  for (const faq of faqsData) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log("✅ FAQs created");

  // Create Clients
  const clientsData = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", order: 1 },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", invert: true, order: 2 },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", order: 3 },
    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png", invert: true, order: 4 },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", order: 5 },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png", invert: true, order: 6 },
  ];

  for (const client of clientsData) {
    await prisma.client.create({ data: client });
  }
  console.log("✅ Clients created");

  // Create Site Settings
  const settingsData = [
    { key: "site_name", value: "Newin Agency", type: "text", label: "Nom du site", group: "general" },
    { key: "site_tagline", value: "Creative Agency", type: "text", label: "Slogan", group: "general" },
    { key: "site_description", value: "Agence créative spécialisée dans le branding et le marketing digital", type: "textarea", label: "Description du site", group: "general" },
    { key: "contact_email", value: "contact@newin.dz", type: "email", label: "Email", group: "contact" },
    { key: "contact_phone", value: "0770 25 77 85", type: "tel", label: "Téléphone", group: "contact" },
    { key: "contact_address", value: "Algérie", type: "text", label: "Adresse", group: "contact" },
    { key: "contact_website", value: "www.newin.dz", type: "text", label: "Site Web", group: "contact" },
    { key: "social_facebook", value: "https://facebook.com/newin.dz", type: "url", label: "Facebook", group: "social" },
    { key: "social_instagram", value: "https://instagram.com/newin.dz", type: "url", label: "Instagram", group: "social" },
    { key: "social_linkedin", value: "https://linkedin.com/company/newin", type: "url", label: "LinkedIn", group: "social" },
    { key: "social_tiktok", value: "https://tiktok.com/@newin.dz", type: "url", label: "TikTok", group: "social" },
  ];

  for (const setting of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type, label: setting.label, group: setting.group },
      create: setting,
    });
  }
  console.log("✅ Site settings created");

  // Create Categories
  const categoriesData = [
    // Project categories
    { name: "Branding", slug: "branding", type: "project", order: 1 },
    { name: "Packaging", slug: "packaging", type: "project", order: 2 },
    { name: "Web Design", slug: "web-design", type: "project", order: 3 },
    { name: "Print", slug: "print", type: "project", order: 4 },
    { name: "Social Media", slug: "social-media", type: "project", order: 5 },
    { name: "Motion", slug: "motion", type: "project", order: 6 },
    { name: "Stands", slug: "stands", type: "project", order: 7 },
    // FAQ categories
    { name: "General", slug: "general-faq", type: "faq", order: 1 },
    { name: "Services", slug: "services-faq", type: "faq", order: 2 },
    { name: "Tarifs & Délais", slug: "tarifs-delais", type: "faq", order: 3 },
    { name: "Processus", slug: "processus", type: "faq", order: 4 },
  ];

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, type: category.type, order: category.order },
      create: category,
    });
  }
  console.log("✅ Categories created");

  // Create Stats
  const statsData = [
    { label: "Clients Satisfaits", value: 76, suffix: "+", order: 1 },
    { label: "Années d'expérience", value: 18, suffix: "+", order: 2 },
    { label: "Projets Réalisés", value: 1000, suffix: "+", order: 3 },
    { label: "Satisfaction", value: 100, suffix: "%", order: 4 },
  ];

  for (const stat of statsData) {
    await prisma.stat.create({ data: stat });
  }
  console.log("✅ Stats created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
