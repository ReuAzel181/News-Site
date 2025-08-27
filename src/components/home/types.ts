export interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: Date;
  views: number;
  slug: string;
  featured: boolean;
}