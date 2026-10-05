import React from 'react';
import { EnquiryStatus, UserType } from '../../types';

interface StatusBadgeProps {
  status?: EnquiryStatus;
  userType?: UserType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, userType, className = '' }) => {
  if (status) {
    const statusConfig = {
      New: {
        label: 'New',
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500',
      },
      Contacted: {
        label: 'Contacted',
        bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        dot: 'bg-blue-500',
      },
      InProgress: {
        label: 'In Progress',
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        dot: 'bg-amber-500',
      },
      Closed: {
        label: 'Closed',
        bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
        dot: 'bg-gray-500',
      },
    };

    const config = statusConfig[status] || statusConfig.New;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  if (userType) {
    const typeConfig = {
      Student: {
        label: 'Student',
        bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      },
      Customer: {
        label: 'Commercial Customer',
        bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      },
      Other: {
        label: 'General / Other',
        bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      },
    };

    const config = typeConfig[userType] || typeConfig.Other;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
      >
        {config.label}
      </span>
    );
  }

  return null;
};
