import React from 'react';
import { MapPin, Snowflake, Truck, Banknote, CheckCircle2 } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: MapPin,
      title: 'Rayachoty Commercial Hub',
      detail: 'Near Reddies Colony, 516269'
    },
    {
      icon: Snowflake,
      title: 'Sub-Zero Cold Storage',
      detail: 'Commercial frozen food lines'
    },
    {
      icon: Truck,
      title: 'Kitchen Dispatch',
      detail: 'Restaurants, cafés & caterers'
    },
    {
      icon: Banknote,
      title: 'Wholesale Settlement',
      detail: 'Cash / COD & UPI accepted'
    },
    {
      icon: CheckCircle2,
      title: 'Authorised Stockist',
      detail: 'ITC · Milky Mist · Del Monte · McCain'
    }
  ];

  return (
    <div className="w-full bg-white border-y border-[#E8E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-y divide-[#E8E2DA] sm:divide-y-0 sm:divide-x sm:divide-[#E8E2DA]">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            const isLastOnMobile = idx === 4;
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 py-4 sm:py-5 px-3 sm:px-4 lg:px-6 ${
                  isLastOnMobile ? 'col-span-2 lg:col-span-1 justify-center sm:justify-start' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-[#C8900A] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1C1410] leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#8B7A5E] mt-0.5 leading-snug">
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
