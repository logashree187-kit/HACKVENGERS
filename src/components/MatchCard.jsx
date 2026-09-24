import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, MapPin, Tag, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MatchCard({ match, fallbackType }) {
  if (!match) return null;

  // Universally resolve candidate item data across different backend controller structures
  const resolveCandidateItem = (m) => {
    // 1. If candidate is nested under matchedItem, item, candidate, match, targetItem, etc.
    const nestedKeys = [
      'matchedItem',
      'item',
      'candidate',
      'match',
      'targetItem',
      'oppositeItem',
      'doc',
      '_doc',
    ];

    for (const key of nestedKeys) {
      const candidate = m[key];
      if (candidate && typeof candidate === 'object' && (candidate.title || candidate.category || candidate._id)) {
        return candidate;
      }
    }

    // 2. If properties exist directly on match object
    if (m.title || m.category || m.location) {
      return m;
    }

    return m.item && typeof m.item === 'object' ? m.item : m;
  };

  const item = resolveCandidateItem(match);

  // Extract score (handles score, matchScore, matchPercentage, percentage, points)
  const score = Math.round(
    Number(
      match.score ??
      match.matchScore ??
      match.matchPercentage ??
      match.percentage ??
      match.points ??
      item.score ??
      0
    )
  );

  // Extract reasons array
  const reasons = Array.isArray(match.reasons)
    ? match.reasons
    : Array.isArray(match.matchReasons)
    ? match.matchReasons
    : Array.isArray(item.reasons)
    ? item.reasons
    : [];

  // Extract valid MongoDB ObjectId
  const itemId =
    item._id ||
    item.id ||
    (typeof match.item === 'string' ? match.item : null) ||
    match.itemId ||
    match._id;

  // Determine item type (default to opposite of parent if missing)
  const itemType = item.type || match.type || fallbackType || 'found';
  const itemStatus = item.status || match.status || 'Open';

  const getScoreTheme = (val) => {
    if (val >= 70) return { ring: 'border-emerald-500 text-emerald-600 bg-emerald-50' };
    if (val >= 40) return { ring: 'border-indigo-500 text-indigo-600 bg-indigo-50' };
    return { ring: 'border-amber-500 text-amber-600 bg-amber-50' };
  };

  const theme = getScoreTheme(score);

  return (
    <div className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-4 shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge type={itemType} />
            <StatusBadge status={itemStatus} />
            {item.category && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                <Tag className="w-2.5 h-2.5 text-slate-400" />
                {item.category}
              </span>
            )}
            {itemId && (
              <span className="text-[10px] font-mono text-slate-400">
                #{String(itemId).slice(-5).toUpperCase()}
              </span>
            )}
          </div>

          {/* Matched Item Title */}
          <h4 className="font-bold text-slate-900 text-sm truncate">
            {item.title || 'Matched Counter-Item'}
          </h4>
        </div>

        {/* Circular Match Percentage Ring */}
        <div
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 shrink-0 ${theme.ring}`}
        >
          <span className="text-xs font-black leading-none">{score}%</span>
          <span className="text-[8px] font-bold uppercase tracking-tight text-slate-500 mt-0.5">
            Match
          </span>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
        {item.description || 'No additional description provided.'}
      </p>

      {/* Deterministic Reason Breakdown Chips */}
      {reasons.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Match Breakdown:
          </p>
          <div className="flex flex-wrap gap-1">
            {reasons.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info & Inspection Link */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate text-[11px]">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{item.location || 'Campus venue'}</span>
        </div>

        {itemId ? (
          <Link
            to={`/items/${itemId}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5 shrink-0"
          >
            Inspect <ArrowRight className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-[10px] text-slate-400 italic">No link available</span>
        )}
      </div>
    </div>
  );
}