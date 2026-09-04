import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ShopPage({ products, onAddToCart, currentLang, initialCategory, onBackToHome, onViewProduct, categories: propCategories }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // قراءة الفئة إما من رابط الـ Query Parameters أو من الـ props
  const queryCategory = searchParams.get('category');
  const activeCategory = queryCategory || initialCategory || 'all';

  const isRtl = currentLang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  
  // 🔍 حالة شريط البحث
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(activeCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  // بناء قائمة التصنيفات ديناميكياً بناءً على ما تم إضافته في لوحة التحكم
  const categories = [
    { id: 'all', name: isRtl ? 'الكل' : 'All' },
    ...(propCategories || []).map(cat => ({
      id: cat.id,
      name: isRtl ? (cat.titleAr || cat.name) : (cat.titleEn || cat.name)
    }))
  ];

  // الأقسام المستهدفة للعرض بشكل ديناميكي
  const categorySections = (propCategories || []).map(cat => ({
    id: cat.id,
    name: isRtl ? `قسم ${cat.titleAr || cat.name}` : `${cat.titleEn || cat.name} Collection`
  }));

  // تحديد الأقسام التي ستظهر (إما الكل أو قسم واحد محدد)
  const visibleSections = selectedCategory === 'all'
    ? categorySections
    : categorySections.filter(cat => cat.id === selectedCategory);

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto min-h-[70vh]">
      {/* زر العودة للصفحة الرئيسية */}
      <button 
        onClick={() => {
          if (onBackToHome) onBackToHome();
          else navigate('/');
        }}
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

      {/* 🔍 شريط البحث */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <span className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-[#D4AF37]`}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث عن منتج بالاسم أو الوصف...' : 'Search products by name or description...'}
            className={`w-full bg-[#1A1A1A] border border-white/10 focus:border-[#D4AF37] text-white text-sm rounded-xs py-3.5 ${isRtl ? 'pr-12 pl-10' : 'pl-12 pr-10'} outline-none transition duration-200 placeholder-gray-500 shadow-lg`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute inset-y-0 ${isRtl ? 'left-4' : 'right-4'} flex items-center text-gray-400 hover:text-white cursor-pointer`}
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          )}
        </div>
      </div>

      {/* أزرار الفلترة السريعة */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              navigate(`/shop?category=${cat.id}`);
            }}
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

      {/* عرض المنتجات مقسمة حسب الفئات */}
      <div className="space-y-16">
        {visibleSections.map((section) => {
          const sectionProducts = products
            .filter(p => {
              const matchesCategory = p.category === section.id;
              const matchesSearch = searchQuery.trim() === '' || 
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.description?.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            })
            .sort((a, b) => {
              const aStock = a.stock ?? 1;
              const bStock = b.stock ?? 1;
              if (aStock > 0 && bStock <= 0) return -1;
              if (aStock <= 0 && bStock > 0) return 1;
              return 0;
            });

          if (sectionProducts.length === 0) return null;

          return (
            <div key={section.id} className="space-y-8">
              {/* عنوان وتصميم هيدر القسم */}
              <div className="flex items-center gap-4">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#F3E5AB] uppercase tracking-wider whitespace-nowrap flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#D4AF37] rotate-45 inline-block"></span>
                  {section.name}
                </h2>
                <div className="h-[1px] bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent w-full"></div>
              </div>

              {/* شبكة منتجات القسم */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sectionProducts.map((item) => {
                  const isOutOfStock = item.stock !== undefined && item.stock <= 0;

                  return (
                    <div 
                      key={item.id}
                      onClick={() => {
                        if (onViewProduct) {
                          onViewProduct(item);
                        } else {
                          navigate(`/product/${item.id}`);
                        }
                      }}
                      className={`rounded-sm overflow-hidden group transition duration-300 flex flex-col justify-between shadow-xl cursor-pointer ${
                        isOutOfStock
                          ? 'bg-[#121212]/60 border border-gray-800 opacity-60 grayscale-[30%]'
                          : 'bg-[#121212] border border-[#D4AF37]/20 hover:border-[#D4AF37]'
                      }`}
                    >
                      {/* صورة المنتوج */}
                      <div className="relative h-64 overflow-hidden bg-black/40">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className={`w-full h-full object-cover transition duration-500 ${
                            isOutOfStock ? 'opacity-50' : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'
                          }`}
                        />
                        <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} z-10 bg-[#D4AF37] text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs`} dir="ltr">
                          Silver 925
                        </span>

                        {/* شارة غير متوفر */}
                        {isOutOfStock && (
                          <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-20 bg-red-900/90 text-red-200 border border-red-500/30 text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase`}>
                            {isRtl ? 'نفذت الكمية' : 'Out of Stock'}
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-grow justify-between text-center">
                        <div>
                          <h3 className={`font-serif font-bold text-base mb-1 transition duration-200 ${
                            isOutOfStock ? 'text-gray-400' : 'text-white group-hover:text-[#F3E5AB]'
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
            </div>
          );
        })}

        {/* حالة عدم وجود منتجات مطابقة */}
        {visibleSections.every(section => {
          return products.filter(p => {
            const matchesCategory = p.category === section.id;
            const matchesSearch = searchQuery.trim() === '' || 
              p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
              p.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
          }).length === 0;
        }) && (
          <div className="text-center text-gray-400 py-16 bg-[#121212]/50 border border-white/5 rounded-xs">
            {isRtl ? 'لا توجد منتجات تطابق بحثك الحالي.' : 'No products match your current search.'}
          </div>
        )}
      </div>
    </div>
  );
}