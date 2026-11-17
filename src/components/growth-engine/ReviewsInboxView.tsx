import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, CheckCircle2, ShieldCheck, 
  RefreshCw, AlertCircle, Clock, User, LogIn, ShieldAlert, Sparkles
} from 'lucide-react';
import { api, Review } from '../../services/api';

export const ReviewsInboxView: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [googleStatus, setGoogleStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [approverName, setApproverName] = useState<string>('RAIS Admin');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [reviewsData, statusData] = await Promise.all([
        api.listReviews(),
        api.getGoogleStatus()
      ]);
      setReviews(reviewsData);
      setGoogleStatus(statusData);

      // Initialize reply draft texts
      const initialTexts: Record<number, string> = {};
      reviewsData.forEach((r) => {
        if (r.reply_drafts && r.reply_drafts.length > 0) {
          const draft = r.reply_drafts[0];
          initialTexts[draft.id] = draft.reply_english;
        }
      });
      setReplyTexts(initialTexts);
    } catch (err: any) {
      console.error('Failed to load reviews or status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!googleStatus?.connected) {
      setNotification({
        message: 'Google Business Profile is not connected. Official Google authorization is required before synchronization.',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      setSyncing(true);
      const res = await api.syncReviews();
      setNotification({
        message: `Reviews synced with Google Business Profile! (${res.new_reviews_synced} new imported)`,
        type: 'success'
      });
      await loadAll();
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to sync reviews from Google',
        type: 'error'
      });
    } finally {
      setSyncing(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleGenerateDemoReview = async () => {
    try {
      setSyncing(true);
      await api.createTestReview(
        "Rayachoty Cafe Partner",
        5,
        "Best wholesale frozen snacks and Amul fries supply in Rayachoty! Delivered at -18°C on time."
      );
      setNotification({
        message: "Demo customer review generated with AI bilingual response draft! Review & approve below.",
        type: "success"
      });
      await loadAll();
    } catch (err: any) {
      setNotification({
        message: err.message || "Failed to generate demo review",
        type: "error"
      });
    } finally {
      setSyncing(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const res = await api.getGoogleAuthorizeUrl();
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      }
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to initiate Google authorization.',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleApproveReply = async (draftId: number) => {
    const textToPublish = replyTexts[draftId];
    if (!textToPublish) return;

    try {
      setActionLoading(draftId);
      const res = await api.approveReviewReply(draftId, textToPublish, approverName);
      
      if (res.status === 'PUBLISHED_TO_GOOGLE') {
        setNotification({
          message: 'Review reply explicitly approved and published live to Google Business Profile!',
          type: 'success'
        });
      } else if (res.status === 'SIMULATED_DEMO_APPROVAL') {
        setNotification({
          message: 'Simulation: Review reply approved locally in demo mode. Nothing was published to Google.',
          type: 'info'
        });
      } else {
        setNotification({
          message: 'Review reply approved locally. Google publishing pending live authorization.',
          type: 'info'
        });
      }
      await loadAll();
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to publish review reply',
        type: 'error'
      });
    } finally {
      setActionLoading(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const isConnected = Boolean(googleStatus?.connected);
  const isApiError = googleStatus?.status === 'API_ERROR';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Google Reviews Inbox & Response Gate</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Google policy compliant review management. AI drafts polite bilingual replies in Telugu & English, with mandatory explicit human approval before any reply is dispatched.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-24 text-xs"
              placeholder="Approver"
            />
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            <span>Sync with Google</span>
          </button>
        </div>
      </div>

      {/* Compliance Callout */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-xs text-amber-300">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
        <span>
          <strong>Mandatory Explicit Approval Rule:</strong> To protect RAIS reputation, Google policies prevent automated unmoderated bot replies. Each generated reply must be checked and approved below.
        </span>
      </div>

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
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Connection State Demarcation */}
      {!isConnected && !loading && (
        <div className="p-6 bg-[#0f172a] border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Reviews Not Connected</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Google Business Profile OAuth authorization is required before reviews can be synchronized. Connect your Google account to import authentic customer reviews.
              </p>
            </div>
          </div>
          <button
            onClick={handleConnectGoogle}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 flex-shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Connect Google</span>
          </button>
        </div>
      )}

      {isApiError && !loading && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-xs text-rose-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>
            <strong>API Synchronization Error:</strong> {googleStatus?.message || 'Failed to communicate with Google Business Profile API. Re-authorization required.'}
          </span>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
            Loading Google Business Profile Reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center bg-[#0f172a] rounded-xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mx-auto flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <p className="font-bold text-white text-sm">No Customer Reviews on Google Maps Yet</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Business Profile is <strong>connected and active</strong> (<span className="text-cyan-300 font-mono">locations/17901714523973178723</span>). Google API returned 0 reviews because customers have not yet posted public reviews on your Maps profile.
              </p>
            </div>
            
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleGenerateDemoReview}
                disabled={syncing}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Demo Review (Test AI Approval Gate)</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  alert("To collect real customer reviews, have walk-in clients scan the official Google QR Sticker placed at your Sundupalli Road depot counter.");
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition-all"
              >
                How to Collect Real Reviews
              </button>
            </div>
          </div>
        ) : (
          reviews.map((review) => {
            const latestDraft = review.reply_drafts && review.reply_drafts.length > 0 ? review.reply_drafts[0] : null;
            const draftStatus = latestDraft?.status || 'PENDING_APPROVAL';
            const isApproved = Boolean(latestDraft?.is_approved);

            return (
              <div 
                key={review.id}
                className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4"
              >
                {/* Header: Author & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-sm">
                      {review.author_name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>{review.author_name}</span>
                        
                        {/* Sentiment Badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          review.sentiment === 'POSITIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : review.sentiment === 'NEGATIVE'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}>
                          {review.sentiment}
                        </span>

                        {/* Explicit Review Origin Tag */}
                        {review.origin === 'GOOGLE_AUTHENTIC' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            Official Google Review
                          </span>
                        )}
                        {review.origin === 'LOCAL_DIRECT' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Direct Customer Submission
                          </span>
                        )}
                        {review.origin === 'SIMULATED_DEMO' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Simulated Demo Review
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        {renderStars(review.rating)}
                        <span>•</span>
                        <span>{new Date(review.create_time).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accurate Review Approval Status Badge */}
                  <div>
                    {draftStatus === 'PUBLISHED_TO_GOOGLE' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>PUBLISHED TO GOOGLE</span>
                      </span>
                    )}
                    {draftStatus === 'SIMULATED_DEMO_APPROVAL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>SIMULATED DEMO APPROVAL</span>
                      </span>
                    )}
                    {draftStatus === 'APPROVED_NOT_PUBLISHED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>APPROVED — NOT PUBLISHED</span>
                      </span>
                    )}
                    {draftStatus === 'PUBLICATION_FAILED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>PUBLICATION FAILED</span>
                      </span>
                    )}
                    {!isApproved && draftStatus === 'PENDING_APPROVAL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>PENDING APPROVAL</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  "{review.comment || 'Rating without comment'}"
                </div>

                {/* Response Section */}
                {latestDraft && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>AI Response Draft (Telugu & English Available)</span>
                      </span>
                      {latestDraft.reply_telugu && (
                        <button
                          type="button"
                          onClick={() => {
                            if (latestDraft) {
                              const currentVal = replyTexts[latestDraft.id];
                              const targetVal = currentVal === latestDraft.reply_telugu 
                                ? latestDraft.reply_english 
                                : (latestDraft.reply_telugu || latestDraft.reply_english);
                              setReplyTexts({
                                ...replyTexts,
                                [latestDraft.id]: targetVal
                              });
                            }
                          }}
                          className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          Switch Language (Telugu / English)
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={3}
                      disabled={isApproved}
                      value={replyTexts[latestDraft.id] || ''}
                      onChange={(e) => setReplyTexts({ ...replyTexts, [latestDraft.id]: e.target.value })}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500/50 leading-relaxed disabled:opacity-70 disabled:cursor-not-allowed"
                      placeholder="Response message..."
                    />

                    {!isApproved && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleApproveReply(latestDraft.id)}
                          disabled={actionLoading === latestDraft.id}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                        >
                          {actionLoading === latestDraft.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          <span>Approve & Dispatch Reply</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
