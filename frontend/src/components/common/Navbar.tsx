import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Sparkles } from 'lucide-react';

/** Minimal quadcopter / UAV icon — matches the aerospace brand identity */
const DroneIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Four rotor arcs */}
    <path d="M4.5 4.5a3.5 3.5 0 0 1 5 0" />
    <path d="M14.5 4.5a3.5 3.5 0 0 1 5 0" />
    <path d="M4.5 19.5a3.5 3.5 0 0 0 5 0" />
    <path d="M14.5 19.5a3.5 3.5 0 0 0 5 0" />
    {/* Diagonal arms */}
    <line x1="7" y1="7" x2="10" y2="10" />
    <line x1="17" y1="7" x2="14" y2="10" />
    <line x1="7" y1="17" x2="10" y2="14" />
    <line x1="17" y1="17" x2="14" y2="14" />
    {/* Central body */}
    <rect x="10" y="10" width="4" height="4" rx="1" />
  </svg>
);

interface NavItem {
  id: string;
  label: string;
  isRoute?: boolean;
  path?: string;
  isSecondary?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'drone-services', label: 'Drone Services' },
  { id: 'pilot-academy', label: 'Pilot Academy' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'admin', label: 'Admin Portal', isRoute: true, path: '/admin', isSecondary: true },
];

const SECTION_IDS = ['home', 'drone-services', 'pilot-academy', 'contact'];

interface NavbarProps {
  onOpenEnquiryModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiryModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  const location = useLocation();
  const navigate = useNavigate();

  const isManualScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track header scroll background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver & Scroll Tracking for Active Section on Home Page
  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    const sectionElements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const handleScrollFallback = () => {
      if (isManualScrollRef.current) return;

      if (window.scrollY < 80) {
        setActiveSection('home');
        return;
      }

      // Check if user has reached bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScrollFallback, { passive: true });

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isManualScrollRef.current) return;

      if (window.scrollY < 80) {
        setActiveSection('home');
        return;
      }

      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Choose dominant intersecting section
        const dominant = visibleEntries.reduce((prev, current) =>
          current.intersectionRatio > prev.intersectionRatio ? current : prev
        );
        if (dominant.target.id && SECTION_IDS.includes(dominant.target.id)) {
          setActiveSection(dominant.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-80px 0px -35% 0px',
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    });

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollFallback);
    };
  }, [location.pathname]);

  // Handle programmatic smooth navigation
  const handleNavClick = (item: NavItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsMobileMenuOpen(false);

    // Route-based item (e.g., Admin Portal)
    if (item.isRoute && item.path) {
      navigate(item.path);
      return;
    }

    setActiveSection(item.id);

    // Lock observer to prevent flickering while scrolling passes through sections
    isManualScrollRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 850);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    // If currently not on Home page, navigate to Home with target section
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: item.id } });
      return;
    }

    // On Home page: scroll directly
    if (item.id === 'home') {
      window.scrollTo({
        top: 0,
        behavior: scrollBehavior,
      });
    } else {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({
          behavior: scrollBehavior,
        });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-900/10 shadow-sm shadow-slate-900/5 py-0'
          : 'bg-white/95 backdrop-blur-lg border-b border-slate-200/80 shadow-xs py-0'
      }`}
      style={{
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <div
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* ─── LEFT: Logo & Branding ─── */}
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => handleNavClick(NAV_ITEMS[0], e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleNavClick(NAV_ITEMS[0]);
            }
          }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0 z-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            <DroneIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-xl tracking-tight text-slate-900">
                VAYUDHARA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 border border-sky-500/20">
                Aero
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium tracking-wide mt-1">
              Aerial Intelligence & Drone Services
            </p>
          </div>
        </div>

        {/* ─── CENTER: True Centered Navigation Pill ─── */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 px-3.5 sm:px-4 py-1.5 rounded-full border border-slate-200/80 shadow-inner w-fit max-w-none transition-all duration-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isRoute
              ? location.pathname === item.path
              : location.pathname === '/' && activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleNavClick(item, e)}
                className={`relative px-3 lg:px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] font-medium transition-all duration-300 ease-out whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/80 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 hover:scale-[1.01]'
                } active:scale-95`}
              >
                {item.isSecondary ? (
                  <span className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors">
                    <Shield className="w-3.5 h-3.5 text-sky-600 transition-transform duration-200 group-hover:scale-110" />
                    <span>{item.label}</span>
                  </span>
                ) : (
                  item.label
                )}
              </button>
            );
          })}
        </nav>

        {/* ─── RIGHT: Submit Enquiry CTA ─── */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0 z-10">
          {onOpenEnquiryModal && (
            <button
              type="button"
              onClick={onOpenEnquiryModal}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs lg:text-sm font-semibold shadow-md shadow-sky-600/20 hover:shadow-sky-600/35 hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer group select-none"
            >
              <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 shrink-0" />
              <span>Submit Enquiry</span>
            </button>
          )}
        </div>

        {/* ─── Mobile Menu Toggle ─── */}
        <div className="flex md:hidden items-center gap-2 z-10">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-slide-down transition-all duration-300">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.isRoute
                ? location.pathname === item.path
                : location.pathname === '/' && activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleNavClick(item, e)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer w-full active:scale-[0.99] ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 font-bold border border-sky-100 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.isSecondary && <Shield className="w-4 h-4 text-sky-600" />}
                    {item.label}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />}
                </button>
              );
            })}
          </div>

          {onOpenEnquiryModal && (
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenEnquiryModal();
                }}
                className="w-full justify-center inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/20 transition-all duration-200 text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Enquiry</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
