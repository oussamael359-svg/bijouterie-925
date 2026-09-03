import React, { useState } from 'react';

export default function ProductsView({ products, setProducts, currentLang }) {
  const isRtl = currentLang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');

  // تصفية المنتجات بناءً على البحث
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // دالة حذف المنتج
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* عنوان القسم */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F3E5AB]">
            {isRtl ? '3. إدارة المنتجات' : 'Products Management'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'إدارة وتعديل منتجات المتجر وحالة المخزون' : 'Manage store products and stock status'}
          </p>
        </div>
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
                    <td className="p-3.5 text-gray-300">{product.category}</td>
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
    </div>
  );
}