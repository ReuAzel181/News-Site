-- News Articles Import Script for Supabase
-- This script imports sample news articles into the database
-- IMPORTANT: Run setup-database.sql FIRST to create tables and initial data
-- Then run this script in your Supabase SQL Editor

-- Insert sample articles using fixed IDs from setup script
-- Business Articles
INSERT INTO "Article" (
  id, title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId", 
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Global Markets Rally as Central Banks Signal Policy Shifts',
  'Financial markets experienced significant gains today as investors responded positively to coordinated policy signals from major central banks. The Federal Reserve indicated a potential pause in rate hikes, while the European Central Bank suggested similar measures to support economic growth. This coordinated approach has boosted investor confidence across global markets, with technology and financial sectors leading the rally. Economic indicators show strengthening consumer spending and business investment, supporting the case for continued market optimism.',
  'Major stock indices surge following coordinated statements from Federal Reserve and European Central Bank regarding interest rate adjustments. The Dow Jones gained 2.3% while the S&P 500 reached new highs as investors anticipate more accommodative monetary policies. Market analysts suggest this could mark the beginning of a sustained bull run driven by improved economic outlook and corporate earnings growth.',
  'global-markets-rally-central-banks',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '1 hour',
  18420,
  'admin-user-001',
  'cat-business-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'global-markets-rally-central-banks'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'Tech Giants Report Record Quarterly Earnings',
  'The latest earnings season has delivered impressive results for major technology corporations, with cloud computing and artificial intelligence driving unprecedented growth. Microsoft''s Azure platform grew 29% year-over-year, while its productivity suite benefited from hybrid work trends. Google''s search advertising revenue rebounded strongly, and YouTube''s creator economy generated $8.1 billion in revenue. These results demonstrate the resilience of tech companies and their ability to adapt to changing market conditions while investing heavily in future technologies.',
  'Leading technology companies exceed analyst expectations with strong revenue growth driven by cloud services and AI investments. Microsoft reported 15% year-over-year growth, while Google''s parent company Alphabet saw 12% increase in advertising revenue. Amazon''s AWS division continues to dominate cloud infrastructure with 32% market share, contributing significantly to overall profitability.',
  'tech-giants-record-quarterly-earnings',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '3 hours',
  12350,
  'admin-user-001',
  'cat-business-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'tech-giants-record-quarterly-earnings'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'Cryptocurrency Market Sees Major Institutional Investment',
  'The cryptocurrency landscape continues to evolve with increased institutional participation, marking a significant shift from retail-dominated trading to professional investment strategies. Major pension funds and endowments are now allocating 1-5% of their portfolios to digital assets, citing diversification benefits and inflation hedging properties. Regulatory frameworks in the US and Europe have provided much-needed clarity, enabling traditional financial institutions to offer crypto services without regulatory uncertainty.',
  'Traditional financial institutions increase digital asset allocations as regulatory clarity improves across major economies. BlackRock''s Bitcoin ETF attracted $2.1 billion in assets under management within its first month, while JPMorgan Chase announced plans to offer crypto custody services to institutional clients. The SEC''s recent approval of spot Bitcoin ETFs has opened the floodgates for mainstream adoption.',
  'cryptocurrency-market-institutional-investment',
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '5 hours',
  9876,
  'admin-user-001',
  'cat-business-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'cryptocurrency-market-institutional-investment'
);

-- Sports Articles
INSERT INTO "Article" (
  id, title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId", 
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Championship Finals Draw Record Television Viewership',
  'The championship finals attracted the largest television audience in sports broadcasting history, with over 180 million viewers worldwide tuning in to watch the thrilling conclusion. The match featured exceptional performances from both teams, with multiple lead changes and dramatic moments that kept fans on the edge of their seats. Social media engagement reached unprecedented levels, with over 50 million posts and interactions across all platforms during the event.',
  'Historic championship match breaks all previous viewership records with 180 million global audience. The thrilling finale featured multiple lead changes and exceptional athletic performances that captivated fans worldwide. Social media buzz reached new heights with record-breaking engagement across all platforms.',
  'championship-finals-record-viewership',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '2 hours',
  25680,
  'admin-user-001',
  'cat-sports-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'championship-finals-record-viewership'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'Olympic Training Facilities Undergo Major Modernization',
  'State-of-the-art training facilities are being constructed across multiple Olympic venues, featuring cutting-edge technology and sustainable design principles. The $2.5 billion investment includes advanced biomechanics labs, recovery centers with cryotherapy chambers, and AI-powered performance analysis systems. These facilities will serve as training grounds for the next generation of Olympic athletes and will remain as community sports centers after the games.',
  'Major investment in Olympic infrastructure brings cutting-edge training facilities with advanced technology and sustainable design. The $2.5 billion project includes biomechanics labs, recovery centers, and AI-powered performance analysis systems that will benefit both elite athletes and local communities.',
  'olympic-facilities-modernization',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '4 hours',
  14230,
  'admin-user-001',
  'cat-sports-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'olympic-facilities-modernization'
);

-- Technology Articles
INSERT INTO "Article" (
  id, title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId", 
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Breakthrough in Quantum Computing Achieves New Milestone',
  'Researchers have successfully demonstrated quantum supremacy in solving complex optimization problems, marking a significant advancement in computational capabilities. The quantum processor completed calculations in minutes that would take classical supercomputers thousands of years. This breakthrough has immediate applications in drug discovery, financial modeling, and cryptography, potentially revolutionizing multiple industries.',
  'Scientists achieve quantum computing breakthrough with processor that solves complex problems in minutes versus thousands of years for classical computers. The advancement opens new possibilities in drug discovery, financial modeling, and cryptography with immediate real-world applications.',
  'quantum-computing-breakthrough-milestone',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '6 hours',
  31450,
  'admin-user-001',
  'cat-technology-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'quantum-computing-breakthrough-milestone'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'AI-Powered Medical Diagnostics Show 95% Accuracy Rate',
  'Advanced artificial intelligence systems are revolutionizing medical diagnostics with unprecedented accuracy rates in detecting various diseases. The AI models, trained on millions of medical images and patient data, can identify early-stage cancers, neurological conditions, and rare diseases with 95% accuracy. Healthcare providers report significant improvements in patient outcomes and reduced diagnostic times from weeks to hours.',
  'Revolutionary AI diagnostic systems achieve 95% accuracy in detecting diseases including early-stage cancers and rare conditions. Healthcare providers see dramatic improvements in patient outcomes with diagnostic times reduced from weeks to hours through advanced machine learning technology.',
  'ai-medical-diagnostics-accuracy',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '8 hours',
  19870,
  'admin-user-001',
  'cat-technology-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'ai-medical-diagnostics-accuracy'
);

-- Lifestyle Articles
INSERT INTO "Article" (
  id, title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId", 
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Mediterranean Diet Linked to Increased Longevity in New Study',
  'A comprehensive 20-year study involving 50,000 participants reveals that adherence to a Mediterranean diet can increase life expectancy by up to 8 years. The research shows significant reductions in cardiovascular disease, diabetes, and cognitive decline among participants who followed the diet rich in olive oil, fish, vegetables, and whole grains. The study also found improved mental health outcomes and better quality of life in older adults.',
  'Groundbreaking 20-year study of 50,000 people shows Mediterranean diet can increase life expectancy by 8 years. Research demonstrates significant reductions in cardiovascular disease, diabetes, and cognitive decline, plus improved mental health outcomes for participants following the traditional diet.',
  'mediterranean-diet-longevity-study',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '10 hours',
  22340,
  'admin-user-001',
  'cat-lifestyle-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'mediterranean-diet-longevity-study'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'Sustainable Fashion Movement Gains Global Momentum',
  'The sustainable fashion industry is experiencing unprecedented growth as consumers increasingly prioritize environmental responsibility in their clothing choices. Major fashion brands are investing billions in eco-friendly materials, circular design principles, and transparent supply chains. The movement has created new job opportunities in green technology and sustainable manufacturing, while reducing the industry''s environmental footprint by 40% over the past five years.',
  'Sustainable fashion industry grows rapidly as consumers demand environmentally responsible clothing options. Major brands invest billions in eco-friendly materials and transparent supply chains, creating jobs while reducing environmental impact by 40% in five years.',
  'sustainable-fashion-global-momentum',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '12 hours',
  16780,
  'admin-user-001',
  'cat-lifestyle-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'sustainable-fashion-global-momentum'
);

-- Politics Articles
INSERT INTO "Article" (
  id, title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId", 
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'New Climate Policy Framework Announced by Government',
  'The government has unveiled a comprehensive climate policy framework aimed at achieving carbon neutrality by 2050. The ambitious plan includes massive investments in renewable energy infrastructure, electric vehicle adoption incentives, and strict emissions regulations for major industries. The policy also establishes a carbon pricing mechanism and provides funding for green technology research and development.',
  'Government announces ambitious climate policy framework targeting carbon neutrality by 2050. The comprehensive plan includes renewable energy investments, EV incentives, emissions regulations, carbon pricing, and green technology funding to combat climate change.',
  'climate-policy-framework-government',
  'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '14 hours',
  18920,
  'admin-user-001',
  'cat-politics-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'climate-policy-framework-government'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'International Trade Agreement Reaches Final Negotiations',
  'After months of intensive negotiations, world leaders are finalizing a landmark international trade agreement that will reshape global commerce. The agreement includes provisions for digital trade, environmental standards, and labor protections across participating nations. Economic analysts predict the deal could boost global GDP by 2.5% over the next decade while promoting sustainable development practices.',
  'World leaders near completion of landmark international trade agreement after months of negotiations. The deal includes digital trade provisions, environmental standards, and labor protections, with economists predicting 2.5% global GDP boost over the next decade.',
  'international-trade-agreement-negotiations',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '16 hours',
  13450,
  'admin-user-001',
  'cat-politics-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'international-trade-agreement-negotiations'
);

-- Entertainment Articles
INSERT INTO "Article" (
  id, title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId", 
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Streaming Wars Heat Up with New Platform Launches',
  'The entertainment industry is witnessing an unprecedented expansion in streaming services as major studios launch their own platforms. With over 15 new streaming services entering the market this year, consumers now have access to more content than ever before. The competition has led to increased investment in original programming, with studios spending billions on exclusive content to attract and retain subscribers.',
  'Entertainment industry sees major expansion in streaming services with 15 new platforms launching this year. Intense competition drives billions in investment for original programming as studios battle for subscribers in the evolving digital landscape.',
  'streaming-wars-new-platforms',
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '18 hours',
  27650,
  'admin-user-001',
  'cat-entertainment-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'streaming-wars-new-platforms'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'Virtual Reality Gaming Reaches New Heights of Realism',
  'The latest generation of virtual reality gaming systems is delivering unprecedented levels of immersion and realism. Advanced haptic feedback, 8K resolution displays, and AI-powered NPCs are creating gaming experiences that blur the line between virtual and reality. The VR gaming market is projected to reach $87 billion by 2030, driven by technological advances and growing consumer adoption.',
  'Next-generation VR gaming systems achieve unprecedented realism with advanced haptic feedback, 8K displays, and AI-powered characters. The immersive technology is driving market growth toward projected $87 billion valuation by 2030.',
  'virtual-reality-gaming-realism',
  'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '20 hours',
  21340,
  'admin-user-001',
  'cat-entertainment-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'virtual-reality-gaming-realism'
);

-- Health Articles
INSERT INTO "Article" (
  id, title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId", 
  "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  'Revolutionary Gene Therapy Shows Promise for Rare Diseases',
  'Breakthrough gene therapy treatments are showing remarkable success in clinical trials for previously incurable rare diseases. The innovative approach uses modified viruses to deliver healthy genes directly to affected cells, correcting genetic defects at their source. Early results show significant improvement in patient outcomes, with some participants experiencing complete reversal of disease symptoms.',
  'Breakthrough gene therapy treatments show remarkable success in clinical trials for rare diseases. The innovative approach delivers healthy genes to affected cells, with early results showing significant patient improvements and some complete symptom reversals.',
  'gene-therapy-rare-diseases-breakthrough',
  'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '22 hours',
  19780,
  'admin-user-001',
  'cat-health-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'gene-therapy-rare-diseases-breakthrough'
)
UNION ALL
SELECT 
  gen_random_uuid(),
  'Mental Health Apps Show Effectiveness in Clinical Studies',
  'Digital mental health applications are proving to be effective tools in treating anxiety, depression, and other mental health conditions. A comprehensive study involving 10,000 participants found that users of evidence-based mental health apps showed significant improvement in symptoms compared to control groups. The apps combine cognitive behavioral therapy techniques with personalized AI coaching and peer support networks.',
  'Clinical studies prove digital mental health apps effectively treat anxiety and depression. Research with 10,000 participants shows significant symptom improvement through evidence-based apps combining cognitive behavioral therapy, AI coaching, and peer support.',
  'mental-health-apps-clinical-effectiveness',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80',
  true,
  NOW() - INTERVAL '1 day',
  15620,
  'admin-user-001',
  'cat-health-001',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Article" WHERE slug = 'mental-health-apps-clinical-effectiveness'
);

-- 4. Bulk insert template for CSV import
-- Use this template when importing from CSV files
/*
COPY "Article" (
  title, content, excerpt, slug, "featuredImage", 
  published, "publishedAt", views, "authorId", "categoryId"
) FROM '/path/to/your/news-data.csv' 
WITH (FORMAT csv, HEADER true);
*/

-- 5. Create tags and associate with articles
-- Example tag creation
INSERT INTO "Tag" (id, name, slug, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Breaking News', 'breaking-news', NOW(), NOW()),
  (gen_random_uuid(), 'Featured', 'featured', NOW(), NOW()),
  (gen_random_uuid(), 'Trending', 'trending', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 6. Helper queries for data verification

-- Check import status
SELECT 
  'Articles' as table_name,
  COUNT(*) as total_count,
  COUNT(CASE WHEN published = true THEN 1 END) as published_count
FROM "Article"
UNION ALL
SELECT 
  'Categories' as table_name,
  COUNT(*) as total_count,
  NULL as published_count
FROM "Category"
UNION ALL
SELECT 
  'Users' as table_name,
  COUNT(*) as total_count,
  NULL as published_count
FROM "User";

-- View articles by category
SELECT 
  c.name as category,
  COUNT(a.id) as article_count
FROM "Category" c
LEFT JOIN "Article" a ON c.id = a."categoryId"
GROUP BY c.name, c.id
ORDER BY article_count DESC;

-- 7. Clean up queries (use with caution)
/*
-- Delete all articles (DANGEROUS - use only for testing)
DELETE FROM "ArticleTag";
DELETE FROM "Article";

-- Reset auto-increment sequences if needed
ALTER SEQUENCE article_id_seq RESTART WITH 1;
*/

-- 8. Performance optimization queries
-- Create indexes for better performance (run these separately after the main import)
/*
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_article_published 
  ON "Article" (published, "publishedAt" DESC) 
  WHERE published = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_article_category 
  ON "Article" ("categoryId", "publishedAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_article_slug 
  ON "Article" (slug) 
  WHERE published = true;
*/

-- Update table statistics
ANALYZE "Article";
ANALYZE "Category";
ANALYZE "User";