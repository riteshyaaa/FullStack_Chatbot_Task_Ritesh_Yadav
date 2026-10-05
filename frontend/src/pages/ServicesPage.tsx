import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ServicesSection } from '../components/sections/ServicesSection';
import { ContactSection } from '../components/sections/ContactSection';

interface LayoutContextType {
  onOpenEnquiryModal: (interest?: string) => void;
  onOpenChat: () => void;
}

export const ServicesPage: React.FC = () => {
  const { onOpenEnquiryModal, onOpenChat } = useOutletContext<LayoutContextType>();

  return (
    <div className="pt-6">
      <ServicesSection onSelectService={(service) => onOpenEnquiryModal(service)} />
      <ContactSection onOpenChat={onOpenChat} />
    </div>
  );
};
