/**
 * RAIS Growth Engine Cloud API Client
 * Connects the public website and admin portal to the live cloud backend on Render.
 */

const API_BASE = (import.meta as any).env?.VITE_GROWTH_ENGINE_API_URL || 'https://rais-growth-backend.onrender.com';

export interface GoogleConnectionStatus {
  status: 'NOT_CONFIGURED' | 'API_ACCESS_NOT_APPROVED' | 'NOT_CONNECTED' | 'AUTHORIZATION_PENDING' | 'CONNECTED' | 'TOKEN_EXPIRED' | 'ACCESS_REVOKED' | 'API_ERROR';
  connected: boolean;
  mode: string;
  is_verified: boolean;
  is_live: boolean;
  is_simulated: boolean;
  account_id: string | null;
  location_id: string | null;
  account_email: string | null;
  location_name: string | null;
  primary_category: string | null;
  scopes_granted: string[];
  message: string;
  actionable_instruction?: string;
}

export class GrowthEngineApi {
  static getBaseUrl(): string {
    return API_BASE;
  }

  static getAuthorizeUrl(): string {
    return `${API_BASE}/api/v1/google/authorize`;
  }

  static async getGoogleStatus(): Promise<GoogleConnectionStatus> {
    try {
      const response = await fetch(`${API_BASE}/api/v1/google/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('Failed to reach Growth Engine cloud backend:', err);
      return {
        status: 'API_ERROR',
        connected: false,
        mode: 'OFFLINE',
        is_verified: false,
        is_live: false,
        is_simulated: false,
        account_id: null,
        location_id: null,
        account_email: null,
        location_name: null,
        primary_category: null,
        scopes_granted: [],
        message: 'Unable to reach backend service on Render.',
        actionable_instruction: 'Check if backend service is running.'
      };
    }
  }

  static async getHealth(): Promise<{ status: string; service: string; version: string }> {
    const res = await fetch(`${API_BASE}/api/health`);
    return await res.json();
  }
}
