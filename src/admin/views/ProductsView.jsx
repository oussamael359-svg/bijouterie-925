import React, { useState, useEffect } from 'react';

export default function ProductsView({ products, setProducts, categories = [], currentLang }) {
  const isRtl = currentLang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // حالة نموذج إضافة منتج جديد
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: ''
  });

  // تحديث التصنيف الافتراضي تلقائياً عند فتح النافذة أو توفر التصنيفات
  useEffect(() => {
    if (categories.length > 0) {
      setFormData(prev => ({
        ...prev,
        category: prev.category || categories[0].id
      }));
    }
  }, [categories, isModalOpen]);

  // تصفية المنتجات بناءً على البحث
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // دالة إضافة المنتج
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category || (categories[0]?.id ?? 'general'),
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 1,
      image: formData.image.trim() || 'https://via.placeholder.com/150'
    };

    setProducts([newProduct, ...products]);
    setFormData({
      name: '',
      category: categories[0]?.id || '',
      price: '',
      stock: '',
      image: ''
    });
    setIsModalOpen(false);
  };

  // دالة حذف المنتج
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 relative">
      {/* عنوان القسم وزر الإضافة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB]">
            {isRtl ? 'إدارة المنتجات' : 'Products Management'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'إدارة وتعديل منتجات المتجر وحالة المخزون' : 'Manage store products and stock status'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D4AF37] hover:bg-[#c19d30] text-black text-xs font-bold px-4 py-2.5 rounded-sm transition flex items-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          {isRtl ? 'إضافة منتج جديد' : 'Add New Product'}
        </button>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-[#121212] border border-white/10 p-4 rounded-sm flex items-center justify-between">
        <input
          type="text"
          placeholder={isRtl ? 'بحث عن منتج...' : 'Search products...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-black/50 border border-white/15 text-white text-xs px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] w-full sm:w-72"
        />
        <span className="text-xs text-gray-400">
          {isRtl ? `النتائج: ${filteredProducts.length}` : `Results: ${filteredProducts.length}`}
        </span>
      </div>

      {/* جدول عرض المنتجات */}
      <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] text-gray-400 uppercase">
                <th className="p-3.5">{isRtl ? 'المنتج' : 'Product'}</th>
                <th className="p-3.5">{isRtl ? 'التصنيف' : 'Category'}</th>
                <th className="p-3.5">{isRtl ? 'السعر' : 'Price'}</th>
                <th className="p-3.5">{isRtl ? 'المخزون' : 'Stock'}</th>
                <th className="p-3.5 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition">
                    <td className="p-3.5 flex items-center gap-3">
                      <img 
                        src={product.image || 'https://via.placeholder.com/40'} 
                        alt={product.name} 
                        className="w-9 h-9 object-cover rounded-sm border border-white/10"
                      />
                      <span className="font-bold text-white">{product.name}</span>
                    </td>
                    <td className="p-3.5 text-gray-300">
                      {categories.find(c => c.id === product.category)?.titleAr || 
                       categories.find(c => c.id === product.category)?.name || 
                       product.category}
                    </td>
                    <td className="p-3.5 text-[#D4AF37] font-bold">{product.price} {isRtl ? 'ر.س' : 'SAR'}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                        (product.stock ?? 1) > 0 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {(product.stock ?? 1) > 0 
                          ? (isRtl ? `متوفر (${product.stock})` : `In Stock (${product.stock})`) 
                          : (isRtl ? 'نفذت الكمية' : 'Out of Stock')}
                      </span>
                    </td>
                    <td className="p-3.5 text-center space-x-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-xs transition cursor-pointer"
                        title={isRtl ? 'حذف' : 'Delete'}
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-400">
                    {isRtl ? 'لا توجد منتجات مطابقة للبحث' : 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة (Modal) إضافة منتج جديد */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/15 p-6 rounded-sm w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">
                {isRtl ? 'إضافة منتج جديد' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">{isRtl ? 'اسم المنتج' : 'Product Name'}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isRtl ? 'أدخل اسم المنتج...' : 'Enter product name...'}
                  className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{isRtl ? 'التصنيف' : 'Category'}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#121212] text-white">
                        {isRtl ? (cat.titleAr || cat.title || cat.name || cat.id) : (cat.titleEn || cat.title || cat.name || cat.id)}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {isRtl ? 'لا توجد تصنيفات مضافة (أضف تصنيفاً أولاً)' : 'No categories found'}
                    </option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">{isRtl ? 'السعر' : 'Price'}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{isRtl ? 'كمية المخزون' : 'Stock Quantity'}</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{isRtl ? 'رابط الصورة (URL)' : 'Image URL'}</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xs transition cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#c19d30] text-black font-bold px-5 py-2 rounded-xs transition cursor-pointer"
                >
                  {isRtl ? 'حفظ المنتج' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}