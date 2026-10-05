import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { CoursesSection } from '../components/sections/CoursesSection';
import { ContactSection } from '../components/sections/ContactSection';

interface LayoutContextType {
  onOpenEnquiryModal: (interest?: string) => void;
  onOpenChat: () => void;
}

export const CoursesPage: React.FC = () => {
  const { onOpenEnquiryModal, onOpenChat } = useOutletContext<LayoutContextType>();

  return (
    <div className="pt-6">
      <CoursesSection onSelectCourse={(course) => onOpenEnquiryModal(course)} />
      <ContactSection onOpenChat={onOpenChat} />
    </div>
  );
};
