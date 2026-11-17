import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/growth-engine/Sidebar';
import { Overview } from '../components/growth-engine/Overview';
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
import { ReelsStudioView } from '../components/growth-engine/ReelsStudioView';
import { MetaPublishingView } from '../components/growth-engine/MetaPublishingView';
import { InstagramEnquiriesView } from '../components/growth-engine/InstagramEnquiriesView';
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
  const [stats, setStats] = useState({
    totalCampaigns: 1,
    pendingReviews: 3,
    totalLeads: 0,
    seoScore: 95,
    killSwitchActive: false
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google_auth')) {
      setCurrentTab('google');
    }
    loadAppInitialState();
  }, []);

  const loadAppInitialState = async () => {
    try {
      const [settings, leads, reviews, seo] = await Promise.allSettled([
        api.getAutomationSettings(),
        api.listLeads(),
        api.listReviews(),
        api.getSeoAudit()
      ]);

      const isKillSwitch = settings.status === 'fulfilled' ? settings.value.emergency_kill_switch : false;
      const leadsCount = leads.status === 'fulfilled' ? leads.value.length : 0;
      const pendingRev = reviews.status === 'fulfilled' 
        ? reviews.value.filter(r => !r.has_replied && (!r.reply_drafts || r.reply_drafts.some(d => !d.is_approved))).length 
        : 2;
      const seoCompleteness = seo.status === 'fulfilled' ? seo.value.completeness_score : 95;

      setKillSwitchActive(isKillSwitch);
      setStats({
        totalCampaigns: 1,
        pendingReviews: pendingRev,
        totalLeads: leadsCount,
        seoScore: seoCompleteness,
        killSwitchActive: isKillSwitch
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

        {/* Meta & Instagram Automation Suite */}
        {currentTab === 'reels' && <ReelsStudioView />}
        {currentTab === 'meta_publishing' && <MetaPublishingView />}
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
