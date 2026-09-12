import React from 'react';

export default function TopBar({ currentLang }) {
  return (
    <div className="bg-[#1A1A1A] text-white py-2.5 px-3 sm:px-6 border-b border-[#D4AF37]/20">
      {/* تثبيت اتجاه Flexbox دائماً من اليسار لليمين لمنع الانقلاب عند تغيير اللغة */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2.5 text-[10px] sm:text-[11px]" dir="ltr">
        
        {/* معلومات التواصل والموقع (تظهر كاملة ومتناسقة على جميع الشاشات) */}
        <div className="flex items-center gap-3 sm:gap-6 text-gray-300 flex-wrap justify-center">
          
          {/* رقم الهاتف */}
          <a 
            href="tel:+212636820175" 
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200"
            title="Call Us"
          >
            <i className="fa-solid fa-phone text-[#D4AF37] text-[10px]"></i>
            <span>+212 636-820175</span>
          </a>

          {/* البريد الإلكتروني مع منع التداخل النصي */}
          <a 
            href="mailto:contact@bijouterie925.com" 
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200"
            title="Email Us"
          >
            <i className="fa-solid fa-envelope text-[#D4AF37] text-[10px]"></i>
            <span className="truncate max-w-[160px] sm:max-w-none">contact@bijouterie925.com</span>
          </a>

          {/* المكان / المدينة (ظاهرة الآن حتى في الهواتف) */}
          <span className="flex items-center gap-1.5 text-gray-300">
            <i className="fa-solid fa-location-dot text-[#D4AF37] text-[10px]"></i>
            <span>{currentLang === 'ar' ? 'المغرب' : 'Morocco'}</span>
          </span>

        </div>

        {/* دعم العملاء 24/7 (يظهر الآن بوضوح في جميع الأجهزة) */}
        <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
          <i className="fa-solid fa-headset text-xs"></i>
          <span>
            {currentLang === 'ar' ? 'دعم العملاء 24/7' : '24/7 Customer Support'}
          </span>
        </div>

      </div>
    </div>
  );
}