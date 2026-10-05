import React from 'react';
import { IEnquiry, EnquiryStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

interface EnquiryTableProps {
  enquiries: IEnquiry[];
  isLoading: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
  };
  onPageChange?: (newPage: number) => void;
  onViewDetails?: (enquiry: IEnquiry) => void;
  onSelect?: (enquiry: IEnquiry) => void;
  onDeleteClick: (enquiry: IEnquiry) => void;
  onStatusChange: (id: string, status: EnquiryStatus) => Promise<any>;
}

export const EnquiryTable: React.FC<EnquiryTableProps> = ({
  enquiries,
  isLoading,
  meta: propMeta,
  pagination,
  onPageChange: propOnPageChange,
  onViewDetails,
  onSelect,
  onDeleteClick,
  onStatusChange,
}) => {
  const meta = pagination || propMeta || { total: enquiries.length, page: 1, limit: 10, totalPages: 1 };
  const handlePageChange = pagination?.onPageChange || propOnPageChange || (() => {});
  const handleSelect = onSelect || onViewDetails || (() => {});
  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  if (isLoading && enquiries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 flex justify-center">
        <LoadingSpinner size="lg" text="Loading enquiries database..." />
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <EmptyState
        title="No Enquiries Found"
        description="No customer or student leads matched your current search criteria or filters."
      />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Date Received</th>
              <th className="py-3 px-4">Contact & Lead</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Service / Interest</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {enquiries.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-muted/30 transition-colors group cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                {/* Date */}
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </td>

                {/* Name & Contact */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-foreground">{item.name}</div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {item.email}
                    </span>
                    {item.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {item.phone}
                      </span>
                    )}
                  </div>
                </td>

                {/* User Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge userType={item.userType} />
                </td>

                {/* Service Interest */}
                <td className="py-3.5 px-4 max-w-xs truncate text-xs text-foreground">
                  <span className="font-medium">
                    {item.serviceInterest || <span className="text-muted-foreground italic">General</span>}
                  </span>
                </td>

                {/* Status Dropdown */}
                <td
                  className="py-3.5 px-4 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()} // Prevent opening detail modal
                >
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange(item.id, e.target.value as EnquiryStatus)}
                    className="text-xs font-semibold px-2 py-1 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                  >
                    <option value="New">🟢 New</option>
                    <option value="Contacted">🔵 Contacted</option>
                    <option value="InProgress">🟡 In Progress</option>
                    <option value="Closed">⚪ Closed</option>
                  </select>
                </td>

                {/* Actions */}
                <td
                  className="py-3.5 px-4 whitespace-nowrap text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleSelect(item)}
                      title="View Lead Details"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      aria-label="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClick(item)}
                      title="Delete Lead"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                      aria-label="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          Showing{' '}
          <span className="font-semibold text-foreground">
            {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-foreground">
            {Math.min(meta.page * meta.limit, meta.total)}
          </span>{' '}
          of <span className="font-semibold text-foreground">{meta.total}</span> leads
        </div>

        {meta.totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => handlePageChange(meta.page - 1)}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <span className="px-3 py-1 font-medium text-foreground bg-card rounded-md border border-border">
              {meta.page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => handlePageChange(meta.page + 1)}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
