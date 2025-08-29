'use client';

import Image from 'next/image';
import { Clock, User, Eye, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Modal } from './Modal';
import { cn } from '@/utils/cn';

interface Article {
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
}

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

const categoryColors = {
  Technology: 'bg-blue-500',
  Environment: 'bg-green-500',
  Business: 'bg-purple-500',
  Politics: 'bg-red-500',
  Sports: 'bg-orange-500',
  Entertainment: 'bg-pink-500'
};

// Extended content for articles
const articleContent: Record<string, string> = {
  'philippines-record-renewable-energy-2024': `
    <p>The Philippines has achieved a remarkable milestone in its renewable energy sector, with the Department of Energy (DOE) reporting a record-breaking 794.34 MW of renewable energy capacity installed in 2024. This achievement surpasses the combined total of 759.82 MW installed from 2021 to 2023, marking a significant acceleration in the country's clean energy transition.</p>
    
    <h3>Government Policies Drive Growth</h3>
    <p>The unprecedented growth is attributed to favorable government policies that have spurred private sector investment and equipment installation. The decline in costs for technologies like solar power has made renewable energy more competitive, narrowing the price gap with conventional power sources.</p>
    
    <p>To further increase the share of renewable energy in power generation, the government raised the Renewable Portfolio Standard (RPS) requirement in 2023. The new standard mandates that electricity suppliers must include a higher proportion of renewable energy in their supply mix, increasing from 1% annually to 2.52%.</p>
    
    <h3>Foreign Investment Boost</h3>
    <p>Additionally, the government has allowed 100% foreign ownership of renewable energy projects, which has contributed significantly to the success of these policies. The net-metering program has also added 141 MW of renewable energy over the past decade.</p>
    
    <h3>Future Outlook</h3>
    <p>The Philippines has set ambitious renewable energy goals of achieving 35% of total power generation by 2035, and 50% by 2040. With these new milestones in installed capacity, further investments are expected to follow, positioning the country as a leader in Southeast Asia's clean energy transition.</p>
  `,
  'masdar-philippines-renewable-energy-deal': `
    <p>The UAE-based renewable energy company Masdar has officially entered the Philippines' renewable energy market through a landmark implementation agreement with the Department of Energy. Under this transformative deal, Masdar will develop 1 GW of solar, wind, and battery energy storage systems (BESS) across the archipelago by 2030.</p>
    
    <h3>Strategic Partnership</h3>
    <p>This agreement operationalizes a memorandum of understanding (MoU) on energy transition cooperation signed in November 2024 between the Philippines and the United Arab Emirates, which identified renewable energy as a key area of collaboration between the two nations.</p>
    
    <p>The partnership directly supports the Philippines Energy Transition Program, which aims to achieve 35% renewable energy in power generation by 2030 and an ambitious 50% by 2040. This aligns with the country's commitment to reducing greenhouse gas emissions and transitioning away from fossil fuel dependence.</p>
    
    <h3>Masdar's Global Expansion</h3>
    <p>Simultaneously with this Philippine venture, Masdar announced that its operational, under construction, and advanced pipeline renewable capacity grew dramatically from 20 GW to 51 GW between 2022 and the end of 2024. This growth was driven by landmark deals in Spain, Greece, and the United States.</p>
    
    <h3>Impact on Energy Security</h3>
    <p>The company targets 100 GW of renewable capacity by 2030, making this Philippine project a crucial component of their global expansion strategy. For the Philippines, this investment represents a significant step toward energy security and independence from volatile fossil fuel markets.</p>
  `,
  'philippines-solar-wind-power-goals-2030': `
    <p>The Philippines has unveiled ambitious renewable energy targets that could transform it into one of Southeast Asia's cleanest energy grids. According to government presentations at the Renewable Energy Markets Asia conference, the country aims to dramatically increase solar power share to 5.6% and wind power share to 11.7% by 2030.</p>
    
    <h3>Current Energy Landscape</h3>
    <p>These targets represent substantial growth from current levels of 2.4% for solar and 3.1% for wind power in 2024. Mylene Capongcol, Assistant Secretary at the Philippines Department of Energy, outlined how the country plans to achieve these targets by doubling solar capacity and tripling wind capacity over the next six years.</p>
    
    <p>The increased proportion of solar and wind energy is expected to compensate for decreases in other clean sources. Hydroelectricity's share is projected to decrease from 10% to 9.1%, while geothermal energy is expected to represent 7.7% of overall output by 2030, down from 8.9% in 2024.</p>
    
    <h3>Offshore Wind Focus</h3>
    <p>The Philippines is particularly betting on a rapid build-out of offshore wind farms, despite their high initial costs. This strategy comes as escalating costs amid high inflation have resulted in some developers canceling or postponing projects in the U.S. and Britain.</p>
    
    <h3>Infrastructure and Nuclear Plans</h3>
    <p>To support this renewable energy expansion, the country plans to enhance its transmission infrastructure to accommodate the integration of renewables. Additionally, the government aims to add 1,200 MW of nuclear capacity by 2032.</p>
    
    <p>The department will also launch a long-term program to facilitate the voluntary early decommissioning or repurposing of over 3.8 GW of coal-fired power plants that are over 20 years old, while aiming to reduce coal's share in power generation to 47.6% by 2030, down from the current 60%.</p>
  `
};

export function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  if (!article) return null;

  const content = articleContent[article.slug] || `
    <p>${article.excerpt}</p>
    <p>This is additional content for the article. In a real application, this would be fetched from a content management system or database.</p>
    <p>The article provides comprehensive coverage of the topic, including background information, expert analysis, and future implications for the Philippines' energy sector.</p>
  `;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="relative">
        {/* Hero Image */}
        <div className="relative" style={{aspectRatio: '16/9'}}>
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                'inline-block px-3 py-1 text-xs font-semibold text-white',
                categoryColors[article.category as keyof typeof categoryColors] || 'bg-gray-500'
              )}
            >
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Related Topics</h4>
            <div className="flex flex-wrap gap-2">
              {['Renewable Energy', 'Philippines', 'Solar Power', 'Wind Energy', 'Climate Change'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}