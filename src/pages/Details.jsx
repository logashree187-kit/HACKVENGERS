import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Tag, 
  Sparkles, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Clock 
} from 'lucide-react';
import { getItemById, getMatches, createClaim } from '../api';
import StatusBadge from '../components/StatusBadge';
import MatchCard from '../components/MatchCard';
import Loading from '../components/Loading';

export default function Details() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Claim Modal/Form States
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [claimError, setClaimError] = useState(null);

  useEffect(() => {
    async function loadItemAndMatches() {
      if (!id || id === 'undefined' || id.trim() === '') {
        setError('Invalid item ID in URL. Please select an item from the Browse catalog.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const raw = await getItemById(id);
        const resolvedItem = raw?.item || raw?.data || raw;

        if (!resolvedItem || (!resolvedItem._id && !resolvedItem.title)) {
          throw new Error('Item record was empty or not found on the server.');
        }

        setItem(resolvedItem);

        // Fetch deterministic matches from backend
        try {
          const matchData = await getMatches(id);
          const resolvedMatches = Array.isArray(matchData)
            ? matchData
            : matchData?.matches || matchData?.data || [];
          setMatches(resolvedMatches);
        } catch (matchErr) {
          console.warn('Notice: matches fetch error:', matchErr);
        }
      } catch (err) {
        console.error('Details load error:', err);
        const serverMsg =
          err.response?.data?.message ||
          (err.message === 'Network Error'
            ? 'Backend server unreachable at http://localhost:5000. Check terminal.'
            : err.message);
        setError(serverMsg || 'Failed to load item record.');
      } finally {
        setLoading(false);
      }
    }

    loadItemAndMatches();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimMessage.trim()) return;

    setSubmittingClaim(true);
    setClaimError(null);

    try {
      await createClaim({
        itemId: id,
        claimantId: item?.reportedBy || '650c00000000000000000001',
        message: claimMessage.trim(),
      });

      setClaimSuccess('Claim filed successfully! Item status automatically changed to Claimed.');
      setItem((prev) => ({ ...prev, status: 'Claimed' }));
      setClaimMessage('');
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to file claim.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) return <Loading count={2} label="Inspecting item record & matching engine..." />;

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Item Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{error || 'Requested item does not exist.'}</p>
        <Link
          to="/browse"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown Date';

  const formattedCreated = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isClaimable = item.status === 'Open';
  const oppositeType = item.type?.toLowerCase() === 'lost' ? 'found' : 'lost';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Feed
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Target Item Specification */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <StatusBadge type={item.type} />
                <StatusBadge status={item.status} />
              </div>
              <span className="text-xs font-mono text-slate-400">ID: {item._id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{item.title}</h1>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-slate-100 py-3.5 text-xs text-slate-600">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Category</span>
                <span className="font-semibold text-slate-800">{item.category}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Location</span>
                <span className="font-semibold text-slate-800">{item.location}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Date</span>
                <span className="font-semibold text-slate-800">{formattedDate}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">Color</span>
                <span className="font-semibold text-slate-800">{item.color || 'Not specified'}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Detailed Description
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.description || 'No detailed description logged.'}
              </div>
            </div>

            {formattedCreated && (
              <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Reported into database on {formattedCreated}
              </div>
            )}

            {/* Claim Box */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Are you the verified owner?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit proof-of-possession identifiers for administrative review.
                </p>
              </div>

              {isClaimable ? (
                <button
                  type="button"
                  onClick={() => setClaimOpen(!claimOpen)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  {claimOpen ? 'Close Form' : 'Claim This Item'}
                </button>
              ) : (
                <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500">
                  Item is {item.status}
                </div>
              )}
            </div>

            {/* Claim Drawer */}
            {claimOpen && isClaimable && (
              <form onSubmit={handleClaimSubmit} className="mt-6 pt-6 border-t border-dashed border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Submit Verification Details
                </h4>

                {claimError && (
                  <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                    {claimError}
                  </div>
                )}
                {claimSuccess && (
                  <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {claimSuccess}
                  </div>
                )}

                <textarea
                  rows={3}
                  required
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  placeholder="Provide proof (serial numbers, wallpaper description, stickers, secret scratch marks, exact contents)..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingClaim}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Deterministic Smart Matches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Smart Matches ({matches.length})
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400">100-pt engine</span>
          </div>

          <p className="text-xs text-slate-500 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
            Comparing opposite records (
            <strong className="font-bold text-indigo-900 capitalize">
              {oppositeType}
            </strong>
            ) across category, location proximity, color, and keyword overlaps.
          </p>

          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((m, idx) => (
                <MatchCard
                  key={m._id || m.item?._id || m.matchedItem?._id || idx}
                  match={m}
                  fallbackType={oppositeType}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
              No counter-items scored above match threshold yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}