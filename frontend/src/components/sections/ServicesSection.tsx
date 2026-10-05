import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Radio } from 'lucide-react';
import { Button } from '../common/Button';

interface ServiceItem {
  id: string;
  image: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  capabilities: string[];
  bottomMetadata: string;
}

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'lidar-surveying',
    image: '/images/drone_lidar_field_work.webp',
    alt: 'Drone operator conducting aerial LiDAR surveying at a construction site',
    category: 'GEOSPATIAL INTELLIGENCE',
    title: 'Topographical GIS & LiDAR Surveying',
    description:
      'Capture high-precision aerial data for terrain mapping, infrastructure planning, construction monitoring, and 3D site analysis.',
    capabilities: [
      'RTK / PPK Mapping',
      'LiDAR & Photogrammetry',
      '3D Point Clouds & DEMs',
    ],
    bottomMetadata: 'HIGH-PRECISION SURVEYING',
  },
  {
    id: 'precision-agriculture',
    image:
      '/images/Commercial_crop_spraying_drone_flynig_over_green_field_spraying_fertilizer.webp',
    alt: 'Agricultural drone spraying crops in a precision farming field',
    category: 'PRECISION AGRICULTURE',
    title: 'Precision Agriculture & Spraying',
    description:
      'Optimize crop protection with precision aerial spraying, multispectral analysis, and data-driven field monitoring.',
    capabilities: [
      'Precision Crop Spraying',
      'NDVI / NDRE Analytics',
      'Variable-Rate Application',
    ],
    bottomMetadata: 'UP TO 30 ACRES / DAY',
  },
  {
    id: 'thermal-inspection',
    image: '/images/thermalandsolar.jpg',
    alt: 'Drone inspecting a solar installation for thermal and infrastructure analysis',
    category: 'INDUSTRIAL INSPECTION',
    title: 'Infrastructure & Thermal Inspection',
    description:
      'Inspect critical infrastructure with high-resolution RGB and thermal imaging to identify defects, hotspots, and maintenance risks without disrupting operations.',
    capabilities: [
      'Thermal + RGB Imaging',
      'AI-Assisted Defect Detection',
      'Solar & Infrastructure Inspection',
    ],
    bottomMetadata: 'NON-INTRUSIVE INSPECTION',
  },
  {
    id: 'cinematography-media',
    image: '/images/cinematic.jpg',
    alt: 'Heavy-lift cinema drone equipped with a professional camera',
    category: 'AERIAL MEDIA & PRODUCTION',
    title: 'Cinematography & High-End Media',
    description:
      'Capture cinematic aerial footage using heavy-lift UAV platforms built for professional cameras, commercial productions, films, and live events.',
    capabilities: [
      'Heavy-Lift Cinema Drones',
      '6K / 8K RAW Capture',
      'FPV & Stabilized Aerials',
    ],
    bottomMetadata: 'PROFESSIONAL AERIAL PRODUCTION',
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, make visible immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger once only, avoiding repeated replay on scrolling
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="drone-services"
      className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── SECTION HEADER ─── */}
        <div
          className={`text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>ENTERPRISE UAV OPERATIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Industrial & Commercial Drone Services
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Precision aerial solutions for surveying, agriculture, infrastructure inspection, and
            professional media — powered by advanced UAV platforms and certified operators.
          </p>
        </div>

        {/* ─── 2 × 2 SERVICE CARDS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {SERVICES.map((service, index) => {
            const staggerDelay = `${index * 100}ms`;

            return (
              <div
                key={service.id}
                style={{
                  transitionDelay: isVisible ? staggerDelay : '0ms',
                }}
                className={`group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden flex flex-col justify-between ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {/* Top Image Container (approx 40-45% height with consistent 16:9 ratio) */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  {/* Subtle dark gradient overlay at lower edge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-5">
                  <div className="space-y-3">
                    {/* Category Label */}
                    <div className="text-[11px] font-bold tracking-widest text-sky-600 uppercase">
                      {service.category}
                    </div>

                    {/* Service Title */}
                    <h3 className="text-xl sm:text-[1.3rem] font-bold text-slate-900 tracking-tight leading-snug group-hover:text-sky-600 transition-colors duration-200">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Technical Capabilities List */}
                    <div className="pt-2">
                      <ul className="space-y-2 text-xs text-slate-700">
                        {service.capabilities.map((cap, idx) => (
                          <li key={idx} className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                            <span className="font-medium">{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Metadata & CTA */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                      {service.bottomMetadata}
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors group/cta cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded py-1 px-1.5 -mr-1.5"
                      aria-label={`Explore ${service.title}`}
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cta:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── SECTION-LEVEL CTA ─── */}
        <div
          className={`mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="space-y-1.5 text-center md:text-left max-w-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Need a specialized UAV solution?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tell us about your project and our team will recommend the right platform, payload,
              and deployment strategy.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onSelectService('Specialized UAV Solution')}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/20 hover:shadow-sky-600/35 shrink-0 transition-all duration-300 hover:scale-[1.02] active:scale-95 group text-xs sm:text-sm px-5 py-2.5"
            rightIcon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
          >
            Request a Quote
          </Button>
        </div>
      </div>
    </section>
  );
};
