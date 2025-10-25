const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Executive Officer & Founder",
    teamRole: "FOUNDER",
    bio: "Dr. Sarah Johnson is a visionary leader with over 15 years of experience in automotive research and innovation. She holds a Ph.D. in Automotive Engineering from MIT and has led numerous breakthrough projects in autonomous vehicle technology.",
    email: "sarah.johnson@arivelab.com",
    linkedin: "https://linkedin.com/in/sarah-johnson",
    twitter: "https://twitter.com/sarahjohnson",
    displayOrder: 1
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    teamRole: "ADMIN",
    bio: "Michael Chen is a technology innovator specializing in AI and machine learning applications in automotive systems. With a background in computer science from Stanford, he has been instrumental in developing our core AI technologies.",
    email: "michael.chen@arivelab.com",
    github: "https://github.com/michaelchen",
    linkedin: "https://linkedin.com/in/michael-chen",
    displayOrder: 2
  },
  {
    name: "Emily Rodriguez",
    role: "Research Director",
    teamRole: "COORDINATOR",
    bio: "Emily Rodriguez leads our research initiatives with expertise in electric vehicle systems and sustainable transportation. She has published over 50 research papers and holds 12 patents in automotive technology.",
    email: "emily.rodriguez@arivelab.com",
    linkedin: "https://linkedin.com/in/emily-rodriguez",
    twitter: "https://twitter.com/emilyrodriguez",
    displayOrder: 3
  },
  {
    name: "David Kim",
    role: "Lead Engineer",
    teamRole: "MEMBER",
    bio: "David Kim is our lead engineer with expertise in autonomous driving systems and sensor fusion. He has worked with major automotive manufacturers and brings valuable industry experience to our team.",
    email: "david.kim@arivelab.com",
    github: "https://github.com/davidkim",
    linkedin: "https://linkedin.com/in/david-kim",
    displayOrder: 4
  },
  {
    name: "Lisa Thompson",
    role: "UX/UI Designer",
    teamRole: "MEMBER",
    bio: "Lisa Thompson specializes in creating intuitive user interfaces for automotive applications. Her design philosophy centers on safety, accessibility, and user experience in next-generation vehicle interfaces.",
    email: "lisa.thompson@arivelab.com",
    linkedin: "https://linkedin.com/in/lisa-thompson",
    twitter: "https://twitter.com/lisathompson",
    displayOrder: 5
  },
  {
    name: "Alex Kumar",
    role: "Research Intern",
    teamRole: "INTERN",
    bio: "Alex Kumar is a talented graduate student in automotive engineering, contributing to our research on vehicle-to-everything (V2X) communication systems. Currently pursuing his Master's degree at Georgia Tech.",
    email: "alex.kumar@arivelab.com",
    github: "https://github.com/alexkumar",
    linkedin: "https://linkedin.com/in/alex-kumar",
    displayOrder: 6
  }
];

console.log('Team members to seed:', teamMembers.length);
console.log('First member:', teamMembers[0]);

// Function to seed team members
async function seedTeamMembers() {
  try {
    for (const member of teamMembers) {
      const response = await fetch('http://localhost:3000/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Added team member:', member.name);
      } else {
        const error = await response.text();
        console.error('❌ Error adding team member:', member.name, error);
      }
    }
    console.log('🎉 Team members seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding team members:', error);
  }
}

// Run the seeding
seedTeamMembers();