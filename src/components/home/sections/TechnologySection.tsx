'use client';

import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '../types';

interface TechnologySectionProps {
  articles: Article[];
}

export function TechnologySection({ articles }: TechnologySectionProps) {
  const techNews = articles.filter(article => article.category === 'Technology').slice(0, 6);

  return (
    <div className="mt-12">
      <div id="technology" className="px-6 py-4 border-b-2 border-blue-600 dark:border-blue-500">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200" style={{color: '#333333'}}>Technology</h2>
      </div>
      <div className="pt-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techNews.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="space-y-3">
                <div className="relative w-full bg-gray-200/50 dark:bg-gray-700/50 overflow-hidden" style={{aspectRatio: '4/3'}}>
                  <ProgressiveImage
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
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