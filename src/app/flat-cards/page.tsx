'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { NewsCard } from '@/components/ui/NewsCard';

export default function FlatCardsDemo() {
  // Sample news data
  const newsItems = [
    {
      id: '1',
      title: 'Government Announces New Economic Policy',
      excerpt: 'The administration unveiled a comprehensive economic plan aimed at boosting growth and reducing inflation over the next fiscal year.',
      category: 'Politics',
      publishedAt: new Date('2023-06-15T09:30:00'),
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=800&fit=crop&q=80',
      authorName: 'Maria Santos',
      categoryColor: '#DC2626' // red-600
    },
    {
      id: '2',
      title: 'Tech Company Launches Revolutionary AI Assistant',
      excerpt: 'The new AI platform promises to transform how businesses handle customer service and data analysis with unprecedented accuracy.',
      category: 'Technology',
      publishedAt: new Date('2023-06-14T14:45:00'),
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop&q=80',
      authorName: 'Alex Chen',
      categoryColor: '#2563EB' // blue-600
    },
    {
      id: '3',
      title: 'National Team Advances to Championship Finals',
      excerpt: 'After a stunning victory in the semifinals, the national team has secured their place in the championship finals for the first time in a decade.',
      category: 'Sports',
      publishedAt: new Date('2023-06-13T18:20:00'),
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop&q=80',
      authorName: 'James Wilson',
      categoryColor: '#059669' // emerald-600
    },
    {
      id: '4',
      title: 'New Study Reveals Health Benefits of Mediterranean Diet',
      excerpt: 'Researchers have found additional evidence supporting the long-term health benefits of following a traditional Mediterranean diet rich in olive oil and vegetables.',
      category: 'Health',
      publishedAt: new Date('2023-06-12T11:15:00'),
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80',
      authorName: 'Sarah Johnson',
      categoryColor: '#7C3AED' // violet-600
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Flat News Card Design</h1>
            <p className="text-gray-600 dark:text-gray-400">
              A demonstration of news cards with a completely flat appearance, featuring sharp 90-degree corners,
              no drop shadows, and flat color fills.
            </p>
          </div>
          
          {/* Grid layout for the cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                excerpt={item.excerpt}
                category={item.category}
                publishedAt={item.publishedAt}
                imageUrl={item.imageUrl}
                authorName={item.authorName}
                categoryColor={item.categoryColor}
                onClick={() => console.log(`Clicked on article: ${item.title}`)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}