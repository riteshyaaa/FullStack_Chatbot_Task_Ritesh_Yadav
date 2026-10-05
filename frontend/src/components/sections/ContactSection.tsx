import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { EnquiryForm } from '../forms/EnquiryForm';

interface ContactSectionProps {
  initialServiceInterest?: string;
  onOpenChat: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialServiceInterest,
  onOpenChat,
}) => {
  return (
    <section className="py-16 sm:py-20 bg-background scroll-mt-24" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>CONNECT WITH VAYUDHARA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Let's Plan Your Next Mission
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Have an enterprise surveying project or looking to enroll in our upcoming DGCA pilot training batch?
            Send our flight ops and admissions team a message or chat with our 24/7 AI assistant.
          </p>
        </div>

        {/* Contact Info & Lead Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-6 transition-all duration-300 hover:border-border/80 hover:shadow-md">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>Flight Operations & Academy</span>
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5 group">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      Flight Center & Academy
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Vayudhara Aero Park, Innovation Corridor, Tech Hub, Sector 44, Delhi NCR, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 group">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      Helpline & Admissions
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Toll-Free: +91 (800) 555-DRONE <br />
                      Direct WhatsApp: +91 98765 43210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 group">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      Email Communications
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Commercial & Quotes: support@vayudhara.example.com <br />
                      Admissions: academy@vayudhara.example.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 group">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      Working Hours
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Monday – Saturday: 9:00 AM – 6:30 PM IST <br />
                      Sunday: Field Flight Operations Only
                    </p>
                  </div>
                </div>
              </div>

              {/* Bot Direct Helper Banner */}
              <div
                onClick={onOpenChat}
                className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-300 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                      Need Immediate Answers?
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Our AI bot answers syllabus, pricing, and specs 24/7
                    </div>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Right Column: Lead Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-bold text-foreground">Submit an Enquiry</h3>
                <p className="text-xs text-muted-foreground">
                  Fill out your mission or training requirements below. Our team responds within 2 business hours.
                </p>
              </div>

              <EnquiryForm initialValues={{ serviceInterest: initialServiceInterest }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
