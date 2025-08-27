import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { NewsGrid } from '@/components/home/NewsGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main id="main-content" className="pt-16" role="main" aria-label="Main content">
        <HeroSection />
        <NewsGrid />
      </main>
      <Footer />
    </div>
  );
}
