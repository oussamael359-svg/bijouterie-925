import React, { useState, useEffect } from 'react';

export default function AttributesView({ categories = [], attributes = [], setAttributes, currentLang }) {
  const isRtl = currentLang === 'ar';
  
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [inputValue, setInputValue] = useState('');

  // تحديث التصنيف المختار تلقائياً إذا تغيرت التصنيفات
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  const handleAddAttribute = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedCategory) return;

    const newAttr = {
      id: Date.now().toString(),
      categoryId: selectedCategory,
      name: inputValue.trim()
    };

    setAttributes([...attributes, newAttr]);
    setInputValue('');
  };

  const handleRemoveAttribute = (id) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  const currentCategoryAttributes = attributes.filter(attr => attr.categoryId === selectedCategory);

  return (
    <div className="p-6 bg-[#0A0A0A] text-white rounded-xl border border-[#D4AF37]/20 max-w-4xl mx-auto my-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <h2 className="text-xl font-serif font-bold text-[#F3E5AB] mb-4">
        {isRtl ? 'إدارة مقاسات وخصائص المنتجات' : 'Manage Product Attributes & Sizes'}
      </h2>
      <p className="text-xs text-gray-400 mb-6">
        {isRtl ? 'حدد المقاسات والأطوال لكل تصنيف لتظهر تلقائياً عند إضافة المنتجات.' : 'Define sizes and lengths for each category to automatically appear when adding products.'}
      </p>

      {/* اختيار التصنيف */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer ${
                selectedCategory === cat.id 
                  ? 'bg-[#D4AF37] text-black shadow-md' 
                  : 'bg-[#1A1A1A] text-gray-300 border border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {isRtl ? (cat.titleAr || cat.title || cat.name) : (cat.titleEn || cat.title || cat.name)}
            </button>
          ))
        ) : (
          <p className="text-xs text-red-400">{isRtl ? 'يرجى إضافة تصنيفات أولاً' : 'Please add categories first'}</p>
        )}
      </div>

      {/* نموذج إضافة مقاس جديد */}
      {categories.length > 0 && (
        <form onSubmit={handleAddAttribute} className="flex gap-3 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRtl ? 'أضف مقاس جديد (مثلاً: 68 أو 50cm)' : 'Add new size...'}
            className="flex-1 bg-[#121212] border border-[#D4AF37]/30 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            className="bg-[#D4AF37] text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#F3E5AB] transition duration-200 cursor-pointer"
          >
            {isRtl ? 'إضافة' : 'Add'}
          </button>
        </form>
      )}

      {/* قائمة المقاسات الحالية للتصنيف */}
      <div className="space-y-3">
        <h3 className="text-sm font-serif font-bold text-[#F3E5AB]">
          {isRtl ? 'المقاسات الحالية لهذا التصنيف:' : 'Current sizes for this category:'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {currentCategoryAttributes.length > 0 ? (
            currentCategoryAttributes.map((attr) => (
              <span 
                key={attr.id}
                className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#D4AF37]/40 px-3 py-1.5 rounded-lg text-xs text-gray-200"
              >
                {attr.name}
                <button 
                  type="button"
                  onClick={() => handleRemoveAttribute(attr.id)}
                  className="text-red-400 hover:text-red-300 transition duration-150 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-500">{isRtl ? 'لا توجد مقاسات مضافة لهذا التصنيف بعد.' : 'No sizes added for this category yet.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}