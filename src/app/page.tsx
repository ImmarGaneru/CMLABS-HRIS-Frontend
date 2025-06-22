import HeroSection from './landing_page/components/heroSection';
import Features from './landing_page/components/features';
import FAQ from './landing_page/components/faq';
import CTA from './landing_page/components/cta';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Features />
      <FAQ />
      <CTA />
    </>
  );
}
