import React from 'react';
import { Snowflake } from 'lucide-react';

interface RaisLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'monogram';
  lightText?: boolean;
}

export const RaisLogo: React.FC<RaisLogoProps> = ({
  size = 'md',
  variant = 'full',
  lightText = true
}) => {
  // Dimensions based on size
  const diamondSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const fontSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const agencySize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-sm' : 'text-xs';
  const taglineSize = size === 'sm' ? 'text-[7px]' : size === 'lg' ? 'text-[10px]' : 'text-[8px]';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Authentic Geometric Diamond Emblem */}
      <div className={`relative ${diamondSize} flex-shrink-0 flex items-center justify-center`}>
        {/* Diamond Outer Frame */}
        <div className="absolute inset-0 rotate-45 rounded-sm border-2 border-amber-400 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-lg shadow-amber-500/10" />
        {/* Diamond Inner Border */}
        <div className="absolute inset-[3px] rotate-45 rounded-[1px] border border-amber-400/40" />
        
        {/* Authentic Center Monogram */}
        <div className="relative z-10 flex flex-col items-center justify-center leading-none text-center">
          <span className="font-serif font-black text-amber-300 drop-shadow-md text-sm sm:text-base">
            R
          </span>
          <span className="text-[6px] tracking-widest font-black text-slate-300 -mt-0.5">
            RAIS
          </span>
        </div>
      </div>

      {/* Official Wordmark */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className={`font-serif font-black tracking-tight ${fontSize} ${lightText ? 'text-white' : 'text-slate-950'}`}>
              RAIS
            </span>
            <span className={`font-black tracking-wider uppercase ${agencySize} text-amber-400`}>
              AGENCIES
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-slate-400 font-medium tracking-wider">
            <Snowflake className="w-2.5 h-2.5 text-cyan-400" />
            <span className={`${taglineSize} uppercase tracking-widest font-semibold text-cyan-300/80`}>
              Frozen Food Products
            </span>
            <Snowflake className="w-2.5 h-2.5 text-cyan-400" />
          </div>
        </div>
      )}
    </div>
  );
};
