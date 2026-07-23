"use client";

import { toast } from "sonner";

export default function AdminSettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Settings</h1>
        <p className="text-zinc-400 text-xs mt-1">
          Configure storefront metadata and administrative checkout details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <h2 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-6">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Store Name
              </label>
              <input
                type="text"
                defaultValue="NXT"
                className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Store Email
              </label>
              <input
                type="email"
                defaultValue="nxteraa953@gmail.com"
                className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+20 101 234 5678"
                className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          <h2 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-6">Payment Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Vodafone Cash Number
              </label>
              <input
                type="text"
                defaultValue="01012345678"
                className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                InstaPay Username
              </label>
              <input
                type="text"
                defaultValue="@nxtstore"
                className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button 
          type="submit"
          className="inline-flex items-center justify-center bg-zinc-900 text-white px-6 py-3.5 rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all duration-300 shadow-md shadow-zinc-900/10"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
