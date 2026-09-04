import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminLogin from './AdminLogin';
import ProductsView from './views/ProductsView';
import CategoriesView from './views/CategoriesView';

export default function AdminLayout({ products, setProducts, categories, setCategories, onBackToHome, currentLang, setCurrentLang }) {
  // التحقق من حالة تسجيل الدخول عبر sessionStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('admin_logged_in') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isRtl = currentLang === 'ar';

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
    if (onBackToHome) onBackToHome();
  };

  // إذا لم يتم تسجيل الدخول، يتم عرض صفحة تسجيل الدخول فقط
  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} currentLang={currentLang} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-serif font-bold text-[#F3E5AB]">
              {isRtl ? 'نظرة عامة (الداشبورد)' : 'Dashboard Overview'}
            </h1>
            <p className="text-xs text-gray-400">
              {isRtl ? 'مرحباً بك في لوحة تحكم Sharp Edge Studio. هنا ملخص سريع لحالة متجرك.' : 'Welcome to Sharp Edge Studio admin panel.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#121212] border border-white/10 p-5 rounded-sm">
                <p className="text-xs text-gray-400">{isRtl ? 'إجمالي المنتجات' : 'Total Products'}</p>
                <p className="text-3xl font-bold text-white mt-2">{products.length}</p>
              </div>
              <div className="bg-[#121212] border border-emerald-500/20 p-5 rounded-sm">
                <p className="text-xs text-gray-400">{isRtl ? 'المنتجات المتوفرة' : 'In Stock'}</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {products.filter(p => (p.stock ?? 1) > 0).length}
                </p>
              </div>
              <div className="bg-[#121212] border border-red-500/20 p-5 rounded-sm">
                <p className="text-xs text-gray-400">{isRtl ? 'نفذت كميتها' : 'Out of Stock'}</p>
                <p className="text-3xl font-bold text-red-400 mt-2">
                  {products.filter(p => (p.stock ?? 1) <= 0).length}
                </p>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <CategoriesView 
            categories={categories} 
            setCategories={setCategories} 
            products={products} 
            currentLang={currentLang} 
          />
        );

      case 'products':
        return (
          <ProductsView 
            products={products} 
            setProducts={setProducts} 
            categories={categories} 
            currentLang={currentLang} 
          />
        );

      case 'visitors':
        return (
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mb-2">
              {isRtl ? 'إحصائيات الزوار' : 'Visitors Analytics'}
            </h1>
            <p className="text-xs text-gray-400 mb-6">
              {isRtl ? 'قريباً: متابعة عدد زوار المتجر والصفحات الأكثر مشاهدة.' : 'Coming soon: Track store visitors.'}
            </p>
          </div>
        );

      case 'trash':
        return (
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mb-2">
              {isRtl ? 'سلة المهملات' : 'Trash Bin'}
            </h1>
            <p className="text-xs text-gray-400 mb-6">
              {isRtl ? 'قريباً: استعادة المنتجات المحذوفة أو حذفها نهائياً.' : 'Coming soon: Restore deleted items.'}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white relative flex">
      {/* السايد بار في اليسار دائماً */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        onBackToHome={onBackToHome}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* منطقة المحتوى تتأقلم مع مساحة السايد بار وتدعم اتجاه اللغة */}
      <main 
        className={`flex-1 p-8 overflow-y-auto max-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="max-w-6xl mx-auto">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}