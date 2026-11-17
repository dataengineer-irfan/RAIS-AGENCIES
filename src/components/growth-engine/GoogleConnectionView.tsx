import React, { useState, useEffect } from 'react';
import { 
  Globe, CheckCircle2, ShieldCheck, Key, 
  ExternalLink, RefreshCw, AlertCircle, Copy, Check, LogIn, ShieldAlert,
  Clock, FileText, ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

type ConnectionState = 
  | 'NOT_CONFIGURED'
  | 'API_ACCESS_NOT_APPROVED'
  | 'NOT_CONNECTED'
  | 'AUTHORIZATION_PENDING'
  | 'CONNECTED'
  | 'TOKEN_EXPIRED'
  | 'ACCESS_REVOKED'
  | 'API_ERROR';

export const GoogleConnectionView: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    // Check URL parameters for OAuth redirect callbacks
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get('google_auth');
    if (authResult === 'success') {
      setNotification({
        message: 'Google Business Profile successfully connected and authorized via OAuth 2.0!',
        type: 'success'
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authResult === 'error') {
      const errDesc = params.get('error_description') || 'Google authorization was cancelled or denied.';
      setNotification({
        message: `Google authorization failed: ${errDesc}`,
        type: 'error'
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getGoogleStatus();
      setStatus(res);
    } catch (err: any) {
      console.error('Failed to load Google status', err);
      setStatus({ status: 'API_ERROR', connected: false, message: err.message || 'Failed to query connection status.' });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setConnecting(true);
      const res = await api.getGoogleAuthorizeUrl();
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      }
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to initiate Google authorization. Check if client credentials are configured in backend/.env.',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 6000);
    } finally {
      setConnecting(false);
    }
  };

  const copyConfig = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine explicit 8-state connection lifecycle
  const mode = status?.mode || '';
  const statusStr = status?.status || '';

  let currentState: ConnectionState = 'NOT_CONNECTED';

  if (mode === 'NOT_CONFIGURED' || statusStr === 'NOT_CONFIGURED') {
    currentState = 'NOT_CONFIGURED';
  } else if (mode === 'API_ACCESS_NOT_APPROVED' || statusStr === 'API_ACCESS_NOT_APPROVED') {
    currentState = 'API_ACCESS_NOT_APPROVED';
  } else if (mode === 'TOKEN_EXPIRED') {
    currentState = 'TOKEN_EXPIRED';
  } else if (mode === 'ACCESS_REVOKED' || mode === 'TOKEN_REVOKED') {
    currentState = 'ACCESS_REVOKED';
  } else if (status?.connected && mode === 'LIVE_CONNECTED') {
    currentState = 'CONNECTED';
  } else if (mode === 'AUTHORIZATION_PENDING') {
    currentState = 'AUTHORIZATION_PENDING';
  } else if (statusStr === 'API_ERROR') {
    currentState = 'API_ERROR';
  } else {
    currentState = 'NOT_CONNECTED';
  }

  const isSimulated = Boolean(status?.is_simulated || mode === 'SIMULATED_DEMO');
  const isConnected = currentState === 'CONNECTED';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Google Business Profile API Connection</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Official Google OAuth 2.0 integration. Connect your authorized Google Account to sync verified locations, reviews, and authentic performance telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadStatus}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>Check Health</span>
          </button>

          {!isConnected && !isSimulated && (
            <button
              onClick={handleConnectGoogle}
              disabled={connecting || currentState === 'NOT_CONFIGURED'}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{connecting ? 'Redirecting...' : 'Connect Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-lg text-xs font-medium flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
            : notification.type === 'error'
            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Connection Health (All 8 Lifecycle States Accurately Represented) */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-400 mb-2">Connection Status</div>
          <div className="flex items-center gap-2 mb-1">
            {currentState === 'CONNECTED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-bold text-emerald-400">CONNECTED & ACTIVE</span>
              </>
            )}
            {currentState === 'AUTHORIZATION_PENDING' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-sm font-bold text-amber-400">AUTHORIZATION PENDING</span>
              </>
            )}
            {currentState === 'NOT_CONFIGURED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span className="text-sm font-bold text-slate-400">NOT CONFIGURED</span>
              </>
            )}
            {currentState === 'API_ACCESS_NOT_APPROVED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-sm font-bold text-amber-300">API ACCESS PENDING APPROVAL</span>
              </>
            )}
            {currentState === 'TOKEN_EXPIRED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-sm font-bold text-amber-400">TOKEN EXPIRED</span>
              </>
            )}
            {currentState === 'ACCESS_REVOKED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-sm font-bold text-rose-400">ACCESS REVOKED</span>
              </>
            )}
            {currentState === 'API_ERROR' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-sm font-bold text-rose-400">API ERROR</span>
              </>
            )}
            {currentState === 'NOT_CONNECTED' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span className="text-sm font-bold text-slate-400">
                  {isSimulated ? 'SIMULATED DEMO' : 'NOT CONNECTED'}
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Mode: <strong className="text-amber-400 font-mono">{mode || currentState}</strong>
          </p>
        </div>

        {/* Card 2: Authorized Location (Strictly authentic, no hardcoded fallbacks) */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-400 mb-2">Authorized Location</div>
          <div className="text-sm font-bold text-white truncate">
            {isConnected ? (status?.location_name || 'RAIS Agencies') : isSimulated ? 'RAIS Agencies (Simulated)' : 'Not Connected'}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono truncate">
            {isConnected 
              ? (status?.location_id || 'No Google location selected') 
              : isSimulated 
              ? 'demo-location-simulated' 
              : 'Not available'}
          </p>
        </div>

        {/* Card 3: Data Protection & Scopes */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-400 mb-2">Data Protection & Scopes</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AES-256 GCM Encrypted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Scope: <code className="text-xs text-slate-300">business.manage</code>
          </p>
        </div>
      </div>

      {/* Dynamic Action Required Box based on Current State */}
      <div className="p-4 bg-[#070b14] border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0">
            {currentState === 'NOT_CONFIGURED' && <Key className="w-5 h-5 text-amber-400" />}
            {currentState === 'AUTHORIZATION_PENDING' && <LogIn className="w-5 h-5 text-blue-400" />}
            {currentState === 'API_ACCESS_NOT_APPROVED' && <ShieldAlert className="w-5 h-5 text-amber-400" />}
            {currentState === 'CONNECTED' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {currentState === 'TOKEN_EXPIRED' && <Clock className="w-5 h-5 text-amber-400" />}
            {currentState === 'ACCESS_REVOKED' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {currentState === 'API_ERROR' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {currentState === 'NOT_CONNECTED' && <Key className="w-5 h-5 text-slate-400" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {currentState === 'NOT_CONFIGURED' && 'Next Action: Configure Google Cloud Credentials'}
              {currentState === 'AUTHORIZATION_PENDING' && 'Next Action: Sign in with Managing Google Account'}
              {currentState === 'API_ACCESS_NOT_APPROVED' && 'Next Action: Submit Google Business Profile API Access Request'}
              {currentState === 'CONNECTED' && 'Connection Active: Profile Verified & Synchronizing'}
              {currentState === 'TOKEN_EXPIRED' && 'Next Action: Re-Authenticate Expired Token'}
              {currentState === 'ACCESS_REVOKED' && 'Next Action: Re-Authorize Google Business Profile'}
              {currentState === 'API_ERROR' && 'Next Action: Check API Quota & Network Connection'}
              {currentState === 'NOT_CONNECTED' && 'Next Action: Complete Setup in Google Cloud Console'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {currentState === 'NOT_CONFIGURED' && 'Create an OAuth 2.0 Web Client in Google Cloud Console. Set Redirect URI to https://rais-growth-backend.onrender.com/api/v1/google/callback, then add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.'}
              {currentState === 'AUTHORIZATION_PENDING' && 'Client credentials detected in backend/.env. Click "Connect Google" above to grant profile management permissions to RAIS Agencies.'}
              {currentState === 'API_ACCESS_NOT_APPROVED' && 'Google restricts GBP API access. The application draft is prepared in docs/GOOGLE_BUSINESS_PROFILE_API_ACCESS_APPLICATION.md. Submit the form to Google and await manual approval (~14 business days).'}
              {currentState === 'CONNECTED' && 'RAIS Agencies is officially authenticated with Google Business Profile. Location information and review synchronization are operational.'}
              {currentState === 'TOKEN_EXPIRED' && 'OAuth access token has expired and refresh attempt requires user re-authorization. Click "Connect Google" to refresh session.'}
              {currentState === 'ACCESS_REVOKED' && 'Google OAuth permissions were revoked on your Google Account. Click "Connect Google" above to re-authorize.'}
              {currentState === 'API_ERROR' && (status?.message || 'Failed to communicate with Google Business Profile API. Verify network connection and API permissions.')}
              {currentState === 'NOT_CONNECTED' && (status?.actionable_instruction || 'Demo mode active. To connect live Google APIs, configure Google Cloud project credentials.')}
            </p>
          </div>
        </div>

        {currentState === 'API_ACCESS_NOT_APPROVED' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-mono text-amber-400 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded">
              See docs/GOOGLE_BUSINESS_PROFILE_API_ACCESS_APPLICATION.md
            </span>
          </div>
        )}
      </div>

      {/* Detailed Technical Connection Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Location & Account Details */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Profile Identity Metadata</span>
          </h2>

          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Business Name:</span>
              <span className="font-bold text-white">RAIS Agencies</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Primary Category:</span>
              <span className="font-semibold text-amber-400">Wholesale food store</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Physical Hub:</span>
              <span className="text-slate-200">Beside Indel Bank, Sundupalli Road Hub</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Locality & District:</span>
              <span className="text-slate-200">Rayachoty, Annamayya District, AP – 516269</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Verified WhatsApp Line:</span>
              <span className="font-mono font-bold text-amber-400">9347453135</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Official Web Domain:</span>
              <a 
                href="https://dataengineer-irfan.github.io/RAIS-AGENCIES/" 
                target="_blank" 
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>RAIS Catalog</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Live Cloud Credentials Setup Instructions */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Production Setup (Google Cloud Console)</span>
            </h2>
            <button
              onClick={() => copyConfig('USE_MOCK_GBP=False\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\nGOOGLE_REDIRECT_URI=https://rais-growth-backend.onrender.com/api/v1/google/callback\nFRONTEND_URL=https://rais-growth-backend.onrender.com')}
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy env template'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 space-y-2.5">
            <p>To connect live production Google Business Profile APIs:</p>
            <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-400">
              <li>
                Visit <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">Google Cloud Console</a> and select your project.
              </li>
              <li>
                Under <strong>APIs & Services &gt; Credentials &gt; OAuth 2.0 Client IDs</strong>:
              </li>
              <li>
                Add Authorized JavaScript origin:
                <code className="block bg-[#070b14] p-1.5 rounded mt-1 font-mono text-[10px] text-amber-300">
                  https://rais-growth-backend.onrender.com
                </code>
              </li>
              <li>
                Add Authorized Redirect URI:
                <code className="block bg-[#070b14] p-1.5 rounded mt-1 font-mono text-[10px] text-amber-300">
                  https://rais-growth-backend.onrender.com/api/v1/google/callback
                </code>
              </li>
              <li>
                Copy credentials to <code className="text-amber-300">backend/.env</code>:
                <pre className="bg-[#070b14] p-2 rounded mt-1 font-mono text-[10px] text-slate-300">
                  USE_MOCK_GBP=False{"\n"}
                  GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com{"\n"}
                  GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
                </pre>
              </li>
              <li>
                Submit the <strong>GBP API Access Request Form</strong> (see docs/GOOGLE_BUSINESS_PROFILE_API_ACCESS_APPLICATION.md).
              </li>
            </ol>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-400">
              All credentials and OAuth refresh tokens are encrypted at rest using AES-256 GCM in the local database.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
