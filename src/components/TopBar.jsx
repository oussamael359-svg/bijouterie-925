import React from 'react';

export default function TopBar({ currentLang }) {
  return (
    <div className="bg-[#1A1A1A] text-white text-xs py-2 px-4 border-b border-[#D4AF37]/20">
      {/* تثبيت اتجاه Flexbox دائماً من اليسار لليمين لمنع الانقلاب عند تغيير اللغة */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2" dir="ltr">
        
        {/* معلومات التواصل والموقع (ثابتة في جهة اليسار) */}
        <div className="flex items-center gap-4 text-gray-300 text-[11px] mx-auto md:mx-0 flex-wrap justify-center">
          
          {/* رقم الهاتف */}
          <a href="tel:+212600000000" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200">
            <i className="fa-solid fa-phone text-[#D4AF37] text-[10px]"></i>
            <span>+212 600-000000</span>
          </a>

          {/* البريد الإلكتروني */}
          <a href="mailto:contact@bijouterie.com" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition duration-200">
            <i className="fa-solid fa-envelope text-[#D4AF37] text-[10px]"></i>
            <span>contact@bijouterie.com</span>
          </a>

          {/* المكان / المدينة */}
          <span className="hidden sm:flex items-center gap-1.5 text-gray-300">
            <i className="fa-solid fa-location-dot text-[#D4AF37] text-[10px]"></i>
            <span>{currentLang === 'ar' ? 'الدار البيضاء، المغرب' : 'Casablanca, Morocco'}</span>
          </span>

        </div>

        {/* دعم العملاء 24/7 (ثابت في جهة اليمين) */}
        <div className="hidden md:flex items-center gap-2 text-[#D4AF37] text-[11px] font-semibold">
          <i className="fa-solid fa-headset text-xs"></i>
          <span>
            {currentLang === 'ar' ? 'دعم العملاء 24/7' : '24/7 Customer Support'}
          </span>
        </div>

      </div>
    </div>
  );
}

