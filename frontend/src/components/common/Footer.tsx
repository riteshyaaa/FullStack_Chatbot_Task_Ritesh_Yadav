import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

/** Clear, high-contrast quadcopter / UAV icon with rotor accents */
const DroneIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* 4 Rotors */}
    <path d="M4.5 4.5a3.5 3.5 0 0 1 5 0" />
    <path d="M14.5 4.5a3.5 3.5 0 0 1 5 0" />
    <path d="M4.5 19.5a3.5 3.5 0 0 0 5 0" />
    <path d="M14.5 19.5a3.5 3.5 0 0 0 5 0" />
    {/* Connecting Diagonal Arms */}
    <line x1="7" y1="7" x2="10" y2="10" />
    <line x1="17" y1="7" x2="14" y2="10" />
    <line x1="7" y1="17" x2="10" y2="14" />
    <line x1="17" y1="17" x2="14" y2="14" />
    {/* Center Avionics Fuselage */}
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" fill="currentColor" fillOpacity="0.25" />
    {/* Rotor Motors */}
    <circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" />
    <circle cx="19.5" cy="4.5" r="1.2" fill="currentColor" />
    <circle cx="4.5" cy="19.5" r="1.2" fill="currentColor" />
    <circle cx="19.5" cy="19.5" r="1.2" fill="currentColor" />
  </svg>
);

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (sectionId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: scrollBehavior });
      }
    }
  };

  return (
    <footer className="border-t border-border bg-card/60 text-foreground pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/60">
          {/* Column 1: Brand Info & UAV Badge */}
          <div className="lg:col-span-2 space-y-4">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleScrollTo('home', e)}
              className="flex items-center gap-3 cursor-pointer group select-none w-fit"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-primary to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <DroneIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-black text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                    VAYUDHARA
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                    Aero
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium tracking-wide mt-1">
                  Aerial Intelligence & Drone Services
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Empowering agriculture, infrastructure inspection, GIS mapping, and media with
              cutting-edge enterprise drone solutions and DGCA-certified remote pilot academy training.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Professional UAV Training & Operations</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('home', e)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('drone-services', e)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left cursor-pointer"
                >
                  Commercial Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('pilot-academy', e)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left cursor-pointer"
                >
                  Pilot Academy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('contact', e)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left cursor-pointer"
                >
                  Contact & Locations
                </button>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors text-left flex items-center gap-1"
                >
                  Admin Portal <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy Courses */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Academy
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('pilot-academy', e)}
                  className="hover:text-primary transition-colors text-left cursor-pointer"
                >
                  DGCA Small & Medium RPC
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('pilot-academy', e)}
                  className="hover:text-primary transition-colors text-left cursor-pointer"
                >
                  GIS & Photogrammetry 3D
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('pilot-academy', e)}
                  className="hover:text-primary transition-colors text-left cursor-pointer"
                >
                  Precision Agri-Spraying
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('pilot-academy', e)}
                  className="hover:text-primary transition-colors text-left cursor-pointer"
                >
                  Thermal Asset Inspection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleScrollTo('drone-services', e)}
                  className="hover:text-primary transition-colors text-left cursor-pointer"
                >
                  Cinema FPV Heavy Lift
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Support & Interactive AI Assistant */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs">Sector 44, Tech Corridor, Aero Park, Delhi NCR, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs">+91 (800) 555-DRONE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs">support@vayudhara.example.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Vayudhara Aero. All rights reserved.</p>
          <div className="flex items-center gap-1 m-6">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by Ritesh Yadav </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
