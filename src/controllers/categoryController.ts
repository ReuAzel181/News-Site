import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export class CategoryController {
  static async getAllCategories() {
    return prisma.category.findMany({
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
        articles: true,
      },
    });
  }

  static async getCategoryArticles(slug: string) {
    return prisma.article.findMany({
      where: {
        category: {
          slug,
        },
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        author: true,
        category: true,
      },
    });
  }

  static async createCategory(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
    });
  }

  static async updateCategory(id: string, updateData: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }

  static async getCategoriesWithArticleCount() {
    const categories = await prisma.category.findMany({
      include: {
        articles: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map((category) => ({
      ...category,
      articleCount: category.articles.length,
    }));
  }
}