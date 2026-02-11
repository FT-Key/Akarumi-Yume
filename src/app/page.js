import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import MangaSection from '@/components/home/MangaSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="relative bg-black">
      <HeroSection />
      <FeaturesSection />
      <MangaSection />
      <NewsletterSection />
      <CTASection />
    </div>
  );
}