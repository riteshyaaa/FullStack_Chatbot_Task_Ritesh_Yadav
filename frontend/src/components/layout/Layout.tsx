import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { ChatWidget } from '../chatbot/ChatWidget';
import { Modal } from '../common/Modal';
import { EnquiryForm } from '../forms/EnquiryForm';

export const Layout: React.FC = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenEnquiryModal = (service?: string) => {
    setSelectedService(service);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenEnquiryModal={() => handleOpenEnquiryModal()} />

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet
          context={{
            onOpenEnquiryModal: handleOpenEnquiryModal,
            onOpenChat: handleOpenChat,
          }}
        />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Chatbot Assistant */}
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onClose={() => setIsChatOpen(false)}
        onOpenEnquiryModal={(serviceInterest) => handleOpenEnquiryModal(serviceInterest)}
      />

      {/* Global Quick Enquiry Modal */}
      <Modal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        title="Submit an Enquiry"
        subtitle="Tell us about your project, service requirement, or training goals and our team will help you choose the right solution."
        size="lg"
      >
        <EnquiryForm
          initialValues={{ serviceInterest: selectedService }}
          onSuccess={() => setIsEnquiryModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
