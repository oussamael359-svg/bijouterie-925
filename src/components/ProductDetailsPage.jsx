import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetailsPage({ products, onAddToCart, currentLang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isRtl = currentLang === 'ar';

  // 🔼 التمرير إلى أعلى الصفحة تلقائياً عند الدخول أو تغيير المنتج
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // البحث عن المنتج المطابق للـ ID القادم من الرابط
  const product = products ? products.find(p => String(p.id) === String(id)) : null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  // تحديث المقاس الافتراضي عند تحميل المنتج
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-32 text-center space-y-6 max-w-xl mx-auto px-6 min-h-[70vh]">
        <h2 className="text-2xl font-serif text-[#F3E5AB]">
          {isRtl ? 'عذراً، لم يتم العثور على هذا المنتج' : 'Product Not Found'}
        </h2>
        <button
          onClick={() => navigate('/shop')}
          className="inline-block bg-[#D4AF37] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-[#F3E5AB] transition duration-300 cursor-pointer"
        >
          {isRtl ? 'العودة إلى المتجر' : 'Back to Shop'}
        </button>
      </div>
    );
  }

  // 📦 التحقق من حالة المخزون والحد الأقصى
  const maxStock = product.stock ?? 0;
  const isOutOfStock = maxStock === 0;
  const isMaxReached = quantity >= maxStock;

  // 💰 حساب السعر الإجمالي حسب الكمية المختارة
  const totalPrice = (product.price || 0) * quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart({
      ...product,
      selectedSize,
      quantity
    });
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto min-h-[80vh]">
      {/* ⬅️ زر الرجوع للخلف */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] transition duration-200 cursor-pointer uppercase tracking-wider group"
      >
        <i className={`fa-solid ${isRtl ? 'fa-arrow-right group-hover:translate-x-1' : 'fa-arrow-left group-hover:-translate-x-1'} transition-transform duration-200`}></i>
        <span>{isRtl ? 'الرجوع للخلف' : 'Go Back'}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
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
            
            {/* 💵 عرض السعر وحالة التوفر بالمخزن */}
            <div className="mt-3 flex items-baseline gap-4 flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-[#D4AF37] transition-all duration-300">
                {totalPrice} {isRtl ? 'د.م' : 'MAD'}
              </span>

              {quantity > 1 && !isOutOfStock && (
                <span className="text-xs text-gray-400 font-medium">
                  ({product.price} {isRtl ? 'د.م / للقطعة' : 'MAD / each'})
                </span>
              )}

              {isOutOfStock ? (
                <span className="text-xs text-rose-400 font-bold bg-rose-950/50 border border-rose-800 px-2.5 py-0.5 rounded-xs">
                  {isRtl ? 'نفذت الكمية' : 'Out of Stock'}
                </span>
              ) : (
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800 px-2.5 py-0.5 rounded-xs">
                  {isRtl ? `متوفر في المخزون` : `In Stock`}
                </span>
              )}
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

          {/* المقاسات */}
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
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {isRtl ? 'الكمية:' : 'Quantity:'}
                </label>
                <div className="flex items-center border border-white/20 bg-[#121212] rounded-xs">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-gray-400 hover:text-white transition font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-[#D4AF37]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    disabled={isMaxReached}
                    className="px-3 py-1.5 text-gray-400 hover:text-white transition font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* زر إضافة للسلة */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 font-bold py-3.5 px-6 rounded-xs transition duration-300 flex items-center justify-center gap-2 uppercase text-xs tracking-wider shadow-lg ${
                  isOutOfStock 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10 shadow-none' 
                    : 'bg-[#D4AF37] text-black hover:bg-[#F3E5AB] cursor-pointer shadow-[#D4AF37]/20'
                }`}
              >
                <i className={`fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-bag-shopping'} text-base`}></i>
                <span>
                  {isOutOfStock 
                    ? (isRtl ? 'غير متوفر حالياً في المخزن' : 'Out of Stock') 
                    : (isRtl ? `إضافة إلى السلة (${totalPrice} د.م)` : `Add To Cart (${totalPrice} MAD)`)}
                </span>
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
        </div>
      </div>
    </div>
  );
}