import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Article } from '@/types';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('Article')
        .select(`
          id,
          title,
          content,
          excerpt,
          slug,
          featuredImage,
          published,
          publishedAt,
          views,
          createdAt,
          updatedAt,
          authorId,
          categoryId,
          Category ( name, slug ),
          User ( name ),
          ArticleTag (
            Tag ( name, slug )
          )
        `)
        .eq('published', true)
        .order('publishedAt', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        const formatted = data.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          imageUrl: article.featuredImage || '',
          publishedAt: new Date(article.publishedAt),
          category: article.Category?.name || 'Uncategorized',
          author: article.User?.name || 'Staff Writer',
          tags: article.ArticleTag?.map((t: any) => t.Tag.name) || [],
          views: article.views || 0,
          slug: article.slug || '',
          featured: false
        }));
        setArticles(formatted);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  return { articles, loading };
}