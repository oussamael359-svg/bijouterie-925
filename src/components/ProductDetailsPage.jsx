import React, { useState } from 'react';

export default function ProductDetailsPage({ product, onAddToCart, currentLang, onBack, onBackToShop }) {
  const isRtl = currentLang === 'ar';
  const [quantity, setQuantity] = useState(1);
  
  // تجهيز هيكل المقاسات والخيارات المتغيرة مستقبلاً (Variable Product)
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : null);

  if (!product) return null;

  // إمكانية استخدام onBack أو onBackToShop للتوافق
  const handleBackAction = onBack || onBackToShop;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      quantity
    });
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto min-h-[80vh]">
      {/* ⬅️ زر الرجوع للخلف الذكي */}
      <button 
        onClick={handleBackAction}
        className="mb-8 flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] transition duration-200 cursor-pointer uppercase tracking-wider group"
      >
        <i className={`fa-solid ${isRtl ? 'fa-arrow-right group-hover:translate-x-1' : 'fa-arrow-left group-hover:-translate-x-1'} transition-transform duration-200`}></i>
        <span>{isRtl ? 'الرجوع للخلف' : 'Go Back'}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* 📸 معرض الصور (Image Gallery) */}
        <div className="space-y-4">
          <div className="relative bg-[#121212] border border-[#D4AF37]/30 rounded-sm overflow-hidden shadow-2xl group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-[450px] md:h-[520px] object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <span className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-xs shadow-md`} dir="ltr">
              Silver 925
            </span>
          </div>

          {/* دعم صور متعددة مستقبلاً (Grouped Images / Variable Gallery) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button key={idx} className="w-20 h-20 border border-white/10 hover:border-[#D4AF37] overflow-hidden rounded-xs cursor-pointer flex-shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 📝 تفاصيل ومعلومات المنتج */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              <i className="fa-solid fa-gem"></i>
              <span>{isRtl ? 'فضة إسترلينية نقية 925' : 'Pure 925 Sterling Silver'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-4">
              <span className="text-2xl font-bold text-[#D4AF37]">
                {product.price} {isRtl ? 'د.م' : 'MAD'}
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800 px-2.5 py-0.5 rounded-xs">
                {isRtl ? 'متوفر في المخزون' : 'In Stock'}
              </span>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* الوصف */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {isRtl ? 'وصف القطعة' : 'Description'}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              {product.description || (isRtl 
                ? 'قطعة فاخرة مصنوعة بدقة عالية من الفضة الإسترلينية 925، مصممة لتدوم وتضفي لمسة من الأنفة والأصالة على إطلالتك.' 
                : 'A luxurious piece crafted with precision from 925 Sterling Silver, designed for elegance and durability.')}
            </p>
          </div>

          {/* 🔲 قسم خيارات المنتج المتغير (Variable Product - المقاسات / الألوان مستقبلاً) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                {isRtl ? 'اختر المقاس:' : 'Select Size:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-bold border transition cursor-pointer rounded-xs ${
                      selectedSize === size
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                        : 'border-white/20 bg-[#1A1A1A] text-white hover:border-[#D4AF37]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🔢 تحديد الكمية والأزرار */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {isRtl ? 'الكمية:' : 'Quantity:'}
              </label>
              <div className="flex items-center border border-white/20 bg-[#121212] rounded-xs">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* أزرار الشراء والتفاعل */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#D4AF37] text-black hover:bg-[#F3E5AB] font-bold py-3.5 px-6 rounded-xs transition duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider shadow-lg shadow-[#D4AF37]/20"
              >
                <i className="fa-solid fa-bag-shopping text-base"></i>
                <span>{isRtl ? 'إضافة إلى السلة' : 'Add To Cart'}</span>
              </button>
            </div>
          </div>

          {/* 🛡️ الضمانات وخدمات التوصيل */}
          <div className="border-t border-white/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-truck-fast text-lg text-[#D4AF37]"></i>
              <span>{isRtl ? 'توصيل سريع لجميع المدن' : 'Fast Delivery Morocco-wide'}</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-certificate text-lg text-[#D4AF37]"></i>
              <span>{isRtl ? 'فضة 925 مضمونة مع ختم الأصالة' : 'Guaranteed 925 Silver Stamp'}</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-hand-holding-dollar text-lg text-[#D4AF37]"></i>
              <span>{isRtl ? 'الدفع عند الاستلام' : 'Pay On Delivery'}</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-box-open text-lg text-[#D4AF37]"></i>
              <span>{isRtl ? 'إمكانية المعاينة قبل الدفع' : 'Inspect Package Before Paying'}</span>
            </div>
          </div>

          {/* 🔗 قسم المنتجات المجمعة / الأطقم مستقبلاً (Grouped Products Slot) */}
          {product.groupedProducts && product.groupedProducts.length > 0 && (
            <div className="mt-8 p-4 bg-[#121212] border border-[#D4AF37]/30 rounded-xs">
              <h4 className="text-xs font-bold text-[#F3E5AB] uppercase mb-3 flex items-center gap-2">
                <i className="fa-solid fa-layer-group text-[#D4AF37]"></i>
                <span>{isRtl ? 'يشمل هذا الطقم القطع التالية:' : 'This Grouped Set Includes:'}</span>
              </h4>
              <div className="space-y-2">
                {product.groupedProducts.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs text-gray-300">
                    <span>• {item.name}</span>
                    <span className="text-[#D4AF37] font-bold">{item.price} MAD</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}