import 'server-only';
import fs from 'fs';
import path from 'path';

export type ArticleOverride = Partial<{
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  tags: string[];
}>;

// New: Hero slide type for editable hero section
export interface HeroSlide {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: string | Date;
  views: number;
  slug: string;
  source?: string;
}

export interface ContentData {
  breakingNews: string[];
  availableTags: string[];
  articleOverrides: Record<string, ArticleOverride>;
  heroSlides: HeroSlide[];
}

const DEFAULT_CONTENT: ContentData = {
  breakingNews: [
    'Supreme Court declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
    'President Marcos addresses the nation on economic recovery plans',
    'Iglesia ni Cristo holds National Rally for Peace with 1.5 million attendees',
    'OFW remittances reach all-time high this quarter',
    'Renewable energy projects accelerate nationwide development',
    'Filipino scientists develop breakthrough cancer treatment',
    'Gilas Pilipinas prepares for FIBA World Cup qualifiers'
  ],
  availableTags: [
    'Politics',
    'National',
    'International',
    'National Security',
    'Legal',
    'Business',
    'Technology',
    'Sports',
    'Lifestyle',
    'Environment',
    'Science',
    'Finance',
    'Entertainment',
    'Health'
  ],
  articleOverrides: {},
  // Keep empty by default; HeroSection will fall back to its built-in defaults if empty
  heroSlides: []
};

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf8');
  }
}

export function readContent(): ContentData {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(CONTENT_FILE, 'utf8');
    const parsed = JSON.parse(raw) as ContentData;
    return {
      breakingNews: Array.isArray(parsed.breakingNews) ? parsed.breakingNews : DEFAULT_CONTENT.breakingNews,
      availableTags: Array.isArray(parsed.availableTags) ? parsed.availableTags : DEFAULT_CONTENT.availableTags,
      articleOverrides: parsed.articleOverrides || {},
      heroSlides: Array.isArray((parsed as any).heroSlides) ? (parsed as any).heroSlides : []
    };
  } catch (e) {
    console.error('Failed to read content store, using defaults:', e);
    return DEFAULT_CONTENT;
  }
}

export function writeContent(updater: (current: ContentData) => ContentData): ContentData {
  const current = readContent();
  const next = updater(current);
  ensureDataFile();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

export function updateArticleOverride(articleId: string, patch: ArticleOverride): ContentData {
  return writeContent((current) => {
    const prev = current.articleOverrides[articleId] || {};
    const merged: ArticleOverride = { ...prev, ...patch };
    return {
      ...current,
      articleOverrides: { ...current.articleOverrides, [articleId]: merged }
    };
  });
}

export function updateBreakingNews(nextItems: string[]): ContentData {
  return writeContent((current) => ({ ...current, breakingNews: nextItems }));
}

export function setAvailableTags(tags: string[]): ContentData {
  return writeContent((current) => ({ ...current, availableTags: tags }));
}

// New: set hero slides
export function setHeroSlides(slides: HeroSlide[]): ContentData {
  return writeContent((current) => ({ ...current, heroSlides: slides }));
}