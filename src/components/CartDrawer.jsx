import React from 'react';

export default function CartDrawer({ isOpen, onClose, cart, onRemove, onUpdateQuantity, totalPrice, currentLang }) {
  if (!isOpen) return null;

  const isRtl = currentLang === 'ar';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* خلفية معتمة بضبابية خفيفة */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* موضع اللوحة الجانبية بناءً على اتجاه اللغة */}
      <div className={`fixed top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-full max-w-md bg-[#0F0F0F] border-x border-[#D4AF37]/30 h-full p-6 flex flex-col justify-between z-10 text-white shadow-2xl transition-transform duration-300`}>
        
        {/* 1. رأس السلة (Header) */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bag-shopping text-[#D4AF37] text-xl"></i>
            <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
              {isRtl ? 'سلة التسوق' : 'Your Cart'}
            </h2>
            <span className="text-xs text-gray-400 font-sans">
              ({cart.reduce((a, c) => a + c.quantity, 0)})
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-[#D4AF37] text-2xl transition duration-200 cursor-pointer"
            aria-label="Close cart"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* 2. قائمة عناصر السلة (Cart Items List) */}
        <div className="my-auto py-4 overflow-y-auto flex-1 space-y-4 pr-1">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-20 flex flex-col items-center justify-center">
              <i className="fa-solid fa-basket-shopping text-5xl mb-4 text-[#D4AF37]/30"></i>
              <p className="text-sm tracking-wide font-medium">
                {isRtl ? 'سلة التسوق فارغة حالياً' : 'Your cart is currently empty'}
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between bg-white/5 p-3 rounded-sm border border-white/5 hover:border-[#D4AF37]/30 transition duration-200"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600'} 
                    alt={item.name} 
                    className="w-14 h-14 object-cover border border-[#D4AF37]/30 rounded-xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                    <span className="text-xs text-[#D4AF37] font-semibold mt-1 block">
                      {item.price} {isRtl ? 'د.م' : 'MAD'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* أزرار التحكم بالكمية */}
                  <div className="flex items-center border border-white/20 rounded-sm bg-black/30">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="px-2 py-0.5 text-xs text-gray-400 hover:text-[#D4AF37] transition duration-150 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="px-2 py-0.5 text-xs text-gray-400 hover:text-[#D4AF37] transition duration-150 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* زر الحذف */}
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-gray-500 hover:text-red-400 text-xs p-1 transition duration-150 cursor-pointer"
                    title={isRtl ? 'إزالة' : 'Remove'}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 3. أسفل السلة (Footer & Checkout) */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 tracking-wider uppercase text-xs">
              {isRtl ? 'المجموع الكلي:' : 'Subtotal:'}
            </span>
            <span className="text-xl font-serif font-bold text-[#D4AF37]">
              {totalPrice} {isRtl ? 'د.م' : 'MAD'}
            </span>
          </div>

          <button 
            disabled={cart.length === 0}
            className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 py-3.5 text-xs font-bold tracking-widest uppercase transition duration-300 shadow-lg cursor-pointer rounded-xs"
          >
            {isRtl ? 'إتمام الطلب' : 'Proceed to Checkout'}
          </button>
        </div>

      </div>
    </div>
  );
}