
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const baseClasses = "py-1 px-2 text-xs font-medium rounded-full";
  const statusClassName = `status-${status.toLowerCase()}`;
  
  return (
    <span className={cn(baseClasses, statusClassName, className)}>
      {status}
    </span>
  );
};

export default StatusBadge;
