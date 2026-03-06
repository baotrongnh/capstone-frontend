import AppPromoSection from "@/components/sections/app-promo"
import HeroSection from "@/components/sections/hero"
import PropertiesSection from "@/components/sections/properties"
import ServicesSection from "@/components/sections/services"
import TestimonialsSection from "@/components/sections/testimonials"

export default function Home() {

  return (
    <div className="">
      <main>
        <HeroSection />
        <PropertiesSection />
        <ServicesSection />
        <TestimonialsSection />
        <AppPromoSection />
      </main>
    </div>
  );
}
