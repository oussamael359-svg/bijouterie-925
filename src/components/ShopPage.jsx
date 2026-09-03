import React, { useState, useEffect } from 'react';

export default function ShopPage({ products, onAddToCart, currentLang, initialCategory, onBackToHome }) {
  const isRtl = currentLang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');

  useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
  }, [initialCategory]);

  const categories = [
    { id: 'all', name: isRtl ? 'الكل' : 'All' },
    { id: 'rings', name: isRtl ? 'خواتم' : 'Rings' },
    { id: 'necklaces', name: isRtl ? 'سلاسل وقلائد' : 'Necklaces' },
    { id: 'bracelets', name: isRtl ? 'أساور' : 'Bracelets' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto min-h-[70vh]">
      {/* زر العودة للصفحة الرئيسية */}
      <button 
        onClick={onBackToHome}
        className="mb-8 flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] transition duration-200 cursor-pointer uppercase tracking-wider"
      >
        <i className={`fa-solid ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
        <span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
      </button>

      {/* عنوان الصفحة */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F3E5AB] tracking-widest uppercase">
          {isRtl ? 'المتجر الكامل' : 'Full Store'}
        </h1>
        <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mt-3"></div>
      </div>

      {/* أزرار الفلترة السريعة */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2 text-xs font-bold transition duration-300 rounded-xs uppercase tracking-wider cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-[#1A1A1A] text-gray-300 hover:text-white border border-white/10 hover:border-[#D4AF37]/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div 
              key={item.id}
              className="bg-[#121212] border border-[#D4AF37]/20 rounded-sm overflow-hidden group hover:border-[#D4AF37] transition duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="relative h-64 overflow-hidden bg-black/40">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                />
                <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} z-10 bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs`} dir="ltr">
                  Silver 925
                </span>
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between text-center">
                <div>
                  <h3 className="font-serif font-bold text-white text-base mb-1 group-hover:text-[#F3E5AB] transition duration-200">
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
                    onClick={() => onAddToCart(item)}
                    className="bg-[#D4AF37] text-black hover:bg-[#F3E5AB] px-3 py-1.5 text-xs font-bold transition duration-200 flex items-center gap-1.5 cursor-pointer rounded-xs"
                  >
                    <i className="fa-solid fa-bag-shopping"></i>
                    <span>{isRtl ? 'إضافة' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-16">
            {isRtl ? 'لا توجد منتجات في هذا التصنيف حالياً.' : 'No products found in this category.'}
          </div>
        )}
      </div>
    </div>
  );
}