import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

const StoreIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </svg>
);

const LockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        let msg = 'Erro ao autenticar. Verifique suas credenciais.';
        try {
          const errData = await res.json();
          if (errData?.error) {
            msg = errData.error;
          }
        } catch (e) {}
        setError(msg);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const token = data.accessToken || data.token;
      if (token) {
        localStorage.setItem('gestormercado_token', token);
        onLoginSuccess(token);
      } else {
        setError('Token de autenticação não retornado pelo servidor.');
      }
    } catch (err) {
      console.error('Erro na requisição de login:', err);
      setError('Não foi possível conectar ao servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f0d] text-white flex flex-col justify-between font-['Inter'] antialiased selection:bg-[#4ade80] selection:text-[#14532d] relative overflow-hidden">
      {/* Glow Effects de Fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4ade80]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#14532d]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Header com Logo */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-6 relative z-10">
        <a href="/" className="flex items-center gap-2.5 text-white no-underline group">
          <div className="w-10 h-10 rounded-xl bg-[#14532d] border border-[#4ade80]/50 flex items-center justify-center shadow-md shadow-[#4ade80]/10 transition-transform group-hover:scale-105">
            <StoreIcon className="w-5 h-5 text-[#4ade80]" />
          </div>
          <span className="font-['Manrope'] font-extrabold text-xl text-white">
            GestorMercado
          </span>
        </a>
        <a
          href="/"
          className="font-['Cabin'] text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          ← Voltar à Home
        </a>
      </header>

      {/* Card de Login Centralizado */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#14532d] border border-[#4ade80]/40 flex items-center justify-center mb-4 shadow-lg shadow-[#4ade80]/10">
              <LockIcon className="w-7 h-7 text-[#4ade80]" />
            </div>
            <h1 className="font-['Instrument_Serif'] text-3xl sm:text-4xl text-white leading-tight">
              Acesse seu Painel
            </h1>
            <p className="font-['Inter'] text-sm text-neutral-400 mt-1">
              Entre com sua conta de administrador do mercadinho
            </p>
          </div>

          {/* Alerta de Erro */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-['Manrope'] font-semibold text-neutral-300 mb-1.5">
                E-mail de Acesso
              </label>
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#4ade80] text-sm transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-['Manrope'] font-semibold text-neutral-300">
                  Senha
                </label>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#4ade80] text-sm transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-bold text-base hover:bg-[#3ec972] transition-all duration-200 shadow-xl shadow-[#4ade80]/20 active:scale-95 disabled:opacity-50 cursor-pointer text-center"
            >
              {loading ? 'Entrando com segurança...' : 'Entrar no Dashboard'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-neutral-600 relative z-10">
        GestorMercado © {new Date().getFullYear()} — Sistema seguro de gestão de mercadinhos
      </footer>
    </div>
  );
}
