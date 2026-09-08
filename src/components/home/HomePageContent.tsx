import {
  AboutSection,
  HowItWorksSection,
  FaqSection,
  HeroSection,
  CtaSection
} from '@/components/sections';
import { ScrollToTop } from '@/components/common';
import HomeBannerAd from '@/components/ads/HomeBannerAd';

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
