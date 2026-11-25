import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, CheckCircle, FileText, Send, Sparkles, Star, MapPin } from 'lucide-react';
import { PRODUCTS, BUSINESS_INFO, ProductItem } from '../data/catalogue';
import { AutomationStorage } from '../services/automationStorage';
import { api } from '../services/api';

const REGIONAL_ROUTES = [
  'Rayachoty (Hub 516269)',
  'Chinnamandem',
  'Kalakada',
  'Mahal',
  'Galiveedu',
  'Rajampeta',
  'Sundupalli',
  'Kadiri'
];

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteItems: { [sku: string]: number };
  onUpdateQty: (sku: string, delta: number) => void;
  onRemoveItem: (sku: string) => void;
  onClearQuote: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  quoteItems,
  onUpdateQty,
  onRemoveItem,
  onClearQuote
}) => {
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Rayachoty');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Selected products array
  const itemsInQuote = Object.entries(quoteItems)
    .filter(([_, qty]) => qty > 0)
    .map(([sku, qty]) => {
      const product = PRODUCTS.find((p) => p.sku === sku);
      return { product, qty };
    })
    .filter((item): item is { product: ProductItem; qty: number } => Boolean(item.product));

  const totalUnits = itemsInQuote.reduce((acc, curr) => acc + curr.qty, 0);

  const captureLeadInCRM = (channel: 'whatsapp_direct' | 'website_quote') => {
    try {
      const leadProducts = itemsInQuote.map(i => `${i.product.name} (${i.product.brand}) x ${i.qty}`).join('; ');
      const buyerPhone = phone.trim();
      const buyerBiz = businessName.trim() || 'Direct Storefront Buyer';
      const buyerLoc = deliveryArea.trim() || 'Rayachoty (516269)';

      AutomationStorage.addLead({
        source: channel,
        customerName: customerName.trim() || 'Storefront Buyer',
        businessName: buyerBiz,
        businessType: 'Hotel / Restaurant',
        productInterest: leadProducts || 'Wholesale Catalogue Order',
        requiredQuantity: `${totalUnits} Units (${itemsInQuote.length} Items)`,
        deliveryLocation: buyerLoc,
        phone: buyerPhone || undefined,
        status: 'Quote Pending',
        lastMessageSnippet: notes ? `Notes: ${notes} | Items: ${leadProducts}` : `Order: ${leadProducts}`,
        humanHandoffRequired: true,
        notes: `Submitted via Storefront Requisition Modal (${channel === 'whatsapp_direct' ? 'WhatsApp' : 'Wholesale Bill Request'}).`
      });

      // Also persist to backend B2B Leads CRM when buyer provided contact details
      if (buyerPhone) {
        void api.createLead({
          business_name: buyerBiz,
          contact_person: customerName.trim() || undefined,
          phone: buyerPhone,
          business_type: 'Hotel / Restaurant',
          location: buyerLoc,
          product_interest: leadProducts || 'Wholesale Catalogue Order',
          status: 'NEW'
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Lead capture notice:', e);
    }
  };

  const handleWhatsAppSend = () => {
    captureLeadInCRM('whatsapp_direct');
    let message = `*WHOLESALE ORDER — RAIS AGENCIES RAYACHOTY (516269)*\n`;
    message += `──────────────────\n`;
    if (customerName) message += `👤 *Name:* ${customerName}\n`;
    if (businessName) message += `🏢 *Shop / Hotel:* ${businessName}\n`;
    if (phone) message += `📞 *Phone / WhatsApp:* ${phone}\n`;
    message += `📍 *Delivery Area:* ${deliveryArea || 'Rayachoty town'}\n`;
    message += `──────────────────\n`;
    message += `*ORDERED ITEMS (${itemsInQuote.length} items / ${totalUnits} units):*\n`;

    itemsInQuote.forEach(({ product, qty }, idx) => {
      message += `${idx + 1}. ${product.name}\n`;
      message += `   Brand: ${product.brand} | Pack: ${product.pack} | Qty: *${qty}*\n`;
    });

    message += `──────────────────\n`;
    if (notes) message += `📝 *Notes:* ${notes}\n`;
    message += `──────────────────\n`;
    message += `Please send today's wholesale bill and confirm delivery/pickup time.\n\n`;
    message += `⭐ *Rate Our Route Supply (10-Second Google Review):*\n`;
    message += `https://search.google.com/local/writereview?placeid=ChIJWWL3zBgDszsR-lQG81niw0c\n`;
    message += `Suggested 5-star feedback: "RAIS Agencies is our trusted wholesale supply partner in ${deliveryArea} for fresh frozen foods and commercial packaging!"\n`;

    const encoded = encodeURI(message);
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encoded}`, '_blank');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    captureLeadInCRM('website_quote');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-[#0f1c3f] border border-cyan-500/30 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-200 text-white">

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-cyan-500/20 flex items-center justify-between bg-[#081026]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                Wholesale Order &amp; Price List
              </h2>
              <p className="text-xs text-slate-400">
                Direct Wholesale Rates · RAIS Agencies Rayachoty (516269)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="size-16 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 mx-auto flex items-center justify-center">
                <CheckCircle className="size-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Wholesale Order Ready!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{customerName || 'Sir'}</strong>. Click below to send this order directly to our Rayachoty WhatsApp desk for today&apos;s wholesale bill and fast dispatch.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsAppSend}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <MessageSquare className="size-4 fill-current" />
                  <span>Send Order to WhatsApp Desk</span>
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClearQuote();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs"
                >
                  Done
                </button>
              </div>

              {/* Automated 10-Second 5-Star Review Funnel for Route */}
              <div className="mt-6 p-4 rounded-2xl bg-[#081026] border border-amber-500/30 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="size-4 text-amber-400" />
                    <span>10-Second 5-Star Review Funnel · {deliveryArea}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Route Verified
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Support your regional delivery vehicle dispatch to <strong>{deliveryArea}</strong> with a 5-star Google Maps review.
                </p>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-amber-200/90 italic">
                  &ldquo;RAIS Agencies is our trusted wholesale supply partner in {deliveryArea}. Top quality frozen snacks and food packaging materials delivered on time!&rdquo;
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <a
                    href="https://search.google.com/local/writereview?placeid=ChIJWWL3zBgDszsR-lQG81niw0c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs text-center transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Star className="size-3.5 fill-slate-950 text-slate-950" />
                    <span>Tap to Submit 5-Star Review (10s)</span>
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Namaste! 🙏 Thank you for choosing RAIS Agencies Rayachoty for delivery along the ${deliveryArea} route.\n\nPlease take 10 seconds to submit a 5-star Google review:\n⭐ https://search.google.com/local/writereview?placeid=ChIJWWL3zBgDszsR-lQG81niw0c\n\nSuggested feedback:\n"RAIS Agencies is our trusted wholesale supply partner in ${deliveryArea}. Top quality frozen snacks and food packaging materials delivered on time!"`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <MessageSquare className="size-3.5 fill-white" />
                    <span>WhatsApp Review Request</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Selected Catalogue Items ({itemsInQuote.length})
                  </h3>
                  {itemsInQuote.length > 0 && (
                    <button
                      onClick={onClearQuote}
                      className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {itemsInQuote.length === 0 ? (
                  <div className="text-center py-10 rounded-2xl bg-[#081026] border border-dashed border-cyan-500/20 p-6">
                    <Sparkles className="size-8 text-cyan-300/40 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">
                      No products added yet. Click "+ Add" on any item in the catalogue to build your wholesale order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {itemsInQuote.map(({ product, qty }) => (
                      <div
                        key={product.sku}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#081026] border border-cyan-500/20"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-cyan-300 font-bold">
                              {product.sku}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {product.brand}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Pack: {product.pack} • HSN {product.hsn || '—'}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center rounded-xl bg-cyan-400/20 border border-cyan-400 text-cyan-200">
                            <button
                              onClick={() => onUpdateQty(product.sku, -1)}
                              className="p-1.5 hover:bg-cyan-400/30 transition-colors"
                              title="Decrease"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="px-2 font-mono text-xs font-bold text-white min-w-6 text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(product.sku, 1)}
                              className="p-1.5 hover:bg-cyan-400/30 transition-colors"
                              title="Increase"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(product.sku)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Commercial Enquiry Scope */}
              {itemsInQuote.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#081026] border border-cyan-500/20 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>Order Summary:</span>
                    <span className="text-cyan-300 font-bold">{itemsInQuote.length} Products ({totalUnits} Selected Units)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1.5 border-t border-cyan-500/15">
                    Wholesale bill with best bulk rates will be shared directly on WhatsApp based on your order. Best wholesale rates guaranteed.
                  </p>
                </div>
              )}

              {/* Inquiry Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-2 border-t border-cyan-500/20">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Buyer Details & Delivery Area
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Reddy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Restaurant / Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Royal Spice Café"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Delivery Route / Town *
                    </label>
                    <select
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white focus:outline-none focus:border-cyan-300"
                    >
                      {REGIONAL_ROUTES.map((route) => (
                        <option key={route} value={route}>{route}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Special Instructions / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Regular daily route, bulk carton requirements, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081026] border border-cyan-400/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 resize-none"
                  />
                </div>

                {/* Submit actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="w-full sm:flex-1 py-3.5 px-5 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.01]"
                  >
                    <MessageSquare className="size-4 fill-current" />
                    <span>Send Order via WhatsApp</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.01]"
                  >
                    <Send className="size-3.5" />
                    <span>Request Wholesale Bill</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
