import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, CheckCircle2, Clock, 
  Send, AlertCircle, RefreshCw, Eye, ChevronRight, Check
} from 'lucide-react';
import { api, Campaign, CampaignPost } from '../../services/api';

export const PublishingCalendarView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedPost, setSelectedPost] = useState<CampaignPost | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await api.listCampaigns();
      setCampaigns(data);
      if (data.length > 0 && data[0].posts && data[0].posts.length > 0) {
        setSelectedPost(data[0].posts[0]);
      }
    } catch (err) {
      console.error('Failed to load campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  const currentCampaign = campaigns[0];

  const handleApproveCampaign = async () => {
    if (!currentCampaign) return;
    try {
      setActionLoading(true);
      const res = await api.approveCampaign(currentCampaign.id);
      setNotification({
        message: `Campaign explicitly approved! ${res.scheduled_posts_count} posts registered in the scheduled publishing queue.`,
        type: 'success'
      });
      await loadCampaigns();
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to approve campaign',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleTriggerPublishCycle = async () => {
    try {
      setActionLoading(true);
      const res = await api.triggerPublishCycle();
      if (res.published_count > 0) {
        setNotification({
          message: `Google publication successful: ${res.published_count} post(s) published live to Google Business Profile.`,
          type: 'success'
        });
      } else if (res.simulated_count > 0) {
        setNotification({
          message: `Queue processed: ${res.simulated_count} post(s) staged in DRAFT mode ready for scheduled release.`,
          type: 'info'
        });
      } else if (res.skipped_count > 0 && res.failed_count === 0) {
        setNotification({
          message: `Queue up to date: ${res.skipped_count} post(s) already processed.`,
          type: 'info'
        });
      } else if (res.failed_count > 0) {
        setNotification({
          message: `Publishing cycle encountered errors: ${res.failed_count} post(s) failed.`,
          type: 'error'
        });
      } else {
        setNotification({
          message: 'Publish cycle checked. No pending posts due for publishing.',
          type: 'info'
        });
      }
      await loadCampaigns();
    } catch (err: any) {
      setNotification({
        message: err.message || 'Publish cycle failed',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filteredPosts = currentCampaign?.posts ? currentCampaign.posts.filter((p) => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">30-Day Launch Publishing Calendar</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            {currentCampaign ? currentCampaign.title : 'Loading campaign...'} — Imported from Blueprint in strict DRAFT mode. Review every post before approving automated schedule.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentCampaign && !currentCampaign.is_approved_by_user ? (
            <button
              onClick={handleApproveCampaign}
              disabled={actionLoading}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve 30-Day Campaign</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Campaign Approved & Scheduled</span>
              </span>
              <button
                onClick={handleTriggerPublishCycle}
                disabled={actionLoading}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Publish Next Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-lg text-xs font-medium flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
            : notification.type === 'error'
            ? 'bg-red-500/15 border border-red-500/30 text-red-300'
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterStatus === st
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st} ({st === 'ALL' ? currentCampaign?.posts?.length || 0 : currentCampaign?.posts?.filter(p => p.status === st).length || 0})
          </button>
        ))}
      </div>

      {/* Split view: List & Detail Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: Posts */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-xl p-4 max-h-[650px] overflow-y-auto space-y-2">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
              Loading 30-Day Campaign Posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No posts found with status {filterStatus}.
            </div>
          ) : (
            filteredPosts.map((post, idx) => {
              const isSelected = selectedPost?.id === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                      : 'bg-[#070b14] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <span>Day {post.day_number || idx + 1}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-mono text-[10px]">{post.target_product_sku || 'General'}</span>
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      post.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : post.status === 'SCHEDULED'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">{post.headline}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{post.content_english}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Inspection */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          {selectedPost ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold text-amber-400">
                    Day {selectedPost.day_number} Campaign Post
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedPost.headline}</h2>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                    selectedPost.status === 'PUBLISHED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : selectedPost.status === 'SCHEDULED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {selectedPost.status}
                  </span>
                  {selectedPost.scheduled_for && (
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(selectedPost.scheduled_for).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SKU & Routing Pill */}
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="px-2.5 py-1 bg-[#070b14] border border-slate-800 rounded text-slate-300">
                  <span className="text-slate-500">Target SKU: </span>
                  <span className="font-mono text-amber-300 font-semibold">{selectedPost.target_product_sku}</span>
                </div>
                <div className="px-2.5 py-1 bg-[#070b14] border border-slate-800 rounded text-slate-300">
                  <span className="text-slate-500">CTA: </span>
                  <span className="font-semibold text-emerald-400">{selectedPost.call_to_action}</span>
                </div>
                <div className="px-2.5 py-1 bg-[#070b14] border border-slate-800 rounded text-slate-300">
                  <span className="text-slate-500">Verification: </span>
                  <span className="text-slate-200">{selectedPost.verification_status}</span>
                </div>
              </div>

              {/* English Copy */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  English Copy
                </label>
                <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedPost.content_english}
                </div>
              </div>

              {/* Telugu Copy */}
              {selectedPost.content_telugu && (
                <div>
                  <label className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider block mb-1">
                    Telugu Copy (తెలుగు)
                  </label>
                  <div className="p-3 bg-[#070b14] rounded-lg border border-slate-800/80 text-xs text-amber-200/90 leading-relaxed whitespace-pre-line">
                    {selectedPost.content_telugu}
                  </div>
                </div>
              )}

              {/* Verified Routing Guarantee */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Wholesale inquiries route strictly to verified WhatsApp: 9347453135</span>
                </div>
                <a
                  href={`https://wa.me/919347453135?text=${encodeURIComponent(`Inquiry for ${selectedPost.headline} (RAIS Rayachoty)`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition-all"
                >
                  Test Link
                </a>
              </div>

              {/* ALGORITHMIC ENHANCEMENT 5: 1-Click Google LocalPost Publishing */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {selectedPost.status === 'PUBLISHED' 
                    ? 'Post is published live on Google Maps.' 
                    : 'Dispatch immediately to Google Business Profile feed.'}
                </span>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={async () => {
                    try {
                      setActionLoading(true);
                      const res = await api.publishPostNow(selectedPost.id);
                      setNotification({
                        message: res.message || 'Post published to Google Business Profile!',
                        type: 'success'
                      });
                      await loadCampaigns();
                    } catch (err: any) {
                      setNotification({
                        message: err.message || 'Failed to publish post to Google',
                        type: 'error'
                      });
                    } finally {
                      setActionLoading(false);
                      setTimeout(() => setNotification(null), 5000);
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{selectedPost.status === 'PUBLISHED' ? 'Re-publish to Google Maps' : '1-Click Publish to Google Maps'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
              <Eye className="w-8 h-8 text-slate-600 mb-2" />
              <span>Select a post from the calendar list to inspect its content and verification status.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};