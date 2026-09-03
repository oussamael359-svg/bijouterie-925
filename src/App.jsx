import React, { useState, useEffect } from 'react';
import { products } from './data/products';
import { translations } from './data/translations';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import ShopPage from './components/ShopPage';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lang, setLang] = useState('ar');

  // 1. قراءة الصفحة الحالية من رابط الموقع لمنع العودة للرئيسية عند الـ Refresh
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#shop' ? 'shop' : 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState('all');

  const t = translations[lang];

  // 2. الاستماع لتغيرات الرابط وأزرار التراجع/التقدم في المتصفح
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#shop') {
        setCurrentPage('shop');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  // دالة الانتقال إلى المتجر
  const handleNavigateToShop = (category = 'all') => {
    setSelectedCategory(category);
    setCurrentPage('shop');
    window.location.hash = 'shop';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // دالة العودة للرئيسية
  const handleNavigateToHome = () => {
    setCurrentPage('home');
    window.location.hash = 'home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalCartCount = cart.reduce((a, c) => a + c.quantity, 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2A2A2A] via-[#121212] to-[#080808] text-white font-sans">
      {/* 1. الشريط العلوي */}
      <TopBar currentLang={lang} />

      {/* 2. الهيدر الرئيسي */}
      <Navbar 
        cartCount={totalCartCount} 
        onOpenCart={() => setIsCartOpen(!isCartOpen)} 
        currentLang={lang}
        onToggleLang={toggleLanguage}
        t={t}
        onNavigateToShop={handleNavigateToShop}
        onBackToHome={handleNavigateToHome}
      />

      {/* 3. عرض الصفحة حسب الحالة */}
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero currentLang={lang} />
            <Categories currentLang={lang} />
            <ProductGrid 
              products={products} 
              onAddToCart={addToCart} 
              currentLang={lang} 
              onNavigateToShop={handleNavigateToShop}
            />
          </>
        ) : (
          <ShopPage 
            products={products}
            onAddToCart={addToCart}
            currentLang={lang}
            initialCategory={selectedCategory}
            onBackToHome={handleNavigateToHome}
          />
        )}
      </main>

      {/* 4. سلة التسوق الجانبية */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={totalCartPrice}
        currentLang={lang}
      />

      {/* 5. تذييل الموقع */}
      <Footer currentLang={lang} />
    </div>
  );
}