import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { translations } from './data/translations';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import ShopPage from './components/ShopPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import Contact from './components/Contact';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';

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
   
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // جلب البيانات من Supabase عند تحميل التطبيق
  useEffect(() => {
    async function fetchAppData() {
      try {
        // 1. جلب المنتجات
        const { data: prodData } = await supabase.from('products').select('*');
        if (prodData) {
          setProducts(prodData.map(p => ({
            id: p.id,
            name: p.name,
            nameAr: p.name_ar,
            nameEn: p.name_en,
            category: p.category,
            price: p.price,
            stock: p.stock,
            description: p.description,
            descriptionAr: p.description_ar,
            descriptionEn: p.description_en,
            image: p.image,
            size: p.attributes?.size || p.size || '' // تم التحديث لقراءة المقاس النصي المرن
          })));
        }

        // 2. جلب التصنيفات
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) {
          setCategories(catData.map(c => ({
            id: c.id,
            titleAr: c.title_ar,
            titleEn: c.title_en,
            descAr: c.desc_ar,
            descEn: c.desc_en,
            image: c.image,
            showOnHome: c.show_on_home
          })));
        }

        // 3. جلب المقاسات والخصائص
        const { data: attrData } = await supabase.from('attributes').select('*');
        if (attrData) {
          setAttributes(attrData.map(a => ({
            id: a.id.toString(),
            categoryId: a.category_id,
            name: a.name
          })));
        }

        // 4. جلب الطلبات
        const { data: ordData } = await supabase.from('orders').select('*');
        if (ordData) {
          setOrders(ordData.map(o => ({
            id: o.id,
            customer: o.customer_name,
            email: o.email,
            phone: o.phone,
            address: o.address,
            paymentMethod: o.payment_method,
            bankReference: o.bank_reference,
            total: o.total,
            status: o.status,
            date: o.date,
            items: o.items
          })));
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      }
    }

    fetchAppData();
  }, []);

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
    const selectedSize = product.selectedSize || '';
    const selectedColor = product.selectedColor || '';

    setCart(prev => {
      const exists = prev.find(
        item => item.id === product.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
      );

      if (exists) {
        const updatedQty = Math.min(exists.quantity + qtyToAdd, maxStock);
        return prev.map(item =>
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: updatedQty }
            : item
        );
      }

      const initialQty = Math.min(qtyToAdd, maxStock);
      return [...prev, { ...product, selectedSize, selectedColor, quantity: initialQty }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id, selectedSize, selectedColor) => {
    setCart(prev => prev.filter(item => {
      const isSameId = item.id === id;
      const isSameSize = (item.selectedSize || '') === (selectedSize || '');
      const isSameColor = (item.selectedColor || '') === (selectedColor || '');
       
      if (selectedSize !== undefined || selectedColor !== undefined) {
        return !(isSameId && isSameSize && isSameColor);
      }
      return !isSameId;
    }));
  };

  const updateQuantity = (id, delta, selectedSize, selectedColor) => {
    setCart(prev =>
      prev.map(item => {
        const isMatch = item.id === id && 
          (selectedSize !== undefined ? (item.selectedSize || '') === (selectedSize || '') : true) &&
          (selectedColor !== undefined ? (item.selectedColor || '') === (selectedColor || '') : true);

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
        <Route 
          path="/admin/*" 
          element={
            <AdminLayout 
              products={products} 
              setProducts={setProducts} 
              categories={categories}
              setCategories={setCategories}
              attributes={attributes}
              setAttributes={setAttributes}
              orders={orders}
              setOrders={setOrders}
              deletedOrders={deletedOrders}
              setDeletedOrders={setDeletedOrders}
              currentLang={lang} 
              setCurrentLang={setLang}
              onBackToHome={() => { window.location.href = '/'; }}
            />
          } 
        />

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

          <Route 
            path="/contact" 
            element={
              <Contact currentLang={lang} />
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}