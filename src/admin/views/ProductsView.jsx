import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';

export default function ProductsView({ 
  products, 
  setProducts, 
  categories = [], 
  attributes = [], // 1. استقبال قائمة المقاسات والخصائص
  currentLang,
  deletedProducts = [],
  setDeletedProducts 
}) {
  const isRtl = currentLang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    category: '',
    price: '',
    stock: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
    sizes: [] // 2. إضافة حقل المقاسات للحالة الأولية
  });

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: categories[0].id
      }));
    }
  }, [categories, isModalOpen]);

  const filteredProducts = products.filter(p => {
    const fullName = `${p.nameAr || p.name || ''} ${p.nameEn || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      image: '',
      sizes: [] // تصفير المقاسات عند الإضافة
    });
    setIsModalOpen(true);
  };

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
      image: product.image || '',
      sizes: product.sizes || [] // جلب المقاسات المحفوظة مسبقاً للمنتج
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.nameAr.trim() && !formData.nameEn.trim()) return;

    if (editingProduct) {
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
            image: formData.image.trim() || 'https://via.placeholder.com/150',
            sizes: formData.sizes || [] // حفظ المقاسات المحددة
          };
        }
        return p;
      }));
    } else {
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
        image: formData.image.trim() || 'https://via.placeholder.com/150',
        sizes: formData.sizes || [] // حفظ المقاسات المحددة
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
      image: '',
      sizes: []
    });
  };

  const handleDelete = (product) => {
    setProducts(products.filter(p => p.id !== product.id));
    if (setDeletedProducts) {
      setDeletedProducts(prev => [product, ...prev]);
    }
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

      {/* شريط البحث وتفلترت المنتجات حسب التصنيف */}
      <div className="bg-[#121212] border border-white/10 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder={isRtl ? 'بحث عن منتج...' : 'Search products...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/50 border border-white/15 text-white text-xs px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] w-full sm:w-64"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/50 border border-white/15 text-white text-xs px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] w-full sm:w-48 cursor-pointer"
          >
            <option value="all">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#121212] text-white">
                {isRtl ? (cat.titleAr || cat.title || cat.name || cat.id) : (cat.titleEn || cat.title || cat.name || cat.id)}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-gray-400 self-end sm:self-center">
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
                      <td className="p-3.5 text-[#D4AF37] font-bold">{product.price} {isRtl ? 'د.م' : 'MAD'}</td>
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
                          onClick={() => handleOpenEditModal(product)}
                          className="text-[#D4AF37] hover:text-[#c19d30] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 p-1.5 rounded-xs transition cursor-pointer"
                          title={isRtl ? 'تعديل' : 'Edit'}
                        >
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
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
                    {isRtl ? 'لا توجد منتجات مطابقة للبحث أو التصنيف' : 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* استدعاء نموذج الفورم مع تمرير الـ attributes */}
      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        formData={formData}
        setFormData={setFormData}
        editingProduct={editingProduct}
        categories={categories}
        attributes={attributes} 
        currentLang={currentLang}
        onImageChange={handleImageFileChange}
      />
    </div>
  );
}