import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ContactSection } from '../components/sections/ContactSection';
import { AboutSection } from '../components/sections/AboutSection';

interface LayoutContextType {
  onOpenEnquiryModal: (interest?: string) => void;
  onOpenChat: () => void;
}

export const ContactPage: React.FC = () => {
  const { onOpenEnquiryModal, onOpenChat } = useOutletContext<LayoutContextType>();

  return (
    <div className="pt-6">
      <ContactSection onOpenChat={onOpenChat} />
      <AboutSection onOpenChat={onOpenChat} onOpenEnquiryModal={() => onOpenEnquiryModal()} />
    </div>
  );
};
