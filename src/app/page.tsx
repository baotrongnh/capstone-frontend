import AppPromoSection from "@/components/sections/app-promo"
import HeroSection from "@/components/sections/hero"
import PropertiesSection from "@/components/sections/properties"
import ServicesSection from "@/components/sections/services"
import TestimonialsSection from "@/components/sections/testimonials"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("HomePage");

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
