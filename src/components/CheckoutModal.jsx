import React, { useState } from 'react';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  setCartItems, 
  orders, 
  setOrders, 
  currentLang 
}) {
  // ⚙️ معلومات حسابك البنكي (يمكنك تعديلها بكل سهولة هنا)
  const bankInfo = {
    bankName: 'CIH Bank',
    rib: '230 780 0000000000000000 45', // رقم الـ RIB الخاص بك
    whatsappPhone: '212600000000' // رقم الواتساب لتلقي الطلبات
  };

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    bankReference: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  if (!isOpen) return null;

  const isRtl = currentLang === 'ar';
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      customer: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      items: cartItems,
      total: totalPrice,
      paymentMethod: 'Bank Transfer',
      bankReference: formData.bankReference || 'غير محدد',
      status: 'pending'
    };

    if (setOrders) {
      setOrders([newOrder, ...(orders || [])]);
    }

    const itemsText = cartItems.map(i => `- ${i.name} (${i.quantity}x) : ${i.price * i.quantity} MAD`).join('%0A');
    const message = `*طلب جديد عبر التحويل البنكي*%0A%0A*رقم الطلب:* ${newOrder.id}%0A*الاسم:* ${formData.fullName}%0A*الهاتف:* ${formData.phone}%0A*العنوان:* ${formData.address}, ${formData.city}%0A*مرجع التحويل:* ${formData.bankReference || 'لم يتم إدخاله'}%0A%0A*المنتجات:*%0A${itemsText}%0A%0A*المجموع الكلي:* ${totalPrice} MAD`;
    
    setWhatsappLink(`https://wa.me/${bankInfo.whatsappPhone}?text=${message}`);

    if (setCartItems) {
      setCartItems([]);
    }
    setIsSubmitted(true);
  };

  const handleCloseAll = () => {
    setIsSubmitted(false);
    setFormData({ fullName: '', phone: '', address: '', city: '', bankReference: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div onClick={handleCloseAll} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative bg-[#0F0F0F] border border-[#D4AF37]/40 w-full max-w-lg p-6 rounded-sm shadow-2xl text-white z-10 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={handleCloseAll}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} text-gray-400 hover:text-[#D4AF37] text-xl cursor-pointer`}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {!isSubmitted ? (
          <div>
            <div className="text-center mb-5">
              <i className="fa-solid fa-building-columns text-[#D4AF37] text-3xl mb-2"></i>
              <h2 className="text-xl font-serif font-bold text-[#F3E5AB]">
                {isRtl ? 'إتمام الطلب عبر التحويل البنكي' : 'Bank Transfer Checkout'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isRtl ? 'قم بتحويل المبلغ إلى حسابنا أدناه ثم أتمم بيانات الشحن' : 'Transfer the amount to our account below and fill details'}
              </p>
            </div>

            {/* صندوق معلومات الحساب البنكي */}
            <div className="bg-white/5 p-4 rounded-sm border border-[#D4AF37]/30 text-xs space-y-2 mb-5">
              <p className="text-[#D4AF37] font-bold flex items-center gap-1.5 border-b border-white/10 pb-2">
                <i className="fa-solid fa-circle-info text-sm"></i>
                {isRtl ? 'معلومات الحساب البنكي للتحويل:' : 'Bank Account Information:'}
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{isRtl ? 'البنك:' : 'Bank:'}</span>
                  <span className="font-semibold text-white">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#F3E5AB]">{bankInfo.accountHolder}</span>
                </div>
                <div className="flex justify-between items-center bg-black/50 p-2.5 rounded border border-white/10">
                  <span className="text-gray-400 font-medium">RIB:</span>
                  <span className="font-mono text-[#D4AF37] font-bold tracking-wider select-all" dir="ltr">
                    {bankInfo.rib}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/10 mt-1">
                  <span className="text-gray-400">{isRtl ? 'المبلغ المطلوب:' : 'Amount:'}</span>
                  <span className="font-bold text-[#D4AF37] text-sm">{totalPrice} MAD</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  {isRtl ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/20 rounded-sm p-2.5 text-sm text-white focus:border-[#D4AF37] outline-none"
                  placeholder={isRtl ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  {isRtl ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/20 rounded-sm p-2.5 text-sm text-white focus:border-[#D4AF37] outline-none"
                  placeholder={isRtl ? '06xxxxxxxx' : '+212 6xxxxxxxx'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">
                    {isRtl ? 'المدينة' : 'City'}
                  </label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/20 rounded-sm p-2.5 text-sm text-white focus:border-[#D4AF37] outline-none"
                    placeholder={isRtl ? 'المدينة' : 'City'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">
                    {isRtl ? 'العنوان بالتفصيل' : 'Address'}
                  </label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/20 rounded-sm p-2.5 text-sm text-white focus:border-[#D4AF37] outline-none"
                    placeholder={isRtl ? 'الشارع / الحي' : 'Street / Neighborhood'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  {isRtl ? 'رقم مرجع التحويل أو اسم الحساب المحول منه (اختياري)' : 'Transfer Reference / Sender Name (Optional)'}
                </label>
                <input 
                  type="text" 
                  name="bankReference"
                  value={formData.bankReference}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/20 rounded-sm p-2.5 text-sm text-white focus:border-[#D4AF37] outline-none"
                  placeholder={isRtl ? 'مثال: رقم العملية أو اسمك في الحساب البنكي' : 'e.g., Transaction ID or your bank account name'}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-bold py-3 uppercase text-xs tracking-widest rounded-sm hover:opacity-90 transition duration-200 cursor-pointer shadow-lg mt-2"
              >
                {isRtl ? 'تأكيد وإرسال تفاصيل التحويل' : 'Confirm & Send Transfer Details'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <i className="fa-solid fa-circle-check text-emerald-400 text-5xl"></i>
            <h3 className="text-xl font-serif font-bold text-[#F3E5AB]">
              {isRtl ? 'تم تسجيل طلبك بنجاح!' : 'Order Placed Successfully!'}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isRtl 
                ? 'تم تسجيل طلبك ومعلومات التحويل في لوحة التحكم. يرجى إرسال وصل التحويل عبر الواتساب لتأكيد شحن طلبك.' 
                : 'Your order has been recorded. Please send your transfer receipt via WhatsApp to ship your order.'}
            </p>
            
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition duration-200 shadow-lg"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              {isRtl ? 'إرسال وصل التحويل عبر واتساب' : 'Send Receipt via WhatsApp'}
            </a>

            <button 
              onClick={handleCloseAll}
              className="w-full bg-white/10 hover:bg-white/20 text-gray-300 py-2.5 rounded-sm text-xs font-medium transition duration-200 cursor-pointer"
            >
              {isRtl ? 'العودة للمتجر' : 'Return to Store'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}