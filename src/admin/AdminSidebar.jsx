import React from 'react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  currentLang, 
  setCurrentLang, 
  onBackToHome, 
  onLogout, 
  isOpen, 
  setIsOpen,
  deletedProducts = [] // استلام قائمة المحذوفات لعرض العدد
}) {
  const isRtl = currentLang === 'ar';

  const menuItems = [
    { id: 'dashboard', labelAr: 'الداشبورد (الإحصائيات)', labelEn: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'categories', labelAr: 'التصنيفات', labelEn: 'Categories', icon: 'fa-tags' },
    { id: 'products', labelAr: 'المنتجات', labelEn: 'Products', icon: 'fa-boxes-stacked' },
    { id: 'visitors', labelAr: 'الزوار', labelEn: 'Visitors', icon: 'fa-users' },
    { 
      id: 'trash', 
      labelAr: 'سلة المهملات', 
      labelEn: 'Trash', 
      icon: 'fa-trash-can', 
      badge: deletedProducts.length // إضافة عدد العناصر المحذوفة
    },
  ];

  return (
    <>
      {/* زر إظهار السايد بار في أقصى اليسار */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-[#121212] border border-[#D4AF37]/40 text-[#D4AF37] p-2.5 rounded-xs shadow-2xl hover:bg-[#D4AF37] hover:text-black transition cursor-pointer"
          aria-label="Open Sidebar"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
      )}

      {/* خلفية معتمة للجوال عند فتح القائمة */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* السايد بار مثبت دائماً في اليسار */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-[#121212] border-r border-[#D4AF37]/20 flex flex-col justify-between p-6 z-40 
        transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full pointer-events-none'}
      `}>
        <div>
          {/* عنوان لوحة التحكم وزر الإغلاق */}
          <div className="mb-8 pb-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-[#F3E5AB]">
                {isRtl ? 'لوحة التحكم' : 'Admin Panel'}
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Bijouterie925</p>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 cursor-pointer transition"
              aria-label="Close Sidebar"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* القوائم */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs font-bold transition duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-lg'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid ${item.icon} text-sm w-4`}></i>
                    <span>{isRtl ? item.labelAr : item.labelEn}</span>
                  </div>

                  {/* شارة (Badge) تعرض عدد العناصر المحذوفة إذا كانت أكبر من صفر */}
                  {item.id === 'trash' && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-black text-[#D4AF37]' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* أزرار الأسفل (تشمل زر تغيير اللغة، العودة للمتجر، وتسجيل الخروج) */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          {/* زر تبديل اللغة */}
          <button
            onClick={() => setCurrentLang(isRtl ? 'en' : 'ar')}
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 px-3 py-2 rounded-xs text-xs font-bold transition cursor-pointer"
          >
            <i className="fa-solid fa-globe text-[#D4AF37]"></i>
            <span>{isRtl ? 'English / تغيير اللغة' : 'العربية / Change Language'}</span>
          </button>

          <button
            onClick={onBackToHome}
            className="w-full flex items-center justify-center gap-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-3 py-2 rounded-xs text-xs font-bold transition cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>{isRtl ? 'العودة للمتجر' : 'Back to Store'}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-xs text-xs font-bold transition cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}