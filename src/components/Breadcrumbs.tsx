import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ${className}`}
    >
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
        <span>მთავარი</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-semibold text-slate-900 dark:text-white truncate max-w-[240px]"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
