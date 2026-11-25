export interface WhatsAppShareResult {
  method: 'web_share' | 'downloaded' | 'cancelled';
  message: string;
}

/**
 * Safely shares an MP4 video + caption directly into mobile OS Share Sheets
 * (allowing 1-tap WhatsApp -> My Status without risky unofficial WhatsApp Web bots),
 * or downloads the MP4 and copies caption on desktop browsers.
 */
export async function shareOrDownloadForWhatsAppStatus(options: {
  videoUrl: string;
  filename: string;
  captionText: string;
}): Promise<WhatsAppShareResult> {
  const safeName = (options.filename || 'rais_promo_video.mp4').endsWith('.mp4')
    ? options.filename
    : `${options.filename || 'rais_promo_video'}.mp4`;

  try {
    await navigator.clipboard?.writeText(options.captionText);
  } catch {
    // Clipboard unavailable in some contexts
  }

  const response = await fetch(options.videoUrl);
  if (!response.ok) {
    let errMsg = `HTTP ${response.status}: Failed to load MP4 video for WhatsApp Status share`;
    try {
      const errData = await response.json();
      if (errData?.detail) errMsg = errData.detail;
    } catch {
      // ignore non-json error response
    }
    throw new Error(errMsg);
  }

  const blob = await response.blob();
  const file = new File([blob], safeName, { type: 'video/mp4' });
  const nav = navigator as any;

  if (typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
    try {
      await nav.share({
        files: [file],
        title: safeName,
        text: options.captionText,
      });
      return {
        method: 'web_share',
        message: 'Opened mobile Share Sheet — select WhatsApp -> My Status (caption also copied)!',
      };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { method: 'cancelled', message: 'Share cancelled by user.' };
      }
    }
  }

  // Fallback for desktop Chrome / unsupported Web Share files: download MP4 cleanly
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

  return {
    method: 'downloaded',
    message: 'MP4 video downloaded & WhatsApp Status caption copied! Send to your phone / post to Status safely.',
  };
}
