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
// Global counter to ensure unique IDs
let articleIdCounter = 0;

// Function to generate a hash from string for more unique IDs
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Function to validate if an image URL is valid and accessible
const isValidImageUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check if it has image file extension or is from known image services
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const imageServices = /(unsplash\.com|images\.|img\.|photo\.|picture\.|cdn\.|static\.)/i;
  
  return imageExtensions.test(url) || imageServices.test(url);
};

const convertRSSToArticle = (item: RSSItem, index: number, source?: string): Article | null => {
  const category = categorizeArticle(item.title, item.description, source);
  
  // Try to get image from multiple sources
  let imageUrl = item.thumbnail || item.enclosure?.link;
  
  // If no valid image found, use high-quality placeholder
  if (!imageUrl || !isValidImageUrl(imageUrl)) {
    imageUrl = getPlaceholderImage(category);
  }
  
  // Ensure we always have a valid image
  if (!isValidImageUrl(imageUrl)) {
    return null; // Skip articles without valid images
  }
  
  // Extract author from description or use source
  const author = item.author || 'News Staff';
  
  // Clean description and create enhanced excerpt
  const cleanDescription = item.description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .trim();
  
  // Create more detailed excerpt with context
  const excerpt = cleanDescription.length > 200 
    ? cleanDescription.substring(0, 200) + '...' 
    : cleanDescription;

  // Generate unique ID using multiple factors
  const titleHash = simpleHash(item.title);
  const urlHash = simpleHash(item.link || '');
  const uniqueId = `${source || 'rss'}-${titleHash}-${urlHash}-${++articleIdCounter}`;

  return {
    id: uniqueId,
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
    const apiUrl = `${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(rssUrl)}&api_key=no&count=20`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NewsApp/1.0'
      }
    });
    
    if (!response.ok) {
      if (response.status === 422) {
        console.warn(`RSS feed ${source} returned 422 - possibly invalid or blocked. Using fallback.`);
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: RSSResponse = await response.json();
    
    if (data.status !== 'ok') {
      console.warn(`RSS feed ${source} parsing failed:`, data);
      return [];
    }
    
    if (!data.items || data.items.length === 0) {
      console.warn(`No items found in RSS feed ${source}`);
      return [];
    }
    
    return data.items.slice(0, 20).map((item, index) => convertRSSToArticle(item, index, source)).filter((article): article is Article => article !== null);
  } catch (error) {
    console.error(`Error fetching RSS news from ${source}:`, error);
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
    
    // Fetch articles from each source with a small delay to avoid rate limiting
    const promises = prioritySources.map((source, sourceIndex) => 
      new Promise<Article[]>(resolve => {
        setTimeout(async () => {
          try {
            const articles = await fetchNewsFromRSS(source);
            resolve(articles.slice(0, 6)); // Take 6 articles from each source
          } catch (error) {
            console.warn(`Failed to fetch from ${source}:`, error);
            resolve([]);
          }
        }, sourceIndex * 200); // 200ms delay between requests
      })
    );
    
    const results = await Promise.all(promises);
    const articles: Article[] = [];
    
    results.forEach(sourceArticles => {
      const validArticles = sourceArticles.filter((article): article is Article => article !== null);
      articles.push(...validArticles);
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
    
    // Remove duplicates based on title and URL, then shuffle and return
    const uniqueArticles = articles.filter((article, index, self) => 
      index === self.findIndex(a => a.title === article.title || a.url === article.url)
    );
    
    return uniqueArticles.sort(() => Math.random() - 0.5).slice(0, 30);
  } catch (error) {
    console.error('Error fetching mixed news:', error);
    return getMockNewsData();
  }
};

// Comprehensive fallback mock data if RSS fails
export const getMockNewsData = (): Article[] => {
  console.log('getMockNewsData function called');
  const mockData = [
    // Business Articles
    {
      id: 'mock-business-1',
      title: 'Global Markets Rally as Central Banks Signal Policy Shifts',
      excerpt: 'Major stock indices surge following coordinated statements from Federal Reserve and European Central Bank regarding interest rate adjustments. The Dow Jones gained 2.3% while the S&P 500 reached new highs as investors anticipate more accommodative monetary policies. Market analysts suggest this could mark the beginning of a sustained bull run driven by improved economic outlook and corporate earnings growth.',
      content: 'Financial markets experienced significant gains today as investors responded positively to coordinated policy signals from major central banks. The Federal Reserve indicated a potential pause in rate hikes, while the European Central Bank suggested similar measures to support economic growth. This coordinated approach has boosted investor confidence across global markets, with technology and financial sectors leading the rally. Economic indicators show strengthening consumer spending and business investment, supporting the case for continued market optimism.',
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
      excerpt: 'Leading technology companies exceed analyst expectations with strong revenue growth driven by cloud services and AI investments. Microsoft reported 15% year-over-year growth, while Google\'s parent company Alphabet saw 12% increase in advertising revenue. Amazon\'s AWS division continues to dominate cloud infrastructure with 32% market share, contributing significantly to overall profitability.',
      content: 'The latest earnings season has delivered impressive results for major technology corporations, with cloud computing and artificial intelligence driving unprecedented growth. Microsoft\'s Azure platform grew 29% year-over-year, while its productivity suite benefited from hybrid work trends. Google\'s search advertising revenue rebounded strongly, and YouTube\'s creator economy generated $8.1 billion in revenue. These results demonstrate the resilience of tech companies and their ability to adapt to changing market conditions while investing heavily in future technologies.',
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
      excerpt: 'Traditional financial institutions increase digital asset allocations as regulatory clarity improves across major economies. BlackRock\'s Bitcoin ETF attracted $2.1 billion in assets under management within its first month, while JPMorgan Chase announced plans to offer crypto custody services to institutional clients. The SEC\'s recent approval of spot Bitcoin ETFs has opened the floodgates for mainstream adoption.',
      content: 'The cryptocurrency landscape continues to evolve with increased institutional participation, marking a significant shift from retail-dominated trading to professional investment strategies. Major pension funds and endowments are now allocating 1-5% of their portfolios to digital assets, citing diversification benefits and inflation hedging properties. Regulatory frameworks in the US and Europe have provided much-needed clarity, enabling traditional financial institutions to offer crypto services without regulatory uncertainty.',
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
    {
      id: 'mock-business-4',
      title: 'Renewable Energy Sector Attracts Record Investment',
      excerpt: 'Clean energy companies secure unprecedented funding as investors pivot toward sustainable technologies and carbon-neutral solutions. Solar and wind projects received $394 billion in global investment this year, representing a 17% increase from 2023. Government incentives and corporate sustainability commitments are driving this massive capital influx into green energy infrastructure.',
      content: 'The renewable energy sector has witnessed a remarkable surge in investment activity this quarter, with venture capital firms and institutional investors recognizing the long-term potential of clean technologies. Battery storage solutions have become particularly attractive, with companies like Tesla and BYD expanding manufacturing capacity to meet growing demand. The International Energy Agency projects that renewable energy will account for 85% of new power generation capacity by 2030, making this sector a cornerstone of future economic growth.',
      imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop&q=80',
      category: 'Business',
      author: 'Energy Markets Analyst',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      featured: false,
      slug: 'renewable-energy-record-investment',
      tags: ['business', 'energy', 'investment'],
      views: 11567,
      likes: 345,
      url: '#',
    },
    {
      id: 'mock-business-5',
      title: 'E-commerce Giants Expand Into Healthcare Services',
      excerpt: 'Major online retailers diversify business models by entering healthcare market with telemedicine and pharmaceutical delivery services...',
      content: 'Leading e-commerce platforms are making strategic moves into the healthcare sector...',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop&q=80',
      category: 'Business',
      author: 'Healthcare Business Reporter',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      featured: false,
      slug: 'ecommerce-giants-healthcare-expansion',
      tags: ['business', 'healthcare', 'ecommerce'],
      views: 9234,
      likes: 278,
      url: '#',
    },
    {
      id: 'mock-business-6',
      title: 'Supply Chain Innovations Reduce Global Shipping Costs',
      excerpt: 'Advanced logistics technologies and strategic partnerships enable companies to cut transportation expenses while improving delivery times...',
      content: 'Revolutionary supply chain management systems are transforming global commerce...',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop&q=80',
      category: 'Business',
      author: 'Supply Chain Correspondent',
      publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
      featured: false,
      slug: 'supply-chain-innovations-shipping-costs',
      tags: ['business', 'logistics', 'technology'],
      views: 7890,
      likes: 189,
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
      excerpt: 'Athletes from around the world make final preparations as the upcoming Olympic Games promise to deliver exceptional competition. Team USA has announced its strongest swimming roster in decades, while track and field events are expected to see multiple world records broken. The host city has completed 95% of venue construction, with state-of-the-art facilities ready to welcome 10,000+ athletes from 206 nations.',
      content: 'With just months remaining before the Olympic Games, athletes are putting finishing touches on their training regimens while dealing with unprecedented global challenges. The International Olympic Committee has implemented enhanced safety protocols and sustainability measures, making these Games the most environmentally conscious in history. Notable storylines include the return of several veteran champions seeking to defend their titles, alongside emerging talents who could reshape their respective sports for years to come.',
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
      excerpt: 'High-profile player movements reshape team dynamics as clubs prepare for the upcoming season with strategic acquisitions. Manchester City secured a €120 million deal for a world-class midfielder, while Barcelona completed three major signings to strengthen their Champions League campaign. The Premier League alone saw over €2 billion in transfer activity, setting new spending records.',
      content: 'The latest transfer window has seen unprecedented activity across major leagues, with clubs investing heavily in talent acquisition despite economic uncertainties. Financial Fair Play regulations have forced teams to be more strategic in their approach, leading to innovative deal structures including player swaps and performance-based payments. Several surprise moves have caught fans off guard, including veteran players seeking new challenges and young prospects commanding record fees.',
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
    {
      id: 'mock-sports-4',
      title: 'Tennis Grand Slam Delivers Thrilling Upsets',
      excerpt: 'Unseeded players advance to later rounds in stunning fashion, creating one of the most unpredictable tournaments in recent memory...',
      content: 'This year\'s tennis grand slam has been marked by extraordinary upsets and breakthrough performances...',
      imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&h=800&fit=crop&q=80',
      category: 'Sports',
      author: 'Tennis Correspondent',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      featured: false,
      slug: 'tennis-grand-slam-thrilling-upsets',
      tags: ['sports', 'tennis', 'tournament'],
      views: 13456,
      likes: 398,
      url: '#',
    },
    {
      id: 'mock-sports-5',
      title: 'Basketball League Implements New Technology Rules',
      excerpt: 'Advanced analytics and instant replay systems enhance game officiating while maintaining the sport\'s traditional flow and excitement...',
      content: 'Professional basketball has embraced cutting-edge technology to improve game accuracy...',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=800&fit=crop&q=80',
      category: 'Sports',
      author: 'Basketball Technology Reporter',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      featured: false,
      slug: 'basketball-league-technology-rules',
      tags: ['sports', 'basketball', 'technology'],
      views: 10789,
      likes: 267,
      url: '#',
    },
    {
      id: 'mock-sports-6',
      title: 'Youth Sports Programs See Record Participation',
      excerpt: 'Community athletic initiatives experience unprecedented enrollment as families prioritize physical activity and team building...',
      content: 'Local sports programs are witnessing remarkable growth in youth participation across all age groups...',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&q=80',
      category: 'Sports',
      author: 'Youth Sports Advocate',
      publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      featured: false,
      slug: 'youth-sports-record-participation',
      tags: ['sports', 'youth', 'community'],
      views: 8234,
      likes: 445,
      url: '#',
    },
    
    // Technology Articles
    {
      id: 'mock-tech-1',
      title: 'Artificial Intelligence Breakthrough in Medical Diagnosis',
      excerpt: 'Revolutionary AI system demonstrates unprecedented accuracy in early disease detection, potentially transforming healthcare delivery. The system achieved 97.3% accuracy in detecting early-stage cancers, outperforming traditional screening methods by 23%. Clinical trials across 15 hospitals showed the AI reduced diagnostic time from weeks to hours while maintaining superior precision in identifying complex medical conditions.',
      content: 'Researchers have developed an advanced artificial intelligence system that shows remarkable promise in medical diagnostics, utilizing deep learning algorithms trained on over 2 million medical images and patient records. The breakthrough technology can identify subtle patterns invisible to human analysis, enabling earlier intervention and improved patient outcomes. Major healthcare systems are already implementing pilot programs, with the FDA fast-tracking approval for widespread clinical use.',
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
      excerpt: 'Scientists demonstrate quantum advantage in complex problem-solving, marking significant progress toward practical quantum applications. The 1000-qubit quantum processor solved optimization problems 10,000 times faster than classical supercomputers. IBM, Google, and academic institutions collaborated on this breakthrough, bringing quantum computing closer to solving real-world challenges in drug discovery, financial modeling, and climate simulation.',
      content: 'A breakthrough in quantum computing has been achieved by an international research collaboration, successfully demonstrating quantum supremacy in practical applications beyond theoretical calculations. The achievement represents a critical milestone in the race to develop fault-tolerant quantum computers capable of solving problems that are intractable for classical computers. Industry experts predict this advancement will accelerate quantum computing adoption across multiple sectors within the next five years.',
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
      excerpt: 'Innovative battery technology promises longer-lasting, environmentally friendly energy storage for renewable power systems. The breakthrough solid-state batteries offer 300% longer lifespan and 50% faster charging compared to lithium-ion alternatives. Major automakers and grid operators are investing $2.5 billion in scaling production, targeting commercial deployment by 2026.',
      content: 'A new approach to energy storage could revolutionize how we harness and store renewable energy, utilizing advanced materials science to create batteries that are both more efficient and environmentally sustainable. The technology eliminates toxic heavy metals while dramatically improving energy density and safety profiles. Industry analysts predict this innovation will accelerate the global transition to renewable energy by making grid-scale storage economically viable.',
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
    {
      id: 'mock-tech-4',
      title: 'Cybersecurity Advances Combat Rising Digital Threats',
      excerpt: 'Next-generation security protocols and AI-powered threat detection systems provide enhanced protection against sophisticated cyber attacks. Zero-trust architecture implementations have reduced successful breaches by 78% across enterprise networks. Machine learning algorithms now identify and neutralize threats 15 times faster than traditional signature-based systems, adapting to new attack vectors in real-time.',
      content: 'The cybersecurity landscape continues to evolve with innovative defense mechanisms that leverage artificial intelligence and behavioral analysis to stay ahead of increasingly sophisticated threat actors. Organizations are implementing comprehensive security frameworks that assume no implicit trust and verify every transaction. Government agencies and private sector leaders are collaborating on new standards that will define cybersecurity best practices for the next decade.',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop&q=80',
      category: 'Technology',
      author: 'Cybersecurity Specialist',
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
      featured: false,
      slug: 'cybersecurity-advances-digital-threats',
      tags: ['technology', 'cybersecurity', 'ai'],
      views: 16789,
      likes: 523,
      url: '#',
    },
    {
      id: 'mock-tech-5',
      title: 'Virtual Reality Transforms Educational Experiences',
      excerpt: 'Immersive VR technology revolutionizes classroom learning with interactive simulations and virtual field trips to historical sites. Students can now explore ancient Rome, conduct virtual chemistry experiments, and practice surgical procedures in risk-free environments. Over 500 schools have reported 40% improvement in student engagement and 25% better retention rates using VR-enhanced curricula.',
      content: 'Educational institutions are embracing virtual reality to create engaging learning environments that transcend traditional classroom limitations, allowing students to experience historical events firsthand and manipulate complex scientific concepts in three-dimensional space. The technology has proven particularly effective in STEM education, where abstract concepts become tangible through immersive visualization. Major educational publishers are investing heavily in VR content development, with the market expected to reach $13 billion by 2025.',
      imageUrl: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=1200&h=800&fit=crop&q=80',
      category: 'Technology',
      author: 'EdTech Innovation Reporter',
      publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
      featured: false,
      slug: 'virtual-reality-educational-experiences',
      tags: ['technology', 'vr', 'education'],
      views: 12456,
      likes: 389,
      url: '#',
    },
    {
      id: 'mock-tech-6',
      title: 'Autonomous Vehicles Achieve New Safety Milestones',
      excerpt: 'Self-driving car technology demonstrates improved accident prevention capabilities through advanced sensor fusion and machine learning. Level 4 autonomous vehicles completed 10 million test miles with 90% fewer accidents than human drivers. Major automakers are preparing for commercial deployment in 2025, with regulatory approval processes accelerating across multiple jurisdictions.',
      content: 'The autonomous vehicle industry has reached significant safety benchmarks this quarter, with comprehensive testing data showing dramatic improvements in collision avoidance and traffic flow optimization. Advanced AI systems now process sensor data from cameras, lidar, and radar in real-time, making split-second decisions that consistently outperform human reaction times. Insurance companies are beginning to offer reduced premiums for autonomous vehicle owners, reflecting the technology\'s proven safety advantages.',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&q=80',
      category: 'Technology',
      author: 'Automotive Technology Writer',
      publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000),
      featured: false,
      slug: 'autonomous-vehicles-safety-milestones',
      tags: ['technology', 'automotive', 'ai'],
      views: 14567,
      likes: 445,
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
      excerpt: 'Eco-conscious designers and brands lead transformation toward environmentally responsible clothing production and consumption. Major fashion houses have committed to 50% reduction in carbon emissions by 2030, while circular fashion initiatives have diverted 2.3 million garments from landfills. Consumer demand for transparency has driven 78% of brands to publish detailed sustainability reports.',
      content: 'The fashion industry is experiencing a significant shift toward sustainability and ethical production, with innovative materials like lab-grown leather and recycled ocean plastic becoming mainstream alternatives to traditional textiles. Leading brands are implementing blockchain technology to ensure supply chain transparency and fair labor practices. The movement has created new business models focused on clothing rental, repair services, and upcycling, fundamentally changing how consumers interact with fashion.',
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
      excerpt: 'Community-based mental health initiatives demonstrate measurable improvements in public awareness and support-seeking behavior. Therapy utilization has increased 65% among young adults, while workplace mental health programs have reduced stress-related absences by 40%. Digital mental health platforms report 3.2 million new users seeking professional support through accessible online services.',
      content: 'Recent mental health awareness campaigns have shown encouraging results in reducing stigma and encouraging people to seek professional help when needed, with comprehensive data showing significant improvements in community mental health outcomes. Educational programs in schools and workplaces have created safe spaces for open dialogue about mental wellness. Government funding for mental health services has increased by 180%, reflecting growing recognition of mental health as a critical public health priority.',
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
    {
      id: 'mock-lifestyle-4',
      title: 'Plant-Based Cuisine Gains Mainstream Popularity',
      excerpt: 'Innovative plant-based restaurants and food products attract diverse audiences seeking healthier and more sustainable dining options. The global plant-based food market has grown 45% annually, with major fast-food chains introducing comprehensive vegan menus. Celebrity chefs and Michelin-starred restaurants are pioneering sophisticated plant-based dishes that rival traditional cuisine in taste and presentation.',
      content: 'The plant-based food movement has evolved from niche dietary choice to mainstream culinary trend, driven by environmental consciousness, health benefits, and remarkable innovations in food technology that create meat-like textures and flavors from plants. Investment in alternative protein startups has reached $7.1 billion, funding research into cellular agriculture and precision fermentation. Major food corporations are reformulating products to meet growing consumer demand for sustainable, nutritious plant-based alternatives.',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=800&fit=crop&q=80',
      category: 'Lifestyle',
      author: 'Culinary Trends Reporter',
      publishedAt: new Date(Date.now() - 8.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'plant-based-cuisine-mainstream-popularity',
      tags: ['lifestyle', 'food', 'sustainability'],
      views: 11234,
      likes: 356,
      url: '#',
    },
    {
      id: 'mock-lifestyle-5',
      title: 'Remote Work Wellness Programs Show Positive Results',
      excerpt: 'Companies implementing comprehensive wellness initiatives for remote employees report improved productivity and job satisfaction. Organizations with structured wellness programs see 32% lower turnover rates and 28% increase in employee engagement scores. Virtual fitness classes, mental health support, and flexible scheduling have become standard benefits in the remote work landscape.',
      content: 'The shift to remote work has prompted innovative approaches to employee wellness and mental health, with companies investing in digital wellness platforms, ergonomic home office setups, and virtual team-building activities that maintain social connections. Data shows that employees with access to comprehensive wellness programs report 40% less burnout and significantly better work-life balance. Forward-thinking organizations are redesigning performance metrics to prioritize employee wellbeing alongside traditional productivity measures.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&q=80',
      category: 'Lifestyle',
      author: 'Workplace Wellness Expert',
      publishedAt: new Date(Date.now() - 10.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'remote-work-wellness-programs-results',
      tags: ['lifestyle', 'wellness', 'work'],
      views: 9876,
      likes: 278,
      url: '#',
    },
    {
      id: 'mock-entertainment-1',
      title: 'Streaming Platforms Invest Heavily in Original Content',
      excerpt: 'Major entertainment companies allocate record budgets to exclusive series and films, intensifying competition for viewer attention...',
      content: 'The streaming wars have reached new heights with unprecedented investment in original programming...',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800&fit=crop&q=80',
      category: 'Entertainment',
      author: 'Entertainment Industry Analyst',
      publishedAt: new Date(Date.now() - 12.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'streaming-platforms-original-content-investment',
      tags: ['entertainment', 'streaming', 'media'],
      views: 15678,
      likes: 467,
      url: '#',
    },
    {
      id: 'mock-entertainment-2',
      title: 'Music Festivals Return with Enhanced Safety Protocols',
      excerpt: 'Live music events resume with innovative health measures and technology integration, bringing communities together safely...',
      content: 'The return of music festivals marks a significant milestone in the entertainment industry recovery...',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&q=80',
      category: 'Entertainment',
      author: 'Music Industry Reporter',
      publishedAt: new Date(Date.now() - 14.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'music-festivals-return-safety-protocols',
      tags: ['entertainment', 'music', 'events'],
      views: 13456,
      likes: 389,
      url: '#',
    },
    {
      id: 'mock-entertainment-3',
      title: 'Gaming Industry Breaks Revenue Records',
      excerpt: 'Video game sales and engagement reach all-time highs as diverse audiences embrace interactive entertainment across all platforms...',
      content: 'The gaming industry continues its remarkable growth trajectory with record-breaking performance...',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop&q=80',
      category: 'Entertainment',
      author: 'Gaming Industry Correspondent',
      publishedAt: new Date(Date.now() - 16.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'gaming-industry-revenue-records',
      tags: ['entertainment', 'gaming', 'technology'],
      views: 18234,
      likes: 567,
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
      id: 'mock-politics-1',
      title: 'Congressional Leaders Reach Bipartisan Healthcare Agreement',
      excerpt: 'Historic healthcare legislation gains cross-party support, promising expanded coverage and reduced costs for millions of Americans...',
      content: 'A landmark bipartisan healthcare agreement has emerged from months of negotiations...',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop&q=80',
      category: 'Politics',
      author: 'Congressional Reporter',
      publishedAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'congressional-bipartisan-healthcare-agreement',
      tags: ['politics', 'healthcare', 'congress'],
      views: 17890,
      likes: 456,
      url: '#',
    },
    {
      id: 'mock-politics-2',
      title: 'Supreme Court Announces Major Constitutional Ruling',
      excerpt: 'Landmark decision on digital privacy rights establishes new precedent for technology regulation and individual freedoms...',
      content: 'The Supreme Court has issued a groundbreaking ruling that will reshape digital privacy law...',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop&q=80',
      category: 'Politics',
      author: 'Supreme Court Correspondent',
      publishedAt: new Date(Date.now() - 7.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'supreme-court-constitutional-ruling',
      tags: ['politics', 'supreme-court', 'privacy'],
      views: 21456,
      likes: 678,
      url: '#',
    },
    {
      id: 'mock-security-1',
      title: 'Cybersecurity Task Force Unveils National Defense Strategy',
      excerpt: 'Comprehensive cybersecurity initiative addresses emerging digital threats with enhanced coordination between agencies and private sector...',
      content: 'A new national cybersecurity strategy has been unveiled to address growing digital threats...',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop&q=80',
      category: 'National Security',
      author: 'National Security Reporter',
      publishedAt: new Date(Date.now() - 9.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'cybersecurity-national-defense-strategy',
      tags: ['security', 'cybersecurity', 'defense'],
      views: 14567,
      likes: 389,
      url: '#',
    },
    {
      id: 'mock-security-2',
      title: 'International Military Exercise Demonstrates Allied Cooperation',
      excerpt: 'Multinational defense training showcases coordinated response capabilities and strengthens strategic partnerships across regions...',
      content: 'A major international military exercise has demonstrated unprecedented levels of allied cooperation...',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=800&fit=crop&q=80',
      category: 'National Security',
      author: 'Defense Correspondent',
      publishedAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000),
      featured: false,
      slug: 'international-military-exercise-cooperation',
      tags: ['security', 'military', 'international'],
      views: 12345,
      likes: 267,
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
    },
    // Additional Breaking News Articles
    {
      id: 'mock-breaking-1',
      title: 'President Announces Major Infrastructure Investment Plan',
      excerpt: 'Comprehensive infrastructure package includes transportation, digital connectivity, and renewable energy projects nationwide...',
      content: 'The President unveiled a sweeping infrastructure investment plan that promises to modernize the nation\'s critical systems...',
      imageUrl: 'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=1200&h=800&fit=crop&q=80',
      category: 'Politics',
      author: 'Political Correspondent',
      publishedAt: new Date(Date.now() - 30 * 60 * 1000),
      featured: true,
      slug: 'president-infrastructure-investment-plan',
      tags: ['politics', 'infrastructure', 'economy'],
      views: 45678,
      likes: 1234,
      url: '#',
    },
    {
      id: 'mock-breaking-2',
      title: 'Emergency Session Called as Economic Indicators Show Volatility',
      excerpt: 'Congressional leaders convene urgent meeting to address market fluctuations and implement stabilization measures...',
      content: 'An emergency congressional session has been called to address recent economic volatility...',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop&q=80',
      category: 'Politics',
      author: 'Economic Reporter',
      publishedAt: new Date(Date.now() - 45 * 60 * 1000),
      featured: true,
      slug: 'emergency-session-economic-indicators',
      tags: ['politics', 'economy', 'congress'],
      views: 38901,
      likes: 987,
      url: '#',
    },
    {
      id: 'mock-breaking-3',
      title: 'Major Trade Agreement Signed with Regional Partners',
      excerpt: 'Historic trade deal strengthens economic ties and creates new opportunities for businesses across multiple sectors...',
      content: 'A landmark trade agreement has been signed with key regional partners...',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&q=80',
      category: 'International',
      author: 'Trade Correspondent',
      publishedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      featured: true,
      slug: 'major-trade-agreement-regional-partners',
      tags: ['international', 'trade', 'economy'],
      views: 29456,
      likes: 756,
      url: '#',
    },
    {
      id: 'mock-breaking-4',
      title: 'Supreme Court Delivers Landmark Constitutional Ruling',
      excerpt: 'High court decision sets new precedent for digital privacy rights and government surveillance powers...',
      content: 'The Supreme Court has issued a groundbreaking ruling on constitutional privacy rights...',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop&q=80',
      category: 'Legal',
      author: 'Legal Affairs Reporter',
      publishedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      featured: true,
      slug: 'supreme-court-constitutional-ruling-privacy',
      tags: ['legal', 'supreme-court', 'privacy'],
      views: 52341,
      likes: 1456,
      url: '#',
    },
    {
      id: 'mock-breaking-5',
      title: 'National Security Alert: Cyber Defense Systems Upgraded',
      excerpt: 'Government announces enhanced cybersecurity measures following recent threats to critical infrastructure...',
      content: 'National security agencies have implemented upgraded cyber defense systems...',
      imageUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&h=800&fit=crop&q=80',
      category: 'National Security',
      author: 'Security Correspondent',
      publishedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      featured: true,
      slug: 'national-security-cyber-defense-upgrade',
      tags: ['security', 'cybersecurity', 'infrastructure'],
      views: 41789,
      likes: 1123,
      url: '#',
    },
    {
      id: 'mock-breaking-6',
      title: 'Emergency Relief Package Approved for Disaster-Affected Areas',
      excerpt: 'Bipartisan legislation provides immediate assistance and long-term recovery support for communities impacted by natural disasters...',
      content: 'Congress has approved a comprehensive emergency relief package...',
      imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=800&fit=crop&q=80',
      category: 'National',
      author: 'Disaster Relief Reporter',
      publishedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
      featured: true,
      slug: 'emergency-relief-package-disaster-areas',
      tags: ['national', 'disaster-relief', 'congress'],
      views: 35672,
      likes: 892,
      url: '#',
    }
  ];
  
  console.log('Mock data created, length:', mockData.length);
  return mockData;
};