import React from 'react';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No items found',
  message = 'There are no active records matching this criterion.',
  actionLabel,
  actionLink,
  onActionClick,
}) {
  return (
    <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-300 rounded-2xl max-w-xl mx-auto my-8">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-indigo-50/50">
        <PackageOpen className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
        {message}
      </p>

      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
        >
          {actionLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}

      {actionLabel && onActionClick && !actionLink && (
        <button
          type="button"
          onClick={onActionClick}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}