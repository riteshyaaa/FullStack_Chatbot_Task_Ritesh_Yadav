import React from 'react';
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react';
import { IEnquiryFilters, UserType, EnquiryStatus } from '../../types';
import { Button } from '../common/Button';

interface EnquiryFiltersProps {
  filters: IEnquiryFilters;
  onFilterChange: (newFilters: Partial<IEnquiryFilters>) => void;
  onRefresh: () => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export const EnquiryFilters: React.FC<EnquiryFiltersProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  onReset,
  isLoading = false,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ userType: (e.target.value as UserType) || undefined });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: (e.target.value as EnquiryStatus) || undefined });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortBy: e.target.value as any });
  };

  const handleOrderToggle = () => {
    onFilterChange({ order: filters.order === 'asc' ? 'desc' : 'asc' });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onFilterChange({
        search: '',
        userType: undefined,
        status: undefined,
        sortBy: 'createdAt',
        order: 'desc',
        page: 1,
      });
    }
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.userType || filters.status || (filters.sortBy && filters.sortBy !== 'createdAt')
  );

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search leads by name, email, phone, or service interest..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Filter Dropdowns & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* User Type Filter */}
          <div className="flex-1 sm:flex-none">
            <select
              value={filters.userType || ''}
              onChange={handleUserTypeChange}
              className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Inquiry Types</option>
              <option value="Student">Students Only</option>
              <option value="Customer">Commercial Customers</option>
              <option value="Other">Other / General</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 sm:flex-none">
            <select
              value={filters.status || ''}
              onChange={handleStatusChange}
              className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="InProgress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex-1 sm:flex-none">
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={handleSortChange}
              className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="createdAt">Sort: Date Received</option>
              <option value="name">Sort: Name</option>
              <option value="status">Sort: Status</option>
              <option value="userType">Sort: User Type</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOrderToggle}
            title={filters.order === 'asc' ? 'Ascending Order' : 'Descending Order'}
            className="px-2.5"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isLoading}
            title="Refresh list"
            className="px-2.5"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
