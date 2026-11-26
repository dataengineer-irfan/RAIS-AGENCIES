// Backend-verified JWT Authentication Service for RAIS Growth Engine Portal

const API_HOST =
  (import.meta as any).env?.VITE_GROWTH_ENGINE_API_URL ||
  'https://rais-growth-backend.onrender.com';
const BASE_URL = `${API_HOST.replace(/\/$/, '')}/api/v1`;

const TOKEN_STORAGE_KEY = 'rais_admin_jwt';
const USER_STORAGE_KEY = 'rais_admin_user';

export interface AdminSession {
  isAuthenticated: boolean;
  user: string;
  token: string;
}

export class AuthService {
  /**
   * Returns stored Bearer JWT if present and not locally expired.
   */
  static getToken(): string | null {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.logout();
        return null;
      }
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }
      return token;
    } catch {
      return null;
    }
  }

  /**
   * Returns Authorization header object when logged in.
   */
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Authenticates directly against FastAPI /api/v1/auth/login (Neon Postgres bcrypt hash).
   */
  static async login(
    username: string,
    passkey: string
  ): Promise<{ success: boolean; message: string; session?: AdminSession }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          passkey: passkey.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          message:
            data?.detail ||
            `Authentication rejected (HTTP ${res.status}). Check username and passkey.`,
        };
      }
      if (!data.access_token) {
        return { success: false, message: 'Server did not return a session token.' };
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      localStorage.setItem(USER_STORAGE_KEY, data.user || 'admin');
      // Purge any legacy client-side demo auth keys
      localStorage.removeItem('rais_admin_passkey');
      sessionStorage.removeItem('rais_admin_session');

      return {
        success: true,
        message: 'Authenticated via RAIS Cloud Security.',
        session: {
          isAuthenticated: true,
          user: data.user || 'admin',
          token: data.access_token,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.message ||
          'Backend server is waking up or unreachable. Please retry in a few seconds.',
      };
    }
  }

  /**
   * Verifies stored JWT against backend /api/v1/auth/verify.
   * Logs out immediately on 401; preserves valid unexpired token only if network is temporarily unreachable.
   */
  static async verifySession(): Promise<{ authenticated: boolean; user?: string }> {
    const token = this.getToken();
    if (!token) return { authenticated: false };

    try {
      const res = await fetch(`${BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        this.logout();
        return { authenticated: false };
      }
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          authenticated: Boolean(data.authenticated),
          user: data.user || localStorage.getItem(USER_STORAGE_KEY) || 'admin',
        };
      }
    } catch {
      // Backend cold-starting; keep locally non-expired JWT until next API call validates
    }
    return {
      authenticated: true,
      user: localStorage.getItem(USER_STORAGE_KEY) || 'admin',
    };
  }

  /**
   * Changes the admin passkey on the server (Neon Postgres bcrypt hash).
   */
  static async changePasskey(
    currentPasskey: string,
    newPasskey: string
  ): Promise<{ success: boolean; message: string }> {
    const token = this.getToken();
    if (!token) {
      return { success: false, message: 'Admin session required.' };
    }
    try {
      const res = await fetch(`${BASE_URL}/auth/change-passkey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_passkey: currentPasskey,
          new_passkey: newPasskey,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, message: data?.detail || `HTTP ${res.status}: Failed to update passkey.` };
      }
      return { success: true, message: data?.message || 'Admin passkey updated in cloud database.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Backend unreachable.' };
    }
  }

  /**
   * Quick synchronous check for unexpired JWT (validated asynchronously via verifySession).
   */
  static checkAuth(): boolean {
    return Boolean(this.getToken());
  }

  /**
   * Clears all local & legacy admin credentials cleanly.
   */
  static logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('rais_admin_passkey');
    localStorage.removeItem('rais_admin_attempts');
    sessionStorage.removeItem('rais_admin_session');
  }
}
