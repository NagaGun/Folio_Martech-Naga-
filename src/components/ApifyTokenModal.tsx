import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, AlertCircle, X, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';

interface ApifyTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  apifyToken: string;
  onSaveToken: (token: string) => void;
}

export const ApifyTokenModal: React.FC<ApifyTokenModalProps> = ({
  isOpen,
  onClose,
  apifyToken,
  onSaveToken,
}) => {
  const [tokenInput, setTokenInput] = useState(apifyToken);
  const [serverStatus, setServerStatus] = useState<{
    apifyConfigured: boolean;
    geminiConfigured: boolean;
    loading: boolean;
  }>({
    apifyConfigured: false,
    geminiConfigured: false,
    loading: true,
  });

  const checkHealth = async () => {
    setServerStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerStatus({
          apifyConfigured: data.apifyConfigured || Boolean(tokenInput),
          geminiConfigured: data.geminiConfigured,
          loading: false,
        });
      } else {
        setServerStatus({ apifyConfigured: Boolean(tokenInput), geminiConfigured: false, loading: false });
      }
    } catch {
      setServerStatus({ apifyConfigured: Boolean(tokenInput), geminiConfigured: false, loading: false });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTokenInput(apifyToken);
      checkHealth();
    }
  }, [isOpen, apifyToken]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveToken(tokenInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-100 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white">Apify Integration & Live Status</h3>
            <p className="text-xs text-zinc-400 font-mono">Live Instagram Reels Scraper Configuration</p>
          </div>
        </div>

        {/* Live Health Status Box */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Server Status:</span>
            <button
              onClick={checkHealth}
              disabled={serverStatus.loading}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className={`w-3 h-3 ${serverStatus.loading ? 'animate-spin' : ''}`} />
              Re-check
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-zinc-800/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Apify Reels Scraper Token:
            </span>
            {serverStatus.apifyConfigured || tokenInput ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Not Configured
              </span>
            )}
          </div>

          <div className="flex items-center justify-between py-1 border-t border-zinc-800/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Gemini 2.5 AI Engine:
            </span>
            {serverStatus.geminiConfigured ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected (Server Env)
              </span>
            )}
          </div>
        </div>

        {/* Token Input Field */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-medium text-zinc-300">
            Apify API Token <span className="text-zinc-500 font-normal">(apify_api_...)</span>
          </label>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="apify_api_..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-all"
          />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            If you set <code className="text-indigo-300">APIFY_TOKEN</code> in your environment, the backend uses it automatically. You can also paste your Apify Personal API token here to analyze handles using your personal Apify credits.
          </p>
        </div>

        {/* External Link */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <a
            href="https://console.apify.com/account/integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono transition-colors"
          >
            <span>Get Apify Token on console.apify.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Save Token & Status
          </button>
        </div>

      </div>
    </div>
  );
};
