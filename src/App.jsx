import React, { useState, useEffect } from 'react';
import { products } from './data/products';
import { translations } from './data/translations';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import ShopPage from './components/ShopPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lang, setLang] = useState('ar');

  // حالة المنتج المحدد للعرض
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#product-')) {
      const id = hash.replace('#product-', '');
      return products.find(p => String(p.id) === String(id)) || products[0];
    }
    return products[0];
  });

  // 1. قراءة الصفحة الحالية من رابط الموقع (Home / Shop / Product)
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#product')) return 'product';
    if (hash === '#shop') return 'shop';
    return 'home';
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const t = translations[lang];

  // 2. الاستماع لتغيرات الرابط والأزرار الخلفية/الأمامية في المتصفح
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        const foundProduct = products.find(p => String(p.id) === String(id));
        if (foundProduct) setSelectedProduct(foundProduct);
        setCurrentPage('product');
      } else if (hash === '#shop') {
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

  // دالة فتح صفحة تفاصيل المنتج
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // 🔄 دالة الرجوع الذكي للصفحة السابقة (سواء الرئيسية أو المتجر)
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleNavigateToHome();
    }
  };

  // إضافة للمنتجات مع دعم تحديد الكمية (من صفحة التفاصيل)
  const addToCart = (product) => {
    const qtyToAdd = product.quantity || 1;
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id && item.selectedSize === product.selectedSize);
      if (exists) {
        return prev.map(item =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
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
        {currentPage === 'home' && (
          <>
            <Hero currentLang={lang} />
            <Categories currentLang={lang} />
            <ProductGrid 
              products={products} 
              onAddToCart={addToCart} 
              currentLang={lang} 
              onNavigateToShop={handleNavigateToShop}
              onViewProduct={handleViewProduct}
            />
          </>
        )}

        {currentPage === 'shop' && (
          <ShopPage 
            products={products}
            onAddToCart={addToCart}
            currentLang={lang}
            initialCategory={selectedCategory}
            onBackToHome={handleNavigateToHome}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailsPage 
            product={selectedProduct}
            onAddToCart={addToCart}
            currentLang={lang}
            onBack={handleGoBack}
            onBackToShop={handleGoBack}
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