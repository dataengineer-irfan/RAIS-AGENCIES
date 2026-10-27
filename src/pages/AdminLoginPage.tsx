import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { RaisLogo } from '../components/RaisLogo';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.login(username, password);
      setIsLoading(false);

      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(result.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f1c3f] border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all mb-6 group shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>← Return to Public Website</span>
        </button>

        {/* Login Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0f1c3f]/95 border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <RaisLogo size="lg" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                Wholesale Admin Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Authorized Personnel Only · Rayachoty (516269)
              </p>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Admin Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or rais.frozenfoods@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#081026] border border-cyan-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Master Passkey
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin passkey"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#081026] border border-cyan-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>

          </form>

          {/* Security Credentials Tip */}
          <div className="p-3.5 rounded-xl bg-[#081026] border border-cyan-500/15 text-[11px] text-slate-400 text-center leading-relaxed">
            <span className="text-amber-400 font-bold">Initial Default PIN:</span> <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded">RAIS@516269</code>
            <div className="text-[10px] text-slate-500 mt-1">You can change this passkey anytime in the Settings tab.</div>
          </div>

          {/* Security Footer Badge */}
          <div className="pt-2 border-t border-cyan-500/15 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Encrypted Session · Brute-force Protected</span>
          </div>

        </div>

      </div>
    </div>
  );
};
