import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { products as initialProducts } from './data/products';
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
import AdminLayout from './admin/AdminLayout';

// 📐 مكون التخطيط العام للمتجر (يحتوي على الهيدر والفوتر والسلة الثابتة)
function StoreLayout({ 
  cartCount, onOpenCart, lang, toggleLanguage, t, 
  cart, removeFromCart, updateQuantity, totalCartPrice, 
  isCartOpen, setIsCartOpen, setSelectedCategory 
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2A2A2A] via-[#121212] to-[#080808] text-white font-sans flex flex-col justify-between">
      <div>
        <TopBar currentLang={lang} />
        <Navbar 
          cartCount={cartCount} 
          onOpenCart={onOpenCart} 
          currentLang={lang}
          onToggleLang={toggleLanguage}
          t={t}
        />
        <main>
          {/* هنا سيتم عرض الصفحة الحالية (الرئيسية، المتجر، أو تفاصيل المنتج) */}
          <Outlet />
        </main>
      </div>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={totalCartPrice}
        currentLang={lang}
      />

      <Footer currentLang={lang} setSelectedCategory={setSelectedCategory} />
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lang, setLang] = useState('ar');
  
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const t = translations[lang];

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const addToCart = (product) => {
    const maxStock = product.stock ?? 99;
    if (maxStock <= 0) return;

    const qtyToAdd = product.quantity || 1;

    setCart(prev => {
      const exists = prev.find(
        item => item.id === product.id && item.selectedSize === product.selectedSize
      );

      if (exists) {
        const updatedQty = Math.min(exists.quantity + qtyToAdd, maxStock);
        return prev.map(item =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: updatedQty }
            : item
        );
      }

      const initialQty = Math.min(qtyToAdd, maxStock);
      return [...prev, { ...product, quantity: initialQty }];
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
          const maxStock = item.stock ?? 99;
          const proposedQty = item.quantity + delta;
          const validQty = Math.min(Math.max(1, proposedQty), maxStock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalCartCount = cart.reduce((a, c) => a + c.quantity, 0);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 مسار لوحة التحكم المستقل */}
        <Route 
          path="/admin/*" 
          element={
            <AdminLayout 
              products={products} 
              setProducts={setProducts} 
              currentLang={lang} 
            />
          } 
        />

        {/* 🛍️ مسارات المتجر مع تخطيط العرض الموحد */}
        <Route element={
          <StoreLayout 
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(!isCartOpen)}
            lang={lang}
            toggleLanguage={toggleLanguage}
            t={t}
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            totalCartPrice={totalCartPrice}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            setSelectedCategory={setSelectedCategory}
          />
        }>
          <Route 
            path="/" 
            element={
              <>
                <Hero currentLang={lang} />
                <Categories currentLang={lang} onSelectCategory={setSelectedCategory} />
                <ProductGrid 
                  products={products} 
                  onAddToCart={addToCart} 
                  currentLang={lang} 
                />
              </>
            } 
          />

          <Route 
            path="/shop" 
            element={
              <ShopPage 
                products={products}
                onAddToCart={addToCart}
                currentLang={lang}
                initialCategory={selectedCategory}
              />
            } 
          />

          <Route 
            path="/product/:id" 
            element={
              <ProductDetailsPage 
                products={products}
                onAddToCart={addToCart}
                currentLang={lang}
              />
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}