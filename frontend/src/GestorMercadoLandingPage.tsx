import React, { useState } from 'react';

// Icons implemented as clean inline SVGs
const StoreIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const BookOpenIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const PackageIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16.5 9.4 4.5-2.8a2 2 0 0 0 0-3.4L12.5 1.2a2 2 0 0 0-2 0L2 6.2a2 2 0 0 0 0 3.4l4.5 2.8" />
    <path d="M12 22.8V12" />
    <path d="m21.5 14.8-9.5 5.9-9.5-5.9" />
    <path d="M3.2 8.5 12 13l8.8-4.5" />
  </svg>
);

const TruckIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-5.5a1.5 1.5 0 0 0-.44-1.06L18.5 7.38A1.5 1.5 0 0 0 17.44 7H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function GestorMercadoLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-['Inter'] antialiased selection:bg-[#4ade80] selection:text-[#14532d] overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. SEÇÃO HERO COM VÍDEO EM TELA CHEIA (SEM OVERLAY) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Vídeo HTML5 em tela cheia de fundo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
        />

        {/* NAVBAR */}
        <header className="relative z-20 w-full flex items-center justify-between px-6 md:px-[120px] py-[16px] bg-transparent">
          {/* Logo Esquerda */}
          <a
            href="#inicio"
            className="flex items-center gap-2.5 text-white no-underline group focus:outline-none"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#14532d]/70 border border-[#4ade80]/40 backdrop-blur-sm shadow-md transition-transform group-hover:scale-105">
              <StoreIcon className="w-5 h-5 text-[#4ade80]" />
            </div>
            <span className="font-['Manrope'] font-extrabold text-xl tracking-tight text-white drop-shadow-sm">
              GestorMercado
            </span>
          </a>

          {/* Links Centro (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 font-['Manrope'] text-[15px] font-medium text-white/90">
            <a
              href="#inicio"
              className="transition-colors hover:text-[#4ade80] drop-shadow-sm"
            >
              Início
            </a>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 transition-colors hover:text-[#4ade80] drop-shadow-sm cursor-pointer focus:outline-none"
              >
                Funcionalidades
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180 text-[#4ade80]" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute top-full left-0 mt-3 w-56 p-2 rounded-xl bg-[#14532d]/90 backdrop-blur-xl border border-[#4ade80]/30 shadow-2xl z-50 flex flex-col gap-1"
                >
                  <a
                    href="#funcionalidades"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[#4ade80]/20 text-white hover:text-[#4ade80] transition-colors"
                  >
                    <BookOpenIcon className="w-4 h-4 text-[#4ade80]" />
                    Fiado Digital
                  </a>
                  <a
                    href="#funcionalidades"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[#4ade80]/20 text-white hover:text-[#4ade80] transition-colors"
                  >
                    <PackageIcon className="w-4 h-4 text-[#4ade80]" />
                    Estoque Inteligente
                  </a>
                  <a
                    href="#funcionalidades"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[#4ade80]/20 text-white hover:text-[#4ade80] transition-colors"
                  >
                    <TruckIcon className="w-4 h-4 text-[#4ade80]" />
                    Fornecedores & Entregas
                  </a>
                </div>
              )}
            </div>

            <a
              href="#como-funciona"
              className="transition-colors hover:text-[#4ade80] drop-shadow-sm"
            >
              Como funciona
            </a>
            <a
              href="#depoimentos"
              className="transition-colors hover:text-[#4ade80] drop-shadow-sm"
            >
              Depoimentos
            </a>
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#4ade80] drop-shadow-sm"
            >
              API Backend
            </a>
          </nav>

          {/* Botões Direita (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/dashboard"
              className="font-['Cabin'] font-semibold text-[15px] px-5 py-2.5 bg-white text-black border border-gray-300 rounded-[8px] hover:bg-gray-100 transition-all duration-200 shadow-sm active:scale-95 text-center"
            >
              Entrar
            </a>
            <a
              href="/dashboard"
              className="font-['Cabin'] font-bold text-[15px] px-5 py-2.5 bg-[#4ade80] text-[#14532d] rounded-[8px] hover:bg-[#3ec972] transition-all duration-200 shadow-md hover:shadow-[#4ade80]/30 active:scale-95 text-center"
            >
              Começar grátis
            </a>
          </div>

          {/* Botão Mobile (Hambúrguer) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 focus:outline-none"
            aria-label="Abrir Menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </header>

        {/* MENU MOBILE FULLSCREEN PRETO */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <StoreIcon className="w-6 h-6 text-[#4ade80]" />
                <span className="font-['Manrope'] font-bold text-xl text-white">
                  GestorMercado
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800"
                aria-label="Fechar Menu"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 font-['Manrope'] text-2xl font-bold text-neutral-200 my-auto">
              <a
                href="#inicio"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#4ade80] transition-colors"
              >
                Início
              </a>
              <a
                href="#funcionalidades"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#4ade80] transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#4ade80] transition-colors"
              >
                Como funciona
              </a>
              <a
                href="http://localhost:3000/api-docs"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#4ade80] transition-colors"
              >
                API Backend
              </a>
            </nav>

            <div className="flex flex-col gap-3 pt-6 border-t border-neutral-800">
              <a
                href="/dashboard"
                className="w-full font-['Cabin'] font-bold py-3.5 bg-white text-black rounded-[8px] text-center"
              >
                Entrar
              </a>
              <a
                href="/dashboard"
                className="w-full font-['Cabin'] font-bold py-3.5 bg-[#4ade80] text-[#14532d] rounded-[8px] text-center shadow-lg shadow-[#4ade80]/20"
              >
                Começar grátis
              </a>
            </div>
          </div>
        )}

        {/* HERO CENTRALIZADO */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto mt-32 pb-24">
          {/* Tagline Glassmorphism */}
          <div className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px] bg-[rgba(20,83,45,0.4)] backdrop-blur-md border border-[rgba(74,222,128,0.5)] shadow-lg shadow-black/20 mb-8 transition-transform hover:scale-105">
            <span className="font-['Manrope'] font-bold text-xs px-2 py-0.5 rounded-[6px] bg-[#4ade80] text-[#14532d] tracking-wide uppercase">
              Novo
            </span>
            <span className="font-['Manrope'] text-xs sm:text-sm font-medium text-white/95">
              Gestão completa do seu mercadinho
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-['Instrument_Serif'] text-5xl sm:text-7xl md:text-[96px] text-white leading-[1.1] tracking-tight max-w-4xl drop-shadow-md mb-6">
            Gerencie seu mercadinho com facilidade{" "}
            <span className="italic font-normal text-[#4ade80]">e</span> sem papel
          </h1>

          {/* Subtexto */}
          <p className="font-['Inter'] text-[16px] sm:text-[18px] text-white/70 max-w-[662px] leading-relaxed mb-10 drop-shadow-sm">
            Controle fiado, estoque e fornecedores pelo celular. Relatório automático todo dia. Sem complicação, sem planilha.
          </p>

          {/* Botões CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="#funcionalidades"
              className="w-full sm:w-auto font-['Cabin'] font-bold text-[16px] px-8 py-3.5 bg-[#4ade80] text-[#14532d] rounded-[10px] hover:bg-[#3ec972] transition-all duration-200 shadow-xl shadow-[#4ade80]/20 hover:shadow-[#4ade80]/40 active:scale-95 text-center"
            >
              Ver demonstração
            </a>
            <a
              href="/dashboard"
              className="w-full sm:w-auto font-['Cabin'] font-semibold text-[16px] px-8 py-3.5 bg-[#14532d] text-[#f6f7f9] border border-[#4ade80]/40 rounded-[10px] hover:bg-[#196537] hover:border-[#4ade80]/70 transition-all duration-200 shadow-lg active:scale-95 text-center"
            >
              Começar agora
            </a>
          </div>
        </div>

        {/* Espaçador inferior suave */}
        <div className="relative z-10 w-full flex justify-center pb-6">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 rounded-full bg-[#4ade80] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SEÇÃO DE FUNCIONALIDADES (FUNDO BRANCO) */}
      {/* ========================================================================= */}
      <section
        id="funcionalidades"
        className="relative z-20 w-full bg-white text-gray-900 py-24 px-6 md:px-[120px]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho da Seção */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-['Manrope'] font-bold text-xs uppercase tracking-widest text-[#14532d] bg-[#4ade80]/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Recursos Essenciais
            </span>
            <h2 className="font-['Instrument_Serif'] text-4xl sm:text-5xl text-gray-950 leading-tight mb-4">
              Tudo o que seu comércio precisa em um só lugar
            </h2>
            <p className="font-['Inter'] text-gray-600 text-base sm:text-lg">
              Substitua o caderno de fiado, acabe com as rupturas de estoque e tenha controle total dos seus fornecedores.
            </p>
          </div>

          {/* 3 Cards Lado a Lado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Fiado Digital */}
            <div className="group relative p-8 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-[#4ade80] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#4ade80]/15 border border-[#4ade80]/30 flex items-center justify-center text-[#14532d] mb-6 group-hover:scale-110 group-hover:bg-[#4ade80] group-hover:text-[#14532d] transition-all duration-300">
                <BookOpenIcon className="w-7 h-7" />
              </div>
              <h3 className="font-['Manrope'] font-bold text-2xl text-gray-900 mb-3">
                Fiado digital
              </h3>
              <p className="font-['Inter'] text-gray-600 text-[15px] leading-relaxed mb-6">
                Cadastre clientes, anote débitos pelo WhatsApp ou celular e dê baixa com um clique. Notificações automáticas de cobrança sem constrangimento.
              </p>
              <ul className="space-y-2.5 font-['Inter'] text-sm text-gray-600 border-t border-gray-200/60 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#14532d]" />
                  Histórico de compras por cliente
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#14532d]" />
                  Quitação em 1 clique pelo celular
                </li>
              </ul>
            </div>

            {/* Card 2: Estoque Inteligente */}
            <div className="group relative p-8 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-[#4ade80] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#4ade80]/15 border border-[#4ade80]/30 flex items-center justify-center text-[#14532d] mb-6 group-hover:scale-110 group-hover:bg-[#4ade80] group-hover:text-[#14532d] transition-all duration-300">
                <PackageIcon className="w-7 h-7" />
              </div>
              <h3 className="font-['Manrope'] font-bold text-2xl text-gray-900 mb-3">
                Estoque inteligente
              </h3>
              <p className="font-['Inter'] text-gray-600 text-[15px] leading-relaxed mb-6">
                Defina quantidades mínimas para cada produto e receba alertas automáticos antes do produto acabar na prateleira.
              </p>
              <ul className="space-y-2.5 font-['Inter'] text-sm text-gray-600 border-t border-gray-200/60 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#14532d]" />
                  Alerta de produtos no limite
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#14532d]" />
                  Sugestão automática de reposição
                </li>
              </ul>
            </div>

            {/* Card 3: Fornecedores */}
            <div className="group relative p-8 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-[#4ade80] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#4ade80]/15 border border-[#4ade80]/30 flex items-center justify-center text-[#14532d] mb-6 group-hover:scale-110 group-hover:bg-[#4ade80] group-hover:text-[#14532d] transition-all duration-300">
                <TruckIcon className="w-7 h-7" />
              </div>
              <h3 className="font-['Manrope'] font-bold text-2xl text-gray-900 mb-3">
                Fornecedores
              </h3>
              <p className="font-['Inter'] text-gray-600 text-[15px] leading-relaxed mb-6">
                Controle dias de visita, histórico da última entrega e valores pagos. Nunca mais seja pego de surpresa pelo entregador.
              </p>
              <ul className="space-y-2.5 font-['Inter'] text-sm text-gray-600 border-t border-gray-200/60 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#14532d]" />
                  Agenda semanal de visitas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#14532d]" />
                  Controle de preços e faturas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEÇÃO COMO FUNCIONA (FUNDO CINZA CLARO) */}
      {/* ========================================================================= */}
      <section
        id="como-funciona"
        className="relative z-20 w-full bg-gray-100 text-gray-900 py-24 px-6 md:px-[120px] border-y border-gray-200/80"
      >
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho da Seção */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-['Manrope'] font-bold text-xs uppercase tracking-widest text-[#14532d] bg-[#4ade80]/30 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Passo a Passo
            </span>
            <h2 className="font-['Instrument_Serif'] text-4xl sm:text-5xl text-gray-950 leading-tight mb-4">
              Como funciona
            </h2>
            <p className="font-['Inter'] text-gray-600 text-base sm:text-lg">
              Comece a usar em menos de 5 minutos, direto pelo celular, sem treinamento complicado.
            </p>
          </div>

          {/* 3 Passos Numerados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Passo 1 */}
            <div className="relative p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-['Manrope'] font-extrabold text-5xl sm:text-6xl text-[#4ade80] tracking-tighter">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#14532d] text-[#4ade80] flex items-center justify-center font-['Manrope'] font-bold text-sm">
                    1º
                  </div>
                </div>
                <h3 className="font-['Manrope'] font-bold text-xl text-gray-900 mb-3 leading-snug">
                  Cadastre seus produtos e clientes
                </h3>
                <p className="font-['Inter'] text-gray-600 text-[15px] leading-relaxed">
                  Adicione seus itens em segundos pelo celular, configure o estoque mínimo e cadastre os clientes habituais do seu comércio.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="relative p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-['Manrope'] font-extrabold text-5xl sm:text-6xl text-[#4ade80] tracking-tighter">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#14532d] text-[#4ade80] flex items-center justify-center font-['Manrope'] font-bold text-sm">
                    2º
                  </div>
                </div>
                <h3 className="font-['Manrope'] font-bold text-xl text-gray-900 mb-3 leading-snug">
                  Registre vendas, fiado e entregas
                </h3>
                <p className="font-['Inter'] text-gray-600 text-[15px] leading-relaxed">
                  Faça vendas no caixa, marque débitos no fiado com 1 toque e receba mercadorias dos fornecedores mantendo o estoque atualizado.
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="relative p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-['Manrope'] font-extrabold text-5xl sm:text-6xl text-[#4ade80] tracking-tighter">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#14532d] text-[#4ade80] flex items-center justify-center font-['Manrope'] font-bold text-sm">
                    3º
                  </div>
                </div>
                <h3 className="font-['Manrope'] font-bold text-xl text-gray-900 mb-3 leading-snug">
                  Receba o relatório todo dia no WhatsApp
                </h3>
                <p className="font-['Inter'] text-gray-600 text-[15px] leading-relaxed">
                  Fechamento de caixa diário, lista de fiados a receber e alertas de compras que precisam ser feitas, direto no seu WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SEÇÃO DE CTA FINAL */}
      {/* ========================================================================= */}
      <section className="relative z-20 w-full bg-white text-gray-900 py-16 px-6 md:px-[120px]">
        <div className="max-w-7xl mx-auto">
          {/* Banner de Chamada Final */}
          <div className="p-8 md:p-12 rounded-3xl bg-[#14532d] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h3 className="font-['Instrument_Serif'] text-3xl sm:text-4xl text-white mb-2">
                Pronto para modernizar seu mercadinho?
              </h3>
              <p className="font-['Inter'] text-white/80 text-base">
                Junte-se a centenas de comerciantes que economizam tempo e aumentam seus lucros com o GestorMercado.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
              <a
                href="/dashboard"
                className="w-full md:w-auto font-['Cabin'] font-bold text-[16px] px-8 py-3.5 bg-[#4ade80] text-[#14532d] rounded-[10px] hover:bg-[#3ec972] transition-all duration-200 shadow-lg cursor-pointer text-center"
              >
                Começar gratuitamente
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="w-full bg-neutral-950 border-t border-neutral-800 py-12 px-6 md:px-[120px] text-neutral-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <StoreIcon className="w-5 h-5 text-[#4ade80]" />
            <span className="font-['Manrope'] font-bold text-base text-white">
              GestorMercado
            </span>
          </div>
          <p className="text-center md:text-left text-xs text-neutral-500">
            © {new Date().getFullYear()} GestorMercado. Todos os direitos reservados. Feito para pequenos comércios e mercadinhos.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <a href="#termos" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#privacidade" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#contato" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
