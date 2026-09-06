import React, { useState, useEffect } from 'react';
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

// 📐 مكون التخطيط العام للمتجر
function StoreLayout({ 
  cartCount, onOpenCart, lang, toggleLanguage, t, 
  cart, removeFromCart, updateQuantity, totalCartPrice, 
  isCartOpen, setIsCartOpen, setSelectedCategory, categories,
  orders, setOrders, setCart
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
        setCartItems={setCart}
        orders={orders}
        setOrders={setOrders}
      />

      <Footer currentLang={lang} setSelectedCategory={setSelectedCategory} categories={categories} />
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lang, setLang] = useState('ar');
  
  // 🏷️ المنتجات مع الحفظ الدائم في localStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('store_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (e) {
      return initialProducts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('store_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);
  
  // 📦 حالة الطلبات مع الحفظ الدائم في localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('store_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('store_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // 🏷️ حالة التصنيفات مع الحفظ الدائم في localStorage
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('store_categories');
      return saved ? JSON.parse(saved) : [
        { id: 'rings', titleAr: 'خواتم', titleEn: 'Rings', descAr: 'خواتم فاخرة بتصميم عصري', descEn: 'Luxury modern rings' },
        { id: 'necklaces', titleAr: 'سلاسل وقلائد', titleEn: 'Necklaces', descAr: 'سلاسل فضية وذهبية راقية', descEn: 'Fine silver and gold necklaces' },
        { id: 'bracelets', titleAr: 'أساور', titleEn: 'Bracelets', descAr: 'تشكيلة أساور مميزة', descEn: 'Unique bracelet collection' }
      ];
    } catch (e) {
      return [
        { id: 'rings', titleAr: 'خواتم', titleEn: 'Rings', descAr: 'خواتم فاخرة بتصميم عصري', descEn: 'Luxury modern rings' },
        { id: 'necklaces', titleAr: 'سلاسل وقلائد', titleEn: 'Necklaces', descAr: 'سلاسل فضية وذهبية راقية', descEn: 'Fine silver and gold necklaces' },
        { id: 'bracelets', titleAr: 'أساور', titleEn: 'Bracelets', descAr: 'تشكيلة أساور مميزة', descEn: 'Unique bracelet collection' }
      ];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('store_categories', JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

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

  const removeFromCart = (id, selectedSize) => {
    setCart(prev => prev.filter(item => {
      if (selectedSize !== undefined && selectedSize !== null) {
        return !(item.id === id && item.selectedSize === selectedSize);
      }
      return item.id !== id;
    }));
  };

  const updateQuantity = (id, delta, selectedSize) => {
    setCart(prev =>
      prev.map(item => {
        const isMatch = (selectedSize !== undefined && selectedSize !== null)
          ? (item.id === id && item.selectedSize === selectedSize)
          : (item.id === id);

        if (isMatch) {
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
              categories={categories}
              setCategories={setCategories}
              orders={orders}
              setOrders={setOrders}
              currentLang={lang} 
              setCurrentLang={setLang}
            />
          } 
        />

        {/* 🛍️ مسارات المتجر */}
        <Route element={
          <StoreLayout 
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(!isCartOpen)}
            lang={lang}
            toggleLanguage={toggleLanguage}
            t={t}
            cart={cart}
            setCart={setCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            totalCartPrice={totalCartPrice}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            orders={orders}
            setOrders={setOrders}
          />
        }>
          <Route 
            path="/" 
            element={
              <>
                <Hero currentLang={lang} />
                <Categories currentLang={lang} onSelectCategory={setSelectedCategory} categories={categories} />
                <ProductGrid 
                  products={products} 
                  onAddToCart={addToCart} 
                  currentLang={lang} 
                  selectedCategory={selectedCategory}
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
                onSelectCategory={setSelectedCategory} 
                categories={categories}
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