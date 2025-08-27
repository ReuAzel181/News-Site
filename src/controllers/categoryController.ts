import { prisma } from '@/lib/prisma';

export class CategoryController {
  static async getAllCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  static async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    });
  }

  static async getCategoryArticles(slug: string, page: number = 1, limit: number = 12) {
    const skip = (page - 1) * limit;

    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return null;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          categoryId: category.id,
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
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: {
          categoryId: category.id,
          published: true,
        },
      }),
    ]);

    return {
      category,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Admin methods
  static async createCategory(data: { name: string; description?: string; color?: string }) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  static async updateCategory(id: string, data: { name?: string; description?: string; color?: string }) {
    const updateData: any = { ...data };
    
    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteCategory(id: string) {
    // Check if category has articles
    const articleCount = await prisma.article.count({
      where: { categoryId: id },
    });

    if (articleCount > 0) {
      throw new Error('Cannot delete category with existing articles');
    }

    return prisma.category.delete({
      where: { id },
    });
  }

  static async getCategoriesWithArticleCount() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}