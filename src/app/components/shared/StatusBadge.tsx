import React from 'react';
import { getStatusColor } from '../../../utils/constants';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * Shared status badge component
 */
export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
