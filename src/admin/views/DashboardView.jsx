import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardView({ products = [], orders = [], currentLang = 'ar' }) {
  const isRtl = currentLang === 'ar';
  
  // حالة التاريخ المختار (افتراضياً تاريخ اليوم)
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // تصفية الطلبات في حالة "مكتمل" أو "تم التسليم" حصراً
  const completedOrders = (orders || []).filter(ord => {
    const status = (ord.status || '').toLowerCase();
    return status === 'completed' || status === 'مكتمل' || status === 'delivered';
  });

  // حساب الإحصائيات العامة للطلبات المكتملة فقط
  const totalRevenue = completedOrders.reduce((sum, ord) => sum + (Number(ord.total || ord.total_price) || 0), 0);
  const avgOrderValue = completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(2) : 0;

  // تجهيز بيانات آخر 7 أيام بناءً على التاريخ المختار في التقويم
  const salesMap = {};
  const baseDate = new Date(filterDate);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', { weekday: 'short' });
    salesMap[dateString] = { label: dayName, total: 0 };
  }

  completedOrders.forEach(ord => {
    const rawDate = ord.date || ord.createdAt || ord.created_at || Date.now();
    const dateString = new Date(rawDate).toISOString().split('T')[0];
    if (salesMap[dateString]) {
      salesMap[dateString].total += Number(ord.total || ord.total_price) || 0;
    }
  });

  const chartLabels = Object.values(salesMap).map(item => item.label);
  const chartValues = Object.values(salesMap).map(item => item.total);

  // ترتيب المنتجات للأرباح المكتملة
  const productSalesMap = {};
  completedOrders.forEach(ord => {
    const items = ord.items || ord.order_items || [];
    if (Array.isArray(items)) {
      items.forEach(item => {
        const name = item.name || (isRtl ? 'منتج مميز' : 'Featured Product');
        productSalesMap[name] = (productSalesMap[name] || 0) + (Number(item.price || 0) * (item.quantity || 1));
      });
    }
  });

  const rankings = Object.keys(productSalesMap).length > 0 
    ? Object.keys(productSalesMap).map(name => ({ name, total: productSalesMap[name] })).sort((a, b) => b.total - a.total)
    : (products || []).slice(0, 5).map((p, idx) => ({ name: p.name || `Product #${idx + 1}`, total: 0 }));

  // إعدادات مبيان Chart.js مع الهوية الذهبية
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: isRtl ? 'أرباح الطلبات المكتملة' : 'Completed Revenue',
        data: chartValues,
        backgroundColor: '#D4AF37',
        hoverBackgroundColor: '#F3E5AB',
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#121212',
        titleColor: '#F3E5AB',
        bodyColor: '#ffffff',
        borderColor: '#D4AF37',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` ${isRtl ? 'الربح' : 'Profit'}: $${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(212, 175, 55, 0.15)' },
        ticks: { color: '#F3E5AB', font: { size: 11 }, callback: (val) => `$${val}` },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#F3E5AB', font: { size: 11, weight: '600' } },
      },
    },
  };

  return (
    <div className="space-y-6 bg-[#0a0a0a] min-h-screen p-4 sm:p-6 text-gray-100 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#D4AF37]/20 pb-4 gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F3E5AB] tracking-wide">
            {isRtl ? 'لوحة التحكم • Sharp Edge Studio' : 'Dashboard Overview • Sharp Edge Studio'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'متابعة الأرباح والطلبات المكتملة حصراً بتصميم فاخر وعصري' : 'Completed orders financial tracking'}
          </p>
        </div>
        <div className="bg-[#121212] border border-[#D4AF37]/40 px-4 py-1.5 rounded text-xs text-[#F3E5AB] shadow-md">
          {isRtl ? '⚡ وضع الطلبات المكتملة فقط' : '⚡ Completed Orders Only'}
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121212] border border-[#D4AF37]/40 p-5 rounded-lg relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#F3E5AB] to-[#D4AF37]"></div>
          <span className="text-xs text-gray-400 font-medium">{isRtl ? 'أرباح الطلبات المكتملة' : 'Completed Revenue'}</span>
          <h3 className="text-3xl font-black text-[#F3E5AB] mt-2">${totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-[#121212] border border-white/10 p-5 rounded-lg shadow-lg">
          <span className="text-xs text-gray-400 font-medium">{isRtl ? 'إجمالي الطلبات المكتملة' : 'Completed Orders Count'}</span>
          <h3 className="text-3xl font-black text-white mt-2">{completedOrders.length}</h3>
        </div>

        <div className="bg-[#121212] border border-[#D4AF37]/30 p-5 rounded-lg shadow-lg">
          <span className="text-xs text-gray-400 font-medium">{isRtl ? 'متوسط قيمة الطلب' : 'Average Order Value'}</span>
          <h3 className="text-3xl font-black text-[#D4AF37] mt-2">${avgOrderValue}</h3>
        </div>
      </div>

      {/* قسم المبيان وترتيب المنتجات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* اليسار: المبيان البياني المنظم */}
        <div className="lg:col-span-2 bg-[#121212] border border-[#D4AF37]/30 p-6 rounded-lg shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2 flex-wrap">
            <div>
              <h2 className="text-base font-bold text-[#F3E5AB]">
                {isRtl ? 'أرباح الأسبوع (للطلبات المكتملة فقط)' : 'Weekly Profit Trend'}
              </h2>
              <p className="text-[11px] text-gray-400">
                {isRtl ? 'المحور الأيسر يعرض الأرباح • المحور السفلي يعرض الأيام' : 'Y-axis shows profit, X-axis shows weekdays'}
              </p>
            </div>
            
            {/* فلتر التقويم (Date Picker) مع تفعيل الوضع الداكن للإيقونات */}
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="bg-[#1a1a1a] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs px-3 py-1.5 rounded outline-none cursor-pointer focus:border-[#D4AF37] shadow-md font-mono"
            />
          </div>

          <div className="h-72 w-full pt-2">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* اليمين: ترتيب أرباح المنتجات */}
        <div className="bg-[#121212] border border-[#D4AF37]/30 p-5 rounded-lg shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#F3E5AB] border-b border-white/10 pb-3">
            {isRtl ? 'ترتيب أرباح المنتجات' : 'Sales Ranking'}
          </h3>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {rankings.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                {isRtl ? 'لا توجد طلبات مكتملة مسجلة حالياً' : 'No completed orders found'}
              </div>
            ) : (
              rankings.slice(0, 6).map((rankItem, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2.5 border-b border-white/5 last:border-none">
                  <div className="flex items-center gap-3 truncate">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      idx === 0 ? 'bg-[#D4AF37] text-black' : 
                      idx === 1 ? 'bg-[#F3E5AB]/80 text-black' : 
                      'bg-white/10 text-[#F3E5AB]'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-gray-200 truncate max-w-[140px]" title={rankItem.name}>
                      {rankItem.name}
                    </span>
                  </div>
                  <span className="font-bold text-[#F3E5AB]">
                    ${rankItem.total.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}