import React, { useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { CoursesSection } from '../components/sections/CoursesSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ContactSection } from '../components/sections/ContactSection';

interface LayoutContextType {
  onOpenEnquiryModal: (interest?: string) => void;
  onOpenChat: () => void;
}

export const HomePage: React.FC = () => {
  const { onOpenEnquiryModal, onOpenChat } = useOutletContext<LayoutContextType>();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: scrollBehavior });
    }
  };

  useEffect(() => {
    const target = location.hash.replace('#', '') || (location.state as any)?.scrollTo;
    if (target) {
      const timeoutId = setTimeout(() => {
        scrollToSection(target);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [location.hash, location.state]);

  return (
    <div className="space-y-0">
      <HeroSection
        onOpenChat={onOpenChat}
        onOpenEnquiryModal={onOpenEnquiryModal}
        onExploreServices={() => scrollToSection('drone-services')}
        onExploreCourses={() => scrollToSection('pilot-academy')}
      />
      <ServicesSection onSelectService={(service) => onOpenEnquiryModal(service)} />
      <CoursesSection onSelectCourse={(course) => onOpenEnquiryModal(course)} />
      <AboutSection onOpenChat={onOpenChat} onOpenEnquiryModal={() => onOpenEnquiryModal()} />
      <ContactSection onOpenChat={onOpenChat} />
    </div>
  );
};
