import { useTranslations } from "next-intl";
import HeroSection from "@/components/sections/hero";
import PropertiesSection from "@/components/sections/properties";
import ServicesSection from "@/components/sections/services";
import TestimonialsSection from "@/components/sections/testimonials";
import AppPromoSection from "@/components/sections/app-promo";
import { Button } from "antd";

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
