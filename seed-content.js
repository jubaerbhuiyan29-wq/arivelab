const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding additional content...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electric Vehicles",
        type: "RESEARCH",
        description: "Research on electric vehicle technology and infrastructure"
      }
    }),
    prisma.category.create({
      data: {
        name: "Autonomous Driving",
        type: "RESEARCH",
        description: "Research on self-driving car technology"
      }
    }),
    prisma.category.create({
      data: {
        name: "Sustainable Mobility",
        type: "PROJECT",
        description: "Projects focused on sustainable transportation solutions"
      }
    })
  ]);

  // Create sample research
  const research = await Promise.all([
    prisma.research.create({
      data: {
        title: "Advanced Battery Technology for EVs",
        description: "Revolutionary research on next-generation battery systems",
        content: "Our research focuses on developing high-capacity, fast-charging battery systems that will revolutionize the electric vehicle industry.",
        featured: true,
        published: true,
        categoryId: categories[0].id
      }
    }),
    prisma.research.create({
      data: {
        title: "AI-Powered Autonomous Systems",
        description: "Cutting-edge research in artificial intelligence for self-driving cars",
        content: "We're developing sophisticated AI systems that can handle complex driving scenarios with unprecedented accuracy and safety.",
        featured: true,
        published: true,
        categoryId: categories[1].id
      }
    }),
    prisma.research.create({
      data: {
        title: "Vehicle-to-Grid Integration",
        description: "Research on bi-directional energy flow between vehicles and power grid",
        content: "Our V2G research explores how electric vehicles can serve as mobile energy storage units to support grid stability.",
        featured: true,
        published: true,
        categoryId: categories[0].id
      }
    })
  ]);

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: "Urban Mobility Solution",
        description: "Comprehensive urban transportation system redesign",
        content: "A holistic approach to redesigning urban mobility for the 21st century.",
        featured: true,
        published: true,
        categoryId: categories[2].id
      }
    }),
    prisma.project.create({
      data: {
        title: "Smart Charging Infrastructure",
        description: "Intelligent EV charging network deployment",
        content: "Deploying AI-powered charging infrastructure across major urban centers.",
        featured: true,
        published: true,
        categoryId: categories[0].id
      }
    }),
    prisma.project.create({
      data: {
        title: "Fleet Electrification Program",
        description: "Large-scale fleet transition to electric vehicles",
        content: "Helping businesses transition their entire vehicle fleets to electric power.",
        featured: true,
        published: true,
        categoryId: categories[2].id
      }
    })
  ]);

  console.log('✅ Additional content seeded successfully!');
  console.log('Created:', {
    categories: categories.length,
    research: research.length,
    projects: projects.length
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding additional content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });