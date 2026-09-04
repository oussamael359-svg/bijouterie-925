import React, { useState } from 'react';

export default function AdminLogin({ onLogin, currentLang }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const isAr = currentLang === 'ar';

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-[#141414] border border-amber-500/20 rounded-lg p-8 shadow-2xl relative overflow-hidden">
        {/* خط ذهبي فاخر يعكس هوية المجوهرات */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-amber-200 mb-2 tracking-wider">
            {isAr ? 'إدارة متجر المجوهرات' : 'Jewelry Store Admin'}
          </h2>
          <p className="text-gray-400 text-xs tracking-wide">
            {isAr ? 'تسجيل الدخول للوحة التحكم الفاخرة' : 'Sign in to the management dashboard'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 mb-2">
              {isAr ? 'اسم المستخدم' : 'Username'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(false); }}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              placeholder={isAr ? 'أدخل اسم المستخدم' : 'Enter username'}
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-300 mb-2">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter password'}
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center bg-red-500/10 py-2.5 rounded border border-red-500/20">
              {isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password'}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-200 text-black font-medium py-3 rounded hover:bg-amber-300 transition-colors duration-200 text-sm tracking-wider uppercase"
          >
            {isAr ? 'تسجيل الدخول' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}