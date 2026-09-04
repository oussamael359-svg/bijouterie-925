import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Categories({ categories, currentLang }) {
  const isRtl = currentLang === 'ar';
  const scrollRef = useRef(null);

  // دالة التمرير عبر الأسهم يميناً ويساراً
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // فلترة الأقسام لعرض المفعّل منها في الصفحة الرئيسية فقط
  const displayedCategories = (categories || []).filter(cat => cat.showOnHome !== false);

  if (displayedCategories.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      {/* رأس القسم */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F3E5AB] tracking-widest uppercase">
          {isRtl ? 'تصفح حسب المجموعة' : 'Shop By Category'}
        </h2>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-3 mb-3"></div>
        <p className="text-xs md:text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
          {isRtl 
            ? 'اختر من بين تشكيلاتنا المخصصة للرجل العصري، المصممة بعناية فائقة لتمنحك حضوراً يتسم بالهيبة والأناقة.'
            : 'Explore curated collections crafted exclusively for the modern gentleman, designed to define your distinction.'}
        </p>
      </div>

      {/* حاوية التصنيفات مع الأسهم الجانبية بدون إطار */}
      <div className="relative px-2 md:px-8">
        {/* زر السهم الأيسر الجانبي */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37] hover:text-[#F3E5AB] transition text-2xl md:text-3xl p-2 cursor-pointer drop-shadow-md"
          aria-label="Previous"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {/* زر السهم الأيمن الجانبي */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 text-[#D4AF37] hover:text-[#F3E5AB] transition text-2xl md:text-3xl p-2 cursor-pointer drop-shadow-md"
          aria-label="Next"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* شبكة التصنيفات الأفقية المتحركة مع شريط تمرير مخصص */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#D4AF37] scrollbar-track-black/40"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#D4AF37 #121212'
          }}
        >
          {displayedCategories.map((cat) => {
            const title = isRtl ? (cat.titleAr || cat.title) : (cat.titleEn || cat.title);
            const desc = isRtl ? (cat.descAr || cat.desc) : (cat.descEn || cat.desc);
            
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group relative h-72 min-w-[280px] sm:min-w-[320px] md:min-w-[360px] flex-shrink-0 rounded-sm overflow-hidden border border-[#D4AF37]/30 block shadow-xl bg-black snap-start"
              >
                {/* صورة خلفية الفئة */}
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-60 group-hover:opacity-40"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-gray-600 text-xs">
                    {isRtl ? 'بدون صورة' : 'No Image'}
                  </div>
                )}
                
                {/* طبقة التظليل */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* نصوص وتفاصيل الفئة */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-center items-center">
                  {desc && (
                    <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1 line-clamp-1">
                      {desc}
                    </span>
                  )}
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#F3E5AB] transition duration-300">
                    {title}
                  </h3>
                  <span className="mt-3 text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition duration-300 flex items-center gap-2">
                    {isRtl ? 'اكتشف المزيد' : 'Explore Now'}
                    <i className={`fa-solid ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'} text-[10px]`}></i>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}