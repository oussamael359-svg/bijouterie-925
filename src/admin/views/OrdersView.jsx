import React from 'react';

export default function AdminOrders({ orders, setOrders, currentLang }) {
  const isRtl = currentLang === 'ar';

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  return (
    <div className="p-6 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-serif font-bold text-[#F3E5AB] mb-6">
        {isRtl ? 'إدارة الطلبات والتحويلات البنكية' : 'Manage Orders & Bank Transfers'}
      </h2>

      {(!orders || orders.length === 0) ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-sm text-center text-gray-400 text-sm">
          {isRtl ? 'لا توجد طلبات جديدة حتى الآن.' : 'No orders received yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-[#0F0F0F] border border-[#D4AF37]/30 p-5 rounded-sm shadow-xl space-y-4">
              
              {/* رأس الطلب: الرقم والحالة */}
              <div className="flex flex-wrap justify-between items-center border-b border-white/10 pb-3 gap-2">
                <div>
                  <span className="text-[#D4AF37] font-bold font-mono text-sm">{order.id}</span>
                  <span className="text-xs text-gray-400 mx-3">{order.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs rounded-sm font-semibold ${
                    order.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {order.status === 'completed' ? (isRtl ? 'مكتمل ومؤكد' : 'Completed') : (isRtl ? 'قيد الانتظار' : 'Pending')}
                  </span>
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="text-red-400 hover:text-red-300 text-xs cursor-pointer p-1"
                    title={isRtl ? 'حذف الطلب' : 'Delete order'}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

              {/* بيانات العميل ومعلومات التحويل */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="space-y-1.5 bg-black/40 p-3 rounded-sm border border-white/5">
                  <p><strong className="text-gray-400">{isRtl ? 'العميل:' : 'Customer:'}</strong> <span className="text-white font-medium">{order.customer}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'الهاتف:' : 'Phone:'}</strong> <span className="text-white font-mono" dir="ltr">{order.phone}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'العنوان:' : 'Address:'}</strong> <span className="text-white">{order.address}</span></p>
                </div>

                <div className="space-y-1.5 bg-black/40 p-3 rounded-sm border border-white/5">
                  <p><strong className="text-gray-400">{isRtl ? 'طريقة الدفع:' : 'Payment:'}</strong> <span className="text-white">{order.paymentMethod}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'مرجع التحويل / المُحوِّل:' : 'Bank Reference:'}</strong> <span className="text-[#D4AF37] font-bold">{order.bankReference}</span></p>
                  <p><strong className="text-gray-400">{isRtl ? 'المجموع الكلي:' : 'Total:'}</strong> <span className="text-[#D4AF37] font-bold text-sm">{order.total} MAD</span></p>
                </div>
              </div>

              {/* المنتجات المطلوبة */}
              <div>
                <p className="text-xs text-gray-400 mb-2 font-semibold">{isRtl ? 'المنتجات المطلوبة:' : 'Ordered Items:'}</p>
                <div className="space-y-1 bg-black/50 p-2.5 rounded-sm border border-white/10 text-xs">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-300 border-b border-white/5 last:border-0 pb-1.5 last:pb-0">
                      <span>{item.name} {item.selectedSize && `(${item.selectedSize})`} × {item.quantity}</span>
                      <span className="font-mono text-[#D4AF37]">{item.price * item.quantity} MAD</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* أزرار التحكم في حالة الطلب */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                {order.status !== 'completed' ? (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-sm text-xs font-bold transition duration-200 cursor-pointer shadow"
                  >
                    {isRtl ? '✓ تأكيد التحويل وتغيير إلى مكتمل' : 'Mark as Completed'}
                  </button>
                ) : (
                  <button 
                    onClick={() => updateOrderStatus(order.id, 'pending')}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-sm text-xs font-bold transition duration-200 cursor-pointer shadow"
                  >
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