import { useState, useEffect } from "react";
import { CustomCursor } from "@/shared/ui/custom-cursor";
import { LoadingAnimation } from "@/shared/ui/loading-animation";
import { Header } from "@/widgets/header";
import { Hero } from "@/widgets/hero";
import { InfoSection } from "@/widgets/info-section";
import { ServicesSection } from "@/widgets/services-section";
import { ProjectList } from "@/features/project/components/project-list";
import { WorkExperienceList } from "@/features/work-experience/components/work-experience-list";
import { TechStackList } from "@/features/tech-stack/components/tech-stack-list";
import { ContactForm } from "@/widgets/contact-form";
import { useScrollReveal } from "@/shared/lib/use-reveal";

export function HomePage() {
  const [loading, setLoading] = useState(true);
  useScrollReveal(!loading);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans">
      {/* Loading overlay — fades out */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <LoadingAnimation />
      </div>

      {/* Main content — fades in */}
      <div
        className={`transition-opacity duration-700 ease-in-out ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <CustomCursor />
        <Header />
        <main id="main-content">
          <Hero />
          <InfoSection />
          <ServicesSection />
          <ProjectList />
          <WorkExperienceList />
          <TechStackList />
          <ContactForm />
        </main>
      </div>
    </div>
  );
}
