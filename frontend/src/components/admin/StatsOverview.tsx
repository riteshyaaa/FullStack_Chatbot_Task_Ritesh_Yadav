import React from 'react';
import { IEnquiry } from '../../types';
import { Inbox, CheckCircle, Clock, Users, Briefcase, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  enquiries: IEnquiry[];
  totalFromMeta?: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ enquiries, totalFromMeta }) => {
  const total = totalFromMeta !== undefined ? totalFromMeta : enquiries.length;
  const newCount = enquiries.filter((e) => e.status === 'New').length;
  const inProgressCount = enquiries.filter((e) => e.status === 'InProgress').length;
  const closedCount = enquiries.filter((e) => e.status === 'Closed').length;
  const studentCount = enquiries.filter((e) => e.userType === 'Student').length;
  const customerCount = enquiries.filter((e) => e.userType === 'Customer').length;

  const stats = [
    {
      label: 'Total Leads',
      value: total,
      icon: <Inbox className="w-5 h-5 text-primary" />,
      bg: 'bg-primary/10 border-primary/20',
    },
    {
      label: 'New & Unread',
      value: newCount,
      icon: <AlertCircle className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Closed / Handled',
      value: closedCount,
      icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Students Enrolled',
      value: studentCount,
      icon: <Users className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Enterprise Clients',
      value: customerCount,
      icon: <Briefcase className="w-5 h-5 text-sky-500" />,
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-border bg-card/60 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
            <div className={`p-1.5 rounded-lg border ${stat.bg}`}>{stat.icon}</div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
