import React from 'react';

export default function AdminSidebar({ activeTab, setActiveTab, currentLang, onBackToHome, onLogout }) {
  const isRtl = currentLang === 'ar';

  const menuItems = [
    { id: 'dashboard', labelAr: 'الداشبورد (الإحصائيات)', labelEn: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'categories', labelAr: 'التصنيفات', labelEn: 'Categories', icon: 'fa-tags' },
    { id: 'products', labelAr: 'المنتجات', labelEn: 'Products', icon: 'fa-boxes-stacked' },
    { id: 'visitors', labelAr: 'الزوار', labelEn: 'Visitors', icon: 'fa-users' },
    { id: 'trash', labelAr: 'سلة المهملات', labelEn: 'Trash', icon: 'fa-trash-can' },
  ];

  return (
    <aside className="w-64 bg-[#121212] border-r border-[#D4AF37]/20 min-h-screen flex flex-col justify-between p-6">
      <div>
        {/* عنوان لوحة التحكم */}
        <div className="mb-8 pb-4 border-b border-white/10">
          <h2 className="text-base font-serif font-bold text-[#F3E5AB]">
            {isRtl ? 'لوحة التحكم' : 'Admin Panel'}
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5">Sharp Edge Studio</p>
        </div>

        {/* القوائم بالترتيب الجديد */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-xs font-bold transition duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-lg'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-sm w-4`}></i>
                <span>{isRtl ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* أزرار الأسفل */}
      <div className="pt-6 border-t border-white/10 space-y-2">
        <button
          onClick={onBackToHome}
          className="w-full flex items-center gap-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-3 py-2 rounded-xs text-xs font-bold transition cursor-pointer"
        >
          <i className={`fa-solid ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
          <span>{isRtl ? 'العودة للمتجر' : 'Back to Store'}</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-xs text-xs font-bold transition cursor-pointer"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}