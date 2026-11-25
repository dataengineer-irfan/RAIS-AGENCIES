import { ReelCalendarItem } from '../data/automationTypes';
import { AutomationStorage } from './automationStorage';

export interface PublishResult {
  success: boolean;
  mode: 'MANUAL_CONFIRMED' | 'MANUAL_REQUIRED';
  postId?: string;
  errorMessage?: string;
  auditMessage: string;
}

export class InstagramPublisher {
  /**
   * Validates Instagram Reel media parameters according to Meta specifications:
   * - Aspect ratio: 9:16
   * - Max duration: 90 seconds (recommended 15-30s for commercial wholesale reels)
   */
  static validateReelSpecs(reel: ReelCalendarItem): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (reel.videoSpecs.aspectRatio !== '9:16') {
      errors.push('Reel aspect ratio must be 9:16 vertical.');
    }
    if (reel.videoSpecs.durationSeconds > 90) {
      errors.push('Reel duration exceeds Meta 90-second limit.');
    }
    if (!reel.caption || reel.caption.trim().length === 0) {
      errors.push('Caption is required for Instagram publishing.');
    }
    if (!reel.productImage) {
      errors.push('Product footage or packaging asset is required.');
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Records a genuine manual Reel publish after the operator posts on Instagram / Meta Business Suite.
   * Automated Graph API publishing is blocked until a real Meta Page Access Token backend service is connected.
   */
  static async publishReel(
    reel: ReelCalendarItem,
    isManualConfirm = false,
    instagramMediaUrl?: string
  ): Promise<PublishResult> {
    const specCheck = this.validateReelSpecs(reel);
    if (!specCheck.valid) {
      return {
        success: false,
        mode: 'MANUAL_REQUIRED',
        errorMessage: specCheck.errors.join('; '),
        auditMessage: `Publish validation failed: ${specCheck.errors.join(', ')}`
      };
    }

    if (reel.status === 'published' && !isManualConfirm) {
      return {
        success: false,
        mode: 'MANUAL_REQUIRED',
        errorMessage: 'This Reel is already marked published.',
        auditMessage: `Duplicate publishing prevented for Reel ID ${reel.id} (${reel.title})`
      };
    }

    if (isManualConfirm) {
      const cleanUrl = instagramMediaUrl?.trim() || reel.instagramMediaUrl;
      const updatedReel: ReelCalendarItem = {
        ...reel,
        status: 'published',
        publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        instagramMediaUrl: cleanUrl
      };
      AutomationStorage.updateReel(updatedReel);
      AutomationStorage.addAuditLog({
        category: 'PUBLISHING',
        action: `Manual Reel Publishing Recorded: ${reel.title}`,
        actor: 'Wholesale Depot Operator',
        status: 'SUCCESS',
        details: cleanUrl
          ? `Recorded manual post to @raisfrozenfoods (${cleanUrl})`
          : `Recorded manual post to @raisfrozenfoods with CTA keyword ${reel.ctaKeyword}`
      });
      return {
        success: true,
        mode: 'MANUAL_CONFIRMED',
        auditMessage: 'Manual publish confirmed and recorded in audit log.'
      };
    }

    return {
      success: false,
      mode: 'MANUAL_REQUIRED',
      errorMessage: 'Direct Meta Graph API auto-posting is not configured. Download the 9:16 MP4 and use the Publishing Pack to post manually on Instagram.',
      auditMessage: 'Automated Graph API unavailable; manual publishing workflow required.'
    };
  }

  /**
   * Generates a ready-to-copy package for manual publishing via Instagram app or Meta Business Suite.
   */
  static generateManualPublishPackage(reel: ReelCalendarItem) {
    const fullCaptionText = `${reel.caption}\n\n${reel.hashtags.join(' ')}`;
    return {
      reelId: reel.id,
      title: reel.title,
      scheduledDate: reel.scheduledDate,
      productName: reel.productName,
      brand: reel.brand,
      ctaKeyword: reel.ctaKeyword,
      captionText: fullCaptionText,
      assetUrl: reel.productImage,
      instructions: [
        '1. Download the 9:16 vertical video asset or screenshot preview.',
        '2. Open Instagram (@raisfrozenfoods) or Meta Business Suite.',
        '3. Tap (+) Create -> Reel -> Select video.',
        '4. Paste the formatted Telugu caption & hashtags below.',
        '5. Tap Publish, then click "Mark as Published" in this dashboard to track leads!'
      ],
      metaBusinessSuiteUrl: 'https://business.facebook.com/creatorstudio'
    };
  }
}
