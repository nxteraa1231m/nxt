"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Video, Image as ImageIcon, Save, Sparkles, Sliders, Type, CreditCard, Share2 } from "lucide-react";
import { getSiteSettings, updateSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
    storeName: "NXT",
    heroTagline: "NEXT IS YOURS",
    heroButtonText: "Shop Now",
    heroMediaType: "image",
    heroVideoUrlLight: "",
    heroVideoUrlDark: "",
    heroImagesLight: ["/banner_light.png"],
    heroImagesDark: ["/banner.png"],
    featuredTitle: "Our Collection",
    featuredSubtitle: "Curated for you",
    introTagline: "DEFINE YOUR STYLE",
    footerDescription: "Premium fashion for modern people. Elevate your style with our curated collections of high-quality clothing and accessories.",
    storeEmail: "nxteraa953@gmail.com",
    storePhone: "+20 101 234 5678",
    vodafoneCash: "01012345678",
    instapayUsername: "@nxtstore",
    instagramUrl: "https://www.instagram.com/nxt_era11",
    facebookUrl: "https://www.facebook.com/share/1D4P25PPrn/",
    tiktokUrl: "https://www.tiktok.com/@nxt_eraa",
    currency: "EGP",
  });

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            heroImagesLight: data.heroImagesLight?.length ? data.heroImagesLight : ["/banner_light.png"],
            heroImagesDark: data.heroImagesDark?.length ? data.heroImagesDark : ["/banner.png"],
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      toast.success("Site settings & content saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const addImageLight = (url: string) => {
    if (!url) return;
    setSettings((prev) => ({
      ...prev,
      heroImagesLight: [...(prev.heroImagesLight || []), url],
    }));
  };

  const removeImageLight = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      heroImagesLight: prev.heroImagesLight?.filter((_, i) => i !== index),
    }));
  };

  const addImageDark = (url: string) => {
    if (!url) return;
    setSettings((prev) => ({
      ...prev,
      heroImagesDark: [...(prev.heroImagesDark || []), url],
    }));
  };

  const removeImageDark = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      heroImagesDark: prev.heroImagesDark?.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
          <Sliders size={14} />
          CMS & Site Control Center
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">
          Website Settings & Copy Editor
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Manage homepage hero media (images, multiple slides, or video for Light/Dark mode) and customize all site text directly.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: HOMEPAGE HERO MEDIA */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h2 className="font-black text-sm text-zinc-900 uppercase tracking-wider">
                Home Hero Banner & Video Settings
              </h2>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Live Customizer
            </span>
          </div>

          {/* Media Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Hero Media Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, heroMediaType: "image" })}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  settings.heroMediaType === "image"
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <ImageIcon size={16} />
                Image Banner / Slideshow
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, heroMediaType: "video" })}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  settings.heroMediaType === "video"
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <Video size={16} />
                Video Banner (mp4 / WebM)
              </button>
            </div>
          </div>

          {/* Video Settings */}
          {settings.heroMediaType === "video" && (
            <div className="space-y-4 pt-2 border-t border-zinc-100">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Light Mode Video URL (.mp4)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/hero-video-light.mp4"
                  value={settings.heroVideoUrlLight || ""}
                  onChange={(e) => setSettings({ ...settings, heroVideoUrlLight: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Dark Mode Video URL (.mp4)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/hero-video-dark.mp4"
                  value={settings.heroVideoUrlDark || ""}
                  onChange={(e) => setSettings({ ...settings, heroVideoUrlDark: e.target.value })}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>
          )}

          {/* Image Settings */}
          {settings.heroMediaType === "image" && (
            <div className="space-y-6 pt-2 border-t border-zinc-100">
              {/* Light Mode Images */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-3">
                  Light Mode Banner Images (White Mode)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {settings.heroImagesLight?.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 group bg-zinc-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Light Banner ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImageLight(i)}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <ImageUploader onUpload={(url) => addImageLight(url)} />
              </div>

              {/* Dark Mode Images */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-3">
                  Dark Mode Banner Images (Dark Mode)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {settings.heroImagesDark?.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 group bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Dark Banner ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImageDark(i)}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <ImageUploader onUpload={(url) => addImageDark(url)} />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: LIVE WEBSITE TEXT & COPY CMS */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
            <Type size={18} className="text-zinc-900" />
            <h2 className="font-black text-sm text-zinc-900 uppercase tracking-wider">
              Website Texts & Copy Control
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName || ""}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currency || "EGP"}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Home Hero Subtitle / Tagline
              </label>
              <input
                type="text"
                value={settings.heroTagline || ""}
                onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Home Hero Button Text
              </label>
              <input
                type="text"
                value={settings.heroButtonText || ""}
                onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Catalog Section Title
              </label>
              <input
                type="text"
                value={settings.featuredTitle || ""}
                onChange={(e) => setSettings({ ...settings, featuredTitle: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Catalog Section Subtitle
              </label>
              <input
                type="text"
                value={settings.featuredSubtitle || ""}
                onChange={(e) => setSettings({ ...settings, featuredSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Intro Screen Animated Tagline
              </label>
              <input
                type="text"
                value={settings.introTagline || ""}
                onChange={(e) => setSettings({ ...settings, introTagline: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Footer Description Paragraph
              </label>
              <textarea
                rows={3}
                value={settings.footerDescription || ""}
                onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: STORE CONTACT & PAYMENT METHODS */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
            <CreditCard size={18} className="text-zinc-900" />
            <h2 className="font-black text-sm text-zinc-900 uppercase tracking-wider">
              Contact & Payment Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Vodafone Cash Number
              </label>
              <input
                type="text"
                value={settings.vodafoneCash || ""}
                onChange={(e) => setSettings({ ...settings, vodafoneCash: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                InstaPay Handle / Username
              </label>
              <input
                type="text"
                value={settings.instapayUsername || ""}
                onChange={(e) => setSettings({ ...settings, instapayUsername: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Support Email Address
              </label>
              <input
                type="email"
                value={settings.storeEmail || ""}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Support Phone Number
              </label>
              <input
                type="text"
                value={settings.storePhone || ""}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SOCIAL MEDIA LINKS */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
            <Share2 size={18} className="text-zinc-900" />
            <h2 className="font-black text-sm text-zinc-900 uppercase tracking-wider">
              Social Media Links
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Instagram Profile Link
              </label>
              <input
                type="text"
                value={settings.instagramUrl || ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Facebook Page Link
              </label>
              <input
                type="text"
                value={settings.facebookUrl || ""}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                TikTok Profile Link
              </label>
              <input
                type="text"
                value={settings.tiktokUrl || ""}
                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all duration-300 shadow-xl shadow-zinc-900/10 disabled:opacity-50"
        >
          {saving ? <Spinner size="sm" className="border-white border-t-transparent" /> : <Save size={16} />}
          Save All Settings & Website Text
        </button>
      </form>
    </div>
  );
}
