import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Plus, CheckCircle2, AlertCircle, 
  MapPin, Phone, Globe, Layers, ShieldCheck 
} from 'lucide-react';
import { api, BusinessProfile, CatalogSKU, ServiceArea } from '../../services/api';

export const BusinessInfoManagerView: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [skus, setSkus] = useState<CatalogSKU[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pData, skusData, areasData] = await Promise.all([
        api.getProfile(),
        api.listSkus(),
        api.listServiceAreas()
      ]);
      setProfile(pData);
      setSkus(skusData);
      setAreas(areasData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setSaveStatus('Saving...');
      await api.updateProfile(profile);
      setSaveStatus('Profile updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      setSaveStatus('Failed to update profile.');
    }
  };

  const toggleSkuStock = async (sku: CatalogSKU) => {
    try {
      const updated = await api.updateSku(sku.id, { in_stock: !sku.in_stock });
      setSkus(skus.map(s => s.id === sku.id ? updated : s));
    } catch (e) {
      console.error('Failed to toggle stock', e);
    }
  };

  if (loading || !profile) {
    return <div className="p-8 text-center text-slate-400">Loading Business Information...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          <span>Editable Business Information & Catalog Manager</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Update verified business details, categories, live stock levels, and service routes without modifying source code.
        </p>
      </div>

      {saveStatus && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
          saveStatus.includes('success') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleProfileSave} className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Google Business Profile Details</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name (Official)</label>
            <input
              type="text"
              value={profile.business_name}
              onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
              className="w-full bg-[#070b14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Strictly legal name — no keyword stuffing per Google policy.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Category (Google Taxonomy)</label>
            <input
              type="text"
              value={profile.primary_category}
              onChange={(e) => setProfile({ ...profile, primary_category: e.target.value })}
              className="w-full bg-[#070b14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Recommended: 'Wholesale food store' for commercial B2B ranking.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Categories (Comma separated)</label>
            <input
              type="text"
              value={profile.secondary_categories}
              onChange={(e) => setProfile({ ...profile, secondary_categories: e.target.value })}
              className="w-full bg-[#070b14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Verified Physical Address & Landmark</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full bg-[#070b14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Must maintain official landmark: 'Beside Indel Money Bank, Sundupalli Road'.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Verified Phone (WhatsApp Desk)</label>
            <input
              type="text"
              value={profile.primary_phone}
              onChange={(e) => setProfile({ ...profile, primary_phone: e.target.value })}
              className="w-full bg-[#070b14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Phone (Optional - Unverified)</label>
            <input
              type="text"
              value={profile.secondary_phone || ''}
              onChange={(e) => setProfile({ ...profile, secondary_phone: e.target.value })}
              placeholder="Leave blank unless confirmed"
              className="w-full bg-[#070b14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Business Description (Max 750 characters)
              </label>
              <span className={`text-[10px] font-mono ${(profile.description?.length || 0) > 750 ? 'text-red-400' : 'text-slate-400'}`}>
                {profile.description?.length || 0} / 750
              </span>
            </div>
            <textarea
              rows={4}
              value={profile.description || ''}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>

      {/* Live SKUs & Stock Management */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Approved Catalog SKUs & Live Stock Status</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Deterministic validator checks AI posts against this list. Toggling stock blocks AI from claiming out-of-stock items.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070b14] text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">SKU Code</th>
                <th className="p-3">Product Name & Brand</th>
                <th className="p-3">Category</th>
                <th className="p-3">Pack Size</th>
                <th className="p-3">Stock Status</th>
                <th className="p-3">Verification</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {skus.map((sku) => (
                <tr key={sku.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-400">{sku.sku}</td>
                  <td className="p-3">
                    <div className="font-semibold text-white">{sku.name}</div>
                    <div className="text-[11px] text-slate-400">{sku.brand}</div>
                  </td>
                  <td className="p-3 text-slate-300">{sku.category}</td>
                  <td className="p-3 font-mono text-slate-400">{sku.pack_size}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      sku.in_stock ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {sku.in_stock ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{sku.verification_status}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleSkuStock(sku)}
                      className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                        sku.in_stock
                          ? 'bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                      }`}
                    >
                      {sku.in_stock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-3">
          <MapPin className="w-4 h-4" />
          <span>Configured Service Areas (50 km Catchment)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {areas.map((a) => (
            <div key={a.id} className="p-3 bg-[#070b14] border border-slate-800 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-xs text-white">{a.area_name}</span>
                {a.is_primary && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                    PRIMARY
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">{a.delivery_frequency}</div>
              <div className="text-[10px] text-slate-500 mt-1">{a.notes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
