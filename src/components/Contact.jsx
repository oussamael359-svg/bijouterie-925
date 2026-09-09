import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact({ currentLang }) {
  const [formData, setFormData] = useState({
    name: '',
    account: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // ضع بيانات EmailJS الخاصة بك هنا لاحقاً
    const serviceID = 'service_pvy7vcc';
    const templateID = 'template_xvk7t3b';
    const publicKey = 'rIIG9afw-AambnNHL';

    const templateParams = {
      from_name: formData.name,
      from_account: formData.account,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        setStatus('success');
        setFormData({ name: '', account: '', subject: '', message: '' });
        setLoading(false);
      }, (err) => {
        setStatus('error');
        setLoading(false);
      });
  };

  return (
    <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2A2A2A] via-[#121212] to-[#080808] text-[#F3E5AB] min-h-[calc(100vh-120px)] py-16 px-6 flex flex-col justify-center items-center" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-serif text-[#D4AF37] mb-3">
            {currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-gray-400 text-sm tracking-wider">
            {currentLang === 'ar' 
              ? 'يسعدنا تلقي استفساراتكم وطلباتكم الخاصة بالفضة' 
              : 'We are delighted to receive your inquiries and custom silver requests'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#121212]/80 backdrop-blur-md border border-[#D4AF37]/40 p-8 rounded-lg shadow-2xl flex flex-col gap-6">
          
          {status === 'success' && (
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] p-4 text-center text-xs tracking-wider rounded">
              {currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Message sent successfully! We will contact you soon.'}
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 text-center text-xs tracking-wider rounded">
              {currentLang === 'ar' ? 'حدث خطأ أثناء الإرسال، يجدر التحقق من البيانات.' : 'Error sending message, please try again.'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                {currentLang === 'ar' ? 'الاسم' : 'Full Name'}
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
                placeholder={currentLang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your name'}
                className="bg-black/60 border border-[#D4AF37]/40 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                {currentLang === 'ar' ? 'الحساب / وسائل التواصل' : 'Account / Contact'}
              </label>
              <input 
                type="text" 
                name="account" 
                value={formData.account} 
                onChange={handleChange} 
                required
                placeholder={currentLang === 'ar' ? 'البريد أو رقم الهاتف أو انستغرام' : 'Email, Phone, or Instagram'}
                className="bg-black/60 border border-[#D4AF37]/40 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
              {currentLang === 'ar' ? 'الموضوع' : 'Subject'}
            </label>
            <input 
              type="text" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              required
              placeholder={currentLang === 'ar' ? 'موضوع الرسالة (طلب تفصيل، استفسار...)' : 'Subject of your message'}
              className="bg-black/60 border border-[#D4AF37]/40 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
              {currentLang === 'ar' ? 'الرسالة' : 'Message'}
            </label>
            <textarea 
              name="message" 
              rows="4" 
              value={formData.message} 
              onChange={handleChange} 
              required
              placeholder={currentLang === 'ar' ? 'اكتب تفاصيل رسالتك هنا...' : 'Write your message details here...'}
              className="bg-black/60 border border-[#D4AF37]/40 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-3.5 rounded hover:bg-[#F3E5AB] transition duration-300 cursor-pointer shadow-lg text-xs"
          >
            {loading 
              ? (currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...') 
              : (currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
          </button>
        </form>

      </div>
    </div>
  );
}