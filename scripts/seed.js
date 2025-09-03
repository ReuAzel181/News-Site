const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      role: 'USER',
    },
  });

  // Create categories
  const categories = [
    { name: 'Politics', slug: 'politics', description: 'Political news and analysis', color: '#EF4444' },
    { name: 'Technology', slug: 'technology', description: 'Tech news and innovations', color: '#3B82F6' },
    { name: 'Sports', slug: 'sports', description: 'Sports news and updates', color: '#10B981' },
    { name: 'Business', slug: 'business', description: 'Business and economy news', color: '#F59E0B' },
    { name: 'Health', slug: 'health', description: 'Health and wellness news', color: '#8B5CF6' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Get created categories
  const createdCategories = await prisma.category.findMany();

  // Create sample articles
  const articles = [
    {
      title: 'Breaking: New Technology Breakthrough',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'A major breakthrough in technology has been announced.',
      slug: 'breaking-new-technology-breakthrough',
      published: true,
      publishedAt: new Date(),
      views: 150,
      authorId: adminUser.id,
      categoryId: createdCategories.find(c => c.slug === 'technology').id,
    },
    {
      title: 'Political Update: Latest Developments',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'Latest political developments in the country.',
      slug: 'political-update-latest-developments',
      published: true,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      views: 89,
      authorId: regularUser.id,
      categoryId: createdCategories.find(c => c.slug === 'politics').id,
    },
    {
      title: 'Sports Championship Results',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'Championship results from the weekend games.',
      slug: 'sports-championship-results',
      published: true,
      publishedAt: new Date(),
      views: 234,
      authorId: adminUser.id,
      categoryId: createdCategories.find(c => c.slug === 'sports').id,
    },
    {
      title: 'Business Market Analysis',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'Analysis of current market trends.',
      slug: 'business-market-analysis',
      published: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
      views: 67,
      authorId: regularUser.id,
      categoryId: createdCategories.find(c => c.slug === 'business').id,
    },
    {
      title: 'Health Tips for Better Living',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      excerpt: 'Essential health tips for a better lifestyle.',
      slug: 'health-tips-better-living',
      published: false, // Draft article
      views: 0,
      authorId: adminUser.id,
      categoryId: createdCategories.find(c => c.slug === 'health').id,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  // Create admin settings
  await prisma.adminSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Veritas Bulletin',
      siteDescription: 'Your trusted source for Filipino news and insights',
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: admin@example.com`);
  console.log(`👤 Regular user: user@example.com`);
  console.log(`📰 Created ${articles.length} sample articles`);
  console.log(`📂 Created ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });