import React from 'react';
import { BUSINESS_INFO } from '../data/catalogue';
import { ShieldAlert, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LegalPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-[#081026] text-white min-h-screen relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-cyan-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <FileText className="size-4 text-cyan-400" />
            <span>Wholesale Operating Policies</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Terms of Wholesale{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
              Supply & Orders
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Simple, transparent wholesale rules for businesses buying from RAIS Agencies, Rayachoty (516269).
          </p>
        </div>

        {/* Section 1: Ordering & Settlement */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-cyan-400 shrink-0" />
            <span>1. Wholesale Orders & Payment Terms</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            RAIS Agencies supplies hotels, fast food centers, bakeries, cafes, and caterers in Rayachoty. Payment is settled via <strong className="text-white font-semibold">Cash on Delivery (COD)</strong> or instant digital <strong className="text-white font-semibold">UPI</strong> (Google Pay, PhonePe, Paytm to <code className="text-cyan-300 font-mono text-xs">{BUSINESS_INFO.upiId}</code>). Credit terms are available only for verified regular business accounts after mutual agreement.
          </p>
        </div>

        {/* Section 2: Cold Chain Protocol */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <ShieldAlert className="size-5 text-amber-400 shrink-0" />
            <span>2. Cold Storage & Quality Handover</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            All frozen items (French fries, nuggets, momos, burger patties, mozzarella cheese) leave our Rayachoty depot frozen solid at <strong className="text-cyan-300 font-semibold">-18°C deep freeze</strong>. Please inspect cartons and packets at the time of counter pickup or town delivery and shift them immediately into your deep freezer. Due to food hygiene and safety standards, frozen items cannot be returned or replaced once thawed.
          </p>
        </div>

        {/* Section 3: Taxes & Invoicing */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
            <span>3. GST & Wholesale Billing</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            We provide official wholesale tax invoices with statutory GST as per government HSN codes (5% on frozen snacks, 12% on dairy and culinary sauces, 18% on takeaway packaging). If your business is GST registered, your GSTIN will be printed on the invoice for tax credit claims.
          </p>
        </div>

        {/* Section 4: Privacy & Communications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-cyan-400 shrink-0" />
            <span>4. Direct Business Communication</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            Your phone number and WhatsApp details are used only to send order updates, dispatch notes, and updated wholesale rate sheets. We do not share your contact information with any third-party marketing companies.
          </p>
        </div>

      </div>
    </div>
  );
};
