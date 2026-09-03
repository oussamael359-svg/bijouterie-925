import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  currentLang, 
  onToggleLang, 
  t, 
  onNavigateToShop, 
  onBackToHome 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // دالة للعودة للرئيسية وإغلاق القائمة
  const handleGoHome = () => {
    if (onBackToHome) onBackToHome();
    setIsSidebarOpen(false);
  };

  // دالة الذهاب للمتجر وإغلاق القائمة
  const handleGoToCatalog = () => {
    if (onNavigateToShop) onNavigateToShop('all');
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-[#0A0A0A] border-b border-[#D4AF37]/30 sticky top-0 z-40 text-[#E5C158] py-3 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between" dir="ltr">
          
          {/* 1. زر فتح القائمة الجانبية */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-3 text-white hover:text-[#D4AF37] transition duration-300 focus:outline-none cursor-pointer group"
              aria-label="Open Menu"
            >
              <div className="p-2.5 border-2 border-[#D4AF37]/50 rounded-md group-hover:border-[#D4AF37] transition duration-300">
                <i className="fa-solid fa-bars-staggered text-2xl text-[#D4AF37]"></i>
              </div>
              <span className="text-sm tracking-widest uppercase font-bold hidden sm:inline text-[#F3E5AB]">
                {currentLang === 'ar' ? 'القائمة' : 'Menu'}
              </span>
            </button>
          </div>

          {/* 2. اللوجو (العودة للرئيسية عند النقر) */}
          <Link 
            to="/" 
            onClick={handleGoHome} 
            className="flex items-center justify-center py-1 group cursor-pointer"
          >
            <img 
              src="/logo.png" 
              alt="Bijouterie 925" 
              className="h-16 md:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* 3. عناصر جهة اليمين */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={onToggleLang}
              className="border border-[#D4AF37]/60 text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-black transition duration-300 px-3 py-1.5 text-xs font-bold tracking-wider cursor-pointer hidden sm:block rounded-sm"
            >
              {currentLang === 'ar' ? 'EN' : 'AR'}
            </button>

            <button
              onClick={() => alert(currentLang === 'ar' ? "سيتم فتح نافذة تسجيل الدخول قريباً" : "Login modal coming soon")}
              className="p-2 text-[#F3E5AB] hover:text-[#D4AF37] transition duration-300 cursor-pointer"
              title={currentLang === 'ar' ? 'حسابي' : 'Account'}
              aria-label="Account"
            >
              <i className="fa-regular fa-user text-2xl"></i>
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#F3E5AB] hover:text-[#D4AF37] transition duration-300 cursor-pointer"
              title={currentLang === 'ar' ? 'سلة التسوق' : 'Cart'}
              aria-label="Shopping Cart"
            >
              <i className="fa-solid fa-bag-shopping text-2xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* القائمة الجانبية Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50" dir="ltr">
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#0F0F0F] border-r border-[#D4AF37]/30 h-full p-8 flex flex-col justify-between z-10 text-white shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <span className="text-xs tracking-widest text-[#D4AF37] uppercase font-bold">
                {currentLang === 'ar' ? 'التصفح' : 'Navigation'}
              </span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-[#D4AF37] text-2xl transition duration-200 cursor-pointer"
                aria-label="Close Menu"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <nav className="flex flex-col gap-6 my-auto text-lg font-serif tracking-wider">
              {/* الرئيسية */}
              <Link 
                to="/" 
                onClick={handleGoHome}
                className="hover:text-[#D4AF37] hover:translate-x-2 transition duration-300 flex items-center justify-between border-b border-white/5 pb-2 cursor-pointer"
              >
                <span>{t?.nav?.home || (currentLang === 'ar' ? 'الرئيسية' : 'Home')}</span>
                <i className="fa-solid fa-angle-right text-xs text-[#D4AF37]"></i>
              </Link>

              {/* المجموعات / المتجر */}
              <Link 
                to="/shop" 
                onClick={handleGoToCatalog}
                className="hover:text-[#D4AF37] hover:translate-x-2 transition duration-300 flex items-center justify-between border-b border-white/5 pb-2 cursor-pointer"
              >
                <span className="font-bold">{t?.nav?.catalog || (currentLang === 'ar' ? 'المتجر' : 'Shop')}</span>
                <i className="fa-solid fa-angle-right text-xs text-[#D4AF37]"></i>
              </Link>

              {/* من نحن */}
              <a 
                href="#about" 
                onClick={() => setIsSidebarOpen(false)}
                className="hover:text-[#D4AF37] hover:translate-x-2 transition duration-300 flex items-center justify-between border-b border-white/5 pb-2 cursor-pointer"
              >
                <span>{t?.nav?.about || (currentLang === 'ar' ? 'من نحن' : 'About Us')}</span>
                <i className="fa-solid fa-angle-right text-xs text-[#D4AF37]"></i>
              </a>

              {/* اتصل بنا */}
              <a 
                href="#contact" 
                onClick={() => setIsSidebarOpen(false)}
                className="hover:text-[#D4AF37] hover:translate-x-2 transition duration-300 flex items-center justify-between border-b border-white/5 pb-2 cursor-pointer"
              >
                <span>{t?.nav?.contact || (currentLang === 'ar' ? 'اتصل بنا' : 'Contact Us')}</span>
                <i className="fa-solid fa-angle-right text-xs text-[#D4AF37]"></i>
              </a>
            </nav>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              <button
                onClick={() => { onToggleLang(); setIsSidebarOpen(false); }}
                className="w-full border border-[#D4AF37] text-[#D4AF37] py-2 text-xs font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-black transition duration-300 cursor-pointer"
              >
                {currentLang === 'ar' ? 'English Version' : 'اللغة العربية'}
              </button>

              <div className="text-center text-[10px] text-gray-500 tracking-widest uppercase">
                Bijouterie 925 • Luxe Collection
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}