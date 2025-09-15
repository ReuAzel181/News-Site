import { toast } from 'react-hot-toast';

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string; // Keep for backward compatibility
  featuredImage?: string; // New field for Supabase
  category: string;
  author: string;
  publishedAt: Date;
  featured: boolean;
  breaking: boolean;
  slug: string;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string; // Keep for backward compatibility
  featuredImage?: string; // New field for Supabase
  category?: string;
  author?: string;
  featured?: boolean;
  breaking?: boolean;
  slug?: string;
}

class ArticleActionsService {
  private baseUrl = '/api/articles';

  async updateArticle(id: number, data: UpdateArticleData): Promise<Article> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update article');
      }

      const updatedArticle = await response.json();
      toast.success('Article updated successfully!');
      return updatedArticle;
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update article');
      throw error;
    }
  }

  async deleteArticle(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete article');
      }

      toast.success('Article deleted successfully!');
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete article');
      throw error;
    }
  }

  async createArticle(data: Omit<Article, 'id' | 'publishedAt'>): Promise<Article> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create article');
      }

      const newArticle = await response.json();
      toast.success('Article created successfully!');
      return newArticle;
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create article');
      throw error;
    }
  }

  async getArticles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }): Promise<{ articles: Article[]; total: number; pages: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.category) searchParams.set('category', params.category);
      if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString());

      const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch articles');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch articles');
      throw error;
    }
  }
}

export const articleActions = new ArticleActionsService();
export default articleActions;