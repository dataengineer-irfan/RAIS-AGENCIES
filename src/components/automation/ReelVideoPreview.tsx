import React, { useState, useEffect, useRef } from 'react';
import { ReelCalendarItem } from '../../data/automationTypes';
import { Play, Pause, Volume2, VolumeX, Download, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { assetUrl } from '../../utils/assetUrl';

interface ReelVideoPreviewProps {
  reel: ReelCalendarItem;
  onApprove?: (reel: ReelCalendarItem) => void;
  onSchedule?: (reel: ReelCalendarItem) => void;
}

export const ReelVideoPreview: React.FC<ReelVideoPreviewProps> = ({
  reel,
  onApprove,
  onSchedule
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<'video' | 'mockup'>(reel.videoSpecs.mediaUrl ? 'video' : 'mockup');
  const [speechSupported, setSpeechSupported] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const duration = reel.videoSpecs.durationSeconds || 25;

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Sync video time or fallback timer simulation
  useEffect(() => {
    if (viewMode === 'video' && reel.videoSpecs.mediaUrl) {
      return;
    }
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, viewMode, reel.videoSpecs.mediaUrl]);

  // Audio / Video handling
  const togglePlay = () => {
    if (viewMode === 'video' && reel.videoSpecs.mediaUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn("Video play error:", err);
        });
      }
      return;
    }

    if (!isPlaying) {
      setIsPlaying(true);
      if (speechSupported && !isMuted) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reel.scriptTelugu);
        utterance.rate = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const teVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('TE'));
        const inVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
        if (teVoice) utterance.voice = teVoice;
        else if (inVoice) utterance.voice = inVoice;
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsPlaying(false);
      if (speechSupported) window.speechSynthesis.cancel();
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
    }
    if (!isMuted && speechSupported) {
      window.speechSynthesis.cancel();
    }
  };

  // Export 9:16 Snapshot
  const handleExportFrame = () => {
    alert(`9:16 Frame ready for Reel Day ${reel.dayNumber}! You can use this media asset with the pre-formatted caption to publish to @raisfrozenfoods.`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* 1. VERTICAL 9:16 PHONE FRAME CONTAINER */}
      <div className="w-full max-w-[340px] mx-auto lg:mx-0 shrink-0 select-none">
        
        {/* View Mode Toggle Pill */}
        {reel.videoSpecs.mediaUrl && (
          <div className="mb-2 flex items-center justify-center gap-1.5 p-1 rounded-xl bg-[#091226] border border-cyan-500/30">
            <button
              onClick={() => {
                if (isPlaying && videoRef.current) videoRef.current.pause();
                setIsPlaying(false);
                setViewMode('video');
              }}
              className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                viewMode === 'video'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Master Reel (MP4)
            </button>
            <button
              onClick={() => {
                if (isPlaying && videoRef.current) videoRef.current.pause();
                setIsPlaying(false);
                setViewMode('mockup');
              }}
              className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                viewMode === 'mockup'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stage Mockup
            </button>
          </div>
        )}

        <div 
          ref={previewRef}
          className="relative aspect-[9/16] w-full rounded-[36px] bg-black border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between"
        >
          {/* Top Notch & Time */}
          <div className="absolute top-0 left-0 right-0 z-30 pt-3 px-6 flex items-center justify-between text-[11px] font-mono text-slate-300 pointer-events-none">
            <span>RAIS REEL</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full" />
            <span className="text-amber-400 font-bold">DAY {reel.dayNumber}</span>
          </div>

          {/* MODE A: NATIVE RENDERED MP4 VIDEO */}
          {viewMode === 'video' && reel.videoSpecs.mediaUrl ? (
            <div className="relative w-full h-full flex flex-col justify-between">
              {/* Native Video Element */}
              <div className="absolute inset-0 z-0 bg-black">
                <video
                  ref={videoRef}
                  src={reel.videoSpecs.mediaUrl}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setCurrentTime(Math.floor(videoRef.current.currentTime));
                    }
                  }}
                  onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                />
              </div>

              {/* Center Play Overlay Icon when paused */}
              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Minimal Bottom Controls Floating Bar */}
              <div className="relative z-30 mt-auto px-4 pb-4 pt-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1.5">
                <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 transition-all duration-200"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-white">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={togglePlay}
                      className="p-1 rounded text-white hover:text-amber-300 transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button 
                      onClick={toggleMute}
                      className="p-1 rounded text-slate-300 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      Telugu Audio
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-300 font-bold">{currentTime}s / {duration}s</span>
                </div>
              </div>
            </div>
          ) : (
            /* MODE B: INTERACTIVE STAGE MOCKUP */
            <>
              {/* BACKGROUND & PRODUCT STAGE */}
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-[#0B132B] to-slate-950">
                <div className="relative w-full h-[62%] mt-12 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={reel.productImage}
                    alt={reel.productName}
                    className={`w-full h-full object-cover rounded-2xl filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />
                  
                  <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                      {reel.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[9px] font-mono font-bold">
                      -18°C COLD CHAIN
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 z-10">
                    <h4 className="text-sm font-bold text-white drop-shadow-md leading-tight">
                      {reel.productName}
                    </h4>
                    <div className="text-[11px] font-semibold text-amber-300">
                      Pack: {reel.packSize} · Wholesale Stock
                    </div>
                  </div>
                </div>
              </div>

              {/* BRAND HEADER BAR */}
              <div className="relative z-20 mt-8 px-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rotate-45 border border-amber-400 bg-slate-900 rounded-sm flex items-center justify-center shadow">
                    <span className="font-serif font-black text-amber-300 text-[10px] -rotate-45">R</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-black text-xs text-white tracking-tight leading-none">RAIS AGENCIES</span>
                    <span className="text-[8px] font-mono text-amber-400 font-bold uppercase tracking-wider">Rayachoty (516269)</span>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-red-600/90 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                  REEL PREVIEW
                </div>
              </div>

              {/* LOWER SECTION: PRESENTER AVATAR & SUBTITLE BAR */}
              <div className="relative z-20 px-4 pb-4 space-y-2">
                <div className="flex items-center gap-2.5 bg-slate-900/90 border border-amber-500/30 p-2 rounded-xl backdrop-blur-md">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                    <img
                      src={assetUrl('/images/presenter_ananya.png')}
                      alt="Ananya - Fictional Presenter"
                      className="w-full h-full object-cover"
                    />
                    {isPlaying && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black animate-ping" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300">Ananya</span>
                      <span className="text-[9px] text-slate-400 font-mono">Telugu Audio</span>
                    </div>
                    <div className="text-[10px] text-slate-300 truncate font-medium">
                      {reel.hookTelugu}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/85 border border-cyan-500/30 backdrop-blur-md">
                  <div className="text-xs font-semibold text-amber-300 leading-snug line-clamp-3">
                    {reel.scriptTelugu}
                  </div>
                  {isPlaying && (
                    <div className="flex items-center gap-0.5 mt-2 h-2.5">
                      {[40, 80, 60, 100, 70, 30, 90, 60, 80, 50, 90, 40, 70].map((h, i) => (
                        <span 
                          key={i} 
                          style={{ height: `${h}%` }}
                          className="w-1 bg-cyan-400 rounded-full animate-pulse"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-between font-bold text-[10px]">
                  <span>Comment "{reel.ctaKeyword}" for Rates!</span>
                  <span className="font-mono">WhatsApp: 9347453135</span>
                </div>

                <div className="pt-1 space-y-1">
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={togglePlay}
                        className="p-1 rounded text-white hover:text-cyan-300 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        onClick={toggleMute}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="font-mono">{currentTime}s / {duration}s</span>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

      {/* 2. REEL METADATA & CONTROL PANEL */}
      <div className="flex-1 w-full space-y-5">
        
        {/* Header with Status Badge */}
        <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                <span>Day {reel.dayNumber} · Scheduled: {reel.scheduledDate}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                {reel.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                reel.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                reel.status === 'approved' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {reel.status}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Target Audience: <strong className="text-white">{reel.targetAudience}</strong>
          </p>
        </div>

        {/* Telugu Script & English Translation Card */}
        <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Telugu Reel Script (Ananya)</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-sm text-slate-200 leading-relaxed font-sans">
              {reel.scriptTelugu}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              English Translation & Intent
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {reel.scriptEnglishBrief}
            </p>
          </div>
        </div>

        {/* Ready-to-Publish Caption & Hashtags Card */}
        <div className="p-5 rounded-2xl bg-[#0f1c3f]/90 border border-cyan-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Instagram Caption & Hashtags
            </h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${reel.caption}\n\n${reel.hashtags.join(' ')}`);
                alert('Caption and hashtags copied to clipboard!');
              }}
              className="text-xs font-bold text-amber-300 hover:text-white transition-colors"
            >
              Copy Caption
            </button>
          </div>
          
          <pre className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/20 text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
            {reel.caption}
          </pre>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {reel.hashtags.map((tag, idx) => (
              <span key={idx} className="text-[11px] font-mono text-cyan-300/80 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Workflow Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          {reel.videoSpecs.mediaUrl && (
            <a
              href={reel.videoSpecs.mediaUrl}
              download={`RAIS_Reel_Day_${reel.dayNumber}_1080x1920.mp4`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Reel (1080x1920 MP4)</span>
            </a>
          )}

          {reel.status === 'draft' && onApprove && (
            <button
              onClick={() => onApprove(reel)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Reel for Schedule</span>
            </button>
          )}

          {onSchedule && reel.status !== 'published' && (
            <button
              onClick={() => onSchedule(reel)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Schedule / Publish Now</span>
            </button>
          )}

          <button
            onClick={handleExportFrame}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-bold transition-all shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download 9:16 Media Frame</span>
          </button>
        </div>

      </div>

    </div>
  );
};
