import React from 'react';

export default function Hero({ currentLang }) {
  return (
    <section className="relative py-16 md:py-24 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* شارة مجوهرات الفضة 925 */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-md">
        <span>✦</span>
        <span>{currentLang === 'ar' ? 'تشكيلة الفضة النقية 925' : 'Authentic 925 Sterling Silver'}</span>
        <span>✦</span>
      </div>

      {/* العنوان الرئيسي للمتجر */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-extrabold text-[#F3E5AB] max-w-4xl leading-tight mb-6 tracking-wide drop-shadow-lg">
        {currentLang === 'ar' 
          ? 'فخامتك وأناقتك تبدأ من تفاصيل الفضة' 
          : 'Refine Your Style With Timeless Elegance'}
      </h1>

      {/* الوصف */}
      <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mb-10 font-light leading-relaxed">
        {currentLang === 'ar'
          ? 'اكتشف مجموعتنا الحصرية من الخواتم، السلاسل، والأساور المصممة بأعلى معايير الجودة من الفضة الخالصة لتناسب إطلالتك.'
          : 'Discover our hand-picked selection of premium 925 sterling silver rings, necklaces, and bracelets crafted for absolute luxury.'}
      </p>

      {/* أزرار الإجراءات (CTA) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
        <a 
          href="#catalog" 
          className="w-full sm:w-auto bg-[#D4AF37] text-black hover:bg-[#F3E5AB] px-9 py-4 rounded-sm font-bold text-xs tracking-widest uppercase transition duration-300 shadow-xl shadow-[#D4AF37]/20"
        >
          {currentLang === 'ar' ? 'تصفح المجموعات' : 'Explore Collections'}
        </a>
        <a 
          href="#about" 
          className="w-full sm:w-auto border border-[#D4AF37]/60 text-[#F3E5AB] hover:bg-[#D4AF37]/10 px-9 py-4 rounded-sm font-bold text-xs tracking-widest uppercase transition duration-300 backdrop-blur-xs"
        >
          {currentLang === 'ar' ? 'عن الماركة' : 'Our Legacy'}
        </a>
      </div>

      {/* شريط المميزات الفاخر */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[#D4AF37]/20 max-w-5xl w-full text-gray-300 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5">
          <i className="fa-solid fa-gem text-[#D4AF37] text-2xl"></i>
          <span className="font-semibold text-center md:text-start">{currentLang === 'ar' ? 'فضة أصلية' : 'Pure 925 Silver'}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5">
          <i className="fa-solid fa-truck-fast text-[#D4AF37] text-2xl"></i>
          <span className="font-semibold text-center md:text-start">{currentLang === 'ar' ? 'توصيل لجميع المدن' : 'Nationwide Shipping'}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5">
          <i className="fa-solid fa-box-open text-[#D4AF37] text-2xl"></i>
          <span className="font-semibold text-center md:text-start">{currentLang === 'ar' ? 'تغليف هدايا فاخر' : 'Luxury Gift Box'}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5">
          <i className="fa-solid fa-shield-halved text-[#D4AF37] text-2xl"></i>
          <span className="font-semibold text-center md:text-start">{currentLang === 'ar' ? 'ضمان الجودة' : 'Lifetime Guarantee'}</span>
        </div>
      </div>

    </section>
  );
}