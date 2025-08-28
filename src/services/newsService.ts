import { Article } from '@/components/home/types';

// RSS to JSON converter service
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

// News sources with their RSS feeds
const NEWS_SOURCES = {
  // General News
  bbc: 'https://feeds.bbci.co.uk/news/rss.xml',
  cnn: 'https://rss.cnn.com/rss/edition.rss',
  reuters: 'https://www.reuters.com/rssFeed/worldNews',
  ap: 'https://rsshub.app/ap/topics/apf-topnews',
  guardian: 'https://www.theguardian.com/world/rss',
  
  // Business & Finance
  bbcBusiness: 'https://feeds.bbci.co.uk/news/business/rss.xml',
  reutersBusiness: 'https://www.reuters.com/rssFeed/businessNews',
  
  // Technology
  bbcTech: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
  
  // Sports
  bbcSports: 'https://feeds.bbci.co.uk/sport/rss.xml',
  
  // Health & Lifestyle
  bbcHealth: 'https://feeds.bbci.co.uk/news/health/rss.xml',
};

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  enclosure?: {
    link: string;
    type: string;
  };
  thumbnail?: string;
}

interface RSSResponse {
  status: string;
  feed: {
    title: string;
    description: string;
  };
  items: RSSItem[];
}

// Enhanced category mapping based on keywords and source
const categorizeArticle = (title: string, description: string, source?: string): string => {
  const content = `${title} ${description}`.toLowerCase();
  
  // Check source-based categorization first
  if (source) {
    if (source.includes('business') || source.includes('Business')) return 'Business';
    if (source.includes('tech') || source.includes('Technology')) return 'Technology';
    if (source.includes('sport') || source.includes('Sports')) return 'Sports';
    if (source.includes('health') || source.includes('Health')) return 'Lifestyle';
  }
  
  // Business & Finance keywords
  if (content.includes('business') || content.includes('economy') || content.includes('market') || 
      content.includes('finance') || content.includes('stock') || content.includes('investment') ||
      content.includes('bank') || content.includes('trade') || content.includes('economic') ||
      content.includes('financial') || content.includes('corporate') || content.includes('earnings')) {
    return 'Business';
  }
  
  // Sports keywords
  if (content.includes('sport') || content.includes('football') || content.includes('basketball') || 
      content.includes('tennis') || content.includes('soccer') || content.includes('baseball') ||
      content.includes('hockey') || content.includes('golf') || content.includes('olympics') ||
      content.includes('championship') || content.includes('league') || content.includes('match') ||
      content.includes('game') || content.includes('player') || content.includes('team')) {
    return 'Sports';
  }
  
  // Technology keywords
  if (content.includes('tech') || content.includes('technology') || content.includes('ai') || 
      content.includes('digital') || content.includes('software') || content.includes('computer') ||
      content.includes('internet') || content.includes('cyber') || content.includes('data') ||
      content.includes('innovation') || content.includes('startup') || content.includes('app')) {
    return 'Technology';
  }
  
  // Lifestyle & Health keywords
  if (content.includes('health') || content.includes('lifestyle') || content.includes('food') || 
      content.includes('travel') || content.includes('wellness') || content.includes('fitness') ||
      content.includes('diet') || content.includes('medical') || content.includes('entertainment') ||
      content.includes('culture') || content.includes('fashion') || content.includes('celebrity')) {
    return 'Lifestyle';
  }
  
  // Politics keywords
  if (content.includes('politics') || content.includes('election') || content.includes('government') ||
      content.includes('president') || content.includes('minister') || content.includes('parliament') ||
      content.includes('congress') || content.includes('senate') || content.includes('vote')) {
    return 'Politics';
  }
  
  // Security keywords
  if (content.includes('security') || content.includes('military') || content.includes('defense') ||
      content.includes('war') || content.includes('conflict') || content.includes('terrorism')) {
    return 'National Security';
  }
  
  // International keywords
  if (content.includes('international') || content.includes('world') || content.includes('global') ||
      content.includes('foreign') || content.includes('diplomatic')) {
    return 'International';
  }
  
  return 'National';
};

// Generate a high-quality placeholder image based on category
const getPlaceholderImage = (category: string): string => {
  const imageMap: Record<string, string> = {
    'Business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&q=80',
    'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop&q=80',
    'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop&q=80',
    'Lifestyle': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80',
    'Politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=800&fit=crop&q=80',
    'National Security': 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1200&h=800&fit=crop&q=80',
    'International': 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1200&h=800&fit=crop&q=80',
    'National': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop&q=80',
    'Finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop&q=80',
    'Entertainment': 'https://images.unsplash.com/photo-1489599904472-af35ff2c7c3f?w=1200&h=800&fit=crop&q=80',
  };
  
  return imageMap[category] || imageMap['National'];
};

// Convert RSS item to Article format
const convertRSSToArticle = (item: RSSItem, index: number, source?: string): Article => {
  const category = categorizeArticle(item.title, item.description, source);
  const imageUrl = item.thumbnail || item.enclosure?.link || getPlaceholderImage(category);
  
  // Extract author from description or use source
  const author = item.author || 'News Staff';
  
  // Clean description and create excerpt
  const cleanDescription = item.description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .trim();
  
  const excerpt = cleanDescription.length > 150 
    ? cleanDescription.substring(0, 150) + '...' 
    : cleanDescription;

  return {
    id: `rss-${Date.now()}-${index}`,
    title: item.title,
    excerpt,
    content: cleanDescription,
    imageUrl,
    category,
    author,
    publishedAt: new Date(item.pubDate),
    featured: index < 2, // Mark first 2 articles as featured
    slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    tags: [category.toLowerCase()],
    views: Math.floor(Math.random() * 10000) + 1000, // Random view count
    likes: Math.floor(Math.random() * 500) + 50,
    url: item.link,
  };
};

// Fetch news from RSS feeds
export const fetchNewsFromRSS = async (source: keyof typeof NEWS_SOURCES = 'bbc'): Promise<Article[]> => {
  try {
    const rssUrl = NEWS_SOURCES[source];
    const response = await fetch(`${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(rssUrl)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: RSSResponse = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('RSS feed parsing failed');
    }
    
    return data.items.slice(0, 20).map((item, index) => convertRSSToArticle(item, index, source));
  } catch (error) {
    console.error('Error fetching RSS news:', error);
    return [];
  }
};

// Fetch news from multiple sources with category diversity
export const fetchMixedNews = async (): Promise<Article[]> => {
  try {
    // Prioritize category-specific sources for better content diversity
    const prioritySources: (keyof typeof NEWS_SOURCES)[] = [
      'bbc', 'bbcBusiness', 'bbcTech', 'bbcSports', 'bbcHealth',
      'cnn', 'reuters', 'reutersBusiness'
    ];
    
    const promises = prioritySources.map(source => 
      fetchNewsFromRSS(source).then(articles => 
        articles.map((article, index) => 
          convertRSSToArticle({
            title: article.title,
            description: article.excerpt,
            link: article.url || '#',
            pubDate: article.publishedAt.toISOString(),
            author: article.author,
            thumbnail: article.imageUrl
          } as RSSItem, index, source)
        )
      )
    );
    
    const results = await Promise.allSettled(promises);
    const articles: Article[] = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        articles.push(...result.value.slice(0, 6)); // Take 6 articles from each source
      }
    });
    
    // If we don't have enough articles, fall back to mock data
    if (articles.length < 10) {
      console.log('Insufficient RSS articles, supplementing with mock data');
      const mockArticles = getMockNewsData();
      articles.push(...mockArticles);
    }
    
    // Ensure we have articles from each major category
    const categoryCounts = articles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Add mock articles for missing categories
    const requiredCategories = ['Business', 'Sports', 'Technology', 'Lifestyle'];
    const mockData = getMockNewsData();
    
    requiredCategories.forEach(category => {
      if (!categoryCounts[category] || categoryCounts[category] < 3) {
        const categoryMockArticles = mockData.filter(article => article.category === category);
        articles.push(...categoryMockArticles.slice(0, 3));
      }
    });
    
    // Shuffle and return mixed articles
    return articles.sort(() => Math.random() - 0.5).slice(0, 30);
  } catch (error) {
    console.error('Error fetching mixed news:', error);
    return getMockNewsData();
  }
};

// Comprehensive fallback mock data if RSS fails
export const getMockNewsData = (): Article[] => {
  return [
    // Business Articles
    {
      id: 'mock-business-1',
      title: 'Global Markets Rally as Central Banks Signal Policy Shifts',
      excerpt: 'Major stock indices surge following coordinated statements from Federal Reserve and European Central Bank regarding interest rate adjustments...',
      content: 'Financial markets experienced significant gains today as investors responded positively to coordinated policy signals from major central banks...',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop&q=80',
      category: 'Business',
      author: 'Financial Markets Reporter',
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      featured: true,
      slug: 'global-markets-rally-central-banks',
      tags: ['business', 'finance', 'markets'],
      views: 18420,
      likes: 542,
      url: '#',
    },
    {
      id: 'mock-business-2',
      title: 'Tech Giants Report Record Quarterly Earnings',
      excerpt: 'Leading technology companies exceed analyst expectations with strong revenue growth driven by cloud services and AI investments...',
      content: 'The latest earnings season has delivered impressive results for major technology corporations...',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&q=80',
      category: 'Business',
      author: 'Corporate Finance Editor',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      featured: false,
      slug: 'tech-giants-record-quarterly-earnings',
      tags: ['business', 'technology', 'earnings'],
      views: 12350,
      likes: 298,
      url: '#',
    },
    {
      id: 'mock-business-3',
      title: 'Cryptocurrency Market Sees Major Institutional Investment',
      excerpt: 'Traditional financial institutions increase digital asset allocations as regulatory clarity improves across major economies...',
      content: 'The cryptocurrency landscape continues to evolve with increased institutional participation...',
      imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=800&fit=crop&q=80',
      category: 'Business',
      author: 'Crypto Markets Analyst',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      featured: false,
      slug: 'cryptocurrency-institutional-investment',
      tags: ['business', 'cryptocurrency', 'finance'],
      views: 9876,
      likes: 234,
      url: '#',
    },
    
    // Sports Articles
    {
      id: 'mock-sports-1',
      title: 'Championship Finals Set as Underdogs Advance',
      excerpt: 'Surprising playoff results lead to an unexpected championship matchup that has fans and analysts buzzing with excitement...',
      content: 'The road to the championship has taken several unexpected turns this season...',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop&q=80',
      category: 'Sports',
      author: 'Sports Editor',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      featured: true,
      slug: 'championship-finals-underdogs-advance',
      tags: ['sports', 'championship', 'playoffs'],
      views: 15670,
      likes: 423,
      url: '#',
    },
    {
      id: 'mock-sports-2',
      title: 'Olympic Preparations Intensify as Games Approach',
      excerpt: 'Athletes from around the world make final preparations as the upcoming Olympic Games promise to deliver exceptional competition...',
      content: 'With just months remaining before the Olympic Games, athletes are putting finishing touches on their training...',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop&q=80',
      category: 'Sports',
      author: 'Olympic Correspondent',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      featured: false,
      slug: 'olympic-preparations-intensify',
      tags: ['sports', 'olympics', 'international'],
      views: 11234,
      likes: 356,
      url: '#',
    },
    {
      id: 'mock-sports-3',
      title: 'Transfer Window Brings Major League Shake-ups',
      excerpt: 'High-profile player movements reshape team dynamics as clubs prepare for the upcoming season with strategic acquisitions...',
      content: 'The latest transfer window has seen unprecedented activity across major leagues...',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&q=80',
      category: 'Sports',
      author: 'Transfer News Reporter',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      featured: false,
      slug: 'transfer-window-major-league-shakeups',
      tags: ['sports', 'transfers', 'football'],
      views: 8945,
      likes: 267,
      url: '#',
    },
    
    // Technology Articles
    {
      id: 'mock-tech-1',
      title: 'Artificial Intelligence Breakthrough in Medical Diagnosis',
      excerpt: 'Revolutionary AI system demonstrates unprecedented accuracy in early disease detection, potentially transforming healthcare delivery...',
      content: 'Researchers have developed an advanced artificial intelligence system that shows remarkable promise in medical diagnostics...',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80',
      category: 'Technology',
      author: 'Science & Technology Reporter',
      publishedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      featured: true,
      slug: 'ai-breakthrough-medical-diagnosis',
      tags: ['technology', 'ai', 'healthcare'],
      views: 22150,
      likes: 678,
      url: '#',
    },
    {
      id: 'mock-tech-2',
      title: 'Quantum Computing Milestone Achieved by Research Team',
      excerpt: 'Scientists demonstrate quantum advantage in complex problem-solving, marking significant progress toward practical quantum applications...',
      content: 'A breakthrough in quantum computing has been achieved by an international research collaboration...',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop&q=80',
      category: 'Technology',
      author: 'Quantum Technology Correspondent',
      publishedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'quantum-computing-milestone-achieved',
      tags: ['technology', 'quantum', 'research'],
      views: 14567,
      likes: 445,
      url: '#',
    },
    {
      id: 'mock-tech-3',
      title: 'Sustainable Energy Storage Solution Unveiled',
      excerpt: 'Innovative battery technology promises longer-lasting, environmentally friendly energy storage for renewable power systems...',
      content: 'A new approach to energy storage could revolutionize how we harness and store renewable energy...',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=800&fit=crop&q=80',
      category: 'Technology',
      author: 'Clean Energy Reporter',
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      featured: false,
      slug: 'sustainable-energy-storage-solution',
      tags: ['technology', 'energy', 'sustainability'],
      views: 10234,
      likes: 312,
      url: '#',
    },
    
    // Lifestyle Articles
    {
      id: 'mock-lifestyle-1',
      title: 'Mediterranean Diet Linked to Enhanced Cognitive Function',
      excerpt: 'Long-term study reveals significant benefits of Mediterranean eating patterns on brain health and memory retention...',
      content: 'New research provides compelling evidence for the cognitive benefits of Mediterranean dietary patterns...',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop&q=80',
      category: 'Lifestyle',
      author: 'Health & Wellness Editor',
      publishedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      featured: true,
      slug: 'mediterranean-diet-cognitive-function',
      tags: ['lifestyle', 'health', 'nutrition'],
      views: 16789,
      likes: 523,
      url: '#',
    },
    {
      id: 'mock-lifestyle-2',
      title: 'Sustainable Fashion Trends Reshape Industry Standards',
      excerpt: 'Eco-conscious consumers drive demand for environmentally responsible clothing options, influencing major fashion brands...',
      content: 'The fashion industry is experiencing a significant shift toward sustainability and ethical production...',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop&q=80',
      category: 'Lifestyle',
      author: 'Fashion & Culture Writer',
      publishedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'sustainable-fashion-trends-reshape-industry',
      tags: ['lifestyle', 'fashion', 'sustainability'],
      views: 12456,
      likes: 389,
      url: '#',
    },
    {
      id: 'mock-lifestyle-3',
      title: 'Mental Health Awareness Campaigns Show Positive Impact',
      excerpt: 'Community-based mental health initiatives demonstrate measurable improvements in public awareness and support-seeking behavior...',
      content: 'Recent mental health awareness campaigns have shown encouraging results in reducing stigma...',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80',
      category: 'Lifestyle',
      author: 'Mental Health Advocate',
      publishedAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'mental-health-awareness-positive-impact',
      tags: ['lifestyle', 'mental-health', 'community'],
      views: 9876,
      likes: 445,
      url: '#',
    },
    
    // Additional National/International Articles
    {
      id: 'mock-national-1',
      title: 'Infrastructure Investment Plan Receives Bipartisan Support',
      excerpt: 'Major infrastructure modernization initiative gains cross-party backing, promising significant improvements to transportation networks...',
      content: 'A comprehensive infrastructure investment plan has received unexpected bipartisan support...',
      imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=800&fit=crop&q=80',
      category: 'National',
      author: 'Political Correspondent',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      featured: false,
      slug: 'infrastructure-investment-bipartisan-support',
      tags: ['politics', 'infrastructure', 'national'],
      views: 13567,
      likes: 234,
      url: '#',
    },
    {
      id: 'mock-international-1',
      title: 'International Climate Summit Reaches Historic Agreement',
      excerpt: 'World leaders commit to ambitious carbon reduction targets in landmark environmental accord with binding enforcement mechanisms...',
      content: 'A historic climate agreement has been reached at the international summit...',
      imageUrl: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1200&h=800&fit=crop&q=80',
      category: 'International',
      author: 'Environmental Correspondent',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      featured: false,
      slug: 'climate-summit-historic-agreement',
      tags: ['international', 'climate', 'environment'],
      views: 19234,
      likes: 567,
      url: '#',
    }
  ];
};