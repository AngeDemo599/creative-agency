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

  // Create Site Settings (only if they don't exist)
  const settingsData = [
    { key: "site_name", value: "Newin Agency", type: "text", label: "Nom du site", group: "general" },
    { key: "site_tagline", value: "Creative Agency", type: "text", label: "Slogan", group: "general" },
    { key: "site_description", value: "Agence créative spécialisée dans le branding et le marketing digital", type: "textarea", label: "Description du site", group: "general" },
    { key: "contact_email", value: "contact@newin.dz", type: "email", label: "Email", group: "contact" },
    { key: "contact_phone", value: "0770 25 77 85", type: "tel", label: "Téléphone", group: "contact" },
    { key: "contact_address", value: "Algérie", type: "text", label: "Adresse", group: "contact" },
    { key: "contact_website", value: "www.newin.dz", type: "text", label: "Site Web", group: "contact" },
    { key: "map_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.086519158798!2d3.0587564!3d36.7525473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb26977ea659f%3A0x4e74f54d98e8ca26!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2s!4v1635789456789!5m2!1sen!2s", type: "url", label: "Google Maps URL", group: "contact" },
    { key: "social_facebook", value: "https://facebook.com/newin.dz", type: "url", label: "Facebook", group: "social" },
    { key: "social_instagram", value: "https://instagram.com/newin.dz", type: "url", label: "Instagram", group: "social" },
    { key: "social_linkedin", value: "https://linkedin.com/company/newin", type: "url", label: "LinkedIn", group: "social" },
    { key: "social_tiktok", value: "https://tiktok.com/@newin.dz", type: "url", label: "TikTok", group: "social" },
    { key: "maintenance_enabled", value: "false", type: "text", label: "Mode Maintenance Activé", group: "maintenance" },
    { key: "maintenance_password", value: "", type: "text", label: "Mot de passe maintenance", group: "maintenance" },
    { key: "maintenance_message", value: "Notre site est actuellement en maintenance. Nous serons bientôt de retour!", type: "textarea", label: "Message de maintenance", group: "maintenance" },
  ];

  for (const setting of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {}, // Don't update existing values
      create: setting,
    });
  }
  console.log("✅ Site settings created");

  // Create Categories (only if they don't exist)
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
      update: {}, // Don't update existing values
      create: category,
    });
  }
  console.log("✅ Categories created");

  // Create Stats (only if none exist)
  const statsCount = await prisma.stat.count();
  if (statsCount === 0) {
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
  } else {
    console.log("⏭️  Stats already exist, skipping");
  }

  console.log("🎉 Seed completed successfully!");
  console.log("");
  console.log("ℹ️  Note: This seed only creates essential data (admin, settings, categories).");
  console.log("   Projects, clients, services, testimonials, and FAQs should be added via the control center.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
