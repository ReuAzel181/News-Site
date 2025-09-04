export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session as Session).user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get current date for today's statistics
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Get last month's date range for comparison
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate());
    const lastMonthEnd = new Date(lastMonthStart.getTime() + 24 * 60 * 60 * 1000);

    // Parallel queries for better performance
    const [totalArticles, publishedToday, totalViews, activeAuthors, totalCategories, lastMonthArticles] = await Promise.all([
      // Total articles count
      prisma.article.count(),
      
      // Articles published today
      prisma.article.count({
        where: {
          published: true,
          publishedAt: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
      }),
      
      // Total views across all articles
      prisma.article.aggregate({
        _sum: {
          views: true,
        },
        where: {
          published: true,
        },
      }),
      
      // Count of unique active authors (authors with at least one published article)
      prisma.user.count({
        where: {
          articles: {
            some: {
              published: true,
            },
          },
        },
      }),
      
      // Total categories count
      prisma.category.count(),
      
      // Articles from last month for comparison
      prisma.article.count({
        where: {
          published: true,
          createdAt: {
            gte: lastMonthStart,
            lt: lastMonthEnd,
          },
        },
      }),
    ]);

    // Calculate percentage changes (mock calculation for now)
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return '+100%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    // Format large numbers
    const formatNumber = (num: number): string => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    const stats = [
      {
        name: 'Total Articles',
        value: totalArticles.toString(),
        change: calculateChange(totalArticles, lastMonthArticles),
        changeType: totalArticles >= lastMonthArticles ? 'positive' : 'negative',
        icon: 'Newspaper'
      },
      {
        name: 'Published Today',
        value: publishedToday.toString(),
        change: '+5%', // Mock change for today's articles
        changeType: 'positive',
        icon: 'Calendar'
      },
      {
        name: 'Total Views',
        value: formatNumber(totalViews._sum.views || 0),
        change: '+18%', // Mock change for views
        changeType: 'positive',
        icon: 'Eye'
      },
      {
        name: 'Active Authors',
        value: activeAuthors.toString(),
        change: '+2%', // Mock change for authors
        changeType: 'positive',
        icon: 'User'
      },
      {
        name: 'Categories',
        value: totalCategories.toString(),
        change: '0%',
        changeType: 'neutral',
        icon: 'BarChart3'
      }
    ];

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}