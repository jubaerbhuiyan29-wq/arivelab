const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding additional content for testing 6-item limit...');

  // Get existing categories
  const categories = await prisma.category.findMany();
  
  // Create additional research items
  const additionalResearch = [
    {
      title: "Autonomous Vehicle Safety Systems",
      description: "Developing advanced safety protocols for self-driving vehicles",
      content: "Research focused on creating robust safety systems for autonomous vehicles.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Autonomous'))?.id || categories[0].id
    },
    {
      title: "Electric Vehicle Battery Optimization",
      description: "Improving battery efficiency and longevity for EVs",
      content: "Advanced research on battery management systems and optimization techniques.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Electric'))?.id || categories[0].id
    },
    {
      title: "Smart Traffic Management",
      description: "AI-powered traffic flow optimization systems",
      content: "Intelligent traffic management using machine learning and IoT sensors.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Smart'))?.id || categories[1].id
    },
    {
      title: "Vehicle-to-Everything Communication",
      description: "V2X technology for connected vehicle ecosystems",
      content: "Research on vehicle-to-everything communication protocols and applications.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Vehicle'))?.id || categories[0].id
    },
    {
      title: "Sustainable Energy Solutions",
      description: "Green energy integration for transportation systems",
      content: "Developing sustainable energy solutions for the transportation sector.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Sustainable'))?.id || categories[2].id
    },
    {
      title: "Advanced Driver Assistance Systems",
      description: "Next-generation ADAS technology and applications",
      content: "Research on advanced driver assistance systems using computer vision and AI.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Autonomous'))?.id || categories[0].id
    }
  ];

  // Create additional project items
  const additionalProjects = [
    {
      title: "Urban EV Charging Network",
      description: "Deploying comprehensive electric vehicle charging infrastructure",
      content: "Large-scale deployment of EV charging stations in urban environments.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Electric'))?.id || categories[0].id
    },
    {
      title: "Autonomous Delivery Fleet",
      description: "Self-driving delivery vehicles for last-mile logistics",
      content: "Implementation of autonomous delivery vehicles for urban logistics.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Autonomous'))?.id || categories[0].id
    },
    {
      title: "Smart Parking Solution",
      description: "AI-powered parking management and reservation system",
      content: "Intelligent parking management system using AI and IoT technologies.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Smart'))?.id || categories[1].id
    },
    {
      title: "Fleet Electrification Platform",
      description: "Comprehensive solution for fleet vehicle electrification",
      content: "End-to-end platform for managing fleet transition to electric vehicles.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Sustainable'))?.id || categories[2].id
    },
    {
      title: "Vehicle Health Monitoring",
      description: "IoT-based vehicle diagnostics and predictive maintenance",
      content: "Advanced vehicle health monitoring using IoT sensors and predictive analytics.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Smart'))?.id || categories[1].id
    },
    {
      title: "Mobility-as-a-Service Platform",
      description: "Integrated transportation platform for urban mobility",
      content: "Comprehensive MaaS platform integrating various transportation services.",
      featured: true,
      published: true,
      categoryId: categories.find(c => c.name.includes('Sustainable'))?.id || categories[2].id
    }
  ];

  // Insert additional research
  const researchPromises = additionalResearch.map(research => 
    prisma.research.create({ data: research })
  );

  // Insert additional projects
  const projectPromises = additionalProjects.map(project => 
    prisma.project.create({ data: project })
  );

  const [newResearch, newProjects] = await Promise.all([
    Promise.all(researchPromises),
    Promise.all(projectPromises)
  ]);

  console.log('✅ Additional content seeded successfully!');
  console.log('Created:', {
    research: newResearch.length,
    projects: newProjects.length,
    totalResearch: await prisma.research.count({ where: { featured: true, published: true } }),
    totalProjects: await prisma.project.count({ where: { featured: true, published: true } })
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