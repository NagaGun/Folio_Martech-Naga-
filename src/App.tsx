import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LandingInput } from './components/LandingInput';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { ReportView } from './components/ReportView';
import { DashboardView } from './components/DashboardView';
import { SavedHandlesModal } from './components/SavedHandlesModal';
import { UserHandleModal } from './components/UserHandleModal';
import { SignInModal } from './components/SignInModal';
import { ApifyTokenModal } from './components/ApifyTokenModal';
import { getReportForHandle, fetchLiveReportForHandle } from './data/mockReports';
import { CreatorReport } from './types';

const INITIAL_SAVED_HANDLES = ['alexhormozi', 'hubermanlab', 'imangadzhi'];

export default function App() {
  const [view, setView] = useState<'input' | 'loading' | 'report' | 'dashboard'>('input');
  const [targetHandle, setTargetHandle] = useState<string>('');
  const [currentReport, setCurrentReport] = useState<CreatorReport | null>(null);
  const analysisRequestIdRef = useRef(0);

  // Apify Token and active status
  const [apifyToken, setApifyToken] = useState<string>(() => {
    try {
      return localStorage.getItem('reel_dna_apify_token') || '';
    } catch {
      return '';
    }
  });
  const [isApifyActive, setIsApifyActive] = useState<boolean>(false);

  // Saved Handles history state with localStorage fallback
  const [savedHandles, setSavedHandles] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('reel_dna_saved_handles');
      return stored ? JSON.parse(stored) : INITIAL_SAVED_HANDLES;
    } catch (e) {
      return INITIAL_SAVED_HANDLES;
    }
  });

  // User personal Instagram handle persistence
  const [userPersonalHandle, setUserPersonalHandle] = useState<string>(() => {
    try {
      return localStorage.getItem('reel_dna_user_handle') || '';
    } catch (e) {
      return '';
    }
  });

  // Modal open states
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [showUserHandleModal, setShowUserHandleModal] = useState<boolean>(false);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [showApifyModal, setShowApifyModal] = useState<boolean>(false);

  // Health check for Apify active status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsApifyActive(Boolean(data.apifyConfigured || apifyToken));
      })
      .catch(() => {
        setIsApifyActive(Boolean(apifyToken));
      });
  }, [apifyToken]);

  // Sync savedHandles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('reel_dna_saved_handles', JSON.stringify(savedHandles));
    } catch (e) {
      // ignore
    }
  }, [savedHandles]);

  const handleSaveApifyToken = (token: string) => {
    setApifyToken(token);
    try {
      localStorage.setItem('reel_dna_apify_token', token);
    } catch {
      // ignore
    }
    setIsApifyActive(Boolean(token));
  };

  // Sync userPersonalHandle to localStorage
  const handleSaveUserHandle = (handle: string) => {
    const clean = handle.trim().replace(/^@/, '');
    setUserPersonalHandle(clean);
    try {
      localStorage.setItem('reel_dna_user_handle', clean);
    } catch (e) {
      // ignore
    }
  };

  const handleStartAnalysis = (handle: string) => {
    const clean = handle.trim().replace(/^@/, '');
    if (!clean) return;
    const requestId = ++analysisRequestIdRef.current;

    setTargetHandle(clean);
    setCurrentReport(null);
    setView('loading');

    // Save to handle history if not already present
    setSavedHandles((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered];
    });

    // Fetch from backend API (passes user apifyToken if provided)
    fetchLiveReportForHandle(clean, apifyToken)
      .then((report) => {
        if (requestId !== analysisRequestIdRef.current) return;
        if (report) {
          setCurrentReport(report);
        } else {
          setCurrentReport(getReportForHandle(clean));
        }
      })
      .catch((err) => {
        if (requestId !== analysisRequestIdRef.current) return;
        console.warn('Using fallback report generator:', err);
        setCurrentReport(getReportForHandle(clean));
      });
  };

  const handleLoadingComplete = () => {
    if (!currentReport && targetHandle) {
      setCurrentReport(getReportForHandle(targetHandle));
    }
    setView('report');
  };

  const handleReset = () => {
    setView('input');
    setTargetHandle('');
    setCurrentReport(null);
  };

  const handleRemoveSavedHandle = (handleToRemove: string) => {
    setSavedHandles((prev) => prev.filter((h) => h.toLowerCase() !== handleToRemove.toLowerCase()));
  };

  const handleSignInSuccess = (userHandle: string) => {
    handleSaveUserHandle(userHandle);
    setShowSignInModal(false);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 antialiased flex flex-col">
      <Header
        currentHandle={targetHandle}
        userPersonalHandle={userPersonalHandle}
        savedHandlesCount={savedHandles.length}
        isApifyActive={isApifyActive}
        onResetSearch={handleReset}
        onGoToDashboard={() => setView('dashboard')}
        onOpenSavedHandles={() => setShowSavedModal(true)}
        onOpenUserHandleModal={() => setShowUserHandleModal(true)}
        onOpenSignIn={() => setShowSignInModal(true)}
        onOpenApifyModal={() => setShowApifyModal(true)}
        isReportView={view === 'report'}
        isLanding={view === 'input'}
        isDashboardView={view === 'dashboard'}
      />

      <main className="flex-1">
        {view === 'input' && (
          <LandingInput
            onAnalyze={handleStartAnalysis}
            userPersonalHandle={userPersonalHandle}
            onSaveUserHandle={handleSaveUserHandle}
            onOpenSignIn={() => setShowSignInModal(true)}
          />
        )}

        {view === 'dashboard' && (
          <DashboardView
            userPersonalHandle={userPersonalHandle}
            savedHandles={savedHandles}
            onAnalyze={handleStartAnalysis}
            onOpenUserHandleModal={() => setShowUserHandleModal(true)}
            onOpenSavedHandlesModal={() => setShowSavedModal(true)}
          />
        )}

        {view === 'loading' && (
          <LoadingAnalysis
            handle={targetHandle}
            isReady={Boolean(currentReport)}
            onComplete={handleLoadingComplete}
            onBack={handleReset}
          />
        )}

        {view === 'report' && currentReport && (
          <ReportView
            report={currentReport}
            userPersonalHandle={userPersonalHandle}
            onSaveUserHandle={handleSaveUserHandle}
            onNewSearch={handleReset}
          />
        )}
      </main>

      {/* APIFY TOKEN MODAL */}
      <ApifyTokenModal
        isOpen={showApifyModal}
        onClose={() => setShowApifyModal(false)}
        apifyToken={apifyToken}
        onSaveToken={handleSaveApifyToken}
      />

      {/* QUICK SIGN IN MODAL */}
      {showSignInModal && (
        <SignInModal
          onClose={() => setShowSignInModal(false)}
          onSignInSuccess={handleSignInSuccess}
        />
      )}

      {/* SAVED HANDLES MODAL */}
      {showSavedModal && (
        <SavedHandlesModal
          savedHandles={savedHandles}
          onSelectHandle={handleStartAnalysis}
          onRemoveHandle={handleRemoveSavedHandle}
          onClose={() => setShowSavedModal(false)}
        />
      )}

      {/* USER PERSONAL HANDLE PROFILE MODAL */}
      {showUserHandleModal && (
        <UserHandleModal
          currentHandle={userPersonalHandle}
          onSaveHandle={handleSaveUserHandle}
          onClose={() => setShowUserHandleModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs font-mono text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} reel_DNA • Instagram Reels Virality Intelligence</p>
          <p className="text-zinc-500 font-sans">Dark Minimal Aesthetic • Built for Instagram Creators & Strategists</p>
        </div>
      </footer>
    </div>
  );
}
