import React from 'react';
import { X, Search, Sparkles, ShieldCheck, ArrowRight, Trash2, History, UserCheck } from 'lucide-react';
import { getReportForHandle } from '../data/mockReports';

interface SavedHandlesModalProps {
  savedHandles: string[];
  onSelectHandle: (handle: string) => void;
  onRemoveHandle: (handle: string) => void;
  onClose: () => void;
}

export const SavedHandlesModal: React.FC<SavedHandlesModalProps> = ({
  savedHandles,
  onSelectHandle,
  onRemoveHandle,
  onClose,
}) => {
  const [filterText, setFilterText] = React.useState('');

  const filtered = savedHandles.filter((h) =>
    h.toLowerCase().includes(filterText.toLowerCase().replace(/^@/, ''))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative my-auto max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Saved Analyzed Handles</span>
                <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  {savedHandles.length}
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                Click any handle below to instantly re-analyze and refind its top viral hooks & captions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search filter if handles > 3 */}
        {savedHandles.length > 3 && (
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search saved handles..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* List of saved handles */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/40 border border-zinc-800/60 rounded-xl space-y-2">
              <p className="text-sm font-mono text-zinc-400">No saved handles found</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Any Instagram handle you analyze will automatically be stored here for instant reference.
              </p>
            </div>
          ) : (
            filtered.map((handle) => {
              const reportSnippet = getReportForHandle(handle);

              return (
                <div
                  key={handle}
                  className="bg-zinc-900/80 border border-zinc-800/90 hover:border-indigo-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={reportSnippet.avatarUrl}
                      alt={handle}
                      className="w-10 h-10 rounded-lg object-cover ring-1 ring-zinc-700 bg-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">@{handle}</span>
                        {reportSnippet.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />}
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                          {reportSnippet.archetype}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">
                        {reportSnippet.followerCount} followers • Avg {reportSnippet.avgViralViews} views
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectHandle(handle);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold font-mono text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-all shadow-md group-hover:scale-102"
                    >
                      <span>Analyze Hooks</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveHandle(handle)}
                      className="text-zinc-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Remove from saved handles"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] font-mono text-zinc-500">
            Clicking a handle re-runs the virality engine and pulls fresh pattern evidence.
          </p>
        </div>

      </div>
    </div>
  );
};
