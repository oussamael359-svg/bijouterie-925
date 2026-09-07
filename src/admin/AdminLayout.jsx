import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminLogin from './AdminLogin';
import DashboardView from './views/DashboardView';
import ProductsView from './views/ProductsView';
import CategoriesView from './views/CategoriesView';
import TrashView from './views/TrashView';
import OrdersView from './views/OrdersView';

export default function AdminLayout({ 
  products, 
  setProducts, 
  categories, 
  setCategories, 
  orders, 
  setOrders, 
  deletedOrders, 
  setDeletedOrders, 
  onBackToHome, 
  currentLang, 
  setCurrentLang 
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('admin_logged_in') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [deletedProducts, setDeletedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('store_deleted_products');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('store_deleted_products', JSON.stringify(deletedProducts)); } catch (e) {}
  }, [deletedProducts]);

  const [deletedCategories, setDeletedCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('store_deleted_categories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('store_deleted_categories', JSON.stringify(deletedCategories)); } catch (e) {}
  }, [deletedCategories]);

  const isRtl = currentLang === 'ar';

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    setIsLoggedIn(false);
    if (onBackToHome) onBackToHome();
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} currentLang={currentLang} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            products={products}
            orders={orders}
            currentLang={currentLang}
          />
        );

      case 'orders':
        return (
          <OrdersView 
            orders={orders} 
            setOrders={setOrders} 
            products={products}
            setProducts={setProducts}
            deletedOrders={deletedOrders}
            setDeletedOrders={setDeletedOrders}
            currentLang={currentLang} 
          />
        );

      case 'categories':
        return (
          <CategoriesView 
            categories={categories} 
            setCategories={setCategories} 
            products={products} 
            deletedCategories={deletedCategories}
            setDeletedCategories={setDeletedCategories}
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
            deletedProducts={deletedProducts}
            setDeletedProducts={setDeletedProducts}
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
          <TrashView 
            deletedProducts={deletedProducts}
            setDeletedProducts={setDeletedProducts}
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            deletedCategories={deletedCategories}
            setDeletedCategories={setDeletedCategories}
            deletedOrders={deletedOrders}
            setDeletedOrders={setDeletedOrders}
            orders={orders}
            setOrders={setOrders}
            currentLang={currentLang}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white relative flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        onBackToHome={onBackToHome}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        deletedProducts={deletedProducts}
        deletedCategories={deletedCategories}
        deletedOrders={deletedOrders}
        orders={orders}
      />

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