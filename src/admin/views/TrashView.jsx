import React, { useState } from 'react';

export default function TrashView({ 
  deletedProducts = [], 
  setDeletedProducts, 
  products, 
  setProducts, 
  categories = [], 
  setCategories,
  deletedCategories = [], 
  setDeletedCategories, 
  currentLang 
}) {
  const isRtl = currentLang === 'ar';
  const [activeTab, setActiveTab] = useState('products');

  const handleRestoreProduct = (product) => {
    setDeletedProducts(deletedProducts.filter(p => p.id !== product.id));
    setProducts([product, ...products]);
  };

  const handlePermanentDeleteProduct = (id) => {
    setDeletedProducts(deletedProducts.filter(p => p.id !== id));
  };

  const handleRestoreCategory = (cat) => {
    setDeletedCategories(deletedCategories.filter(c => c.id !== cat.id));
    if (setCategories) {
      setCategories([cat, ...categories]);
    }
  };

  const handlePermanentDeleteCategory = (id) => {
    setDeletedCategories(deletedCategories.filter(c => c.id !== id));
  };

  const handleEmptyTrash = () => {
    if (activeTab === 'products') {
      setDeletedProducts([]);
    } else {
      setDeletedCategories([]);
    }
  };

  return (
    <div className="space-y-6 relative" dir={isRtl ? 'rtl' : 'ltr'}>
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB]">
            {isRtl ? 'سلة المهملات' : 'Trash'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'العناصر المحذوفة (يمكنك استعادتها أو حذفها نهائياً)' : 'Deleted items (you can restore or permanently delete them)'}
          </p>
        </div>
        
        {((activeTab === 'products' && deletedProducts.length > 0) || (activeTab === 'categories' && deletedCategories.length > 0)) && (
          <button
            onClick={handleEmptyTrash}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold px-4 py-2.5 rounded-sm transition flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-trash-arrow-up text-xs"></i>
            {activeTab === 'products' 
              ? (isRtl ? 'إفراغ سلة المنتجات' : 'Empty Products Trash') 
              : (isRtl ? 'إفراغ سلة التصنيفات' : 'Empty Categories Trash')}
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/10 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'products' 
              ? 'border-[#D4AF37] text-[#F3E5AB]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-box text-xs"></i>
          <span>{isRtl ? 'المنتجات المحذوفة' : 'Deleted Products'}</span>
          <span className={`px-2 py-0.5 rounded-xs text-[10px] ${activeTab === 'products' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-gray-400'}`}>
            {deletedProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'categories' 
              ? 'border-[#D4AF37] text-[#F3E5AB]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-folder text-xs"></i>
          <span>{isRtl ? 'التصنيفات المحذوفة' : 'Deleted Categories'}</span>
          <span className={`px-2 py-0.5 rounded-xs text-[10px] ${activeTab === 'categories' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-gray-400'}`}>
            {deletedCategories.length}
          </span>
        </button>
      </div>

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[11px] text-[#D4AF37] uppercase tracking-wider">
                  <th className="p-3.5">{isRtl ? 'المنتج' : 'Product'}</th>
                  <th className="p-3.5">{isRtl ? 'التصنيف' : 'Category'}</th>
                  <th className="p-3.5">{isRtl ? 'السعر' : 'Price'}</th>
                  <th className="p-3.5">{isRtl ? 'المخزون' : 'Stock'}</th>
                  <th className="p-3.5 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {deletedProducts.length > 0 ? (
                  deletedProducts.map((product) => {
                    const displayName = isRtl 
                      ? (product.nameAr || product.name || '') 
                      : (product.nameEn || product.name || '');
                    const displayDesc = isRtl 
                      ? (product.descriptionAr || product.description || '') 
                      : (product.descriptionEn || product.description || '');

                    return (
                      <tr key={product.id} className="hover:bg-white/5 transition opacity-80 hover:opacity-100">
                        <td className="p-3.5 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-sm overflow-hidden bg-black/50 border border-white/10 shrink-0">
                            {product.image ? (
                              <img src={product.image} alt={displayName} className="w-full h-full object-cover grayscale" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">Img</div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{displayName}</span>
                            {displayDesc && (
                              <span className="text-[10px] text-gray-400 truncate block max-w-xs">{displayDesc}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-gray-400 font-mono">
                          {categories.find(c => c.id === product.category)?.titleAr || 
                           categories.find(c => c.id === product.category)?.titleEn || 
                           product.category}
                        </td>
                        <td className="p-3.5 text-gray-300 font-bold">{product.price} {isRtl ? 'د.م' : 'MAD'}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            {product.stock ?? 1}
                          </span>
                        </td>
                        <td className="p-3.5 text-center space-x-2">
                          <button
                            onClick={() => handleRestoreProduct(product)}
                            className="text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded-xs transition cursor-pointer"
                            title={isRtl ? 'استعادة المنتج' : 'Restore Product'}
                          >
                            <i className="fa-solid fa-rotate-left text-xs"></i>
                          </button>
                          <button
                            onClick={() => handlePermanentDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-xs transition cursor-pointer"
                            title={isRtl ? 'حذف نهائي' : 'Delete Permanently'}
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-12 text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <i className="fa-solid fa-box-open text-3xl text-gray-600 mb-2"></i>
                        <span>{isRtl ? 'سلة المنتجات فارغة' : 'Products trash is empty'}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab Content */}
      {activeTab === 'categories' && (
        <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[11px] text-[#D4AF37] uppercase tracking-wider">
                  <th className="p-3.5">{isRtl ? 'الصورة' : 'Image'}</th>
                  <th className="p-3.5">{isRtl ? 'معرف التصنيف (ID)' : 'Category ID'}</th>
                  <th className="p-3.5">{isRtl ? 'اسم التصنيف' : 'Category Name'}</th>
                  <th className="p-3.5 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {deletedCategories.length > 0 ? (
                  deletedCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-white/5 transition opacity-80 hover:opacity-100">
                      <td className="p-3.5">
                        <div className="w-9 h-9 rounded-sm overflow-hidden bg-black/50 border border-white/10">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.titleAr} className="w-full h-full object-cover grayscale" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">Img</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[#F3E5AB]">{cat.id}</td>
                      <td className="p-3.5 font-bold text-white">
                        <div>{cat.titleAr || cat.title}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{cat.titleEn || cat.title}</div>
                      </td>
                      <td className="p-3.5 text-center space-x-2">
                        <button
                          onClick={() => handleRestoreCategory(cat)}
                          className="text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded-xs transition cursor-pointer"
                          title={isRtl ? 'استعادة التصنيف' : 'Restore Category'}
                        >
                          <i className="fa-solid fa-rotate-left text-xs"></i>
                        </button>
                        <button
                          onClick={() => handlePermanentDeleteCategory(cat.id)}
                          className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-xs transition cursor-pointer"
                          title={isRtl ? 'حذف نهائي' : 'Delete Permanently'}
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-12 text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <i className="fa-solid fa-folder-open text-3xl text-gray-600 mb-2"></i>
                        <span>{isRtl ? 'سلة التصنيفات فارغة' : 'Categories trash is empty'}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}