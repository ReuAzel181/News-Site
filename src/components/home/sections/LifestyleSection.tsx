'use client';

import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '../types';

interface LifestyleSectionProps {
  articles: Article[];
  onReadMore: (article: Article) => void;
}

export function LifestyleSection({ articles, onReadMore }: LifestyleSectionProps) {
  const lifestyleNews = articles.filter(article => 
    article.category === 'Lifestyle' || article.category === 'Entertainment'
  ).slice(0, 8);

  return (
    <div className="mt-12">
      <div id="lifestyle" className="px-6 py-4 border-b-2 border-blue-600 dark:border-blue-500">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200" style={{color: '#333333'}}>Lifestyle</h2>
      </div>
      <div className="pt-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {lifestyleNews.map((article) => (
            <div key={article.id} className="cursor-pointer" onClick={() => onReadMore(article)}>
              <div className="space-y-3 p-3 bg-white dark:bg-gray-800">
                <div className="relative w-full bg-gray-200 dark:bg-gray-700" style={{aspectRatio: '4/3'}}>
                  <ProgressiveImage
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    quality={95}
                  />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-semibold line-clamp-2 leading-relaxed" style={{color: '#333333'}}>
                    {article.title}
                  </h3>
                  <div className="text-xs text-gray-500/80 dark:text-gray-400/80">
                    {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}