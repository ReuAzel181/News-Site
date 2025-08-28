export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: Date;
  views: number;
  slug: string;
  featured: boolean;
  tags?: string[];
  likes?: number;
  url?: string;
}