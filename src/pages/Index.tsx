import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhySection from "@/components/WhySection";
import SignBandSection from "@/components/SignBandSection";
import VideosNewsSection from "@/components/VideosNewsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhySection />
      <SignBandSection />
      <VideosNewsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
