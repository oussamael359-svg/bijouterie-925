import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import ProductsView from './views/ProductsView';
// سنقوم بإنشاء هذه الملفات تباعاً
// import DashboardView from './views/DashboardView';
// import CategoriesView from './views/CategoriesView';
// import VisitorsView from './views/VisitorsView';
// import TrashView from './views/TrashView';

export default function AdminLayout({ products, setProducts, onBackToHome, currentLang }) {
  // اجعل الداشبورد هي الصفحة الافتتاحية عند فتح الأدمن
  const [activeTab, setActiveTab] = useState('dashboard');
  const isRtl = currentLang === 'ar';

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    onBackToHome();
  };

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
            {/* كروت الإحصائيات السريعة */}
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
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#F3E5AB] mb-2">
              {isRtl ? 'إدارة التصنيفات' : 'Categories Management'}
            </h1>
            <p className="text-xs text-gray-400 mb-6">
              {isRtl ? 'قريباً: إضافة وتعديل وحذف تصنيفات المتجر (خواتم، سلاسل، أساور...)' : 'Coming soon: Manage store categories.'}
            </p>
          </div>
        );

      case 'products':
        return <ProductsView products={products} setProducts={setProducts} currentLang={currentLang} />;

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
    <div className="bg-[#0a0a0a] min-h-screen text-white flex">
      {/* السايد بار بالترتيب الجديد */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        onBackToHome={onBackToHome}
        onLogout={handleLogout}
      />

      {/* منطقة المحتوى المتغيرة */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}