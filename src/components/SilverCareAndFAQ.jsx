import React, { useState } from 'react';

export default function SilverCareAndFAQ({ currentLang }) {
  const isRtl = currentLang === 'ar';
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // نصائح العناية بالفضة
  const careTips = [
    {
      icon: 'fa-spray-can-sparkles',
      title: isRtl ? 'تجنب العطور والكيماويات' : 'Avoid Direct Perfumes',
      desc: isRtl 
        ? 'رش العطور أو المواد الكيميائية مباشرة على الفضة يسرّع عملية الأكسدة. ارتَدِ مجوهراتك دائماً كخطوة أخيرة.'
        : 'Chemicals and perfumes accelerate oxidation. Always put on your silver jewelry last.'
    },
    {
      icon: 'fa-box-archive',
      title: isRtl ? 'التخزين المخصص' : 'Proper Storage',
      desc: isRtl 
        ? 'احفظ القطع في علبتها المخملية أو أكياس محكمة الإغلاق لمنع تعرضها المستمر للرطوبة والهواء.'
        : 'Keep pieces in air-tight velvet pouches or original boxes to shield them from moisture.'
    },
    {
      icon: 'fa-wand-magic-sparkles',
      title: isRtl ? 'التلميع الدوري' : 'Regular Polishing',
      desc: isRtl 
        ? 'استخدم قطعة قماش ناعمة (Microfiber) مخصصة للفضة لاستعادة بريقها ولمعانها الأصلي بسهولة.'
        : 'Use a soft microfiber polishing cloth to restore its original luster gently without scratching.'
    },
    {
      icon: 'fa-shield-halved',
      title: isRtl ? 'الارتداء المستمر' : 'Wear It Often',
      desc: isRtl 
        ? 'الزيوت الطبيعية في بشرتك تساعد في حماية الفضة وتأخير أكسدتها أثناء الارتداء اليومي.'
        : 'Natural skin oils help prevent tarnish, keeping your 925 silver glowing with daily wear.'
    }
  ];

  // الأسئلة الشائعة
  const faqs = [
    {
      q: isRtl ? 'هل جميع القطع مصنوعة من الفضة الإسترلينية 925 الأصلية؟' : 'Are all pieces made of authentic 925 Sterling Silver?',
      a: isRtl 
        ? 'نعم، جميع مجوهراتنا مصنوعة 100% من الفضة الإسترلينية المعيارية 925 ومختومة بطابع الأصالة (Stamp 925)، مع ضمان الأصالة وعدم تغير جودة المعدن.'
        : 'Yes, 100% of our collection is crafted from genuine 925 sterling silver, stamped for authenticity, and backed by our quality guarantee.'
    },
    {
      q: isRtl ? 'كم يستغرق التوصيل وما هي التكلفة؟' : 'How long does delivery take and how much does it cost?',
      a: isRtl 
        ? 'يستغرق التوصيل عادةً من 24 إلى 48 ساعة للدن الكبرى، ومن 2 إلى 4 أيام لباقي المناطق. يتصل بك المندوب قبل التسليم لتأكيد المكان والوقت.'
        : 'Delivery takes 24-48 hours for major cities and 2-4 business days nationwide. Our courier will contact you prior to delivery.'
    },
    {
      q: isRtl ? 'ما هي طرق الدفع المتاحة لدى المتجر؟' : 'What payment options are available?',
      a: isRtl 
        ? 'نوفر خدمة الدفع عند الاستلام (Cash on Delivery) لضمان أمانك وراحتك التامة، حيث يمكنك معاينة طلبك قبل السداد للمندوب.'
        : 'We provide Cash on Delivery (COD) for maximum convenience and trust, allowing you to inspect your package before paying.'
    },
    {
      q: isRtl ? 'ماذا أفعل إذا كان مقاس الخاتم غير مناسب؟' : 'What if the ring size does not fit?',
      a: isRtl 
        ? 'نوفر خدمة استبدال المقاس بكل مرونة خلال 7 أيام من تاريخ الاستلام. كل ما عليك هو التواصل مع فريق الدعم عبر الواتساب.'
        : 'We offer hassle-free size exchanges within 7 days of delivery. Simply reach out to our WhatsApp support team.'
    }
  ];

  return (
    <section id="faq-care" className="py-20 px-6 max-w-7xl mx-auto space-y-20 border-t border-[#D4AF37]/20">
      
      {/* 1. قسم دليل العناية بالفضة */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F3E5AB] tracking-widest uppercase">
            {isRtl ? 'دليل العناية بالفضة 925' : '925 Silver Care Guide'}
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2 mb-3"></div>
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            {isRtl ? 'خطوات بسيطة للحفاظ على رونق وبريق مجوهراتك الفاخرة لسنوات طويلة' : 'Simple tips to preserve the shine and brilliance of your silver pieces for years.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {careTips.map((tip, idx) => (
            <div 
              key={idx}
              className="bg-[#121212] border border-[#D4AF37]/20 hover:border-[#D4AF37] p-6 rounded-sm text-center transition duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition duration-300">
                <i className={`fa-solid ${tip.icon} text-xl`}></i>
              </div>
              <h3 className="font-serif font-bold text-[#F3E5AB] text-sm mb-2">
                {tip.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}