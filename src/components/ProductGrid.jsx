import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductGrid({ products, onAddToCart, currentLang }) {
  const navigate = useNavigate();
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
          ? products
              .filter(p => p.category === sec.id)
              .sort((a, b) => {
                const aStock = a.stock ?? 1;
                const bStock = b.stock ?? 1;
                if (aStock > 0 && bStock <= 0) return -1;
                if (aStock <= 0 && bStock > 0) return 1; 
                return 0;
              })
              .slice(0, 5) 
          : [];

        if (catProducts.length === 0) return null;

        return (
          <div key={sec.id} id={sec.id} className="space-y-8 scroll-mt-24">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F3E5AB] tracking-widest uppercase">
                {sec.title}
              </h2>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2 mb-3"></div>
              <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
                {sec.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch" dir="ltr">
              {catProducts.map((item, index) => {
                const isOutOfStock = item.stock !== undefined && item.stock <= 0;
                const isLatest = index === catProducts.length - 1 && catProducts.length > 1 && !isOutOfStock;

                return (
                  <div 
                    key={item.id} 
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className={`relative rounded-sm overflow-hidden group transition-all duration-300 flex flex-col justify-between shadow-xl ${
                      isOutOfStock
                        ? 'bg-[#121212]/60 border border-gray-800 opacity-60 grayscale-[30%]'
                        : isLatest 
                          ? 'border border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.35)] scale-[1.02] bg-gradient-to-b from-[#1E1B13] via-[#121212] to-[#0A0A0A]' 
                          : 'bg-[#121212] border border-[#D4AF37]/20 hover:border-[#D4AF37]'
                    }`}
                  >
                    {/* صورة المنتج - توجيه لصفحة التفاصيل */}
                    <div 
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="relative h-60 overflow-hidden bg-black/40 cursor-pointer"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className={`w-full h-full object-cover transition duration-500 ${
                          isOutOfStock ? 'opacity-50' : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'
                        }`}
                      />
                      
                      <span 
                        className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} z-10 bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs`}
                        dir="ltr"
                      >
                        Silver 925
                      </span>

                      {isOutOfStock ? (
                        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-20 bg-red-900/90 text-red-200 border border-red-500/30 text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase`}>
                          {isRtl ? 'نفذت الكمية' : 'Out of Stock'}
                        </div>
                      ) : isLatest ? (
                        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-20 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] text-black text-[9px] font-extrabold px-2 py-0.5 rounded-xs shadow-md animate-pulse tracking-widest uppercase flex items-center gap-1`}>
                          <span>✦</span>
                          <span>{isRtl ? 'جديد' : 'NEW'}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="p-4 flex flex-col flex-grow justify-between text-center">
                      {/* عنوان ووصف المنتج - توجيه لصفحة التفاصيل */}
                      <div 
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="cursor-pointer"
                      >
                        <h3 className={`font-serif font-bold text-base mb-1 transition duration-200 ${
                          isOutOfStock ? 'text-gray-400' : isLatest ? 'text-[#F3E5AB]' : 'text-white group-hover:text-[#F3E5AB]'
                        }`}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                        <span className={`text-sm font-bold ${isOutOfStock ? 'text-gray-500' : 'text-[#D4AF37]'}`}>
                          {item.price} {isRtl ? 'د.م' : 'MAD'}
                        </span>
                        
                        <button
                          disabled={isOutOfStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) {
                              onAddToCart(item);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-bold transition duration-200 flex items-center gap-1.5 rounded-xs ${
                            isOutOfStock
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                              : isLatest 
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:opacity-90 shadow-md cursor-pointer' 
                                : 'bg-[#D4AF37] text-black hover:bg-[#F3E5AB] cursor-pointer'
                          }`}
                        >
                          <i className={`fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-bag-shopping'}`}></i>
                          <span>
                            {isOutOfStock 
                              ? (isRtl ? 'نفذت' : 'Sold Out') 
                              : (isRtl ? 'إضافة' : 'Add')}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* زر تصفح تشكيلة التصنيف الكاملة مع تمرير الـ id الخاص بالقسم */}
            <div className="text-center pt-2">
              <button
                onClick={() => navigate(`/shop?category=${sec.id}`)}
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