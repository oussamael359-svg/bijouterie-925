import React from 'react';

export default function ProductGrid({ products, onAddToCart, currentLang, onNavigateToShop, onViewProduct }) {
  const isRtl = currentLang === 'ar';

  const categorySections = [
    {
      id: 'rings',
      title: isRtl ? 'أحدث خواتم الفضة الرجالية' : 'Latest Men\'s Silver Rings',
      desc: isRtl 
        ? 'تصاميم تعكس الهيبة والرجولة، معقودة بعناية من الفضة الإسترلينية 925 والأحجار الكريمة.'
        : 'Bold, masculine designs handcrafted in 925 sterling silver for timeless distinction.',
    },
    {
      id: 'necklaces',
      title: isRtl ? 'أحدث السلاسل والقلائد' : 'Latest Men\'s Chains & Necklaces',
      desc: isRtl 
        ? 'سلاسل متينة بحباك فخم يمنح مظهرك حضوراً استثنائياً في كل المناسبات.'
        : 'Durable 925 silver chains with refined weaving designed to elevate your everyday style.',
    },
    {
      id: 'bracelets',
      title: isRtl ? 'أحدث الأساور الفاخرة' : 'Latest Men\'s Bracelets',
      desc: isRtl 
        ? 'لمسة معاصرة تجمع بين صلابة الفضة والجلد الطبيعي الفاخر على معصمك.'
        : 'A seamless blend of pure silver and premium leather designed for the modern gentleman.',
    }
  ];

  return (
    <section id="catalog" className="py-16 px-6 max-w-7xl mx-auto space-y-20">
      {categorySections.map((sec) => {
        const catProducts = products 
          ? products.filter(p => p.category === sec.id).slice(0, 5) 
          : [];

        if (catProducts.length === 0) return null;

        return (
          <div key={sec.id} id={sec.id} className="space-y-8 scroll-mt-24">
            {/* عنوان ووصف القسم */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F3E5AB] tracking-widest uppercase">
                {sec.title}
              </h2>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2 mb-3"></div>
              <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
                {sec.desc}
              </p>
            </div>

            {/* شبكة المنتجات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch" dir="ltr">
              {catProducts.map((item, index) => {
                const isLatest = index === catProducts.length - 1 && catProducts.length > 1;

                return (
                  <div 
                    key={item.id} 
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className={`relative rounded-sm overflow-hidden group transition-all duration-300 flex flex-col justify-between shadow-xl ${
                      isLatest 
                        ? 'border border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.35)] scale-[1.02] bg-gradient-to-b from-[#1E1B13] via-[#121212] to-[#0A0A0A]' 
                        : 'bg-[#121212] border border-[#D4AF37]/20 hover:border-[#D4AF37]'
                    }`}
                  >
                    {/* صورة المنتج قابلة للضغط */}
                    <div 
                      onClick={() => onViewProduct && onViewProduct(item)}
                      className="relative h-60 overflow-hidden bg-black/40 cursor-pointer"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                      />
                      
                      <span 
                        className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} z-10 bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs`}
                        dir="ltr"
                      >
                        Silver 925
                      </span>

                      {isLatest && (
                        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-20 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-xs shadow-md animate-pulse tracking-widest uppercase flex items-center gap-1`}>
                          <span>✦</span>
                          <span>{isRtl ? 'جديد' : 'NEW'}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow justify-between text-center">
                      {/* عنوان ووصف المنتج قابلة للضغط */}
                      <div 
                        onClick={() => onViewProduct && onViewProduct(item)}
                        className="cursor-pointer"
                      >
                        <h3 className={`font-serif font-bold text-base mb-1 transition duration-200 ${
                          isLatest ? 'text-[#F3E5AB]' : 'text-white group-hover:text-[#F3E5AB]'
                        }`}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                        <span className="text-sm font-bold text-[#D4AF37]">
                          {item.price} {isRtl ? 'د.م' : 'MAD'}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className={`px-3 py-1.5 text-xs font-bold transition duration-200 flex items-center gap-1.5 cursor-pointer rounded-xs ${
                            isLatest 
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:opacity-90 shadow-md' 
                              : 'bg-[#D4AF37] text-black hover:bg-[#F3E5AB]'
                          }`}
                        >
                          <i className="fa-solid fa-bag-shopping"></i>
                          <span>{isRtl ? 'إضافة' : 'Add'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* زر تصفح المزيد لكل تصنيف */}
            <div className="text-center pt-2">
              <button
                onClick={() => onNavigateToShop && onNavigateToShop(sec.id)}
                className="inline-flex items-center gap-2 border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition duration-300 rounded-xs group cursor-pointer"
              >
                <span>{isRtl ? 'تصفح تشكيلة التصنيف الكاملة' : 'View Full Category'}</span>
                <i className={`fa-solid ${isRtl ? 'fa-arrow-left group-hover:-translate-x-1' : 'fa-arrow-right group-hover:translate-x-1'} transition-transform duration-200`}></i>
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}