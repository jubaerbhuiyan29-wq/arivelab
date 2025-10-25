const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create homepage settings
  const homepageSettings = await prisma.homepageSettings.create({
    data: {
      heroTitle: "Welcome to Arive Lab",
      heroSubtitle: "Innovating the Future of Automotive Research",
      heroCtaText: "Join Now",
      heroCtaLink: "/register",
      seoTitle: "Arive Lab - Automotive Research Innovation",
      seoDescription: "Leading the future of automotive research and innovation through cutting-edge technology and collaborative breakthroughs."
    }
  });

  // Create about section
  const about = await prisma.about.create({
    data: {
      title: "About Arive Lab",
      description: "Arive Lab is at the forefront of automotive research and innovation, pioneering the future of transportation through cutting-edge technology and groundbreaking research."
    }
  });

  // Create some core values
  const coreValues = await Promise.all([
    prisma.coreValue.create({
      data: {
        title: "Innovation",
        description: "Pushing boundaries with cutting-edge automotive research",
        icon: "💡",
        displayOrder: 1
      }
    }),
    prisma.coreValue.create({
      data: {
        title: "Collaboration",
        description: "Working together to achieve breakthrough solutions",
        icon: "🤝",
        displayOrder: 2
      }
    }),
    prisma.coreValue.create({
      data: {
        title: "Excellence",
        description: "Committed to the highest standards in research and development",
        icon: "⭐",
        displayOrder: 3
      }
    })
  ]);

  // Create social links
  const socialLinks = await Promise.all([
    prisma.socialLink.create({
      data: {
        platform: "Twitter",
        url: "https://twitter.com/arivelab",
        icon: "🐦"
      }
    }),
    prisma.socialLink.create({
      data: {
        platform: "LinkedIn",
        url: "https://linkedin.com/company/arivelab",
        icon: "💼"
      }
    }),
    prisma.socialLink.create({
      data: {
        platform: "GitHub",
        url: "https://github.com/arivelab",
        icon: "🔧"
      }
    })
  ]);

  // Create contact info
  const contactInfo = await prisma.contactInfo.create({
    data: {
      email: "info@arivelab.com",
      phone: "+1 (555) 123-4567",
      address: "123 Innovation Drive, Tech City, TC 12345"
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('Created:', {
    homepageSettings,
    about,
    coreValues: coreValues.length,
    socialLinks: socialLinks.length,
    contactInfo
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });