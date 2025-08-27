export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  category: Category;
  categoryId: string;
  author: User;
  authorId: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  articles: Article[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  articles: Article[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  published?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: PaginationParams;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AdminSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  articlesPerPage: number;
  featuredArticlesCount: number;
  enableComments: boolean;
  enableNewsletter: boolean;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  updatedAt: Date;
}