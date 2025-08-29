'use client';

import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '../types';

interface BusinessSectionProps {
  articles: Article[];
  onReadMore?: (article: Article) => void;
}

export function BusinessSection({ articles, onReadMore }: BusinessSectionProps) {
  console.log('BusinessSection received articles:', articles.length);
  console.log('Business articles before filtering:', articles.filter(a => a.category === 'Business' || a.category === 'Finance'));
  
  const businessNews = articles
    .filter(article => 
      article.category === 'Business' || article.category === 'Finance'
    )
    .filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    )
    .slice(0, 6);
    
  console.log('BusinessSection filtered articles:', businessNews.length, businessNews);

  return (
    <div className="mt-12">
      <div id="business" className="py-4 border-b-2 border-deep-blue dark:border-deep-blue">
        <div className="flex items-center mb-3">
          <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
          <h2 className="text-xl font-black uppercase tracking-wide text-left" style={{color: '#000057'}}>Business & Finance</h2>
        </div>
      </div>
      <div className="pt-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-0">
          {businessNews.map((article, index) => (
            <div key={article.id} className="cursor-pointer relative" onClick={() => onReadMore?.(article)}>
              <div className="space-y-3 p-6" style={{backgroundColor: 'var(--card)'}}>
                {/* Removed all borders and dividers for flat design */}
                <div className="relative w-full" style={{aspectRatio: '4/3'}}>
                  <ProgressiveImage
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-full"
                    quality={95}
                  />
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-600 text-white">
                    {article.category}
                  </span>
                  <h3 className="text-sm font-semibold line-clamp-2 leading-relaxed" style={{color: '#333333'}}>
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
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