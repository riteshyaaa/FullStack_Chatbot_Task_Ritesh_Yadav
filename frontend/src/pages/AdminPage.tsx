import React, { useState } from 'react';
import { useEnquiries } from '../hooks/useEnquiries';
import { useToast } from '../contexts/ToastContext';
import { StatsOverview } from '../components/admin/StatsOverview';
import { EnquiryFilters } from '../components/admin/EnquiryFilters';
import { EnquiryTable } from '../components/admin/EnquiryTable';
import { EnquiryDetailModal } from '../components/admin/EnquiryDetailModal';
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal';
import { IEnquiry, EnquiryStatus } from '../types';
import { ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AdminPage: React.FC = () => {
  const {
    enquiries,
    filters,
    meta,
    isLoading,
    error,
    updateFilters,
    fetchEnquiries,
    updateStatus,
    deleteEnquiry,
  } = useEnquiries();

  const { success, error: toastError, info } = useToast();

  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<IEnquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await updateStatus(id, newStatus);
      success(`Lead status successfully updated to ${newStatus}.`);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to update lead status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteEnquiry(enquiryToDelete.id);
      success(`Inquiry for "${enquiryToDelete.name}" was permanently deleted.`);
      if (selectedEnquiry && selectedEnquiry.id === enquiryToDelete.id) {
        setSelectedEnquiry(null);
      }
      setEnquiryToDelete(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to delete enquiry.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-background min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Vayudhara Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Lead & Pilot Admission Portal
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Real-time inbound lead management, pilot candidate records, and enterprise service
              queries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchEnquiries();
                info('Refreshed leads data.');
              }}
              isLoading={isLoading}
              className="gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Records</span>
            </Button>
          </div>
        </div>

        {/* Global Error Banner if API Fails */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-between text-destructive text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <Button size="xs" variant="outline" onClick={() => fetchEnquiries()}>
              Retry
            </Button>
          </div>
        )}

        {/* High-Level Metric Stat Cards */}
        <StatsOverview enquiries={enquiries} />

        {/* Search, Status & Type Filter Toolbars */}
        <EnquiryFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={() =>
            updateFilters({
              search: '',
              userType: undefined,
              status: undefined,
              page: 1,
              sortBy: 'createdAt',
              order: 'desc',
            })
          }
          onRefresh={() => fetchEnquiries()}
        />

        {/* Dynamic Enquiries Data Table */}
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <EnquiryTable
            enquiries={enquiries}
            isLoading={isLoading}
            pagination={{
              page: meta.page,
              limit: meta.limit,
              total: meta.total,
              totalPages: meta.totalPages,
              onPageChange: (newPage) => updateFilters({ page: newPage }),
            }}
            onSelect={(enquiry) => setSelectedEnquiry(enquiry)}
            onStatusChange={handleStatusChange}
            onDeleteClick={(enquiry) => setEnquiryToDelete(enquiry)}
          />
        </div>
      </div>

      {/* Detailed Lead Modal Viewer */}
      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleStatusChange}
        onDeleteClick={(enquiry) => {
          setSelectedEnquiry(null);
          setEnquiryToDelete(enquiry);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!enquiryToDelete}
        enquiryName={enquiryToDelete?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEnquiryToDelete(null)}
      />
    </div>
  );
};
