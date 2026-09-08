import HomeBannerAd from '@/components/ads/HomeBannerAd';
import { ScrollToTop } from '@/components/common';
import {
  AboutSection,
  CtaSection,
  FaqSection,
  HeroSection,
  HowItWorksSection} from '@/components/sections';

export default function HomePageContent() {
  return (
    <>
      <HeroSection />

      <HomeBannerAd
        adSlot="1234567890"
        adFormat="auto"
        variant="display"
        className="bg-gray-50"
      />

      {/* Sections importées */}
      <AboutSection />

      <HomeBannerAd
        adSlot="2345678901"
        adFormat="horizontal"
        variant="infeed"
        className="bg-white"
      />

      <HowItWorksSection />

      <HomeBannerAd
        adSlot="3456789012"
        adFormat="auto"
        variant="display"
        className="bg-gray-50"
      />

      <FaqSection />

      <CtaSection />

      {/* Scroll to top */}
      <ScrollToTop />
    </>
  );
}
