'use client';

import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '../types';
import { useSession } from 'next-auth/react';

interface TechnologySectionProps {
  articles: Article[];
  onReadMore: (article: Article) => void;
  onEdit?: (article: Article) => void;
}

export function TechnologySection({ articles, onReadMore, onEdit }: TechnologySectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && (session.user as any).role === 'ADMIN';
  const techNews = articles
    .filter(article => article.category === 'Technology')
    .filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    )
    .slice(0, 6);

  return (
    <div className="mt-12">
      <div id="technology" className="py-4">
        <div className="flex items-center mb-3">
          <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
          <h2 className="text-xl font-black uppercase tracking-wide text-left text-deep-blue news-title">Technology</h2>
        </div>
      </div>
      <div className="pt-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-0 items-stretch">
          {techNews.map((article) => (
            <div key={article.id} className="cursor-pointer h-full" onClick={() => onReadMore?.(article)}>
              {isAdmin && onEdit && (
                <div className="w-full flex justify-end mb-2">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs font-semibold bg-black text-white"
                    onClick={(e) => { e.stopPropagation(); onEdit(article); }}
                    aria-label={`Edit ${article.title}`}
                  >
                    Edit
                  </button>
                </div>
              )}
              <div className="space-y-3 p-6 h-full flex flex-col" style={{backgroundColor: 'var(--card)'}}>
                {/* Removed all borders and dividers for flat design */}
                <div className="relative w-full" style={{aspectRatio: '4/3'}}>
                  <ProgressiveImage
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-full"
                    quality={95}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-2 flex-1 flex flex-col">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-600 text-white">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-semibold line-clamp-2 news-title">
                    {article.title}
                  </h3>
                  <p className="text-xs line-clamp-2 news-content">
                    {article.excerpt}
                  </p>
                  <div className="text-xs news-meta mt-auto">
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