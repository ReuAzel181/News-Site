'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/utils/cn';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { ArticleModal } from '@/components/ui/ArticleModal';
import {
  BreakingNewsSection,
  BusinessSection,
  SportsSection,
  LifestyleSection,
  TechnologySection,
  FeaturedVideosSection
} from './sections';
import { Article } from './types';

// Real news articles based on current Philippine events
const newsArticles = [
  {
    id: '1',
    title: 'President Marcos Grants Executive Clemency to Former Iloilo Mayor',
    excerpt: 'President Ferdinand Marcos Jr. grants executive clemency to former Iloilo City mayor Jed Patrick Mabilog, who had been charged with graft before the Ombudsman.',
    imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop',
    category: 'Politics',
    author: 'Maria Santos',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    views: 18420,
    slug: 'marcos-executive-clemency-mabilog',
    featured: true
  },
  {
    id: '2',
    title: 'AFP Arrests Chinese National for Surveillance Activities',
    excerpt: 'The Armed Forces of the Philippines announces the arrest of Chinese national Deng Yuanqing and two Filipino accomplices for conducting surveillance on sensitive installations.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
    category: 'National Security',
    author: 'Carlos Reyes',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    views: 12150,
    slug: 'afp-arrests-chinese-surveillance',
    featured: false
  },
  {
    id: '10',
    title: 'BSP Maintains Key Interest Rate at 6.0% Amid Inflation Concerns',
    excerpt: 'The Bangko Sentral ng Pilipinas keeps the overnight reverse repurchase rate unchanged at 6.0%, citing the need to balance economic growth with price stability.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
    category: 'Finance',
    author: 'Benjamin Cruz',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    views: 15400,
    slug: 'bsp-interest-rate-decision',
    featured: false
  },
  {
    id: '11',
    title: 'PBA Season 49 Governors Cup Finals Set Between Ginebra and TNT',
    excerpt: 'Barangay Ginebra and TNT Tropang Giga advance to the PBA Governors Cup Finals after thrilling semifinal victories, setting up an exciting championship series.',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
    category: 'Sports',
    author: 'Mark Gonzales',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    views: 18900,
    slug: 'pba-governors-cup-finals',
    featured: false
  },
  {
    id: '12',
    title: 'DOST Unveils New Satellite Technology for Disaster Monitoring',
    excerpt: 'The Department of Science and Technology launches advanced satellite monitoring systems to enhance early warning capabilities for natural disasters across the archipelago.',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop',
    category: 'Technology',
    author: 'Dr. Sarah Lim',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    views: 12300,
    slug: 'dost-satellite-disaster-monitoring',
    featured: false
  },
  {
    id: '13',
    title: 'Philippine Stock Exchange Hits New Record High',
    excerpt: 'The PSEi closes at an all-time high of 7,850 points, driven by strong performance in banking and telecommunications sectors amid positive economic indicators.',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop',
    category: 'Business',
    author: 'Patricia Tan',
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000), // 13 hours ago
    views: 16700,
    slug: 'pse-record-high',
    featured: false
  },
  {
    id: '14',
    title: 'Azkals Secure Spot in AFC Asian Cup Qualifiers',
    excerpt: 'The Philippine national football team qualifies for the AFC Asian Cup after a decisive 3-1 victory over Cambodia in the final qualifying match.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop',
    category: 'Sports',
    author: 'Rico Santos',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    views: 21500,
    slug: 'azkals-afc-asian-cup-qualifiers',
    featured: false
  },
  {
    id: '15',
    title: 'DOH Reports Significant Decline in COVID-19 Cases Nationwide',
    excerpt: 'The Department of Health announces a 40% decrease in COVID-19 cases over the past month, with hospital utilization rates dropping to manageable levels.',
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=250&fit=crop',
    category: 'Health',
    author: 'Dr. Maria Santos',
    publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000), // 15 hours ago
    views: 19200,
    slug: 'doh-covid-cases-decline',
    featured: false
  },
  {
    id: '16',
    title: 'Renewable Energy Investments Reach ₱500 Billion This Year',
    excerpt: 'The Philippines attracts record-breaking investments in renewable energy projects, with solar and wind farms leading the sustainable energy transition.',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop',
    category: 'Energy',
    author: 'Engineer Luis Mendoza',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    views: 14800,
    slug: 'renewable-energy-investments',
    featured: false
  },
  {
    id: '17',
    title: 'MMDA Launches New Traffic Management System in Metro Manila',
    excerpt: 'The Metropolitan Manila Development Authority implements AI-powered traffic management systems across major thoroughfares to reduce congestion and improve mobility.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop',
    category: 'Transportation',
    author: 'Carlos Rivera',
    publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000), // 17 hours ago
    views: 13600,
    slug: 'mmda-traffic-management-system',
    featured: false
  },
  {
    id: '18',
    title: 'Philippine Tourism Revenue Surpasses Pre-Pandemic Levels',
    excerpt: 'The Department of Tourism reports that visitor arrivals and tourism revenue have exceeded 2019 figures, marking a complete recovery from the pandemic impact.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    category: 'Tourism',
    author: 'Isabella Cruz',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    views: 17300,
    slug: 'tourism-revenue-recovery',
    featured: false
  },
  {
    id: '19',
    title: 'DepEd Implements New Digital Learning Platform Nationwide',
    excerpt: 'The Department of Education rolls out an enhanced digital learning platform to support blended learning approaches and improve educational accessibility.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
    category: 'Education',
    author: 'Teacher Anna Reyes',
    publishedAt: new Date(Date.now() - 19 * 60 * 60 * 1000), // 19 hours ago
    views: 11900,
    slug: 'deped-digital-learning-platform',
    featured: false
  },
  {
    id: '20',
    title: 'Cebu Pacific Expands International Routes to Southeast Asia',
    excerpt: 'Cebu Pacific announces new direct flights to Vietnam, Thailand, and Malaysia, strengthening connectivity within the ASEAN region and boosting tourism.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop',
    category: 'Aviation',
    author: 'Captain Miguel Torres',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    views: 15100,
    slug: 'cebu-pacific-southeast-asia-routes',
    featured: false
  },
  {
    id: '3',
    title: 'Agriculture Secretary Declares Food Security Emergency on Rice',
    excerpt: 'Agriculture Secretary Francisco Tiu Laurel Jr. declares a food security emergency on rice due to rising prices affecting Filipino families nationwide.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop',
    category: 'Agriculture',
    author: 'Ana Dela Cruz',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    views: 15750,
    slug: 'rice-food-security-emergency',
    featured: false
  },
  {
    id: '4',
    title: '17 Filipino Crew Members Released from Houthi Captivity',
    excerpt: 'The national government confirms that 17 Filipinos are among the 25 crew members of M/V Galaxy Leader who have been released from captivity by Houthi rebels after being held off Yemen since November 2023.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
    category: 'International',
    author: 'Miguel Torres',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    views: 9300,
    slug: 'filipino-crew-houthi-release',
    featured: false
  },
  {
    id: '5',
    title: 'Iglesia ni Cristo Holds National Rally for Peace',
    excerpt: 'The Iglesia ni Cristo holds the National Rally for Peace, a nationwide demonstration to express disapproval of impeachment efforts against Vice President Duterte. At the Quirino Grandstand alone, 1.5 million people attend the rally.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    category: 'National',
    author: 'Rosa Martinez',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    views: 7890,
    slug: 'inc-national-rally-peace',
    featured: false
  },
  {
    id: '6',
    title: 'Supreme Court Strikes Down Mining Moratorium in Occidental Mindoro',
    excerpt: 'The Supreme Court strikes down a 25-year moratorium on large-scale mining in Occidental Mindoro introduced in 2008, saying that local governments can prohibit specific mining projects but cannot do so for all large-scale mining activities.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
    category: 'Legal',
    author: 'Roberto Kim',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    views: 11200,
    slug: 'supreme-court-mining-moratorium',
    featured: false
  },
  {
    id: '7',
    title: 'Sandiganbayan Convicts Former Quezon City Mayor Herbert Bautista',
    excerpt: 'The Sandiganbayan convicts former Quezon City mayor Herbert Bautista and former city administrator Aldrin Cuña of graft over the procurement of an Online Occupational Permitting Tracking System in 2019.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
    category: 'Legal',
    author: 'James Wilson',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    views: 13500,
    slug: 'sandiganbayan-bautista-conviction',
    featured: false
  },
  {
    id: '8',
    title: 'Catholic Bishops Designate New National Shrines',
    excerpt: 'The Catholic Bishops Conference of the Philippines designates as national shrines the EDSA Shrine in Quezon City, the Sampaloc Church in Manila, and the Diocesan Shrine of Our Lady of Aranzazu in San Mateo, Rizal.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
    category: 'Religion',
    author: 'Patricia Lim',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    views: 8750,
    slug: 'cbcp-new-national-shrines',
    featured: false
  },
  {
    id: '9',
    title: 'Department of Justice Withdraws Dengvaxia Charges Against Janette Garin',
    excerpt: 'The Department of Justice releases a resolution withdrawing 98 charges of reckless imprudence resulting in homicide against former health secretary Janette Garin filed over the Dengvaxia controversy.',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
    category: 'Health',
    author: 'Dr. Emily Watson',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    views: 10420,
    slug: 'doj-dengvaxia-garin-charges',
    featured: false
  },
  {
    id: '10',
    title: 'Renewable Energy Projects Accelerate Nationwide',
    excerpt: 'Solar and wind farms expand rapidly as Philippines commits to clean energy transition and carbon neutrality goals.',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop',
    category: 'Environment',
    author: 'Mark Thompson',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    views: 6150,
    slug: 'renewable-energy-philippines-expansion',
    featured: false
  },
  {
    id: '11',
    title: 'Filipino Scientists Develop Breakthrough Cancer Treatment',
    excerpt: 'Research team at University of the Philippines creates innovative therapy showing promising results in clinical trials.',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
    category: 'Health',
    author: 'Dr. Lisa Rodriguez',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    views: 9890,
    slug: 'filipino-scientists-cancer-breakthrough',
    featured: false
  },
  {
    id: '12',
    title: 'Gilas Pilipinas Prepares for FIBA World Cup Qualifiers',
    excerpt: 'National basketball team intensifies training as they gear up for crucial qualifying matches in the upcoming tournament.',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
    category: 'Sports',
    author: 'Miguel Torres',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    views: 14200,
    slug: 'gilas-pilipinas-fiba-world-cup-qualifiers',
    featured: false
  },
  {
    id: '13',
    title: 'Manila Film Festival Showcases Local Cinema Excellence',
    excerpt: 'Independent filmmakers and established directors present diverse stories celebrating Filipino culture and creativity.',
    imageUrl: 'https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=400&h=250&fit=crop',
    category: 'Entertainment',
    author: 'Sofia Garcia',
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000), // 13 hours ago
    views: 5670,
    slug: 'manila-film-festival-local-cinema',
    featured: false
  },
  {
    id: '14',
    title: 'Typhoon Season Preparedness: NDRRMC Issues Guidelines',
    excerpt: 'Disaster risk reduction agency releases comprehensive protocols as the country braces for the peak typhoon season.',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop',
    category: 'National',
    author: 'Carlos Reyes',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    views: 8340,
    slug: 'typhoon-season-ndrrmc-guidelines',
    featured: false
  },
  {
    id: '15',
    title: 'OFW Remittances Reach All-Time High This Quarter',
    excerpt: 'Overseas Filipino workers send record-breaking amounts home, boosting domestic consumption and economic stability.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    category: 'Finance',
    author: 'Ana Dela Cruz',
    publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000), // 15 hours ago
    views: 12890,
    slug: 'ofw-remittances-record-high',
    featured: false
  },
  {
    id: '16',
    title: 'Bases Conversion Authority Reassumes Control Over Camp John Hay',
    excerpt: 'The Bases Conversion and Development Authority reassumes control over Camp John Hay in Baguio as part of a 2024 Supreme Court arbitral ruling ordering the Camp John Hay Development Corporation to vacate the property.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    category: 'Legal',
    author: 'Teacher Grace Santos',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    views: 7250,
    slug: 'digital-transformation-philippine-education',
    featured: false
  },
  {
    id: '17',
    title: 'Philippines Begins Hosting Afghan Refugees for US Resettlement',
    excerpt: 'The Philippines begins hosting Afghan refugees seeking to resettle in the United States as part of a July 2024 agreement between the Philippines and the U.S. to temporarily host a U.S. immigrant visa processing center.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
    category: 'International',
    author: 'Maria Santos',
    publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000), // 17 hours ago
    views: 11450,
    slug: 'philippines-afghan-refugees-us',
    featured: false
  },
  {
    id: '18',
    title: 'State of Calamity Declared in Ubay, Bohol Due to African Swine Fever',
    excerpt: 'A state of calamity is declared in Ubay, Bohol due to an outbreak of African swine fever affecting local livestock and farmers.',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=250&fit=crop',
    category: 'Agriculture',
    author: 'Tech Reporter Alex Chen',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    views: 9180,
    slug: 'ubay-bohol-african-swine-fever',
    featured: false
  },
  {
    id: '19',
    title: 'Sandiganbayan Acquits Former VP Jejomar Binay and Son',
    excerpt: 'The Sandiganbayan acquits former vice president Jejomar Binay and his son, former Makati mayor Junjun Binay for graft and falsification cases related to alleged irregularities in the construction of the Makati Science High School building.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
    category: 'Legal',
    author: 'Legal Reporter Juan Cruz',
    publishedAt: new Date(Date.now() - 19 * 60 * 60 * 1000), // 19 hours ago
    views: 14200,
    slug: 'sandiganbayan-binay-acquittal',
    featured: false
  },
  {
    id: '20',
    title: 'Charyzah Esparrago Crowned Miss Supermodel Worldwide Philippines 2025',
    excerpt: 'Charyzah Esparrago of Quezon City is crowned Miss Supermodel Worldwide Philippines 2025 in the pageant\'s coronation night held at the Newport Performing Arts Theatre in Pasay.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=250&fit=crop',
    category: 'Entertainment',
    author: 'Entertainment Reporter Sofia Garcia',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    views: 8750,
    slug: 'charyzah-esparrago-miss-supermodel',
    featured: false
  },
  {
    id: '21',
    title: 'Executive Order 81 Reorganizes National Security Council',
    excerpt: 'Executive Secretary Lucas Bersamin announces President Marcos\' enactment of Executive Order No. 81 which reorganizes the National Security Council, with the Vice President and former presidents being stripped of their membership.',
    imageUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop',
    category: 'Politics',
    author: 'Political Reporter Carlos Mendoza',
    publishedAt: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21 hours ago
    views: 16800,
    slug: 'executive-order-81-nsc-reorganization',
    featured: false
  },
  // Additional Sports Articles
  {
    id: '22',
    title: 'Manny Pacquiao Announces Boxing Exhibition Tour Across Asia',
    excerpt: 'The Filipino boxing legend reveals plans for a series of exhibition matches in Japan, South Korea, and Thailand, promoting Philippine boxing internationally.',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
    category: 'Sports',
    author: 'Boxing Reporter Mike Santos',
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    views: 25400,
    slug: 'pacquiao-exhibition-tour-asia',
    featured: false
  },
  {
    id: '23',
    title: 'UAAP Season 87 Basketball Finals: Ateneo vs La Salle Rivalry Renewed',
    excerpt: 'The Blue Eagles and Green Archers clash in the championship series, reviving one of Philippine college basketball\'s most intense rivalries.',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop',
    category: 'Sports',
    author: 'UAAP Reporter Carlos Mendoza',
    publishedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    views: 19800,
    slug: 'uaap-basketball-finals-ateneo-la-salle',
    featured: false
  },
  {
    id: '24',
    title: 'Philippine Volleyball Team Qualifies for Asian Games',
    excerpt: 'The national women\'s volleyball team secures their spot in the upcoming Asian Games after a dominant performance in the regional qualifiers.',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop',
    category: 'Sports',
    author: 'Volleyball Reporter Ana Cruz',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    views: 16200,
    slug: 'philippine-volleyball-asian-games',
    featured: false
  },
  {
    id: '25',
    title: 'Carlos Yulo Prepares for World Gymnastics Championships',
    excerpt: 'The Olympic gold medalist intensifies training as he aims to defend his title in the upcoming World Gymnastics Championships in Belgium.',
    imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop',
    category: 'Sports',
    author: 'Gymnastics Reporter Maria Torres',
    publishedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    views: 22100,
    slug: 'carlos-yulo-world-championships',
    featured: false
  },
  // Additional Technology Articles
  {
    id: '26',
    title: 'Globe Telecom Launches 5G Network Expansion in Rural Areas',
    excerpt: 'Globe accelerates 5G infrastructure deployment to underserved communities, aiming to bridge the digital divide across the archipelago.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    category: 'Technology',
    author: 'Tech Reporter Alex Chen',
    publishedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
    views: 18500,
    slug: 'globe-5g-rural-expansion',
    featured: false
  },
  {
    id: '27',
    title: 'Philippine Startup Develops AI-Powered Disaster Response System',
    excerpt: 'Local tech company creates innovative artificial intelligence platform that can predict and respond to natural disasters with unprecedented accuracy.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
    category: 'Technology',
    author: 'Innovation Reporter Dr. Sarah Lim',
    publishedAt: new Date(Date.now() - 27 * 60 * 60 * 1000),
    views: 14700,
    slug: 'ai-disaster-response-system',
    featured: false
  },
  {
    id: '28',
    title: 'PLDT Introduces Fiber Internet to 500 More Barangays',
    excerpt: 'The telecommunications giant expands high-speed fiber connectivity to remote barangays, supporting digital transformation initiatives nationwide.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    category: 'Technology',
    author: 'Telecom Reporter Miguel Santos',
    publishedAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
    views: 12900,
    slug: 'pldt-fiber-barangay-expansion',
    featured: false
  },
  {
    id: '29',
    title: 'Philippine Space Agency Partners with NASA for Satellite Mission',
    excerpt: 'PhilSA collaborates with NASA on a groundbreaking satellite mission to monitor climate change and natural disasters in Southeast Asia.',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop',
    category: 'Technology',
    author: 'Space Reporter Dr. Elena Rodriguez',
    publishedAt: new Date(Date.now() - 29 * 60 * 60 * 1000),
    views: 20300,
    slug: 'philsa-nasa-satellite-mission',
    featured: false
  },
  {
    id: '30',
    title: 'Smart Communications Tests 6G Technology in Metro Manila',
    excerpt: 'Smart begins pilot testing of next-generation 6G wireless technology, positioning the Philippines as an early adopter of ultra-fast connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop',
    category: 'Technology',
    author: 'Network Reporter James Wilson',
    publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    views: 17600,
    slug: 'smart-6g-technology-testing',
    featured: false
  },
  // Additional Lifestyle Articles
  {
    id: '31',
    title: 'Manila Restaurant Week Showcases Filipino Fusion Cuisine',
    excerpt: 'Top chefs across Metro Manila present innovative dishes that blend traditional Filipino flavors with international culinary techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop',
    category: 'Lifestyle',
    author: 'Food Critic Isabella Martinez',
    publishedAt: new Date(Date.now() - 31 * 60 * 60 * 1000),
    views: 13400,
    slug: 'manila-restaurant-week-fusion',
    featured: false
  },
  {
    id: '32',
    title: 'Sustainable Fashion Movement Gains Momentum in Philippines',
    excerpt: 'Local designers and brands embrace eco-friendly materials and ethical production practices, leading the sustainable fashion revolution.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop',
    category: 'Lifestyle',
    author: 'Fashion Reporter Sofia Garcia',
    publishedAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
    views: 11800,
    slug: 'sustainable-fashion-philippines',
    featured: false
  },
  {
    id: '33',
    title: 'Wellness Tourism Booms in Palawan and Bohol',
    excerpt: 'Health and wellness resorts in these island destinations attract international visitors seeking holistic healing and relaxation experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    category: 'Lifestyle',
    author: 'Travel Writer Rosa Dela Cruz',
    publishedAt: new Date(Date.now() - 33 * 60 * 60 * 1000),
    views: 15600,
    slug: 'wellness-tourism-palawan-bohol',
    featured: false
  },
  {
    id: '34',
    title: 'Filipino Coffee Culture Evolves with Third-Wave Movement',
    excerpt: 'Specialty coffee shops and local roasters elevate Philippine coffee beans, showcasing unique flavors from different regions across the country.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=250&fit=crop',
    category: 'Lifestyle',
    author: 'Coffee Expert Miguel Torres',
    publishedAt: new Date(Date.now() - 34 * 60 * 60 * 1000),
    views: 9700,
    slug: 'filipino-coffee-third-wave',
    featured: false
  },
  {
    id: '35',
    title: 'Art Galleries in BGC Feature Contemporary Filipino Artists',
    excerpt: 'Bonifacio Global City becomes a hub for contemporary art, with new galleries showcasing the works of emerging and established Filipino artists.',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop',
    category: 'Lifestyle',
    author: 'Art Critic Patricia Lim',
    publishedAt: new Date(Date.now() - 35 * 60 * 60 * 1000),
    views: 8900,
    slug: 'bgc-art-galleries-filipino-artists',
    featured: false
  },
  {
    id: '36',
    title: 'Mindfulness and Meditation Centers Open Across Metro Manila',
    excerpt: 'Growing interest in mental wellness drives the opening of meditation studios and mindfulness centers, offering urban dwellers stress relief.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop',
    category: 'Lifestyle',
    author: 'Wellness Reporter Dr. Anna Santos',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    views: 12300,
    slug: 'mindfulness-meditation-centers-manila',
    featured: false
  }
];

const categoryColors = {
  Technology: 'bg-blue-500',
  Environment: 'bg-green-500',
  Science: 'bg-purple-500',
  Finance: 'bg-yellow-500',
  Health: 'bg-red-500',
  Politics: 'bg-indigo-500',
  Sports: 'bg-orange-500',
  Entertainment: 'bg-pink-500',
  National: 'bg-emerald-600',
  Business: 'bg-amber-600',
  Automotive: 'bg-slate-600',
  Education: 'bg-cyan-600',
  Tourism: 'bg-teal-600',
  'National Security': 'bg-red-600',
  Agriculture: 'bg-green-600',
  International: 'bg-blue-600',
  Legal: 'bg-gray-600',
  Religion: 'bg-purple-600',
  Energy: 'bg-yellow-600',
  Aviation: 'bg-sky-600',
  Transportation: 'bg-violet-600'
};

// YouTube videos data
const youtubeVideos = [
  {
    id: 'video1',
    title: 'President Marcos SONA 2024 Highlights',
    description: 'Key highlights from President Ferdinand Marcos Jr.\'s 2024 State of the Nation Address covering economic recovery, infrastructure, and governance reforms.',
    videoId: 'smBAliz5iCY', // SONA 2024 highlights from ANC
    thumbnail: 'https://img.youtube.com/vi/smBAliz5iCY/hqdefault.jpg',
    duration: '15:32',
    views: '2.1M',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    channel: 'ANC 24/7'
  },
  {
    id: 'video2',
    title: 'SC declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
    description: 'Breaking news coverage of the Supreme Court\'s declaration regarding the Articles of Impeachment against Vice President Sara Duterte.',
    videoId: '_zCam-VGggA', // GMA Integrated News - SC impeachment ruling
    thumbnail: 'https://img.youtube.com/vi/_zCam-VGggA/hqdefault.jpg',
    duration: '22:45',
    views: '856K',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    channel: 'GMA Integrated News'
  },
  {
    id: 'video3',
    title: 'Iglesia ni Cristo National Rally for Peace - Full Coverage',
    description: 'Complete coverage of the massive National Rally for Peace held at Quirino Grandstand, with 1.5 million attendees expressing their stance on current political issues.',
    videoId: 'VRnpcXdDbz8', // INC National Rally for Peace 2025
    thumbnail: 'https://img.youtube.com/vi/VRnpcXdDbz8/hqdefault.jpg',
    duration: '45:18',
    views: '3.2M',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    channel: 'GMA News'
  }
];

export function NewsGrid() {
  const [selectedArticle, setSelectedArticle] = useState<typeof newsArticles[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = (article: typeof newsArticles[0]) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <section className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 pb-8 dark:bg-gray-900" style={{backgroundColor: '#F5F5F5'}}>
      <div className="max-w-7xl mx-auto px-0">
        {newsArticles.length > 0 ? (
          <div className="space-y-0">
            <BreakingNewsSection articles={newsArticles} onReadMore={handleReadMore} />
            <BusinessSection articles={newsArticles} onReadMore={handleReadMore} />
            <SportsSection articles={newsArticles} onReadMore={handleReadMore} />
            <LifestyleSection articles={newsArticles} />
            <TechnologySection articles={newsArticles} />
            <FeaturedVideosSection videos={youtubeVideos} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="w-12 h-12 text-gray-400">📰</div>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{color: '#333333'}}>
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No articles available at the moment.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Article Modal */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        article={selectedArticle}
      />
    </section>
  );
}