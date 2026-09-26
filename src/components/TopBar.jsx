import React, { useState, useEffect } from 'react';

export default function TopBar({ currentLang }) {
  const [settings, setSettings] = useState({
    phone: '+212 636-820175',
    email: 'contact@bijouterie925.com',
    locationAr: 'المغرب',
    locationEn: 'Morocco',
    supportAr: 'دعم العملاء 24/7',
    supportEn: '24/7 Customer Support'
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('store_topbar_details');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const locationText = currentLang === 'ar' ? settings.locationAr : settings.locationEn;
  const supportText = currentLang === 'ar' ? settings.supportAr : settings.supportEn;

  return (
    <div className="bg-[#1A1A1A] text-white py-2.5 px-3 sm:px-6 border-b border-[#D4AF37]/20">
      {/* تثبيت اتجاه Flexbox دائماً من اليسار لليمين لمنع الانقلاب عند تغيير اللغة */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2.5 text-[10px] sm:text-[11px]" dir="ltr">
        
        {/* معلومات التواصل والموقع */}
        <div className="flex items-center gap-3 sm:gap-6 text-gray-300 flex-wrap justify-center">
          
          {/* رقم الهاتف */}
          <a 
            href={`tel:${settings.phone}`} 
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200"
            title="Call Us"
          >
            <i className="fa-solid fa-phone text-[#D4AF37] text-[10px]"></i>
            <span>{settings.phone}</span>
          </a>

          {/* البريد الإلكتروني */}
          <a 
            href={`mailto:${settings.email}`} 
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200"
            title="Email Us"
          >
            <i className="fa-solid fa-envelope text-[#D4AF37] text-[10px]"></i>
            <span className="truncate max-w-[160px] sm:max-w-none">{settings.email}</span>
          </a>

          {/* المكان / المدينة */}
          <span className="flex items-center gap-1.5 text-gray-300">
            <i className="fa-solid fa-location-dot text-[#D4AF37] text-[10px]"></i>
            <span>{locationText}</span>
          </span>

        </div>

        {/* دعم العملاء */}
        <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
          <i className="fa-solid fa-headset text-xs"></i>
          <span>{supportText}</span>
        </div>

      </div>
    </div>
  );
}