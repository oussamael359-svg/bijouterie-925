import React from 'react';

export default function Categories({ currentLang }) {
  const isRtl = currentLang === 'ar';

  const categories = [
    {
      id: 'rings',
      title: isRtl ? 'خواتم فضة رجالية' : 'Men\'s Silver Rings',
      sub: '925 Sterling',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'necklaces',
      title: isRtl ? 'سلاسل وقلائد رجالية' : 'Men\'s Necklaces',
      sub: 'Luxury Design',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'bracelets',
      title: isRtl ? 'أساور رجالية فاخرة' : 'Men\'s Bracelets',
      sub: 'Handcrafted',
      img: 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&q=80&w=600'
    }
  ];

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
            ? 'اختر من بين تشكيلاتنا المخصصة للرجل العصري، المصممة بعناية فائقة من الفضة الإسترلينية 925 لتمنحك حضوراً يتسم بالهيبة والأناقة.'
            : 'Explore curated collections crafted exclusively for the modern gentleman in pure 925 sterling silver, designed to define your distinction.'}
        </p>
      </div>

      {/* شبكة التصنيفات - تم تثبيت الاتجاه بحاصرة dir="ltr" لتجنب تغير المواضع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="ltr">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href="#catalog"
            className="group relative h-64 rounded-sm overflow-hidden border border-[#D4AF37]/30 block shadow-xl"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* صورة خلفية الفئة */}
            <img
              src={cat.img}
              alt={cat.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-60 group-hover:opacity-40"
            />
            
            {/* طبقة التظليل */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* نصوص وتفاصيل الفئة */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-center items-center">
              <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1">
                {cat.sub}
              </span>
              <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#F3E5AB] transition duration-300">
                {cat.title}
              </h3>
              <span className="mt-3 text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition duration-300 flex items-center gap-2">
                {isRtl ? 'اكتشف المزيد' : 'Explore Now'}
                <i className={`fa-solid ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'} text-[10px]`}></i>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}