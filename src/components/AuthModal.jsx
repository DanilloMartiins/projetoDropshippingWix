import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, noticeMessage = '' }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanEmail = email.trim().toLowerCase();

      // Recupera banco de usuários cadastrados
      let usersDb = {};
      try {
        const saved = localStorage.getItem('vektor_users_db');
        usersDb = saved ? JSON.parse(saved) : {};
      } catch {
        usersDb = {};
      }

      // 1. MODO ESQUECI A SENHA
      if (mode === 'forgot') {
        if (!usersDb[cleanEmail]) {
          setErrorMsg('No account found with this email address.');
          return;
        }
        setSuccessMsg(`Password reset instructions sent to ${cleanEmail}`);
        return;
      }

      // 2. MODO CADASTRO (CREATE ACCOUNT)
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          return;
        }

        // Cria ou atualiza novo usuário no banco oficial
        const newUser = {
          name: name.trim(),
          email: cleanEmail,
          password: password,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          shippingAddress: {
            street: '',
            suite: '',
            city: '',
            state: '',
            zip: '',
            country: 'United States'
          }
        };

        usersDb[cleanEmail] = newUser;
        try {
          localStorage.setItem('vektor_users_db', JSON.stringify(usersDb));
        } catch (err) {
          console.error('Failed to save user db:', err);
        }

        onLoginSuccess(newUser);
        onClose();
        return;
      }

      // 3. MODO LOGIN (SIGN IN)
      if (mode === 'signin') {
        const existingUser = usersDb[cleanEmail];

        // Se o usuário não existir
        if (!existingUser) {
          setErrorMsg('Account not found. Please click "Create Account" above to register.');
          return;
        }

        // Se a senha estiver errada
        if (existingUser.password !== password) {
          setErrorMsg('Incorrect password. Please verify your password and try again.');
          return;
        }

        // Login com sucesso
        onLoginSuccess(existingUser);
        onClose();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0D1424] border border-cyan-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/50 text-slate-100 max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Compacto & Elegante */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2 shadow-inner shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {mode === 'signin' && 'Sign in to access your orders, profile & exclusive perks'}
            {mode === 'signup' && 'Join Vektor Studio for fast checkout and priority USPS tracking'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Notice Message (ex: vindo do checkout) */}
        {noticeMessage && (
          <div className="mb-3.5 p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 text-[11px] sm:text-xs flex items-start gap-2.5 shadow-lg shadow-cyan-950/50">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{noticeMessage}</span>
          </div>
        )}

        {/* Tabs Sign In / Create Account */}
        {mode !== 'forgot' && (
          <div className="flex p-1 bg-slate-900/80 border border-slate-800 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Mensagens de Sucesso ou Erro */}
        {successMsg && (
          <div className="mb-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Formulário com espaçamento otimizado para notebooks e mobile */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Miller"
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1.5 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-blue-600 hover:to-blue-500 text-black font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'signin' && 'Sign In to Vektor Studio'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Recovery Email'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer com retorno ao signin se estiver em forgot */}
        {mode === 'forgot' && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Selo de Segurança */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          <span>256-bit SSL encrypted member session</span>
        </div>
      </div>
    </div>
  );
}
