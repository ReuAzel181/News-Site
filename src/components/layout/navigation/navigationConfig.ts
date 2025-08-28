import React from 'react';

export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

export const navigationSections = {
  home: {
    name: 'Home',
    href: '#',
    icon: undefined
  },
  breakingNews: {
    name: 'Breaking News',
    href: '#breaking-news',
    icon: undefined
  },
  business: {
    name: 'Business',
    href: '#business-finance',
    icon: undefined
  },
  technology: {
    name: 'Technology',
    href: '#technology',
    icon: undefined
  },
  sports: {
    name: 'Sports',
    href: '#sports',
    icon: undefined
  },
  lifestyle: {
    name: 'Lifestyle',
    href: '#lifestyle',
    icon: undefined
  },
  featuredVideos: {
    name: 'Featured Videos',
    href: '#featured-videos',
    icon: undefined
  }
};

export const navigation: NavItem[] = [
  navigationSections.home,
  navigationSections.breakingNews,
  navigationSections.business,
  navigationSections.technology,
  navigationSections.sports,
  navigationSections.lifestyle,
  navigationSections.featuredVideos
];