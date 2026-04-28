import React, { useState, useEffect } from 'react';
import { Shield, Lock, Mail, ArrowRight, Activity, Fingerprint, Info } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // FUNGSI SAKTI: AUTO TYPING EFFECT
  const handleUseDemo = () => {
    if (isTyping) return;
    setIsTyping(true);
    setError('');
    
    const targetEmail = 'admin@demo.com';
    const targetPass = 'admin123';
    
    // Reset fields dulu biar dramatis
    setEmail('');
    setPassword('');

    let emailIdx = 0;
    let passIdx = 0;

    // Ketik Email dulu
    const emailInterval = setInterval(() => {
      setEmail(targetEmail.slice(0, emailIdx + 1));
      emailIdx++;
      if (emailIdx >= targetEmail.length) {
        clearInterval(emailInterval);
        
        // Jeda sebentar sebelum ketik password
        setTimeout(() => {
          const passInterval = setInterval(() => {
            setPassword(targetPass.slice(0, passIdx + 1));
            passIdx++;
            if (passIdx >= targetPass.length) {
              clearInterval(passInterval);
              setIsTyping(false);
            }
          }, 50); // Kecepatan ketik password
        }, 300);
      }
    }, 50); // Kecepatan ketik email
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isTyping) return;
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === 'admin@demo.com' && password === 'admin123') {
        onLogin(); 
      } else {
        setError('Kredensial tidak valid. Gunakan akun demo di bawah.');
        setIsLoading(false);
      }
    }, 1200); 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-500">
      
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 dark:bg-blue-600/20 blur-[120px] rounded-full transition-colors duration-500"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 dark:bg-indigo-600/20 blur-[120px] rounded-full transition-colors duration-500"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-500/20 ring-4 ring-white dark:ring-[#121214]">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">OpsInsight<span className="text-blue-600"> AI</span></h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-2 font-medium">AI-Powered Operational Intelligence</p>
        </div>

        <div className="bg-white dark:bg-[#121214] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl border border-slate-100 dark:border-zinc-800/60 overflow-hidden transition-colors duration-500">
          <div className="p-8 md:p-10">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <div className="bg-red-50 dark:bg-rose-500/10 border border-red-100 dark:border-rose-500/30 text-red-600 dark:text-rose-400 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
                  <Info size={14} /> {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wider">Work Email</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                    disabled={isTyping}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 disabled:opacity-80"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wider">Password</label>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    disabled={isTyping}
                    className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 disabled:opacity-80"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading || isTyping}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Sign In to Dashboard <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-zinc-800/60">
              <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-5 border border-slate-100 dark:border-zinc-800 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={16} className="text-blue-600" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-tight">Demo Account</span>
                  </div>
                  <button 
                    onClick={handleUseDemo}
                    disabled={isTyping}
                    className={`relative text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border shadow-sm ${
                      isTyping 
                      ? 'bg-slate-200 text-slate-400 border-slate-300' 
                      : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 animate-pulse'
                    }`}
                  >
                    {isTyping ? 'TYPING...' : 'USE DEMO'}
                  </button>
                </div>
                <div className="space-y-1.5 relative z-10">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-zinc-400">Email:</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-mono font-medium">admin@demo.com</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-zinc-400">Password:</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-mono font-medium">admin123</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-400 dark:text-zinc-500 mt-4 leading-relaxed italic">
                "For demonstration purposes, click the pulse button to auto-fill."
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 dark:text-zinc-500 mt-8 font-bold uppercase tracking-[0.2em]">
          &copy; 2026 OpsInsight AI Intelligence
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
}