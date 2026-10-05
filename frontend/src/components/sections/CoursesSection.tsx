import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  GraduationCap,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../common/Button';

interface TrainingStage {
  id: string;
  stageNumber: string;
  pillTag: string;
  image: string;
  alt: string;
  category: string;
  categoryColor: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  duration: string;
  eligibility: string;
  bottomLabel: string;
  objectPosition?: string;
}

interface CoursesSectionProps {
  onSelectCourse: (courseName: string) => void;
}

const TRAINING_STAGES: TrainingStage[] = [
  {
    id: 'stage-01-core',
    stageNumber: '01',
    pillTag: '01 · CORE',
    image: '/images/pilot_training.png',
    alt: 'Drone pilot students receiving practical flight training',
    category: 'CORE CERTIFICATION',
    categoryColor: 'text-sky-600',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    title: 'DGCA Remote Pilot Certificate',
    subtitle: 'Commercial UAV Pilot Training',
    description:
      'Build the practical skills required for professional drone operations through structured ground instruction, flight training, safety procedures, and regulatory fundamentals.',
    highlights: [
      'UAV systems & flight fundamentals',
      'Airspace rules & operational safety',
      'Hands-on flight and emergency procedures',
      'Practical mission planning',
    ],
    duration: '5 Days · Intensive Training',
    eligibility: '18+ years · As per applicable requirements',
    bottomLabel: 'PROFESSIONAL PILOT TRAINING',
    objectPosition: 'center 40%',
  },
  {
    id: 'stage-02-geospatial',
    stageNumber: '02',
    pillTag: '02 · GEOSPATIAL',
    image: '/images/gis_mapping_training.png',
    alt: 'UAV mapping training with drone surveying and 3D terrain analysis',
    category: 'GEOSPATIAL SPECIALIZATION',
    categoryColor: 'text-indigo-600',
    badge: 'HIGH INDUSTRY DEMAND',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
    title: 'GIS & Photogrammetry Specialist',
    subtitle: 'Aerial Mapping & Data Processing',
    description:
      'Learn to transform drone-captured aerial data into accurate maps, 3D models, terrain datasets, and actionable geospatial insights.',
    highlights: [
      'RTK / PPK aerial data acquisition',
      'Orthomosaics & 3D reconstruction',
      'DEM, DSM & point-cloud generation',
      'GIS analysis & mapping workflows',
    ],
    duration: '3 Weeks · Hybrid / Field',
    eligibility: 'Basic computer literacy · Technical background preferred',
    bottomLabel: 'GEOSPATIAL DATA & MAPPING',
    objectPosition: 'center 45%',
  },
  {
    id: 'stage-03-agritech',
    stageNumber: '03',
    pillTag: '03 · AGRITECH',
    image: '/images/agricultural_drone_training.png',
    alt: 'Students learning precision agricultural drone spraying',
    category: 'AGRITECH SPECIALIZATION',
    categoryColor: 'text-emerald-600',
    badge: 'AGRITECH SPECIALIST',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    title: 'Precision Agriculture Drone Operations',
    subtitle: 'Aerial Spraying & Crop Intelligence',
    description:
      'Develop practical skills in agricultural drone operations, precision spraying, crop monitoring, and field mission planning.',
    highlights: [
      'Precision spraying & droplet control',
      'Crop monitoring & NDVI analysis',
      'Battery, chemical & safety procedures',
      'Field mission planning & execution',
    ],
    duration: '10 Days · Field Training',
    eligibility: 'Applicable remote pilot qualification / entry requirements',
    bottomLabel: 'PRECISION AGRICULTURE OPERATIONS',
    objectPosition: 'center 45%',
  },
  {
    id: 'stage-04-industrial',
    stageNumber: '04',
    pillTag: '04 · INDUSTRIAL',
    image: '/images/thermal_inspection_training.png',
    alt: 'Drone thermal inspection training for solar and industrial assets',
    category: 'INDUSTRIAL SPECIALIZATION',
    categoryColor: 'text-amber-600',
    badge: 'ADVANCED AUDIT SKILLS',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    title: 'Industrial Thermography & Asset Inspection',
    subtitle: 'Thermal Imaging & Infrastructure Auditing',
    description:
      'Learn to use thermal and RGB drone data to identify hotspots, defects, and maintenance risks across solar, electrical, and industrial assets.',
    highlights: [
      'Thermal imaging fundamentals',
      'Radiometric data interpretation',
      'Solar & electrical asset inspection',
      'Defect detection & reporting workflows',
    ],
    duration: '2 Weeks · Theory + Field',
    eligibility: 'Engineering / diploma / relevant technical background preferred',
    bottomLabel: 'THERMAL & INFRASTRUCTURE INSPECTION',
    objectPosition: 'center 40%',
  },
];

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onSelectCourse }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isVisible, setIsVisible] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Track active stage without triggering unnecessary React renders on continuous scroll
  const currentStageRef = useRef(0);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Section entrance animation via IntersectionObserver
  useEffect(() => {
    if (isReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isReducedMotion]);

  // Direct GPU-accelerated style application function (zero React render overhead during scroll)
  const applyStackStyles = useCallback((stageFloat: number) => {
    const numCards = TRAINING_STAGES.length;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    // Physical Stack Parameters:
    // Desktop: 0px, 42px, 84px, 126px with scale 1.00, 0.97, 0.94, 0.91
    // Mobile:  0px, 24px, 48px, 72px  with scale 1.00, 0.975, 0.95, 0.925
    const offsetStep = isMobile ? 24 : 42;
    const scaleStep = isMobile ? 0.025 : 0.03;
    const minScale = isMobile ? 0.925 : 0.91;

    for (let i = 0; i < numCards; i++) {
      const cardEl = cardRefs.current[i];
      if (!cardEl) continue;

      if (isReducedMotion) {
        const isActive = i === Math.round(stageFloat);
        cardEl.style.transform = 'none';
        cardEl.style.opacity = isActive ? '1' : '0';
        cardEl.style.zIndex = isActive ? '40' : '10';
        cardEl.style.pointerEvents = isActive ? 'auto' : 'none';
        continue;
      }

      const delta = i - stageFloat;

      let scale = 1;
      let translateY = 0;
      let opacity = 1;
      let zIndex = 40;
      let shadow = '0 20px 35px -10px rgba(0, 0, 0, 0.28), 0 10px 18px -6px rgba(0, 0, 0, 0.16)';
      let pointerEvents: 'auto' | 'none' = 'none';

      if (delta >= 0) {
        // Active card (delta=0) or Queued cards physically stacked underneath (delta > 0)
        // delta=0: scale=1.00, translateY=0px,   zIndex=40, opacity=1.00
        // delta=1: scale=0.97, translateY=42px,  zIndex=30, opacity=0.88
        // delta=2: scale=0.94, translateY=84px,  zIndex=20, opacity=0.72
        // delta=3: scale=0.91, translateY=126px, zIndex=10, opacity=0.55
        scale = Math.max(minScale, 1.0 - delta * scaleStep);
        translateY = delta * offsetStep;
        opacity = Math.max(0.40, 1.0 - delta * 0.16);

        if (delta < 0.5) {
          zIndex = 40;
          shadow = '0 20px 35px -10px rgba(0, 0, 0, 0.28), 0 10px 18px -6px rgba(0, 0, 0, 0.16)';
          pointerEvents = 'auto';
        } else if (delta < 1.5) {
          zIndex = 30;
          shadow = '0 14px 22px -8px rgba(0, 0, 0, 0.20), 0 6px 10px -4px rgba(0, 0, 0, 0.12)';
        } else if (delta < 2.5) {
          zIndex = 20;
          shadow = '0 8px 16px -6px rgba(0, 0, 0, 0.15)';
        } else {
          zIndex = 10;
          shadow = '0 4px 8px -4px rgba(0, 0, 0, 0.10)';
        }
      } else {
        // Outgoing card (delta < 0): slides slightly upward (-32px), scales slightly down (0.97), and fades out
        // as the next card underneath physically rises and takes over the front
        const u = -delta; // u in (0, 3]
        scale = Math.max(0.96, 1.0 - u * 0.04);
        translateY = Math.max(-32, -u * 32);
        opacity = Math.max(0, 1.0 - u * 1.35);
        zIndex = 35; // Positioned right under the incoming card (zIndex 40)
        shadow = '0 10px 20px -10px rgba(0, 0, 0, 0.15)';
        pointerEvents = 'none';
      }

      cardEl.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      cardEl.style.opacity = opacity.toFixed(3);
      cardEl.style.zIndex = String(zIndex);
      cardEl.style.boxShadow = shadow;
      cardEl.style.pointerEvents = pointerEvents;
    }
  }, [isReducedMotion]);

  // High-performance requestAnimationFrame scroll controller (60/120fps direct DOM manipulation)
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const rect = scrollAreaRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = rect.height - windowHeight;

    if (totalScrollable <= 0) return;

    // Responsive progress calculation with clean entry/exit offsets
    const scrolled = -rect.top + 70;
    const rawProgress = Math.min(1, Math.max(0, scrolled / totalScrollable));

    // Continuous progress float: 0.00 to 3.00
    const stageFloat = rawProgress * (TRAINING_STAGES.length - 1);

    // Apply direct style updates immediately (zero React render overhead)
    applyStackStyles(stageFloat);

    // Update active stage integer only when stage boundaries change
    const newStageIndex = Math.min(
      TRAINING_STAGES.length - 1,
      Math.max(0, Math.round(stageFloat))
    );

    if (newStageIndex !== currentStageRef.current) {
      currentStageRef.current = newStageIndex;
      setActiveStageIndex(newStageIndex);
    }
  }, [applyStackStyles]);

  useEffect(() => {
    let ticking = false;

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial mount style application
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      id="pilot-academy"
      className="relative bg-slate-50/70 border-b border-slate-200/80 scroll-mt-24 pt-16 sm:pt-24 pb-16 sm:pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── 1. SECTION HEADER ─── */}
        <div
          className={`text-center max-w-3xl mx-auto space-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
            <span>VAYUDHARA FLIGHT ACADEMY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-slate-900 tracking-tight leading-tight">
            TRAIN. CERTIFY. OPERATE.
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Professional drone pilot training and specialized UAV programs for the next generation of
            commercial operators.
          </p>
        </div>

        {/* ─── 2. ACADEMY BENEFIT STRIP ─── */}
        <div
          className={`mt-8 sm:mt-10 max-w-3xl mx-auto transition-all duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs">
              <div className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>STUDENT ADVANTAGE</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span>15% Scholarship</span>
                <span className="text-slate-300 font-bold">·</span>
                <span>Placement Assistance</span>
                <span className="text-slate-300 font-bold">·</span>
                <span>Industry Exposure</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectCourse('Student Scholarship & Advantage')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors group cursor-pointer shrink-0 py-0.5 px-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              aria-label="Learn more about student scholarships and placement assistance"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ─── 3. TRAINING PATHWAY LABEL ─── */}
        <div
          className={`mt-14 sm:mt-16 mb-6 flex items-center gap-2 border-b border-slate-200/80 pb-3.5 transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Layers className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
            YOUR UAV TRAINING PATHWAY
          </span>
        </div>

        {/* ─── 4. SCROLL-DRIVEN STACKED CARDS CONTAINER ─── */}
        {/* Calibrated scroll distance (~3.2 viewport heights for responsive 350-500ms transitions) */}
        <div
          ref={scrollAreaRef}
          className="relative min-h-[300vh] sm:min-h-[320vh] lg:min-h-[340vh]"
        >
          {/* Sticky Viewport Container */}
          <div className="sticky top-20 md:top-24 h-[calc(100vh-5.5rem)] min-h-[560px] max-h-[820px] flex flex-col justify-center">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* ─── LEFT COLUMN: SYNCHRONIZED TRAINING EDITORIAL PANEL ─── */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative min-h-[440px] sm:min-h-[470px]">
                  {TRAINING_STAGES.map((stage, idx) => {
                    const isActive = idx === activeStageIndex;

                    return (
                      <div
                        key={stage.id}
                        className={`bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[470px] transition-all duration-300 ease-out ${
                          isActive
                            ? 'opacity-100 translate-y-0 pointer-events-auto relative z-10'
                            : 'opacity-0 translate-y-2 pointer-events-none absolute inset-0 z-0'
                        }`}
                      >
                        <div className="space-y-3.5">
                          {/* Category & Badge Header */}
                          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold tracking-widest uppercase ${stage.categoryColor}`}>
                                {stage.category}
                              </span>
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${stage.badgeColor}`}>
                                {stage.badge}
                              </span>
                            </div>

                            {/* Stage Counter */}
                            <span className="text-xs font-mono font-bold text-slate-400">
                              STAGE {stage.stageNumber}
                            </span>
                          </div>

                          {/* Titles */}
                          <div className="space-y-1">
                            <h3 className="text-2xl sm:text-[1.65rem] font-extrabold text-slate-900 tracking-tight leading-tight">
                              {stage.title}
                            </h3>
                            <div className="text-sm font-semibold text-sky-600">
                              {stage.subtitle}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1.5">
                              {stage.description}
                            </p>
                          </div>

                          {/* Curriculum Highlights */}
                          <div className="pt-1.5 space-y-1.5">
                            <div className="text-xs font-bold tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                              <span>Curriculum Highlights:</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {stage.highlights.map((hl, hIdx) => (
                                <li key={hIdx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                                  <span className="font-medium leading-snug">{hl}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Duration & Eligibility Box */}
                          <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700">
                              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                              <div>
                                <div className="text-[10px] uppercase font-bold text-slate-400">Duration</div>
                                <div className="font-semibold text-slate-800">{stage.duration}</div>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700">
                              <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <div className="text-[10px] uppercase font-bold text-slate-400">Eligibility</div>
                                <div className="font-semibold text-slate-800 line-clamp-1" title={stage.eligibility}>
                                  {stage.eligibility}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                            {stage.bottomLabel}
                          </span>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onSelectCourse(stage.title)}
                            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/20 hover:shadow-sky-600/35 shrink-0 transition-all duration-300 hover:scale-[1.02] active:scale-95 group text-xs px-4 py-2"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />}
                          >
                            Enroll / Inquire
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── RIGHT COLUMN: PHYSICAL STACKED TRAINING CARDS DECK ─── */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="relative w-full max-w-[660px] mx-auto h-[320px] sm:h-[380px] md:h-[400px] lg:h-[420px]">
                  {TRAINING_STAGES.map((stage, idx) => (
                    <div
                      key={stage.id}
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      style={{
                        transformOrigin: 'center center',
                        willChange: 'transform, opacity',
                      }}
                      className="absolute inset-0 rounded-[22px] border border-slate-300/80 overflow-hidden bg-slate-900 group"
                    >
                      {/* High-Resolution Training Asset */}
                      <img
                        src={stage.image}
                        alt={stage.alt}
                        loading="lazy"
                        style={{ objectPosition: stage.objectPosition || 'center center' }}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />

                      {/* Subtle Bottom Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent pointer-events-none" />

                      {/* Top-Left Translucent Stage Pill Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wider font-mono uppercase shadow-sm">
                          {stage.pillTag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtle Responsive Stage Progress Indicator */}
                <div className="mt-20 sm:mt-24 lg:mt-28 flex items-center justify-between max-w-[660px] mx-auto px-3 text-xs text-slate-500 font-mono">
                  <span className="font-semibold text-slate-600 tracking-wider">TRAINING STAGE</span>

                  {/* Connected responsive 4-dot indicator */}
                  <div className="flex items-center gap-2">
                    {TRAINING_STAGES.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                          i === activeStageIndex
                            ? 'w-6 bg-sky-600'
                            : 'w-2 bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-bold text-slate-800">
                    {TRAINING_STAGES[activeStageIndex].stageNumber} / 04
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ─── 5. FINAL ACADEMY ADVISORY CONVERSION CTA ─── */}
        <div
          className={`mt-14 sm:mt-20 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="space-y-1.5 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NOT SURE WHERE TO START?</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Personalized UAV Career & Certification Guidance
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tell us your background and career goal. We'll help you choose the right UAV training path.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onSelectCourse('Academy Advisor Consultation')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md shrink-0 transition-all duration-300 hover:scale-[1.02] active:scale-95 group text-xs sm:text-sm px-5 py-2.5"
            rightIcon={<ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
          >
            Talk to an Academy Advisor
          </Button>
        </div>

      </div>
    </section>
  );
};
