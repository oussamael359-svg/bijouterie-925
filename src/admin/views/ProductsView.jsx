import React, { useState, useEffect } from 'react';

export default function ProductsView({ products, setProducts, categories = [], currentLang }) {
  const isRtl = currentLang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // حالة نموذج إضافة/تعديل منتج (دعم اللغتين العربية والإنجليزية للاسم والوصف)
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    category: '',
    price: '',
    stock: '',
    descriptionAr: '',
    descriptionEn: '',
    image: ''
  });

  // تحديث التصنيف الافتراضي تلقائياً عند فتح النافذة للإضافة وعدم وجود تصنيف محدد
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: categories[0].id
      }));
    }
  }, [categories, isModalOpen]);

  // تصفية المنتجات بناءً على البحث (في الاسم بالعربية أو الإنجليزية)
  const filteredProducts = products.filter(p => {
    const fullName = `${p.nameAr || p.name || ''} ${p.nameEn || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // دالة التعامل مع رفع الصورة من الجهاز وتحويلها إلى Base64
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // فتح نافذة الإضافة
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      nameAr: '',
      nameEn: '',
      category: categories[0]?.id || '',
      price: '',
      stock: '',
      descriptionAr: '',
      descriptionEn: '',
      image: ''
    });
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل مع تعبئة بيانات المنتج الحالي
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      nameAr: product.nameAr || product.name || '',
      nameEn: product.nameEn || '',
      category: product.category || categories[0]?.id || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      descriptionAr: product.descriptionAr || product.description || '',
      descriptionEn: product.descriptionEn || '',
      image: product.image || ''
    });
    setIsModalOpen(true);
  };

  // دالة حفظ المنتج (إضافة أو تعديل)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.nameAr.trim() && !formData.nameEn.trim()) return;

    if (editingProduct) {
      // تعديل منتج موجود
      setProducts(products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formData.nameAr || formData.nameEn,
            nameAr: formData.nameAr,
            nameEn: formData.nameEn,
            category: formData.category || (categories[0]?.id ?? 'general'),
            price: parseFloat(formData.price) || 0,
            stock: parseInt(formData.stock) || 1,
            description: formData.descriptionAr || formData.descriptionEn,
            descriptionAr: formData.descriptionAr,
            descriptionEn: formData.descriptionEn,
            image: formData.image.trim() || 'https://via.placeholder.com/150'
          };
        }
        return p;
      }));
    } else {
      // إضافة منتج جديد
      const newProduct = {
        id: Date.now().toString(),
        name: formData.nameAr || formData.nameEn,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        category: formData.category || (categories[0]?.id ?? 'general'),
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 1,
        description: formData.descriptionAr || formData.descriptionEn,
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn,
        image: formData.image.trim() || 'https://via.placeholder.com/150'
      };
      setProducts([newProduct, ...products]);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      nameAr: '',
      nameEn: '',
      category: categories[0]?.id || '',
      price: '',
      stock: '',
      descriptionAr: '',
      descriptionEn: '',
      image: ''
    });
  };

  // دالة حذف المنتج
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 relative">
      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #222222 #0d0d0d;
        }
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #0d0d0d;
        }
        ::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #D4AF37;
        }
      `}</style>

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
          onClick={handleOpenAddModal}
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
                filteredProducts.map((product) => {
                  const displayName = isRtl 
                    ? (product.nameAr || product.name || '') 
                    : (product.nameEn || product.name || '');
                  const displayDesc = isRtl 
                    ? (product.descriptionAr || product.description || '') 
                    : (product.descriptionEn || product.description || '');

                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition">
                      <td className="p-3.5 flex items-center gap-3">
                        <img 
                          src={product.image || 'https://via.placeholder.com/40'} 
                          alt={displayName} 
                          className="w-9 h-9 object-cover rounded-sm border border-white/10"
                        />
                        <div>
                          <span className="font-bold text-white block">{displayName}</span>
                          {displayDesc && (
                            <span className="text-[10px] text-gray-400 truncate block max-w-xs">{displayDesc}</span>
                          )}
                        </div>
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
                        {/* زر التعديل (قلم) */}
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-[#D4AF37] hover:text-[#c19d30] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 p-1.5 rounded-xs transition cursor-pointer"
                          title={isRtl ? 'تعديل' : 'Edit'}
                        >
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        {/* زر الحذف */}
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-xs transition cursor-pointer"
                          title={isRtl ? 'حذف' : 'Delete'}
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
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

      {/* نافذة (Modal) إضافة أو تعديل منتج */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-white/15 p-6 rounded-sm w-full max-w-lg shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">
                {editingProduct 
                  ? (isRtl ? 'تعديل المنتج' : 'Edit Product') 
                  : (isRtl ? 'إضافة منتج جديد' : 'Add New Product')}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* اسم المنتج بالعربية والإنجليزية جنباً إلى جنب */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">{isRtl ? 'اسم المنتج بالعربية' : 'Product Name (Arabic)'}</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder={isRtl ? 'أدخل اسم المنتج بالعربية...' : 'Arabic name...'}
                    className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{isRtl ? 'اسم المنتج بالإنجليزية' : 'Product Name (English)'}</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Luxury Ring"
                    className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* وصف المنتج بالعربية والإنجليزية جنباً إلى جنب */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">{isRtl ? 'الوصف بالعربية' : 'Description (Arabic)'}</label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder={isRtl ? 'وصف مختصر للمنتج...' : 'Short description...'}
                    rows="2"
                    className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{isRtl ? 'الوصف بالإنجليزية' : 'Description (English)'}</label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="English description..."
                    rows="2"
                    className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>
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

              {/* قسم صورة المنتج (رابط URL أو رفع ملف) */}
              <div className="space-y-2">
                <label className="block text-gray-400 mb-1">
                  {isRtl ? 'صورة المنتج (رابط URL أو رفع ملف)' : 'Product Image (URL or file upload)'}
                </label>
                
                <div className="flex items-center gap-2">
                  <label className="bg-black/50 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-bold px-4 py-2 rounded-xs transition cursor-pointer flex items-center justify-center whitespace-nowrap">
                    {isRtl ? 'رفع ملف' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={formData.image.startsWith('data:') ? (isRtl ? '[تم رفع صورة من الجهاز]' : '[Image uploaded from device]') : formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-black/50 border border-white/15 text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {formData.image && (
                  <div className="flex items-center gap-3 mt-2 p-2 bg-white/5 border border-white/10 rounded-xs">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-10 h-10 object-cover rounded-xs border border-white/20" 
                    />
                    <span className="text-[10px] text-gray-300 truncate">
                      {isRtl ? 'معاينة الصورة المحددة' : 'Selected image preview'}
                    </span>
                  </div>
                )}
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
                  {editingProduct 
                    ? (isRtl ? 'تعديل المنتج' : 'Update Product') 
                    : (isRtl ? 'حفظ المنتج' : 'Save Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}