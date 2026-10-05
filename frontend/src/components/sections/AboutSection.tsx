import React from 'react';
import { ShieldCheck, Cpu, Target, Bot, Award, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface AboutSectionProps {
  onOpenChat: () => void;
  onOpenEnquiryModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenChat,
  onOpenEnquiryModal,
}) => {
  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    } else {
      onOpenEnquiryModal();
    }
  };

  const pillars = [
    {
      num: '01',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: 'Professional UAV Operations',
      description:
        'DGCA-compliant enterprise flight operations adhering to strict aviation safety protocols, airspace authorizations, and structured standard operating procedures.',
    },
    {
      num: '02',
      icon: <Cpu className="w-5 h-5 text-primary" />,
      title: 'Enterprise-Grade UAV Technology',
      description:
        'Equipped with heavy-lift octocopters, LiDAR payloads, radiometric thermal sensors, and high-precision RTK GPS units delivering millimeter-accurate telemetry.',
    },
    {
      num: '03',
      icon: <Target className="w-5 h-5 text-amber-500" />,
      title: 'Survey-Grade Aerial Data',
      description:
        'High-precision 2D orthomosaics, 3D point clouds, digital elevation models (DEM), and volumetric calculations engineered for infrastructure and GIS workflows.',
    },
    {
      num: '04',
      icon: <Bot className="w-5 h-5 text-purple-500" />,
      title: 'AI-Assisted Support',
      description:
        'Instant guidance on DGCA syllabus, flight batch schedules, equipment capabilities, and enterprise quote requests powered by our 24/7 Aero assistant.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background border-b border-border/60 scroll-mt-24" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Mission */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>WHY VAYUDHARA AERO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Precision UAV Operations. Professional Pilot Training.
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Founded by aerospace engineers and geospatial professionals, Vayudhara Aero bridges the gap
              between enterprise industrial drone requirements and world-class pilot academy
              training.
            </p>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Whether you are an infrastructure conglomerate requiring survey-grade thermal inspections
              or an aspiring aviator looking to build a licensed commercial pilot career, we deliver the
              aircraft, regulatory framework, and technical expertise to help you soar.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleScrollToContact}
                className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={onOpenChat}
                className="gap-2 text-primary border-primary/30 hover:bg-primary/10 transition-all duration-200 hover:scale-105 active:scale-95 group"
              >
                <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>Ask AI Assistant</span>
              </Button>
            </div>
          </div>

          {/* Right 4 Pillars Grid (2x2 Uniform-Height Cards) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between group h-full"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:scale-105 transition-all duration-300">
                      {pillar.icon}
                    </div>
                    <span className="text-xs font-black tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors">
                      {pillar.num}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors duration-200">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
