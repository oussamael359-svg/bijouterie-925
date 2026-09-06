import React, { useState } from 'react';

export default function AdminOrders({ orders, setOrders, products, setProducts, currentLang }) {
  const isRtl = currentLang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'

  const updateOrderStatus = (orderId, newStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    // خصم الكميات من المخزون عند تحويل الحالة إلى مكتمل لأول مرة
    if (newStatus === 'completed' && targetOrder.status !== 'completed' && setProducts) {
      setProducts(prevProducts => {
        return prevProducts.map(product => {
          const orderedItem = targetOrder.items?.find(item => item.id === product.id);
          if (orderedItem) {
            const currentStock = product.stock ?? 1;
            const newStock = Math.max(0, currentStock - (orderedItem.quantity || 1));
            return { ...product, stock: newStock };
          }
          return product;
        });
      });
    }

    // تحديث حالة الطلب
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  // فلترة الطلبات حسب البحث والحالة
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phone && order.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="p-6 text-white space-y-6 overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <style>{`
        /* تخصيص شريط التمرير ليطابق الهوية البصرية الفاخرة */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #090909;
        }
        ::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #F3E5AB;
        }
      `}</style>
      
      {/* عنوان الصفحة وعدد النتائج */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#F3E5AB]">
            {isRtl ? 'إدارة الطلبات والتحويلات البنكية' : 'Manage Orders & Bank Transfers'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'متابعة طلبات العملاء وحالة التحويلات البنكية بدقة' : 'Track customer orders and bank transfer statuses'}
          </p>
        </div>
        <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-3.5 py-1.5 rounded-sm text-xs border border-[#D4AF37]/30 shadow font-sans">
          {isRtl ? `النتائج: ${filteredOrders.length} (من أصل ${orders?.length || 0})` : `Results: ${filteredOrders.length} (of ${orders?.length || 0})`}
        </div>
      </div>

      {/* مربع البحث والفلتر في الأعلى */}
      <div className="bg-[#121212] border border-[#D4AF37]/30 p-4 rounded-sm shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96 relative">
          <span className={`absolute inset-y-0 ${isRtl ? 'right-3' : 'left-3'} flex items-center pointer-events-none text-gray-400`}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث برقم الطلب، اسم العميل، أو الهاتف...' : 'Search by order ID, customer name, or phone...'}
            className={`w-full bg-[#0F0F0F] border border-white/10 rounded-sm py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 bg-[#0F0F0F] border border-white/10 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition cursor-pointer"
          >
            <option value="all">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="pending">{isRtl ? 'قيد الانتظار' : 'Pending'}</option>
            <option value="completed">{isRtl ? 'مكتمل ومؤكد' : 'Completed'}</option>
          </select>
        </div>
      </div>

      {/* قائمة الطلبات */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#121212] border border-[#D4AF37]/20 p-12 rounded-sm text-center text-gray-400 text-sm shadow-xl">
          <i className="fa-solid fa-box-open text-4xl mb-3 text-[#D4AF37]/50"></i>
          <p>{isRtl ? 'لا توجد طلبات تطابق بحثك.' : 'No matching orders found.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-[#121212] border border-[#D4AF37]/30 p-5 rounded-sm shadow-2xl space-y-4 relative overflow-hidden">
              
              {/* شريط جمالي في الجانب */}
              <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} w-1 h-full ${order.status === 'completed' ? 'bg-emerald-500' : 'bg-[#D4AF37]'}`}></div>

              {/* رأس الطلب: الرقم والحالة */}
              <div className="flex flex-wrap justify-between items-center border-b border-white/10 pb-3 gap-2">
                <div>
                  <span className="text-[#D4AF37] font-bold font-mono text-sm tracking-wide">{order.id}</span>
                  <span className="text-xs text-gray-400 mx-3"><i className="fa-regular fa-clock mr-1"></i>{order.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs rounded-sm font-semibold tracking-wide ${
                    order.status === 'completed' 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {order.status === 'completed' ? (isRtl ? '✓ مكتمل وتم التوصيل' : 'Completed / Delivered') : (isRtl ? '⏳ قيد الانتظار' : 'Pending')}
                  </span>
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="text-red-400 hover:text-red-300 text-xs cursor-pointer p-1.5 bg-red-500/10 border border-red-500/20 rounded-sm transition"
                    title={isRtl ? 'حذف الطلب' : 'Delete order'}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

              {/* بيانات العميل ومعلومات التحويل */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="space-y-2 bg-black/40 p-3.5 rounded-sm border border-white/5">
                  <p className="text-[#F3E5AB] font-semibold border-b border-white/5 pb-1 mb-1.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-user-tie text-[#D4AF37]"></i> {isRtl ? 'معلومات العميل' : 'Customer Info'}
                  </p>
                  <p><strong className="text-gray-400">{isRtl ? 'الاسم:' : 'Name:'}</strong> <span className="text-white font-medium">{order.customer}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'الهاتف:' : 'Phone:'}</strong> <span className="text-white font-mono" dir="ltr">{order.phone}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'العنوان:' : 'Address:'}</strong> <span className="text-white">{order.address}</span></p>
                </div>

                <div className="space-y-2 bg-black/40 p-3.5 rounded-sm border border-white/5">
                  <p className="text-[#F3E5AB] font-semibold border-b border-white/5 pb-1 mb-1.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-credit-card text-[#D4AF37]"></i> {isRtl ? 'تفاصيل الدفع' : 'Payment Details'}
                  </p>
                  <p><strong className="text-gray-400">{isRtl ? 'طريقة الدفع:' : 'Payment Method:'}</strong> <span className="text-white">{order.paymentMethod}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'مرجع التحويل (CIH):' : 'Bank Reference:'}</strong> <span className="text-[#D4AF37] font-bold font-mono bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">{order.bankReference}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'المجموع الكلي:' : 'Total:'}</strong> <span className="text-[#D4AF37] font-bold text-sm font-mono">{order.total} د.م.</span></p>
                </div>
              </div>

              {/* المنتجات المطلوبة */}
              <div>
                <p className="text-xs text-[#F3E5AB] mb-2 font-semibold flex items-center gap-1.5">
                  <i className="fa-solid fa-bag-shopping text-[#D4AF37]"></i> {isRtl ? 'المنتجات المطلوبة:' : 'Ordered Items:'}
                </p>
                <div className="space-y-1.5 bg-black/50 p-3 rounded-sm border border-white/10 text-xs">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-300 border-b border-white/5 last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center gap-2">
                        {item.image && <img src={item.image} alt="" className="w-8 h-8 object-cover rounded border border-[#D4AF37]/30" />}
                        <span>{item.name} {item.selectedSize && <span className="text-[#D4AF37]">({item.selectedSize})</span>} <span className="text-gray-400">× {item.quantity}</span></span>
                      </div>
                      <span className="font-mono text-[#D4AF37] font-bold">{item.price * item.quantity} د.م.</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* أزرار التحكم في حالة الطلب */}
              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                {order.status !== 'completed' ? (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-sm text-xs font-bold transition duration-200 cursor-pointer shadow-lg flex items-center gap-2"
                  >
                    <i className="fa-solid fa-check-circle"></i>
                    {isRtl ? 'تأكيد التوصيل (خصم من المخزون)' : 'Mark as Completed & Deduct Stock'}
                  </button>
                ) : (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'pending')}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-sm text-xs font-bold transition duration-200 cursor-pointer shadow-lg flex items-center gap-2"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    {isRtl ? 'إرجاع إلى قيد الانتظار' : 'Mark as Pending'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}