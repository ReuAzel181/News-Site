'use client';

import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '../types';

interface BreakingNewsSectionProps {
  articles: Article[];
  onReadMore?: (article: Article) => void;
}

export function BreakingNewsSection({ articles, onReadMore }: BreakingNewsSectionProps) {
  // Get featured articles first, then fill with recent articles from priority categories
  const featuredArticles = articles.filter(article => article.featured);
  const priorityCategories = ['Politics', 'National Security', 'National', 'International', 'Legal'];
  const priorityArticles = articles.filter(article => 
    !article.featured && priorityCategories.includes(article.category)
  );
  const otherArticles = articles.filter(article => 
    !article.featured && !priorityCategories.includes(article.category)
  );
  
  const breakingNews = [...featuredArticles, ...priorityArticles, ...otherArticles]
    .filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    )
    .slice(0, 4);
  const mainArticle = breakingNews[0];
  const sideArticles = breakingNews.slice(1, 4);

  return (
    <section className="mt-12 mb-16">
      <div className="max-w-7xl mx-auto">
        <div id="breaking-news" className="py-4 border-b-2 border-deep-blue dark:border-deep-blue">
        <div className="flex items-center mb-3">
          <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
          <h2 className="text-xl font-black uppercase tracking-wide text-left" style={{color: '#000057'}}>Breaking News</h2>
        </div>
      </div>
        <div className="pt-8 px-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[650px] overflow-hidden">
            {/* Left Column - Main Article */}
            {mainArticle && (
              <div className="lg:col-span-2 cursor-pointer h-[600px]" onClick={() => onReadMore?.(mainArticle)}>
                <div className="h-full flex flex-col" style={{backgroundColor: 'var(--card)'}}>
                  <div className="relative w-full" style={{height: '350px'}}>
                    <ProgressiveImage
                      src={mainArticle.imageUrl}
                      alt={mainArticle.title}
                      width={800}
                      height={350}
                      className="w-full h-full"
                      priority
                      quality={95}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                     <div className="space-y-4 flex-1">
                       <div className="flex items-center justify-between">
                         <span className="inline-block px-4 py-2 text-sm font-semibold bg-red-600 text-white">
                           {mainArticle.category}
                         </span>
                         <div className="flex items-center space-x-2 text-sm">
                           <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                             {mainArticle.author.split(' ').map(n => n[0]).join('')}
                           </div>
                           <span className="font-medium text-gray-700 dark:text-gray-300">{mainArticle.author}</span>
                         </div>
                       </div>
                       <h3 className="text-2xl font-bold line-clamp-3 leading-tight" style={{color: '#333333'}}>
                         {mainArticle.title}
                       </h3>
                       <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-base leading-relaxed">
                         {mainArticle.excerpt}
                       </p>
                     </div>
                     <div className="mt-4 pt-4">
                       <span className="text-sm text-gray-500 dark:text-gray-400">{formatDistanceToNow(mainArticle.publishedAt, { addSuffix: true })}</span>
                     </div>
                   </div>
                </div>
              </div>
            )}
            
            {/* Right Section - Full Height */}
            <div className="h-[600px] flex flex-col">
              {/* All Cards - Full Height Distribution */}
              <div className="flex-1 flex flex-col">
                {sideArticles.map((article) => (
                  <div key={article.id} className="cursor-pointer flex-1" onClick={() => onReadMore?.(article)}>
                    <div 
                      className="p-4 h-full flex space-x-4"
                      style={{
                        backgroundColor: 'var(--card)'
                      }}
                    >
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <ProgressiveImage
                          src={article.imageUrl}
                          alt={article.title}
                          width={96}
                          height={96}
                          className="w-full h-full"
                          quality={95}
                        />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                         <div className="space-y-2 flex-1">
                           <div className="flex items-center justify-between">
                             <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-600 text-white">
                               {article.category}
                             </span>
                             <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{article.author}</span>
                           </div>
                           <h4 className="text-sm font-semibold line-clamp-2 leading-tight" style={{color: '#333333'}}>
                             {article.title}
                           </h4>
                           <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-tight">
                             {article.excerpt}
                           </p>
                         </div>
                         <div className="mt-2 pt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}