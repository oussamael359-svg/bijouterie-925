import React from 'react';

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingProduct,
  categories,
  attributes = [], // 1. استقبال قائمة الخصائص والمقاسات
  currentLang,
  onImageChange
}) {
  if (!isOpen) return null;
  const isRtl = currentLang === 'ar';

  // 2. تصفية المقاسات أو الخصائص بناءً على الفئة المختارة للمنتج حالياً
  const currentCategoryAttributes = attributes.filter(
    attr => attr.categoryId === formData.category
  );

  // 3. دالة تحديد أو إلغاء تحديد مقاس معين
  const handleSizeToggle = (sizeName) => {
    const currentSizes = formData.sizes || [];
    if (currentSizes.includes(sizeName)) {
      setFormData({
        ...formData,
        sizes: currentSizes.filter(s => s !== sizeName)
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...currentSizes, sizeName]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-white/15 p-6 rounded-sm w-full max-w-lg shadow-2xl space-y-4 my-8">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">
            {editingProduct 
              ? (isRtl ? 'تعديل المنتج' : 'Edit Product') 
              : (isRtl ? 'إضافة منتج جديد' : 'Add New Product')}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* اسم المنتج بالعربية والإنجليزية */}
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

          {/* وصف المنتج بالعربية والإنجليزية */}
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

          {/* التصنيف */}
          <div>
            <label className="block text-gray-400 mb-1">{isRtl ? 'التصنيف' : 'Category'}</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, sizes: [] })}
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
                  {isRtl ? 'لا توجد تصنيفات مضافة' : 'No categories found'}
                </option>
              )}
            </select>
          </div>

          {/* 4. قسم المقاسات / الخصائص الديناميكية (يظهر فقط إذا كانت الفئة تحتوي على مقاسات مسجلة) */}
          {currentCategoryAttributes.length > 0 && (
            <div className="border border-white/10 bg-white/5 p-3 rounded-xs space-y-2">
              <label className="block text-[#F3E5AB] font-bold text-[11px]">
                {isRtl ? 'المقاسات المتاحة لهذا التصنيف:' : 'Available Sizes for this Category:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {currentCategoryAttributes.map((attr) => {
                  const isSelected = (formData.sizes || []).includes(attr.name);
                  return (
                    <button
                      key={attr.id}
                      type="button"
                      onClick={() => handleSizeToggle(attr.name)}
                      className={`px-3 py-1 text-[11px] rounded-xs border transition cursor-pointer ${
                        isSelected 
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold' 
                          : 'bg-black/40 text-gray-300 border-white/15 hover:border-[#D4AF37]'
                      }`}
                    >
                      {attr.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* السعر والمخزون */}
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

          {/* قسم الصورة */}
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
                  onChange={onImageChange}
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

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
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
  );
}