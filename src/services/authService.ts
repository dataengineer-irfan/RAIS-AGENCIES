// Secure Authentication Service for RAIS Wholesale Hub Admin Portal

const AUTH_STORAGE_KEY = 'rais_admin_session';
const PASSKEY_STORAGE_KEY = 'rais_admin_passkey';
const ATTEMPTS_KEY = 'rais_admin_attempts';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  passkey: 'RAIS@516269' // Default initial PIN based on Rayachoty PIN 516269
};

export interface AdminSession {
  isAuthenticated: boolean;
  user: string;
  loginTime: string;
  token: string;
}

export class AuthService {
  /**
   * Retrieves the current stored passkey (or returns default).
   */
  static getStoredPasskey(): string {
    return localStorage.getItem(PASSKEY_STORAGE_KEY) || DEFAULT_CREDENTIALS.passkey;
  }

  /**
   * Changes the master admin passkey.
   */
  static updatePasskey(currentPasskey: string, newPasskey: string): { success: boolean; message: string } {
    if (currentPasskey !== this.getStoredPasskey()) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (!newPasskey || newPasskey.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    localStorage.setItem(PASSKEY_STORAGE_KEY, newPasskey);
    return { success: true, message: 'Password successfully updated.' };
  }

  /**
   * Validates admin login credentials with lockout protection.
   */
  static login(username: string, passkey: string): { success: boolean; message: string; session?: AdminSession } {
    // Check lockout
    const attemptData = this.getAttemptData();
    if (attemptData.lockedUntil && Date.now() < attemptData.lockedUntil) {
      const waitSec = Math.ceil((attemptData.lockedUntil - Date.now()) / 1000);
      return { success: false, message: `Account temporarily locked due to too many failed attempts. Please wait ${waitSec}s.` };
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = passkey.trim();
    const validPass = this.getStoredPasskey();

    const isUserValid = cleanUser === 'admin' || cleanUser === 'rais.frozenfoods@gmail.com' || cleanUser === 'rais';
    const isPassValid = cleanPass === validPass;

    if (isUserValid && isPassValid) {
      // Reset attempts
      localStorage.removeItem(ATTEMPTS_KEY);
      
      const session: AdminSession = {
        isAuthenticated: true,
        user: cleanUser,
        loginTime: new Date().toISOString(),
        token: `rais_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      };

      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true, message: 'Authentication successful.', session };
    }

    // Record failed attempt
    const newCount = (attemptData.count || 0) + 1;
    let lockedUntil = undefined;
    if (newCount >= 5) {
      lockedUntil = Date.now() + 60 * 1000; // 60s lock
    }
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ count: newCount, lockedUntil }));

    if (lockedUntil) {
      return { success: false, message: '5 failed login attempts. Locked for 60 seconds.' };
    }

    return { 
      success: false, 
      message: `Invalid username or password. (${5 - newCount} attempts remaining before temporary lockout)` 
    };
  }

  /**
   * Checks if user has an active authenticated session.
   */
  static checkAuth(): boolean {
    try {
      const sessionStr = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (!sessionStr) return false;
      const session: AdminSession = JSON.parse(sessionStr);
      return Boolean(session && session.isAuthenticated);
    } catch {
      return false;
    }
  }

  /**
   * Logs out the current admin session.
   */
  static logout(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private static getAttemptData(): { count: number; lockedUntil?: number } {
    try {
      const str = localStorage.getItem(ATTEMPTS_KEY);
      if (str) return JSON.parse(str);
    } catch {}
    return { count: 0 };
  }
}
