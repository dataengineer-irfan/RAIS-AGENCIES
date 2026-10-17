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
            <span>Commercial Operating Policies</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Terms of Wholesale{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">
              Supply & Policies
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Standard operating conditions for commercial B2B transactions with RAIS Agencies, Rayachoty.
          </p>
        </div>

        {/* Section 1: Ordering & Settlement */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-cyan-400 shrink-0" />
            <span>1. Wholesale Terms & Settlement</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            RAIS Agencies distributes exclusively to verified foodservice operators, restaurants, cafés, quick-service food outlets, and institutional caterers. All transactions are settled on a <strong className="text-white font-semibold">Cash on Delivery (COD)</strong> or <strong className="text-white font-semibold">Immediate Digital UPI</strong> basis (<code className="text-cyan-300 font-mono text-xs">{BUSINESS_INFO.upiId}</code>). Invoice date equals due date unless prior written commercial credit terms have been formally executed.
          </p>
        </div>

        {/* Section 2: Cold Chain Protocol */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <ShieldAlert className="size-5 text-amber-400 shrink-0" />
            <span>2. Cold-Chain Handover & Product Acceptance</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            Frozen food inventory (French fries, nuggets, patties, momos, mozzarella cheese) leaves our Rayachoty hub at continuous <strong className="text-cyan-300 font-semibold">-18°C deep freeze</strong>. Buyers are strictly advised to inspect product temperature and carton seals at the time of delivery or counter handover. Once accepted, products must be immediately transferred to commercial deep freezers. Due to food safety standards, frozen items cannot be returned or refunded once thawed.
          </p>
        </div>

        {/* Section 3: Taxes & Invoicing */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
            <span>3. GST & Tax Invoicing</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            In accordance with B2B wholesale distribution standards, official wholesale quotations and volume trade terms are provided directly to verified commercial food-service establishments upon quotation request. Formal commercial tax invoices detailing statutory Goods and Services Tax (GST) according to approved HSN classifications (5% on frozen food staples, 12% on dairy and gourmet sauces, 18% on packaging materials) and buyer GSTIN are generated upon order execution.
          </p>
        </div>

        {/* Section 4: Privacy & Communications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1c3f]/85 border border-cyan-500/25 space-y-3 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-cyan-400 shrink-0" />
            <span>4. Commercial Communications</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            Direct communications via WhatsApp, telephone, or digital requisition forms are strictly utilised for operational fulfillment, dispatch notifications, and price list updates. Contact details are never shared with third parties or external marketing agencies.
          </p>
        </div>

      </div>
    </div>
  );
};
