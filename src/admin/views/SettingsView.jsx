import React, { useState, useEffect } from 'react';

export default function SettingsView({ currentLang }) {
  const isRtl = currentLang === 'ar';
  
  const [settings, setSettings] = useState({
    phone: '+212 636-820175',
    email: 'contact@bijouterie925.com',
    locationAr: 'المغرب',
    locationEn: 'Morocco',
    supportAr: 'دعم العملاء 24/7',
    supportEn: '24/7 Customer Support'
  });

  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('store_topbar_details');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('store_topbar_details', JSON.stringify(settings));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mb-1">
          {isRtl ? 'إعدادات معلومات الشريط العلوي' : 'TopBar Info Settings'}
        </h1>
        <p className="text-xs text-gray-400">
          {isRtl ? 'التحكم في رقم الهاتف، البريد، الموقع، وخدمة العملاء الظاهرة في أعلى المتجر' : 'Manage phone, email, location, and support text in TopBar'}
        </p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xs text-xs">
          {isRtl ? '✓ تم حفظ التغييرات بنجاح!' : '✓ Changes saved successfully!'}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#121212] border border-[#D4AF37]/20 p-6 rounded-xs space-y-4">
        <h2 className="text-sm font-bold text-[#D4AF37] mb-2">
          {isRtl ? 'بيانات التواصل والخدمة' : 'Contact & Service Details'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {isRtl ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {isRtl ? 'الموقع / الدولة (بالعربية)' : 'Location (Arabic)'}
            </label>
            <input
              type="text"
              name="locationAr"
              value={settings.locationAr}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {isRtl ? 'الموقع / الدولة (بالإنجليزية)' : 'Location (English)'}
            </label>
            <input
              type="text"
              name="locationEn"
              value={settings.locationEn}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {isRtl ? 'نص خدمة العملاء (بالعربية)' : 'Customer Support Text (Arabic)'}
            </label>
            <input
              type="text"
              name="supportAr"
              value={settings.supportAr}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2">
              {isRtl ? 'نص خدمة العملاء (بالإنجليزية)' : 'Customer Support Text (English)'}
            </label>
            <input
              type="text"
              name="supportEn"
              value={settings.supportEn}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#D4AF37] text-black font-bold px-6 py-2.5 rounded-xs text-xs hover:bg-[#c29f31] transition cursor-pointer"
          >
            {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}