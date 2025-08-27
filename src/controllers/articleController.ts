import { prisma } from '@/lib/prisma';
import { Article, SearchFilters, PaginationParams } from '@/types';

export class ArticleController {
  static async getPublishedArticles(
    filters: SearchFilters = {},
    pagination: PaginationParams = { page: 1, limit: 12 }
  ) {
    const { query, category, tags, author, dateFrom, dateTo } = filters;
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {
      published: true,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            slug: {
              in: tags,
            },
          },
        },
      };
    }

    if (author) {
      where.author = {
        name: { contains: author, mode: 'insensitive' },
      };
    }

    if (dateFrom || dateTo) {
      where.publishedAt = {};
      if (dateFrom) where.publishedAt.gte = dateFrom;
      if (dateTo) where.publishedAt.lte = dateTo;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getFeaturedArticles(count: number = 6) {
    return prisma.article.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [
        { views: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: count,
    });
  }

  static async getArticleBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (article) {
      // Increment view count
      await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
      });
    }

    return article;
  }

  static async getRelatedArticles(articleId: string, categoryId: string, limit: number = 4) {
    return prisma.article.findMany({
      where: {
        published: true,
        categoryId,
        NOT: {
          id: articleId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });
  }

  // Admin methods
  static async createArticle(data: any, authorId: string) {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return prisma.article.create({
      data: {
        ...data,
        slug,
        authorId,
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  static async updateArticle(id: string, data: any) {
    return prisma.article.update({
      where: { id },
      data,
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  static async deleteArticle(id: string) {
    return prisma.article.delete({
      where: { id },
    });
  }

  static async getAllArticles(pagination: PaginationParams = { page: 1, limit: 20 }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.article.count(),
    ]);

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}