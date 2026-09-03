import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ currentLang }) {
  const isRtl = currentLang === 'ar';

  return (
    <footer className="bg-[#080808] text-gray-400 border-t border-[#D4AF37]/20 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* العمود الأول: الماركة والهوية */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#F3E5AB] tracking-widest uppercase">
            BIJOUTERIE
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            {isRtl 
              ? 'وجهتك الأولى للمجوهرات الرجالية الفاخرة المصنوعة من الفضة الإسترلينية 925 عالية النقاوة. هيبة، أناقة، وجودة تدوم.'
              : 'Your premier destination for luxury men\'s jewelry crafted in pure 925 sterling silver. Distinction and elegance that endure.'}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold pt-2">
            <i className="fa-solid fa-shield-halved"></i>
            <span>{isRtl ? 'فضة استرلينية 925 مضمونة 100%' : '100% Guaranteed 925 Silver'}</span>
          </div>
        </div>

        {/* روابط سريعة للمجموعات (مع تحديد الفئة عبر Query Parameters) */}
        <div className="space-y-3 text-start">
          <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-2">
            {isRtl ? 'المجموعات' : 'Collections'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/shop?category=rings" className="hover:text-[#F3E5AB] transition duration-200">
                {isRtl ? 'خواتم فضة' : 'Silver Rings'}
              </Link>
            </li>
            <li>
              <Link to="/shop?category=necklaces" className="hover:text-[#F3E5AB] transition duration-200">
                {isRtl ? 'سلاسل وقلائد' : 'Chains & Necklaces'}
              </Link>
            </li>
            <li>
              <Link to="/shop?category=bracelets" className="hover:text-[#F3E5AB] transition duration-200">
                {isRtl ? 'أساور رجالية' : 'Men\'s Bracelets'}
              </Link>
            </li>
          </ul>
        </div>

        {/* العمود الثالث: الشحن والخدمات */}
        <div className="space-y-3 text-start">
          <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
            {isRtl ? 'خدمة العملاء' : 'Customer Care'}
          </h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-truck-fast text-[#D4AF37]"></i>
              <span>{isRtl ? 'توصيل سريع لجميع المدن المغربية' : 'Express Delivery Across Morocco'}</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-building-columns text-[#D4AF37]"></i>
              <span>{isRtl ? 'الدفع عبر التحويل البنكي' : 'Bank Transfer Payment'}</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-rotate-left text-[#D4AF37]"></i>
              <span>{isRtl ? 'إمكانية المعاينة عند الاستلام' : 'Inspect Package Upon Delivery'}</span>
            </li>
          </ul>
        </div>

        {/* العمود الرابع: التواصل والشبكات الاجتماعية */}
        <div className="space-y-4 text-start">
          <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
            {isRtl ? 'تواصل معنا' : 'Connect With Us'}
          </h3>
          <p className="text-xs text-gray-400">
            {isRtl ? 'تابع حساباتنا للاطلاع على أحدث المجموعات والعروض الحصرية.' : 'Follow us for latest drops and exclusive offers.'}
          </p>
          
          <div className="flex items-center gap-4 text-lg">
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-[#121212] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition duration-300"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a 
              href="https://instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-[#121212] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition duration-300"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a 
              href="https://tiktok.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok"
              className="w-9 h-9 rounded-full bg-[#121212] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition duration-300"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>

      </div>

      {/* الشريط السفلي للحقوق */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} BIJOUTERIE. {isRtl ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}
        </p>
        <p className="text-[11px] text-gray-600">
          {isRtl ? 'مجوهرات رجالية فضة استرلينية 925' : 'Luxury Men\'s 925 Silver Jewelry'}
        </p>
      </div>
    </footer>
  );
}