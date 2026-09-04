import React, { useState } from 'react';

export default function CategoriesView({ categories, setCategories, products, currentLang }) {
  const isRtl = currentLang === 'ar';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    titleAr: '',
    titleEn: '',
    descAr: '',
    descEn: '',
    image: '',
    showOnHome: true
  });

  // فتح نافذة الإضافة
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ id: '', titleAr: '', titleEn: '', descAr: '', descEn: '', image: '', showOnHome: true });
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      id: cat.id,
      titleAr: cat.titleAr || cat.title || '',
      titleEn: cat.titleEn || cat.title || '',
      descAr: cat.descAr || cat.desc || '',
      descEn: cat.descEn || cat.desc || '',
      image: cat.image || '',
      showOnHome: cat.showOnHome !== undefined ? cat.showOnHome : true
    });
    setIsModalOpen(true);
  };

  // رفع الصورة محلياً وتحويلها إلى Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // حفظ (إضافة أو تحديث)
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.titleAr) return;

    if (editingCategory) {
      // تحديث
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData } : c));
    } else {
      // إضافة جديد
      if (categories.some(c => c.id === formData.id)) {
        alert(isRtl ? 'معرف التصنيف (ID) موجود مسبقاً!' : 'Category ID already exists!');
        return;
      }
      setCategories([...categories, formData]);
    }
    setIsModalOpen(false);
  };

  // حذف تصنيف
  const handleDelete = (id) => {
    const count = products.filter(p => p.category === id).length;
    if (count > 0) {
      if (!window.confirm(isRtl ? `هذا التصنيف يحتوي على ${count} منتج. هل أنت متأكد من الحذف؟` : `This category contains ${count} products. Are you sure?`)) {
        return;
      }
    } else {
      if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) {
        return;
      }
    }
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB]">
            {isRtl ? 'إدارة التصنيفات' : 'Categories Management'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'تحكم في أقسام المتجر وعرض المنتجات وصور الأقسام بالصفحة الرئيسية.' : 'Manage store categories, images, and homepage visibility.'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#D4AF37] text-black hover:bg-[#F3E5AB] px-4 py-2.5 rounded-xs text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <i className="fa-solid fa-plus"></i>
          <span>{isRtl ? 'إضافة تصنيف جديد' : 'Add New Category'}</span>
        </button>
      </div>

      {/* جدول التصنيفات */}
      <div className="bg-[#121212] border border-[#D4AF37]/20 rounded-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead className="bg-black/40 border-b border-white/10 text-[11px] text-[#D4AF37] uppercase tracking-wider">
              <tr>
                <th className="p-4">{isRtl ? 'الصورة' : 'Image'}</th>
                <th className="p-4">{isRtl ? 'معرف التصنيف (ID)' : 'Category ID'}</th>
                <th className="p-4">{isRtl ? 'اسم التصنيف' : 'Category Name'}</th>
                <th className="p-4">{isRtl ? 'الرئيسية' : 'Show on Home'}</th>
                <th className="p-4">{isRtl ? 'عدد المنتجات' : 'Products Count'}</th>
                <th className="p-4 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {categories.map((cat) => {
                const productCount = products.filter(p => p.category === cat.id).length;
                return (
                  <tr key={cat.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <div className="w-10 h-10 rounded overflow-hidden bg-black/50 border border-white/10">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.titleAr} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[#F3E5AB]">{cat.id}</td>
                    <td className="p-4 font-bold text-white">
                      <div>{cat.titleAr || cat.title}</div>
                      <div className="text-[10px] text-gray-400 font-normal">{cat.titleEn || cat.title}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-xs text-[10px] font-bold ${cat.showOnHome !== false ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'}`}>
                        {cat.showOnHome !== false ? (isRtl ? 'ظاهر' : 'Visible') : (isRtl ? 'مخفي' : 'Hidden')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-xs text-gray-300">
                        {productCount} {isRtl ? 'منتج' : 'items'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xs transition cursor-pointer"
                          title={isRtl ? 'تعديل' : 'Edit'}
                        >
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xs transition cursor-pointer"
                          title={isRtl ? 'حذف' : 'Delete'}
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة الإضافة / التعديل منبثقة (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div 
            className="bg-[#121212] border border-[#D4AF37]/40 w-full max-w-lg rounded-sm p-6 shadow-2xl relative text-right max-h-[90vh] overflow-y-auto"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-lg font-serif font-bold text-[#F3E5AB]">
                {editingCategory ? (isRtl ? 'تعديل التصنيف' : 'Edit Category') : (isRtl ? 'إضافة تصنيف جديد' : 'Add New Category')}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  {isRtl ? 'معرف التصنيف (ID بالإنجليزية وبدون مسافات، مثل: rings)' : 'Category ID (e.g. rings)'}
                </label>
                <input
                  type="text"
                  disabled={!!editingCategory}
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.trim().toLowerCase() })}
                  required
                  className="w-full bg-black/50 border border-white/20 rounded-xs px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none disabled:opacity-50"
                  placeholder="e.g. rings"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isRtl ? 'اسم التصنيف بالعربية' : 'Arabic Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/20 rounded-xs px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                    placeholder="أحدث خواتم الفضة"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isRtl ? 'اسم التصنيف بالإنجليزية' : 'English Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/20 rounded-xs px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                    placeholder="Latest Men's Rings"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isRtl ? 'الوصف بالعربية' : 'Arabic Description'}
                  </label>
                  <textarea
                    value={formData.descAr}
                    onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                    rows="2"
                    className="w-full bg-black/50 border border-white/20 rounded-xs px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none resize-none"
                    placeholder="وصف مختصر للقسم..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isRtl ? 'الوصف بالإنجليزية' : 'English Description'}
                  </label>
                  <textarea
                    value={formData.descEn}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    rows="2"
                    className="w-full bg-black/50 border border-white/20 rounded-xs px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none resize-none"
                    placeholder="Short description..."
                    dir="ltr"
                  />
                </div>
              </div>

              {/* حقل صورة التصنيف (رفع ملف أو رابط URL) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300">
                  {isRtl ? 'صورة التصنيف (رابط URL أو رفع ملف)' : 'Category Image (URL or File Upload)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-black/50 border border-white/20 rounded-xs px-3 py-2 text-xs text-white focus:border-[#D4AF37] outline-none"
                    dir="ltr"
                  />
                  <label className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-4 py-2 text-xs font-bold rounded-xs cursor-pointer transition flex items-center justify-center shrink-0">
                    <span>{isRtl ? 'رفع ملف' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-2 w-16 h-16 rounded overflow-hidden border border-white/20">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* خيار الإظهار في الصفحة الرئيسية */}
              <div className="flex items-center gap-3 pt-2 bg-white/[0.02] p-3 rounded-xs border border-white/5">
                <input
                  type="checkbox"
                  id="showOnHomeCheckbox"
                  checked={formData.showOnHome}
                  onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                  className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                />
                <label htmlFor="showOnHomeCheckbox" className="text-xs text-gray-200 cursor-pointer select-none">
                  {isRtl ? 'إظهار هذا التصنيف في قسم "تصفح حسب المجموعة" بالصفحة الرئيسية' : 'Show this category in the homepage "Browse Collection" section'}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-gray-300 hover:bg-white/5 rounded-xs text-xs font-bold transition cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] text-black hover:bg-[#F3E5AB] rounded-xs text-xs font-bold transition cursor-pointer shadow-lg"
                >
                  {isRtl ? 'حفظ التصنيف' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}