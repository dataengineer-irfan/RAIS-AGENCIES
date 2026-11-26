import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/growth-engine/Sidebar';
import { Overview, OverviewStats } from '../components/growth-engine/Overview';
import { GoogleConnectionView } from '../components/growth-engine/GoogleConnectionView';
import { ContentStudioView } from '../components/growth-engine/ContentStudioView';
import { PublishingCalendarView } from '../components/growth-engine/PublishingCalendarView';
import { ReviewsInboxView } from '../components/growth-engine/ReviewsInboxView';
import { LocalSEOView } from '../components/growth-engine/LocalSEOView';
import { CompetitorsView } from '../components/growth-engine/CompetitorsView';
import { AnalyticsView } from '../components/growth-engine/AnalyticsView';
import { MediaLibraryView } from '../components/growth-engine/MediaLibraryView';
import { B2BLeadsView } from '../components/growth-engine/B2BLeadsView';
import { AutomationControlView } from '../components/growth-engine/AutomationControlView';
import { BusinessInfoManagerView } from '../components/growth-engine/BusinessInfoManagerView';
import { MetaPublishingView } from '../components/growth-engine/MetaPublishingView';
import { InstagramEnquiriesView } from '../components/growth-engine/InstagramEnquiriesView';
import { YouTubeStudioView } from '../components/growth-engine/YouTubeStudioView';
import { TrafficAnalyticsTab } from '../components/automation/TrafficAnalyticsTab';
import { api } from '../services/api';

interface AutomationDashboardPageProps {
  onLogout?: () => void;
  onBackToHome?: () => void;
}

export const AutomationDashboardPage: React.FC<AutomationDashboardPageProps> = ({ 
  onLogout, 
  onBackToHome 
}) => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [stats, setStats] = useState<OverviewStats>({
    totalCampaigns: 0,
    pendingReviews: 0,
    totalLeads: 0,
    seoScore: null,
    killSwitchActive: false,
    googleConnected: false,
    googleStatusMode: 'CHECKING',
    publishedReelsCount: 0,
    totalReelsCount: 0,
    ytPublishedCount: 0,
    igPublishedCount: 0,
    fbPublishedCount: 0,
    queuedVideosCount: 0,
    metaConnected: false,
    metaUsername: 'rais_agencies_frozen_foods',
    autoPilotEnabled: true,
    geminiConnected: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google_auth')) {
      setCurrentTab('google');
    } else if (window.location.hash.replace(/^#\/?/, '').toLowerCase() === 'reels') {
      setCurrentTab('youtube_drive');
    }
    loadAppInitialState();
  }, []);

  const loadAppInitialState = async () => {
    try {
      const [settings, leads, reviews, seo, campaigns, googleStatus, ytQueue, metaStatus, ytSettings] = await Promise.allSettled([
        api.getAutomationSettings(),
        api.listLeads(),
        api.listReviews(),
        api.getSeoAudit(),
        api.listCampaigns(),
        api.getGoogleStatus(),
        api.listYouTubeQueue(),
        api.getMetaStatus(),
        api.getYouTubeSettings(),
      ]);

      const isKillSwitch = settings.status === 'fulfilled' ? Boolean(settings.value?.emergency_kill_switch) : false;
      const leadsCount = leads.status === 'fulfilled' && Array.isArray(leads.value) ? leads.value.length : 0;
      const pendingRev = reviews.status === 'fulfilled' && Array.isArray(reviews.value)
        ? reviews.value.filter(r => !r.has_replied && (!r.reply_drafts || r.reply_drafts.some(d => !d.is_approved))).length 
        : 0;
      const seoCompleteness =
        seo.status === 'fulfilled' && seo.value && typeof seo.value.completeness_score === 'number'
          ? seo.value.completeness_score
          : null;
      const campaignsCount = campaigns.status === 'fulfilled' && Array.isArray(campaigns.value) ? campaigns.value.length : 0;
      const isGoogleConnected = googleStatus.status === 'fulfilled' ? Boolean(googleStatus.value?.connected) : false;
      const gMode = googleStatus.status === 'fulfilled' ? (googleStatus.value?.status || 'NOT_CONNECTED') : 'BACKEND_UNREACHABLE';

      const qItems = ytQueue.status === 'fulfilled' && Array.isArray(ytQueue.value) ? ytQueue.value : [];
      const ytPub = qItems.filter(q => q.status === 'PUBLISHED').length;
      const igPub = qItems.filter(q => q.ig_status === 'PUBLISHED').length;
      const fbPub = qItems.filter(q => q.fb_status === 'PUBLISHED').length;
      const queuedCnt = qItems.filter(q => q.status === 'QUEUED').length;
      const metaVal = metaStatus.status === 'fulfilled' ? metaStatus.value : null;
      const ytSetVal = ytSettings.status === 'fulfilled' ? ytSettings.value : null;

      setKillSwitchActive(isKillSwitch);
      setStats({
        totalCampaigns: campaignsCount,
        pendingReviews: pendingRev,
        totalLeads: leadsCount,
        seoScore: seoCompleteness,
        killSwitchActive: isKillSwitch,
        googleConnected: isGoogleConnected,
        googleStatusMode: gMode,
        publishedReelsCount: igPub,
        totalReelsCount: qItems.length,
        ytPublishedCount: ytPub,
        igPublishedCount: igPub,
        fbPublishedCount: fbPub,
        queuedVideosCount: queuedCnt,
        metaConnected: Boolean(metaVal?.connected),
        metaUsername: metaVal?.ig_username || 'rais_agencies_frozen_foods',
        autoPilotEnabled: Boolean(ytSetVal?.auto_post_immediately ?? true),
        geminiConnected: Boolean(ytSetVal?.gemini_connected),
      });
    } catch (err) {
      console.warn('Backend offline or initializing', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        killSwitchActive={killSwitchActive}
        googleConnected={stats.googleConnected}
        totalReelsCount={stats.totalReelsCount}
        metaUsername={stats.metaUsername}
        metaConnected={stats.metaConnected}
        onBackToHome={onBackToHome}
        onLogout={onLogout}
      />

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto">
        {/* Google Growth Suite */}
        {currentTab === 'overview' && (
          <Overview 
            onNavigate={setCurrentTab} 
            stats={stats} 
          />
        )}
        {currentTab === 'google' && <GoogleConnectionView />}
        {currentTab === 'reviews' && <ReviewsInboxView />}
        {currentTab === 'seo' && <LocalSEOView />}
        {currentTab === 'competitors' && <CompetitorsView />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'ga4_traffic' && <TrafficAnalyticsTab />}

        {/* Meta & Video Automation Suite */}
        {currentTab === 'reels' && <YouTubeStudioView />}
        {currentTab === 'meta_publishing' && <MetaPublishingView />}
        {currentTab === 'youtube_drive' && <YouTubeStudioView />}
        {currentTab === 'enquiries' && <InstagramEnquiriesView />}
        {currentTab === 'content' && <ContentStudioView />}
        {currentTab === 'calendar' && <PublishingCalendarView />}

        {/* B2B Depot Management */}
        {currentTab === 'leads' && <B2BLeadsView />}
        {currentTab === 'media' && <MediaLibraryView />}
        {(currentTab === 'business_info' || currentTab === 'business') && <BusinessInfoManagerView />}
        {currentTab === 'automation' && (
          <AutomationControlView 
            killSwitchActive={killSwitchActive} 
            setKillSwitchActive={setKillSwitchActive} 
          />
        )}
      </main>
    </div>
  );
};

export default AutomationDashboardPage;
