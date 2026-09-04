import React from 'react';
import { Link } from 'react-router-dom';

export default function Categories({ categories, currentLang }) {
  const isRtl = currentLang === 'ar';

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
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-3 mb-4"></div>
        <p className="text-xs md:text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
          {isRtl 
            ? 'اختر من بين تشكيلاتنا المخصصة للرجل العصري، المصممة بعناية فائقة لتمنحك حضوراً يتسم بالهيبة والأناقة.'
            : 'Explore curated collections crafted exclusively for the modern gentleman, designed to define your distinction.'}
        </p>
      </div>

      {/* شبكة التصنيفات الديناميكية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="ltr">
        {displayedCategories.map((cat) => {
          const title = isRtl ? (cat.titleAr || cat.title) : (cat.titleEn || cat.title);
          const desc = isRtl ? (cat.descAr || cat.desc) : (cat.descEn || cat.desc);
          
          return (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative h-64 rounded-sm overflow-hidden border border-[#D4AF37]/30 block shadow-xl bg-black"
              dir={isRtl ? 'rtl' : 'ltr'}
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
    </section>
  );
}