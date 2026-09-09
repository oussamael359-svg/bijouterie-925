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
  const bankInfo = {
    bankName: 'CIH Bank',
    rib: '230 780 0000000000000000 45',
    whatsappPhone: '212600000000'
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    bankReference: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isRtl = currentLang === 'ar';
  const currentTotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyRib = () => {
    navigator.clipboard.writeText(bankInfo.rib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const calculatedTotal = currentTotalPrice;
    setFinalTotal(calculatedTotal);

    const newOrder = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      customer: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      items: cartItems,
      total: calculatedTotal,
      paymentMethod: 'Bank Transfer',
      bankReference: formData.bankReference || 'غير محدد',
      status: 'pending'
    };

    if (setOrders) {
      setOrders(prevOrders => [newOrder, ...(prevOrders || [])]);
    }

    const itemsText = cartItems.map(i => `- ${i.name} (${i.quantity}x) : ${i.price * i.quantity} MAD`).join('%0A');
    const message = `*طلب جديد عبر التحويل البنكي*%0A%0A*رقم الطلب:* ${newOrder.id}%0A*الاسم:* ${formData.fullName}%0A*البريد:* ${formData.email}%0A*الهاتف:* ${formData.phone}%0A*العنوان:* ${formData.address}, ${formData.city}%0A*مرجع التحويل:* ${formData.bankReference || 'لم يتم إدخاله'}%0A%0A*المنتجات:*%0A${itemsText}%0A%0A*المجموع الكلي:* ${calculatedTotal} MAD`;
    
    setWhatsappLink(`https://wa.me/${bankInfo.whatsappPhone}?text=${message}`);

    if (setCartItems) {
      setCartItems([]);
    }
    setIsSubmitted(true);
  };

  const handleCloseAll = () => {
    setIsSubmitted(false);
    setFormData({ fullName: '', email: '', phone: '', address: '', city: '', bankReference: '' });
    setCopied(false);
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
                {isRtl ? 'أدخل معلوماتك لتأكيد الطلب والحصول على تفاصيل الدفع' : 'Enter your details to confirm order and get payment info'}
              </p>
            </div>

            <div className="bg-white/5 p-3.5 rounded-sm border border-[#D4AF37]/20 text-xs text-gray-300 mb-5 flex items-center gap-3">
              <i className="fa-solid fa-shield-halved text-[#D4AF37] text-lg shrink-0"></i>
              <p className="leading-relaxed">
                {isRtl 
                  ? 'ستظهر لك معلومات الحساب البنكي (RIB) مباشرة بعد تأكيد الطلب أدناه.' 
                  : 'Bank account details (RIB) will appear immediately after confirming your order.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/20 rounded-sm p-2.5 text-sm text-white focus:border-[#D4AF37] outline-none"
                    placeholder="name@example.com"
                  />
                </div>
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

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-bold py-3 uppercase text-xs tracking-widest rounded-sm hover:opacity-90 transition duration-200 cursor-pointer shadow-lg mt-2"
              >
                {isRtl ? 'تأكيد الطلب وعرض بيانات الحساب' : 'Confirm Order & View Bank Info'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <i className="fa-solid fa-circle-check text-emerald-400 text-4xl"></i>
            <h3 className="text-xl font-serif font-bold text-[#F3E5AB]">
              {isRtl ? 'تم تسجيل طلبك بنجاح!' : 'Order Placed Successfully!'}
            </h3>
            
            {/* رسالة توضيحية لخطوات الدفع */}
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3.5 rounded-sm text-xs text-gray-200 leading-relaxed text-center">
              {isRtl 
                ? 'قم بنسخ رقم الحساب (RIB)، وحول المبلغ المطلوب لكي تتوصل بمنتجاتك، ثم تواصل معنا عبر الواتساب لإرسال وصل التحويل.' 
                : 'Copy the RIB number, transfer the required amount to receive your products, and contact us via WhatsApp.'}
            </div>

            <div className="bg-white/5 p-4 rounded-sm border border-[#D4AF37]/30 text-xs text-left space-y-3" dir="ltr">
              <div className="flex justify-between text-gray-300 items-center">
                <span className="text-gray-400">Bank:</span>
                <span className="font-semibold text-white">{bankInfo.bankName}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-400 text-[11px] block">RIB:</span>
                <div className="flex justify-between items-center bg-black/60 p-2.5 rounded border border-white/10 gap-2">
                  <span className="font-mono text-[#D4AF37] font-bold select-all tracking-wider text-xs break-all">
                    {bankInfo.rib}
                  </span>
                  <button 
                    onClick={handleCopyRib}
                    className="bg-[#D4AF37] hover:bg-[#F3E5AB] text-black px-3 py-2 rounded flex items-center gap-1.5 cursor-pointer text-xs font-bold shrink-0 transition-colors shadow-md"
                  >
                    <i className={`fa-solid ${copied ? 'fa-check text-emerald-900' : 'fa-copy'} text-sm`}></i>
                    <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-gray-300 pt-2 border-t border-white/10 items-center">
                <span className="text-gray-400">Total Amount:</span>
                <span className="font-bold text-[#D4AF37] text-sm font-mono">{finalTotal} MAD</span>
              </div>
            </div>
            
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition duration-200 shadow-lg cursor-pointer"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              {isRtl ? 'تواصل معنا عبر الواتساب لتأكيد الطلب' : 'Contact via WhatsApp to Confirm'}
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