import React, { useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Crosshair, Radio, GraduationCap } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onOpenChat: () => void;
  onOpenEnquiryModal: (interest?: string) => void;
  onExploreServices?: () => void;
  onExploreCourses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenEnquiryModal,
  onExploreServices,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure the video plays on mount (some browsers block autoplay until interaction)
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        /* autoplay blocked by browser policy — video stays paused, poster shows */
      });
    }
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-100 dark:to-slate-950 min-h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-4.5rem)] flex items-center scroll-mt-24"
    >
      {/* Subtle grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Smooth transition gradient into the light gray / white background below */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-slate-100 via-slate-100/50 to-transparent dark:from-slate-950 dark:via-slate-950/50 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      <div className="relative z-[5] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* ─── LEFT COLUMN: Text Content (45%) ─── */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left animate-fade-in-up">

            {/* Enterprise Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400 tracking-wide uppercase transition-all duration-300 hover:bg-sky-500/15 hover:border-sky-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Enterprise UAV Services & Training</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[3rem] font-extrabold tracking-tight leading-[1.14] text-white">
              Enterprise Drone Services &{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                Aerial Intelligence
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Professional UAV solutions for LiDAR surveying, precision agriculture, industrial inspection, aerial media, and pilot training.
            </p>

            {/* CTA Buttons — two only */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenEnquiryModal('Commercial Services')}
                className="shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
                rightIcon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
              >
                Request a Quote
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onExploreServices}
                className="border-slate-600 text-slate-200 hover:text-white hover:bg-slate-800/80 hover:border-slate-400 font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Explore Drone Services
              </Button>
            </div>

            {/* Trust Points (Clean, unencapsulated, bright and directly readable) */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2 text-slate-200 transition-colors duration-200 hover:text-white">
                <Crosshair className="w-4 h-4 text-sky-400 shrink-0 transition-transform duration-200 hover:scale-110" />
                <span>Precision Mapping</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 transition-colors duration-200 hover:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 hover:scale-110" />
                <span>Enterprise UAV Operations</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 transition-colors duration-200 hover:text-white">
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 hover:scale-110" />
                <span>Professional Pilot Training</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Video Panel (55%) ─── */}
          <div className="lg:col-span-7 relative flex items-center justify-center animate-scale-in">
            {/* Subtle atmospheric glow behind video */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-60 pointer-events-none animate-pulse-subtle" />

            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/15 bg-slate-950 transition-transform duration-500 hover:scale-[1.01]">

              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full aspect-[16/10] max-h-[360px] sm:max-h-[420px] lg:max-h-[460px] xl:max-h-[500px] object-cover"
              >
                <source src="/videos/drone-hero.mp4" type="video/mp4" />
              </video>

              {/* Gradient Overlays for depth and edge integration */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />

              {/* Video Overlay Label */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white/90 uppercase">
                    Commercial UAV / Survey Operations
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
