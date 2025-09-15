import { PrismaClient } from '@prisma/client';
import { getMockNewsData, fetchMixedNews } from '../src/services/newsService';
import type { Article as NewsArticle } from '../src/components/home/types';

const prisma = new PrismaClient();

// Category mapping with colors
const CATEGORY_MAPPING = {
  'Business': { slug: 'business', color: '#10B981', description: 'Business and financial news' },
  'Sports': { slug: 'sports', color: '#F59E0B', description: 'Sports news and updates' },
  'Technology': { slug: 'technology', color: '#3B82F6', description: 'Technology and innovation news' },
  'Lifestyle': { slug: 'lifestyle', color: '#EC4899', description: 'Health, lifestyle and entertainment' },
  'Politics': { slug: 'politics', color: '#EF4444', description: 'Political news and analysis' },
  'National Security': { slug: 'national-security', color: '#6B7280', description: 'Security and defense news' },
  'International': { slug: 'international', color: '#8B5CF6', description: 'International news and affairs' },
  'National': { slug: 'national', color: '#059669', description: 'National news and events' },
  'Finance': { slug: 'finance', color: '#DC2626', description: 'Financial markets and economy' },
  'Entertainment': { slug: 'entertainment', color: '#F97316', description: 'Entertainment and celebrity news' },
};

// Create or get admin user
async function ensureAdminUser() {
  const adminEmail = 'admin@newsite.com';
  
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });
  
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'News Admin',
        role: 'ADMIN',
      }
    });
    console.log('✅ Created admin user:', adminEmail);
  }
  
  return adminUser;
}

// Create or get categories
async function ensureCategories() {
  const categories = new Map();
  
  for (const [name, config] of Object.entries(CATEGORY_MAPPING)) {
    let category = await prisma.category.findUnique({
      where: { slug: config.slug }
    });
    
    if (!category) {
      category = await prisma.category.create({
        data: {
          name,
          slug: config.slug,
          description: config.description,
          color: config.color,
        }
      });
      console.log(`✅ Created category: ${name}`);
    }
    
    categories.set(name, category);
  }
  
  return categories;
}

// Create or get tags
async function ensureTags(tagNames: string[]) {
  const tags = new Map();
  
  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    let tag = await prisma.tag.findUnique({
      where: { slug }
    });
    
    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          slug,
        }
      });
    }
    
    tags.set(tagName, tag);
  }
  
  return tags;
}

// Convert news article to database format
function convertNewsArticleToDbFormat(
  newsArticle: NewsArticle,
  authorId: string,
  categoryId: string
) {
  return {
    title: newsArticle.title,
    content: newsArticle.content || newsArticle.excerpt,
    excerpt: newsArticle.excerpt,
    slug: newsArticle.slug,
    featuredImage: newsArticle.imageUrl,
    published: true,
    publishedAt: newsArticle.publishedAt,
    views: newsArticle.views || 0,
    authorId,
    categoryId,
  };
}

// Import articles with batch processing
async function importArticles(newsArticles: NewsArticle[], batchSize = 10) {
  const adminUser = await ensureAdminUser();
  const categories = await ensureCategories();
  
  // Collect all unique tags
  const allTags = new Set<string>();
  newsArticles.forEach(article => {
    if (article.tags) {
      article.tags.forEach(tag => allTags.add(tag));
    }
  });
  
  const tags = await ensureTags(Array.from(allTags));
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  // Process articles in batches
  for (let i = 0; i < newsArticles.length; i += batchSize) {
    const batch = newsArticles.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (newsArticle) => {
        try {
          // Check if article already exists
          const existingArticle = await prisma.article.findUnique({
            where: { slug: newsArticle.slug }
          });
          
          if (existingArticle) {
            console.log(`⏭️  Skipping existing article: ${newsArticle.title}`);
            skipped++;
            return;
          }
          
          // Get category
          const category = categories.get(newsArticle.category);
          if (!category) {
            console.warn(`⚠️  Category not found for: ${newsArticle.category}`);
            errors++;
            return;
          }
          
          // Create article
          const dbArticle = convertNewsArticleToDbFormat(
            newsArticle,
            adminUser.id,
            category.id
          );
          
          const createdArticle = await prisma.article.create({
            data: dbArticle
          });
          
          // Associate tags
          if (newsArticle.tags && newsArticle.tags.length > 0) {
            const articleTags = newsArticle.tags
              .map(tagName => {
                const tag = tags.get(tagName);
                return tag ? {
                  articleId: createdArticle.id,
                  tagId: tag.id
                } : null;
              })
              .filter(Boolean);
            
            if (articleTags.length > 0) {
              await prisma.articleTag.createMany({
                data: articleTags as any[],
                skipDuplicates: true
              });
            }
          }
          
          console.log(`✅ Imported: ${newsArticle.title}`);
          imported++;
          
        } catch (error) {
          console.error(`❌ Error importing article "${newsArticle.title}":`, error);
          errors++;
        }
      })
    );
    
    // Small delay between batches to avoid overwhelming the database
    if (i + batchSize < newsArticles.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return { imported, skipped, errors };
}

// Main import function
export async function importNewsToDatabase(source: 'mock' | 'rss' = 'mock') {
  try {
    console.log('🚀 Starting news import process...');
    
    let newsArticles: NewsArticle[];
    
    if (source === 'mock') {
      console.log('📰 Fetching mock news data...');
      newsArticles = getMockNewsData();
    } else {
      console.log('📡 Fetching RSS news data...');
      newsArticles = await fetchMixedNews();
    }
    
    console.log(`📊 Found ${newsArticles.length} articles to import`);
    
    if (newsArticles.length === 0) {
      console.log('⚠️  No articles to import');
      return;
    }
    
    const result = await importArticles(newsArticles);
    
    console.log('\n📈 Import Summary:');
    console.log(`✅ Imported: ${result.imported} articles`);
    console.log(`⏭️  Skipped: ${result.skipped} articles (already exist)`);
    console.log(`❌ Errors: ${result.errors} articles`);
    console.log(`📊 Total processed: ${result.imported + result.skipped + result.errors}`);
    
    if (result.imported > 0) {
      console.log('\n🎉 News import completed successfully!');
    }
    
  } catch (error) {
    console.error('💥 Fatal error during import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI execution
if (require.main === module) {
  const source = process.argv[2] as 'mock' | 'rss' || 'mock';
  
  importNewsToDatabase(source)
    .then(() => {
      console.log('✨ Import process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Import failed:', error);
      process.exit(1);
    });
}