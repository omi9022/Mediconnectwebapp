import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

/**
 * Shared stat card component for dashboard metrics
 */
export const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color = 'blue',
  onClick 
}: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    teal: 'bg-teal-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500'
  }[color] || 'bg-blue-500';

  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            <TrendIcon size={16} />
            {change}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
};
