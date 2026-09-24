import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item }) {
  if (!item) return null;

  const itemId = item._id || item.id;
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  return (
    <div className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge type={item.type} />
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              <Tag className="w-3 h-3 text-slate-400" />
              {item.category || 'General'}
            </span>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
          {item.title}
        </h3>

        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed min-h-8">
          {item.description || 'No description provided.'}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location || 'Campus'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate justify-end">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {item.color && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400 border border-slate-300"></span>
            <span>
              Color: <strong className="font-semibold text-slate-700">{item.color}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-400">
          ID: {itemId ? String(itemId).slice(-6).toUpperCase() : 'N/A'}
        </span>
        {itemId && (
          <Link
            to={`/items/${itemId}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            View & Match
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}