import React, { useEffect, useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  AlertCircle,
  ShieldCheck,
  Lock,
  Clock
} from 'lucide-react';
import { getClaims, updateClaim } from '../api';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Authority state synced with localStorage
  const [isAuthority, setIsAuthority] = useState(() => {
    return localStorage.getItem('lostfound_authority') === 'true';
  });

  useEffect(() => {
    const handleAuthorityChange = () => {
      setIsAuthority(localStorage.getItem('lostfound_authority') === 'true');
    };
    window.addEventListener('authority_mode_changed', handleAuthorityChange);
    return () => window.removeEventListener('authority_mode_changed', handleAuthorityChange);
  }, []);

  const loadClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClaims();
      setClaims(data || []);
    } catch (err) {
      setError('Failed to fetch claims list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleStatusChange = async (claimId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this claim as ${newStatus}?`)) return;

    setUpdatingId(claimId);
    setFeedback(null);
    try {
      await updateClaim(claimId, { status: newStatus });
      setFeedback(`Claim successfully marked as ${newStatus}`);
      setClaims((prev) =>
        prev.map((c) => (c._id === claimId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Claims & Verification Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAuthority
              ? 'Security Desk Mode: Review claimant proof and authorize item handover.'
              : 'Public View: Track verified recovery claims submitted across the campus.'}
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 self-start">
          Total Claims: {claims.length}
        </div>
      </div>

      {/* Authority Mode Notification Banner */}
      {isAuthority ? (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Campus Security Desk Active: You have authorization to Approve or Reject returns.</span>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-200">
            Authorized
          </span>
        </div>
      ) : (
        <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-600 text-xs">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Handover authorization is restricted to Campus Security. Use the{' '}
            <strong className="text-slate-800">Officer Login</strong> in the top navbar to authenticate.
          </span>
        </div>
      )}

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <Loading count={3} label="Fetching verification records..." />
      ) : claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => {
            const item = claim.itemId || {};
            const isPending = claim.status === 'Pending';
            const formattedDate = claim.createdAt
              ? new Date(claim.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Unknown date';

            return (
              <div
                key={claim._id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <StatusBadge status={claim.status} />
                      <span className="text-xs font-mono text-slate-400">
                        Claim #{claim._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">• Filed {formattedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      Item: {item.title || 'Referenced Property'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Type: <strong className="capitalize">{item.type || 'N/A'}</strong> | Location:{' '}
                      {item.location || 'N/A'} | Category: {item.category || 'N/A'}
                    </p>
                  </div>

                  {/* Actions: ONLY visible to authorized security */}
                  {isAuthority && isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={updatingId === claim._id}
                        onClick={() => handleStatusChange(claim._id, 'Approved')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve (Hand Over)
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === claim._id}
                        onClick={() => handleStatusChange(claim._id, 'Rejected')}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-50 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject (Re-open)
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      {isPending ? (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Awaiting Security Desk Review
                          </span>
                        </>
                      ) : (
                        <span>Settled ({claim.status})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Claimant Proof Message */}
                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3.5 rounded-lg">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-600 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    Claimant Stated Proof:
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "{claim.message || 'No description provided by claimant.'}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No claims filed yet"
          message="When users file ownership proofs on open listings, they will appear here."
        />
      )}
    </div>
  );
}