import React, { useState } from 'react';
import { IEnquiry } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  enquiry?: IEnquiry | null;
  enquiryName?: string;
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: ((id: string) => Promise<void> | void) | (() => Promise<void> | void);
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  enquiry,
  enquiryName,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  isDeleting: propIsDeleting,
}) => {
  const [internalDeleting, setInternalDeleting] = useState(false);
  const isDeleting = propIsDeleting !== undefined ? propIsDeleting : internalDeleting;
  const handleClose = onCancel || onClose || (() => {});
  const displayName = enquiryName || enquiry?.name || 'this lead';
  const displayEmail = enquiry?.email;

  const handleDelete = async () => {
    setInternalDeleting(true);
    try {
      if (enquiry) {
        await (onConfirm as (id: string) => Promise<void> | void)(enquiry.id);
      } else {
        await (onConfirm as () => Promise<void> | void)();
      }
      handleClose();
    } finally {
      setInternalDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      title={
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle className="w-5 h-5" />
          <span>Confirm Lead Deletion</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Are you sure you want to permanently delete the enquiry from{' '}
          <strong className="font-semibold text-foreground">{displayName}</strong>
          {displayEmail && (
            <>
              {' '}(<span className="text-muted-foreground">{displayEmail}</span>)
            </>
          )}?
        </p>

        <p className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border">
          This action cannot be undone and will remove the record from the database.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Permanently Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
