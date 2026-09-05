import React from 'react';

export default function TrashView({ 
  deletedProducts = [], 
  setDeletedProducts, 
  products, 
  setProducts, 
  categories = [], 
  currentLang 
}) {
  const isRtl = currentLang === 'ar';

  const handleRestore = (product) => {
    setDeletedProducts(deletedProducts.filter(p => p.id !== product.id));
    setProducts([product, ...products]);
  };

  const handlePermanentDelete = (id) => {
    setDeletedProducts(deletedProducts.filter(p => p.id !== id));
  };

  const handleEmptyTrash = () => {
    setDeletedProducts([]);
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB]">
            {isRtl ? 'سلة المهملات' : 'Trash'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'المنتجات المحذوفة (يمكنك استعادتها أو حذفها نهائياً)' : 'Deleted products (you can restore or permanently delete them)'}
          </p>
        </div>
        
        {deletedProducts.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold px-4 py-2.5 rounded-sm transition flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-trash-arrow-up text-xs"></i>
            {isRtl ? 'إفراغ سلة المهملات' : 'Empty Trash'}
          </button>
        )}
      </div>

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
                        <img 
                          src={product.image || 'https://via.placeholder.com/40'} 
                          alt={displayName} 
                          className="w-9 h-9 object-cover rounded-sm border border-white/10 grayscale"
                        />
                        <div>
                          <span className="font-bold text-white block">{displayName}</span>
                          {displayDesc && (
                            <span className="text-[10px] text-gray-400 truncate block max-w-xs">{displayDesc}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-400">
                        {categories.find(c => c.id === product.category)?.titleAr || 
                         categories.find(c => c.id === product.category)?.name || 
                         product.category}
                      </td>
                      <td className="p-3.5 text-gray-400 font-bold">{product.price} {isRtl ? 'د.م' : 'MAD'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          {product.stock ?? 1}
                        </span>
                      </td>
                      <td className="p-3.5 text-center space-x-2">
                        <button
                          onClick={() => handleRestore(product)}
                          className="text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded-xs transition cursor-pointer"
                          title={isRtl ? 'استعادة المنتج' : 'Restore Product'}
                        >
                          <i className="fa-solid fa-rotate-left text-xs"></i>
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(product.id)}
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
                      <i className="fa-solid fa-trash-can text-3xl text-gray-600 mb-2"></i>
                      <span>{isRtl ? 'سلة المهملات فارغة' : 'Trash is empty'}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}