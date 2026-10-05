import React, { useState } from 'react';
import { IEnquiry, EnquiryStatus } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import {
  Mail,
  Phone,
  Calendar,
  Tag,
  MessageSquare,
  Trash2,
} from 'lucide-react';

interface EnquiryDetailModalProps {
  enquiry: IEnquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: EnquiryStatus) => Promise<any>;
  onDeleteClick: (enquiry: IEnquiry) => void;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiry,
  isOpen,
  onClose,
  onStatusChange,
  onDeleteClick,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus>(
    enquiry?.status || 'New'
  );

  React.useEffect(() => {
    if (enquiry) {
      setSelectedStatus(enquiry.status);
    }
  }, [enquiry]);

  if (!enquiry) return null;

  const handleStatusUpdate = async (newStatus: EnquiryStatus) => {
    setSelectedStatus(newStatus);
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(enquiry.id, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <span>Lead / Enquiry Details</span>
          <span className="text-xs font-mono font-normal text-muted-foreground">
            #{enquiry.id.slice(-6)}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Summary Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/40 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              {enquiry.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{enquiry.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge userType={enquiry.userType} />
                <StatusBadge status={enquiry.status} />
              </div>
            </div>
          </div>

          {/* Quick Status Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusUpdate(e.target.value as EnquiryStatus)}
              disabled={isUpdatingStatus}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="InProgress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Contact & Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Email Address</span>
            </div>
            <a
              href={`mailto:${enquiry.email}`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors block break-all"
            >
              {enquiry.email}
            </a>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>Phone Contact</span>
            </div>
            {enquiry.phone ? (
              <a
                href={`tel:${enquiry.phone}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors block"
              >
                {enquiry.phone}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground italic">Not provided</span>
            )}
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Service / Course Interest</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {enquiry.serviceInterest || 'General Inquiry'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Submitted At</span>
            </div>
            <p className="text-sm font-medium text-foreground">{formatDate(enquiry.createdAt)}</p>
          </div>
        </div>

        {/* Message / Requirement Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>Message / Project Description:</span>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/30 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {enquiry.message}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDeleteClick(enquiry);
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Lead
          </Button>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
