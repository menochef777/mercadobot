import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

// Web Audio API beep feedback
const playBeep = (freq = 880, type: OscillatorType = 'sine', duration = 0.1) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio might be blocked if no user interaction yet
  }
};

// Icons
const StoreIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </svg>
);

const BookOpenIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const PackageIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16.5 9.4 4.5-2.8a2 2 0 0 0 0-3.4L12.5 1.2a2 2 0 0 0-2 0L2 6.2a2 2 0 0 0 0 3.4l4.5 2.8" />
    <path d="M12 22.8V12" />
    <path d="m21.5 14.8-9.5 5.9-9.5-5.9" />
    <path d="M3.2 8.5 12 13l8.8-4.5" />
  </svg>
);

const TruckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-5.5a1.5 1.5 0 0 0-.44-1.06L18.5 7.38A1.5 1.5 0 0 0 17.44 7H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
);

const CashIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlusIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const CameraIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const BarcodeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5v14" />
    <path d="M8 5v14" />
    <path d="M12 5v14" />
    <path d="M17 5v14" />
    <path d="M21 5v14" />
  </svg>
);

const LogOutIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

interface Fiado {
  id: string;
  nomeCliente: string;
  telefoneCliente?: string;
  valor: number;
  descricao?: string;
  dataCriacao: string;
  status: string;
  dataPagamento?: string;
}

interface AlertaEstoque {
  productId: string;
  name: string;
  barcode?: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  statusEstoque: string;
  deficit: number;
  price: number;
}

interface ProductItem {
  productId: string;
  name: string;
  barcode?: string;
  sku?: string;
  price: number;
  costPrice?: number;
  quantidadeAtual: number;
  quantidadeMinima: number;
  stockQuantity?: number;
  description?: string;
}

interface Fornecedor {
  id: string;
  nome: string;
  telefone?: string;
  produtos?: string;
  diaVisita?: string;
  ultimaEntregaData?: string;
  ultimaEntregaValor?: number;
  createdAt: string;
}

interface Venda {
  id: string;
  valor: number;
  formaPagamento: string;
  cliente?: string;
  itens?: string;
  createdAt: string;
}

interface CartItem {
  productId?: string;
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  stockAvailable?: number;
}

interface ContaPagar {
  id: string;
  nomeFornecedor: string;
  valor: number;
  dataVencimento?: string | null;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'caixa' | 'fiado' | 'estoque' | 'fornecedores' | 'financeiro'>('caixa');
  
  // Data State
  const [fiados, setFiados] = useState<Fiado[]>([]);
  const [alertasEstoque, setAlertasEstoque] = useState<AlertaEstoque[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<ProductItem[]>([]);
  const [searchProduto, setSearchProduto] = useState('');
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [vendasHoje, setVendasHoje] = useState<Venda[]>([]);
  const [totalCaixaHoje, setTotalCaixaHoje] = useState(0);
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([]);
  const [totalPendenteFinanceiro, setTotalPendenteFinanceiro] = useState(0);
  const [filtroFinanceiro, setFiltroFinanceiro] = useState<'TODAS' | 'PENDENTE' | 'PAGO'>('TODAS');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form Nova Conta a Pagar
  const [novaContaFornecedor, setNovaContaFornecedor] = useState('');
  const [novaContaValor, setNovaContaValor] = useState('');
  const [novaContaVencimento, setNovaContaVencimento] = useState('');
  const [financeiroLoading, setFinanceiroLoading] = useState(false);

  // Modal de Reposição / Atualização de Estoque
  const [reporModalOpen, setReporModalOpen] = useState(false);
  const [reporItem, setReporItem] = useState<{ productId: string; name: string; quantidadeAtual: number; quantidadeMinima: number; price?: number } | null>(null);
  const [reporQtd, setReporQtd] = useState<number>(10);
  const [reporModo, setReporModo] = useState<'adicionar' | 'definir'>('adicionar');
  const [reporLoading, setReporLoading] = useState(false);

  // PDV / Carrinho State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formaPagamento, setFormaPagamento] = useState<string>('PIX');
  const [clienteVenda, setClienteVenda] = useState('');
  const [observacoesVenda, setObservacoesVenda] = useState('');
  const [pdvLoading, setPdvLoading] = useState(false);
  
  // Camera Barcode Scanner State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Fornecedor Form State
  const [fornecedorModalOpen, setFornecedorModalOpen] = useState(false);
  const [fornecedorEditId, setFornecedorEditId] = useState<string | null>(null);
  const [fornecedorNome, setFornecedorNome] = useState('');
  const [fornecedorTelefone, setFornecedorTelefone] = useState('');
  const [fornecedorProdutos, setFornecedorProdutos] = useState('');
  const [fornecedorDiaVisita, setFornecedorDiaVisita] = useState('Segunda');
  const [fornecedorUltimaData, setFornecedorUltimaData] = useState('');
  const [fornecedorUltimaValor, setFornecedorUltimaValor] = useState('');

  // Fiado Form State
  const [novoFiadoNome, setNovoFiadoNome] = useState('');
  const [novoFiadoTelefone, setNovoFiadoTelefone] = useState('');
  const [novoFiadoValor, setNovoFiadoValor] = useState('');
  const [novoFiadoDesc, setNovoFiadoDesc] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4500);
  };

  // Auto-focus barcode input when switching to Caixa tab
  useEffect(() => {
    if (activeTab === 'caixa') {
      setTimeout(() => barcodeInputRef.current?.focus(), 150);
    }
  }, [activeTab]);

  // Load Tab Data
  const fetchFiados = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/fiado?status=PENDENTE`);
      if (res.ok) {
        const data = await res.json();
        setFiados(data);
      }
    } catch (err) {
      console.error('Erro ao buscar fiados:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/estoque/alertas`);
      if (res.ok) {
        const data = await res.json();
        setAlertasEstoque(data);
      }
    } catch (err) {
      console.error('Erro ao buscar alertas:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodosProdutos = async () => {
    try {
      const res = await fetch(`${API_BASE}/product`);
      if (res.ok) {
        const data = await res.json();
        setTodosProdutos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erro ao buscar todos os produtos:', err);
    }
  };

  const handleAbrirModalReposicao = (item: { productId: string; name: string; quantidadeAtual: number; quantidadeMinima: number; price?: number }) => {
    setReporItem(item);
    setReporQtd(10);
    setReporModo('adicionar');
    setReporModalOpen(true);
  };

  const handleSalvarReposicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporItem) return;
    try {
      setReporLoading(true);
      const payload = reporModo === 'adicionar'
        ? { adicionar: Number(reporQtd) }
        : { quantidadeAtual: Number(reporQtd) };

      const res = await fetch(`${API_BASE}/estoque/${reporItem.productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Estoque de "${reporItem.name}" atualizado com sucesso!`, 'success');
        setReporModalOpen(false);
        fetchEstoque();
        fetchTodosProdutos();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Erro ao atualizar estoque.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao atualizar estoque.', 'error');
    } finally {
      setReporLoading(false);
    }
  };

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/fornecedor`);
      if (res.ok) {
        const data = await res.json();
        setFornecedores(data);
      }
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendasHoje = async () => {
    try {
      const res = await fetch(`${API_BASE}/venda/hoje`);
      if (res.ok) {
        const data = await res.json();
        setVendasHoje(data.vendas || []);
        setTotalCaixaHoje(data.total || 0);
      }
    } catch (err) {
      console.error('Erro ao buscar vendas de hoje:', err);
    }
  };

  const fetchContasPagar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/financeiro/contas-pagar`);
      if (res.ok) {
        const data = await res.json();
        setContasPagar(Array.isArray(data.contas) ? data.contas : []);
        setTotalPendenteFinanceiro(typeof data.totalPendente === 'number' ? data.totalPendente : 0);
      }
    } catch (err) {
      console.error('Erro ao buscar contas a pagar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carrega resumo inicial financeiro
    fetchContasPagar();
  }, []);

  useEffect(() => {
    if (activeTab === 'fiado') fetchFiados();
    if (activeTab === 'estoque') {
      fetchEstoque();
      fetchTodosProdutos();
    }
    if (activeTab === 'fornecedores') fetchFornecedores();
    if (activeTab === 'caixa') fetchVendasHoje();
    if (activeTab === 'financeiro') fetchContasPagar();
  }, [activeTab]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('gestormercado_token');
    window.location.pathname = '/login';
  };

  // =========================================================================
  // CAMERA SCANNER (@zxing/browser)
  // =========================================================================
  const startCameraScanner = async () => {
    setScannerOpen(true);
    setCameraError(null);

    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Small delay to allow DOM video element to mount
      setTimeout(async () => {
        if (!videoRef.current) return;
        try {
          await codeReader.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, err) => {
              if (result) {
                const scannedText = result.getText();
                playBeep(950, 'square', 0.12);
                handleAddItemByBarcode(scannedText);
                // Pause slightly before next scan to prevent duplicate scans
              }
            }
          );
        } catch (camErr: any) {
          console.error('Erro ao inicializar câmera:', camErr);
          setCameraError('Permissão de câmera negada ou nenhuma câmera detectada.');
        }
      }, 300);
    } catch (err: any) {
      setCameraError('Não foi possível iniciar o leitor de código.');
    }
  };

  const stopCameraScanner = () => {
    if (codeReaderRef.current) {
      try {
        // Stop scanning and camera track
        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (e) {}
    }
    setScannerOpen(false);
    setCameraError(null);
    barcodeInputRef.current?.focus();
  };

  // =========================================================================
  // PDV: BUSCA DE PRODUTO & COSMOS API INTEGRATION
  // =========================================================================
  const handleAddItemByBarcode = async (rawCode?: string) => {
    const code = (rawCode || barcodeInput).trim();
    if (!code) return;

    setPdvLoading(true);
    try {
      // 1. Verificar se produto já está no carrinho
      const existingCartIndex = cart.findIndex(
        item => item.barcode === code || (item.productId && item.productId === code)
      );

      if (existingCartIndex >= 0) {
        // Incrementa quantidade
        const updatedCart = [...cart];
        updatedCart[existingCartIndex].quantity += 1;
        setCart(updatedCart);
        playBeep(880, 'sine', 0.1);
        showToast(`+1x ${updatedCart[existingCartIndex].name} adicionado ao carrinho!`);
        setBarcodeInput('');
        setPdvLoading(false);
        barcodeInputRef.current?.focus();
        return;
      }

      // 2. Buscar no banco local por código de barras ou ID
      let localProduct: any = null;
      try {
        const resLocal = await fetch(`${API_BASE}/product/barcode/${encodeURIComponent(code)}`);
        if (resLocal.ok) {
          localProduct = await resLocal.json();
        }
      } catch (e) {}

      // Se não achou por barcode, tenta por ID direto
      if (!localProduct) {
        try {
          const resId = await fetch(`${API_BASE}/product/${encodeURIComponent(code)}`);
          if (resId.ok) {
            localProduct = await resId.json();
          }
        } catch (e) {}
      }

      if (localProduct && localProduct.name) {
        // Produto já cadastrado no banco local!
        const newItem: CartItem = {
          productId: localProduct.productId,
          barcode: localProduct.barcode || code,
          name: localProduct.name,
          price: Number(localProduct.price) || 5.0,
          quantity: 1,
          stockAvailable: localProduct.quantidadeAtual ?? localProduct.stockQuantity ?? 50,
        };

        setCart(prev => [newItem, ...prev]);
        playBeep(880, 'sine', 0.1);
        showToast(`${newItem.name} (R$ ${newItem.price.toFixed(2)}) adicionado!`);
        setBarcodeInput('');
        setPdvLoading(false);
        barcodeInputRef.current?.focus();
        return;
      }

      // 3. Produto não achou no banco local: Consultar API Cosmos (Bluesoft)
      showToast(`Buscando código ${code} na API Cosmos...`, 'success');

      let cosmosData: any = null;
      try {
        // Consulta via backend proxy /cosmos/:gtin que repassa com Header 'X-Cosmos-Token: DEMO'
        const cosmosRes = await fetch(`${API_BASE}/cosmos/${encodeURIComponent(code)}`);
        if (cosmosRes.ok) {
          cosmosData = await cosmosRes.json();
        }
      } catch (cosmosErr) {
        console.warn('Erro ao consultar backend cosmos:', cosmosErr);
      }

      // Se não retornou ou deu erro, fallback para formato padrão
      const productName = cosmosData?.description || `Produto ${code}`;
      const productPrice = Number(cosmosData?.avg_price || cosmosData?.price || 6.50);

      // 4. Cadastrar automaticamente no banco local com os dados do Cosmos
      let createdProduct: any = null;
      try {
        const createRes = await fetch(`${API_BASE}/product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productName,
            barcode: code,
            sku: `GTIN-${code.slice(-6)}`,
            costPrice: productPrice * 0.7,
            price: productPrice,
            description: `Importado via Cosmos API (GTIN: ${code})`,
            stockQuantity: 50,
            quantidadeAtual: 50,
            quantidadeMinima: 5,
            imgURL: cosmosData?.thumbnail || '/files/product-default.jpg',
          }),
        });

        if (createRes.ok) {
          createdProduct = await createRes.json();
        }
      } catch (saveErr) {
        console.warn('Erro ao salvar produto automaticamente no banco:', saveErr);
      }

      // 5. Adicionar ao carrinho
      const newItem: CartItem = {
        productId: createdProduct?.productId,
        barcode: code,
        name: productName,
        price: productPrice,
        quantity: 1,
        stockAvailable: 50,
      };

      setCart(prev => [newItem, ...prev]);
      playBeep(1046, 'triangle', 0.15);
      showToast(`✨ ${productName} cadastrado via Cosmos e adicionado ao carrinho!`);
      setBarcodeInput('');
    } catch (err) {
      console.error('Erro no fluxo de leitura:', err);
      showToast('Erro ao processar código de barras.', 'error');
    } finally {
      setPdvLoading(false);
      barcodeInputRef.current?.focus();
    }
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      handleRemoveFromCart(index);
    } else {
      updated[index].quantity = newQty;
      setCart(updated);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const item = cart[index];
    setCart(cart.filter((_, i) => i !== index));
    showToast(`Item ${item.name} removido do carrinho.`);
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    showToast('Carrinho limpo.');
    barcodeInputRef.current?.focus();
  };

  const totalCart = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // =========================================================================
  // PDV: FINALIZAR VENDA (Salva Venda + Baixa Estoque + Limpa Carrinho)
  // =========================================================================
  const handleFinalizarVenda = async () => {
    if (cart.length === 0) {
      showToast('Adicione ao menos um item ao carrinho.', 'error');
      return;
    }

    setPdvLoading(true);
    try {
      // 1. Montar resumo de itens
      const itensSummary = cart
        .map(i => `${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2)})`)
        .join(', ');

      // 2. Salvar venda no banco
      const resVenda = await fetch(`${API_BASE}/venda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor: totalCart,
          formaPagamento: formaPagamento,
          cliente: clienteVenda.trim() || undefined,
          itens: `${itensSummary}${observacoesVenda ? ' | Obs: ' + observacoesVenda : ''}`,
        }),
      });

      if (!resVenda.ok) {
        showToast('Erro ao salvar venda no banco de dados.', 'error');
        setPdvLoading(false);
        return;
      }

      // 3. Baixar estoque dos produtos no banco local
      for (const item of cart) {
        if (item.productId) {
          try {
            // Busca o produto atual para decrementar
            const pRes = await fetch(`${API_BASE}/product/${item.productId}`);
            if (pRes.ok) {
              const pData = await pRes.json();
              const currentStock = pData.quantidadeAtual ?? pData.stockQuantity ?? 10;
              const newStock = Math.max(0, currentStock - item.quantity);

              await fetch(`${API_BASE}/product/${item.productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: pData.name,
                  barcode: pData.barcode,
                  price: pData.price,
                  costPrice: pData.costPrice || 0,
                  sku: pData.sku || '',
                  description: pData.description || '',
                  quantidadeAtual: newStock,
                  stockQuantity: newStock,
                  quantidadeMinima: pData.quantidadeMinima ?? 5,
                }),
              });
            }
          } catch (stkErr) {
            console.warn(`Erro ao baixar estoque do item ${item.name}:`, stkErr);
          }
        }
      }

      // Som de sucesso e feedback
      playBeep(1318, 'sine', 0.2);
      showToast(`🎉 Venda de R$ ${totalCart.toFixed(2)} finalizada com sucesso! Estoque atualizado.`);
      
      // Limpa formulário do PDV
      setCart([]);
      setClienteVenda('');
      setObservacoesVenda('');
      setBarcodeInput('');

      // Atualiza vendas do dia e alertas de estoque
      fetchVendasHoje();
      fetchEstoque();
    } catch (err) {
      console.error('Erro ao finalizar venda:', err);
      showToast('Erro interno ao finalizar venda.', 'error');
    } finally {
      setPdvLoading(false);
      barcodeInputRef.current?.focus();
    }
  };

  // =========================================================================
  // GESTÃO DE FORNECEDORES (Criar / Editar / Excluir)
  // =========================================================================
  const handleOpenNewFornecedor = () => {
    setFornecedorEditId(null);
    setFornecedorNome('');
    setFornecedorTelefone('');
    setFornecedorProdutos('');
    setFornecedorDiaVisita('Segunda-feira');
    setFornecedorUltimaData('');
    setFornecedorUltimaValor('');
    setFornecedorModalOpen(true);
  };

  const handleEditFornecedor = (f: Fornecedor) => {
    setFornecedorEditId(f.id);
    setFornecedorNome(f.nome);
    setFornecedorTelefone(f.telefone || '');
    setFornecedorProdutos(f.produtos || '');
    setFornecedorDiaVisita(f.diaVisita || 'Segunda-feira');
    setFornecedorUltimaData(f.ultimaEntregaData ? f.ultimaEntregaData.slice(0, 10) : '');
    setFornecedorUltimaValor(f.ultimaEntregaValor ? String(f.ultimaEntregaValor) : '');
    setFornecedorModalOpen(true);
  };

  const handleSaveFornecedor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fornecedorNome.trim()) {
      showToast('Nome do fornecedor é obrigatório.', 'error');
      return;
    }

    try {
      const payload = {
        nome: fornecedorNome.trim(),
        telefone: fornecedorTelefone.trim() || undefined,
        produtos: fornecedorProdutos.trim() || undefined,
        diaVisita: fornecedorDiaVisita.trim() || undefined,
        ultimaEntregaData: fornecedorUltimaData ? new Date(fornecedorUltimaData).toISOString() : undefined,
        ultimaEntregaValor: fornecedorUltimaValor ? parseFloat(fornecedorUltimaValor) : undefined,
      };

      let res;
      if (fornecedorEditId) {
        res = await fetch(`${API_BASE}/fornecedor/${fornecedorEditId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/fornecedor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showToast(fornecedorEditId ? 'Fornecedor atualizado!' : 'Novo fornecedor cadastrado com sucesso!');
        setFornecedorModalOpen(false);
        fetchFornecedores();
      } else {
        showToast('Erro ao salvar dados do fornecedor.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao salvar fornecedor.', 'error');
    }
  };

  const handleDeleteFornecedor = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o fornecedor "${nome}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/fornecedor/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast(`Fornecedor "${nome}" excluído.`);
        fetchFornecedores();
      } else {
        showToast('Erro ao excluir fornecedor.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao excluir fornecedor.', 'error');
    }
  };

  // =========================================================================
  // FIADO ACTIONS
  // =========================================================================
  const handlePagarFiado = async (id: string, nomeCliente: string) => {
    try {
      const res = await fetch(`${API_BASE}/fiado/${id}/pagar`, { method: 'PATCH' });
      if (res.ok) {
        showToast(`Fiado de ${nomeCliente} quitado com sucesso!`);
        fetchFiados();
      } else {
        showToast('Erro ao quitar fiado.', 'error');
      }
    } catch (err) {
      showToast('Erro ao conectar à API.', 'error');
    }
  };

  const handleCriarFiado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoFiadoNome || !novoFiadoValor) return;
    try {
      const res = await fetch(`${API_BASE}/fiado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCliente: novoFiadoNome,
          telefoneCliente: novoFiadoTelefone,
          valor: parseFloat(novoFiadoValor),
          descricao: novoFiadoDesc,
        }),
      });
      if (res.ok) {
        showToast('Novo registro de fiado salvo com sucesso!');
        setNovoFiadoNome('');
        setNovoFiadoTelefone('');
        setNovoFiadoValor('');
        setNovoFiadoDesc('');
        fetchFiados();
      }
    } catch (err) {
      showToast('Erro ao cadastrar fiado.', 'error');
    }
  };

  // =========================================================================
  // FINANCEIRO / CONTAS A PAGAR ACTIONS
  // =========================================================================
  const isVencendoEmMenosDe3Dias = (dataVencimento?: string | null, status?: string): boolean => {
    if (status === 'PAGO' || !dataVencimento) return false;
    const clean = dataVencimento.trim();
    let dt: Date | null = null;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
      const [d, m, y] = clean.split('/').map(Number);
      dt = new Date(y, m - 1, d, 0, 0, 0);
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
      const [d, m, y] = clean.split('-').map(Number);
      dt = new Date(y, m - 1, d, 0, 0, 0);
    } else if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
      const [y, m, d] = clean.substring(0, 10).split('-').map(Number);
      dt = new Date(y, m - 1, d, 0, 0, 0);
    } else {
      const parsed = new Date(clean);
      dt = isNaN(parsed.getTime()) ? null : parsed;
    }
    if (!dt) return false;
    const now = new Date();
    const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const diffDays = Math.ceil((dt.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const handleMarcarComoPago = async (id: string, nomeFornecedor: string) => {
    try {
      const res = await fetch(`${API_BASE}/financeiro/contas-pagar/${id}/pagar`, {
        method: 'PATCH',
      });
      if (res.ok) {
        showToast(`Conta de "${nomeFornecedor}" marcada como PAGA com sucesso!`);
        fetchContasPagar();
      } else {
        showToast('Erro ao atualizar status da conta.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao marcar conta como paga.', 'error');
    }
  };

  const handleCriarContaPagar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaContaFornecedor || !novaContaValor) return;
    try {
      setFinanceiroLoading(true);
      const res = await fetch(`${API_BASE}/financeiro/contas-pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeFornecedor: novaContaFornecedor.trim(),
          valor: parseFloat(novaContaValor),
          dataVencimento: novaContaVencimento.trim() || undefined,
        }),
      });
      if (res.ok) {
        showToast('Nova conta a pagar registrada com sucesso!');
        setNovaContaFornecedor('');
        setNovaContaValor('');
        setNovaContaVencimento('');
        fetchContasPagar();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Erro ao registrar conta a pagar.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao registrar conta a pagar.', 'error');
    } finally {
      setFinanceiroLoading(false);
    }
  };

  const totalFiadosPendentes = fiados.reduce((acc, f) => acc + f.valor, 0);

  return (
    <div className="min-h-screen w-full bg-[#0a0f0d] text-neutral-100 flex flex-col font-['Inter'] antialiased selection:bg-[#4ade80] selection:text-[#14532d]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between px-6 md:px-12 py-3.5 bg-black/70 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 text-white no-underline group">
            <div className="w-10 h-10 rounded-xl bg-[#14532d] border border-[#4ade80]/50 flex items-center justify-center shadow-md shadow-[#4ade80]/10 transition-transform group-hover:scale-105">
              <StoreIcon className="w-5 h-5 text-[#4ade80]" />
            </div>
            <div>
              <span className="font-['Manrope'] font-extrabold text-lg text-white block leading-tight">
                GestorMercado
              </span>
              <span className="text-[11px] text-[#4ade80] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                PDV & Painel do Mercadinho
              </span>
            </div>
          </a>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="hidden sm:inline-block font-['Cabin'] text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
          >
            Landing Page
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-['Cabin'] text-xs font-bold px-3.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/30 transition-colors cursor-pointer"
          >
            <LogOutIcon className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 py-8 flex flex-col gap-6">
        
        {/* Toast Notificação */}
        {message && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between shadow-xl transition-all ${
              message.type === 'success'
                ? 'bg-[#14532d] border-[#4ade80]/50 text-white'
                : 'bg-red-950 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5 font-medium text-sm">
              <CheckIcon className="w-5 h-5 text-[#4ade80]" />
              {message.text}
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Resumo Rápido Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Caixa de Hoje</p>
              <h3 className="text-2xl font-bold font-['Manrope'] text-[#4ade80] mt-1">
                R$ {totalCaixaHoje.toFixed(2)}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">{vendasHoje.length} vendas registradas</p>
            </div>
            <div className="p-3 rounded-xl bg-[#4ade80]/15 text-[#4ade80]">
              <CashIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Fiado a Receber</p>
              <h3 className="text-2xl font-bold font-['Manrope'] text-emerald-400 mt-1">
                R$ {totalFiadosPendentes.toFixed(2)}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">{fiados.length} clientes pendentes</p>
            </div>
            <div className="p-3 rounded-xl bg-[#4ade80]/15 text-[#4ade80]">
              <BookOpenIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Contas a Pagar</p>
              <h3 className="text-2xl font-bold font-['Manrope'] text-rose-400 mt-1">
                R$ {totalPendenteFinanceiro.toFixed(2)}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Total pendente</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/15 text-rose-400 font-bold text-xl flex items-center justify-center">
              💰
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Alertas de Estoque</p>
              <h3 className="text-2xl font-bold font-['Manrope'] text-amber-400 mt-1">
                {alertasEstoque.length} itens
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Produtos críticos ou baixos</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-400/15 text-amber-400">
              <PackageIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Fornecedores</p>
              <h3 className="text-2xl font-bold font-['Manrope'] text-sky-400 mt-1">
                {fornecedores.length} ativos
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Parceiros cadastrados</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-400/15 text-sky-400">
              <TruckIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('caixa')}
            className={`flex items-center gap-2 px-5 py-3 font-['Manrope'] font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'caixa'
                ? 'bg-white/[0.08] text-[#4ade80] border-b-2 border-[#4ade80]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <CashIcon className="w-4 h-4" />
            PDV / Caixa do Dia
          </button>

          <button
            onClick={() => setActiveTab('fornecedores')}
            className={`flex items-center gap-2 px-5 py-3 font-['Manrope'] font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'fornecedores'
                ? 'bg-white/[0.08] text-[#4ade80] border-b-2 border-[#4ade80]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <TruckIcon className="w-4 h-4" />
            Fornecedores ({fornecedores.length})
          </button>

          <button
            onClick={() => setActiveTab('estoque')}
            className={`flex items-center gap-2 px-5 py-3 font-['Manrope'] font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'estoque'
                ? 'bg-white/[0.08] text-[#4ade80] border-b-2 border-[#4ade80]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <PackageIcon className="w-4 h-4" />
            Estoque & Alertas ({alertasEstoque.length})
          </button>

          <button
            onClick={() => setActiveTab('fiado')}
            className={`flex items-center gap-2 px-5 py-3 font-['Manrope'] font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'fiado'
                ? 'bg-white/[0.08] text-[#4ade80] border-b-2 border-[#4ade80]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <BookOpenIcon className="w-4 h-4" />
            Fiado Digital ({fiados.length})
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`flex items-center gap-2 px-5 py-3 font-['Manrope'] font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'financeiro'
                ? 'bg-white/[0.08] text-[#4ade80] border-b-2 border-[#4ade80]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <span>💰</span>
            Financeiro 💰
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="flex flex-col gap-6">

          {/* ================================================================= */}
          {/* ABA 1: PDV / CAIXA DO DIA (REAL POINT OF SALE) */}
          {/* ================================================================= */}
          {activeTab === 'caixa' && (
            <div className="flex flex-col gap-8">
              
              {/* Modal / Inline Scanner de Câmera (@zxing/browser) */}
              {scannerOpen && (
                <div className="p-6 rounded-3xl bg-neutral-900 border-2 border-[#4ade80] shadow-2xl flex flex-col items-center gap-4 relative">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-[#4ade80] font-bold">
                      <CameraIcon className="w-5 h-5 animate-pulse" />
                      <span>Leitor de Código de Barras / QR Code Ativo</span>
                    </div>
                    <button
                      onClick={stopCameraScanner}
                      className="px-3 py-1 text-xs rounded-lg bg-red-950 text-red-200 border border-red-500/40 hover:bg-red-900"
                    >
                      ✕ Fechar Câmera
                    </button>
                  </div>

                  {cameraError ? (
                    <div className="p-4 rounded-xl bg-red-950/80 text-red-200 text-sm border border-red-500/40">
                      ⚠️ {cameraError}
                    </div>
                  ) : (
                    <div className="relative w-full max-w-md h-64 bg-black rounded-2xl overflow-hidden border border-white/20 flex items-center justify-center">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      {/* Mira / Linha Laser Vermelha */}
                      <div className="absolute inset-x-8 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                    </div>
                  )}

                  <p className="text-xs text-neutral-400 text-center">
                    Aponte a câmera para o código de barras ou QR Code do produto. O item será adicionado automaticamente ao bipar.
                  </p>
                </div>
              )}

              {/* Grid do PDV: Scanner & Input na Esquerda + Carrinho e Pagamento na Direita */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Coluna Esquerda: Entrada de Produtos (Scanner & Barcode Input) */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Manrope'] font-bold text-lg text-white flex items-center gap-2">
                        <BarcodeIcon className="w-5 h-5 text-[#4ade80]" />
                        Entrada de Produto (Leitor & Cosmos API)
                      </h3>
                      <button
                        type="button"
                        onClick={scannerOpen ? stopCameraScanner : startCameraScanner}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#14532d] hover:bg-[#1b6a3b] text-[#4ade80] border border-[#4ade80]/40 text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <CameraIcon className="w-4 h-4" />
                        {scannerOpen ? 'Parar Câmera' : '📷 Ler via Câmera'}
                      </button>
                    </div>

                    <p className="text-xs text-neutral-400">
                      Digite ou bipe o código de barras (EAN/GTIN) e pressione <strong>Enter</strong>. Se o produto não existir no banco local, ele será buscado na <strong>Cosmos API</strong> e cadastrado automaticamente.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddItemByBarcode();
                      }}
                      className="flex gap-2"
                    >
                      <div className="relative flex-1">
                        <input
                          ref={barcodeInputRef}
                          type="text"
                          autoFocus
                          placeholder="Digite o código de barras (ex: 7891000100103)..."
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#4ade80] text-sm transition-colors font-mono font-semibold"
                        />
                        <BarcodeIcon className="w-5 h-5 text-neutral-500 absolute left-3 top-3.5 pointer-events-none" />
                      </div>
                      <button
                        type="submit"
                        disabled={pdvLoading || !barcodeInput.trim()}
                        className="px-5 py-3 rounded-xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-bold text-sm hover:bg-[#3ec972] transition-all disabled:opacity-50 cursor-pointer shrink-0 shadow-lg shadow-[#4ade80]/15 active:scale-95"
                      >
                        {pdvLoading ? 'Buscando...' : 'Adicionar'}
                      </button>
                    </form>

                    {/* Atalhos Rápidos de Códigos de Teste / Demonstração */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-neutral-400">
                      <span className="text-[11px] font-medium text-neutral-500">Exemplos rápidos:</span>
                      <button
                        type="button"
                        onClick={() => handleAddItemByBarcode('7891000100103')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-[11px] border border-white/5 transition-colors"
                      >
                        7891000100103 (Leite)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddItemByBarcode('7894900011517')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-[11px] border border-white/5 transition-colors"
                      >
                        7894900011517 (Coca-Cola)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddItemByBarcode('7896004000111')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-[11px] border border-white/5 transition-colors"
                      >
                        7896004000111 (Arroz)
                      </button>
                    </div>
                  </div>

                  {/* Informações da Venda Atual (Cliente Opcional & Forma de Pagamento) */}
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col gap-4">
                    <h3 className="font-['Manrope'] font-bold text-base text-white">
                      Condições de Pagamento & Cliente
                    </h3>

                    {/* Botões de Seleção de Pagamento */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['PIX', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormaPagamento(method)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold font-['Cabin'] transition-all border ${
                            formaPagamento === method
                              ? 'bg-[#4ade80] text-[#14532d] border-[#4ade80] shadow-md shadow-[#4ade80]/20'
                              : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {method === 'PIX' && '⚡ PIX'}
                          {method === 'Dinheiro' && '💵 Dinheiro'}
                          {method === 'Cartão de Crédito' && '💳 Crédito'}
                          {method === 'Cartão de Débito' && '💳 Débito'}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-['Manrope'] font-medium text-neutral-400 mb-1">
                          Cliente (Opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Dona Maria"
                          value={clienteVenda}
                          onChange={(e) => setClienteVenda(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#4ade80] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-['Manrope'] font-medium text-neutral-400 mb-1">
                          Observações (Opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Entrega no balcão"
                          value={observacoesVenda}
                          onChange={(e) => setObservacoesVenda(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#4ade80] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Carrinho de Compras do PDV */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-2xl flex flex-col justify-between h-full shadow-2xl">
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" />
                          <h3 className="font-['Manrope'] font-bold text-lg text-white">
                            Carrinho de Compras
                          </h3>
                        </div>
                        {cart.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearCart}
                            className="text-xs text-red-400 hover:text-red-300 font-medium"
                          >
                            Limpar Carrinho
                          </button>
                        )}
                      </div>

                      {/* Lista de Itens no Carrinho */}
                      <div className="flex flex-col gap-2.5 my-4 max-h-[340px] overflow-y-auto pr-1">
                        {cart.length === 0 ? (
                          <div className="py-12 text-center text-neutral-500 text-sm flex flex-col items-center gap-2">
                            <BarcodeIcon className="w-8 h-8 text-neutral-600 opacity-50" />
                            <span>Nenhum produto adicionado ainda.</span>
                            <span className="text-xs text-neutral-600">Bipe ou digite o código de barras ao lado.</span>
                          </div>
                        ) : (
                          cart.map((item, idx) => (
                            <div
                              key={`${item.barcode}-${idx}`}
                              className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 transition-all hover:border-white/20"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                                  <span className="font-mono text-[11px] text-neutral-500">#{item.barcode}</span>
                                  <span>•</span>
                                  <span>R$ {item.price.toFixed(2)} un</span>
                                </div>
                              </div>

                              {/* Controles de Quantidade */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(idx, -1)}
                                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-[#4ade80]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(idx, 1)}
                                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>

                              {/* Subtotal & Delete */}
                              <div className="text-right min-w-[70px]">
                                <span className="block text-sm font-bold font-['Manrope'] text-white">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(idx)}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Resumo & Botão Finalizar */}
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span>Forma Selecionada:</span>
                        <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                          {formaPagamento}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-['Manrope'] text-sm font-semibold text-neutral-300">
                          Total a Pagar:
                        </span>
                        <span className="font-['Manrope'] text-3xl font-extrabold text-[#4ade80] drop-shadow-md">
                          R$ {totalCart.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleFinalizarVenda}
                        disabled={pdvLoading || cart.length === 0}
                        className="w-full py-4 rounded-2xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-extrabold text-base hover:bg-[#3ec972] transition-all shadow-xl shadow-[#4ade80]/20 active:scale-95 disabled:opacity-40 cursor-pointer text-center flex items-center justify-center gap-2"
                      >
                        {pdvLoading ? (
                          'Processando Venda & Baixa no Estoque...'
                        ) : (
                          <>
                            <CheckIcon className="w-5 h-5" />
                            Finalizar Venda (R$ {totalCart.toFixed(2)})
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Histórico de Vendas do Dia Abaixo do PDV */}
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <h3 className="font-['Manrope'] font-bold text-lg text-white">
                      Vendas Realizadas Hoje
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Histórico em tempo real de todas as vendas processadas no caixa do dia
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400">Total do Dia:</span>
                    <h4 className="font-['Manrope'] text-xl font-bold text-[#4ade80]">
                      R$ {totalCaixaHoje.toFixed(2)}
                    </h4>
                  </div>
                </div>

                {vendasHoje.length === 0 ? (
                  <div className="py-8 text-center text-neutral-500 text-sm">
                    Nenhuma venda registrada hoje até o momento.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs text-neutral-400 uppercase tracking-wider">
                          <th className="py-3 px-3">Horário</th>
                          <th className="py-3 px-3">Cliente</th>
                          <th className="py-3 px-3">Pagamento</th>
                          <th className="py-3 px-3">Itens / Descrição</th>
                          <th className="py-3 px-3 text-right">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-['Inter']">
                        {vendasHoje.map((v) => (
                          <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-3 text-xs text-neutral-400 font-mono">
                              {new Date(v.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3 px-3 font-medium text-white">
                              {v.cliente || <span className="text-neutral-500 italic">Consumidor Balcão</span>}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30">
                                {v.formaPagamento}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-xs text-neutral-300 max-w-xs truncate">
                              {v.itens || '—'}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-white font-['Manrope']">
                              R$ {v.valor.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ABA 2: FORNECEDORES (COM CADASTRO, EDIÇÃO E EXCLUSÃO) */}
          {/* ================================================================= */}
          {activeTab === 'fornecedores' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-['Manrope'] font-bold text-xl text-white">
                    Gestão de Fornecedores & Entregas
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Cadastre novos fornecedores, edite visitas e exclua parceiros
                  </p>
                </div>
                <button
                  onClick={handleOpenNewFornecedor}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-bold text-xs hover:bg-[#3ec972] transition-all shadow-md active:scale-95"
                >
                  <PlusIcon className="w-4 h-4" />
                  + Novo Fornecedor
                </button>
              </div>

              {/* Grid de Fornecedores */}
              {loading && fornecedores.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 text-sm">Carregando fornecedores...</div>
              ) : fornecedores.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-neutral-400">
                  Nenhum fornecedor cadastrado. Clique em "+ Novo Fornecedor" para começar.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fornecedores.map((forn) => (
                    <div
                      key={forn.id}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-['Manrope'] font-bold text-base text-white">
                            {forn.nome}
                          </h4>
                          {forn.diaVisita && (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/40">
                              Visita: {forn.diaVisita}
                            </span>
                          )}
                        </div>

                        {forn.telefone && (
                          <p className="text-xs text-neutral-300 flex items-center gap-1.5">
                            <span className="text-neutral-500">Tel:</span>
                            <span className="font-mono">{forn.telefone}</span>
                          </p>
                        )}

                        {forn.produtos && (
                          <div className="mt-1 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-300">
                            <span className="text-neutral-500 font-semibold block mb-0.5">Fornece:</span>
                            {forn.produtos}
                          </div>
                        )}

                        {(forn.ultimaEntregaData || forn.ultimaEntregaValor) && (
                          <div className="mt-1 text-xs text-neutral-400">
                            <span>Última Entrega: </span>
                            <strong className="text-white">
                              {forn.ultimaEntregaData ? new Date(forn.ultimaEntregaData).toLocaleDateString('pt-BR') : '—'}
                            </strong>
                            {forn.ultimaEntregaValor && (
                              <span className="text-emerald-400 font-bold ml-1">
                                (R$ {forn.ultimaEntregaValor.toFixed(2)})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Botões de Ação do Fornecedor */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        {forn.telefone && (
                          <a
                            href={`https://wa.me/55${forn.telefone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center transition-colors"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditFornecedor(forn)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFornecedor(forn.id, forn.nome)}
                          className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 text-xs font-bold transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal de Criar/Editar Fornecedor */}
              {fornecedorModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="max-w-md w-full p-6 rounded-3xl bg-neutral-900 border border-white/20 shadow-2xl flex flex-col gap-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-['Manrope'] font-bold text-lg text-white">
                        {fornecedorEditId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                      </h3>
                      <button
                        onClick={() => setFornecedorModalOpen(false)}
                        className="text-neutral-400 hover:text-white text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveFornecedor} className="flex flex-col gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Nome da Empresa / Fornecedor *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Distribuidora Ambev"
                          value={fornecedorNome}
                          onChange={(e) => setFornecedorNome(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: (81) 99123-4567"
                          value={fornecedorTelefone}
                          onChange={(e) => setFornecedorTelefone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Produtos que Fornece
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Cervejas, Refrigerantes, Energéticos"
                          value={fornecedorProdutos}
                          onChange={(e) => setFornecedorProdutos(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">
                            Dia de Visita
                          </label>
                          <select
                            value={fornecedorDiaVisita}
                            onChange={(e) => setFornecedorDiaVisita(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                          >
                            <option value="Segunda-feira">Segunda-feira</option>
                            <option value="Terça-feira">Terça-feira</option>
                            <option value="Quarta-feira">Quarta-feira</option>
                            <option value="Quinta-feira">Quinta-feira</option>
                            <option value="Sexta-feira">Sexta-feira</option>
                            <option value="Sábado">Sábado</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">
                            Valor Última Entrega (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 850.00"
                            value={fornecedorUltimaValor}
                            onChange={(e) => setFornecedorUltimaValor(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">
                          Data da Última Entrega
                        </label>
                        <input
                          type="date"
                          value={fornecedorUltimaData}
                          onChange={(e) => setFornecedorUltimaData(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setFornecedorModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-bold text-xs hover:bg-[#3ec972]"
                        >
                          Salvar Fornecedor
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* ABA 3: ESTOQUE & ALERTAS */}
          {/* ================================================================= */}
          {activeTab === 'estoque' && (
            <div className="flex flex-col gap-10">
              
              {/* SEÇÃO 1: ALERTAS DE REPOSIÇÃO */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                  <div>
                    <h3 className="font-['Manrope'] font-extrabold text-2xl text-white flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        ⚠️
                      </span>
                      Alertas de Reposição de Estoque
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Produtos que atingiram ou estão abaixo da quantidade mínima configurada no mercadinho
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                      {alertasEstoque.filter(a => (a.quantidadeAtual ?? 0) <= 0).length} Esgotados
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {alertasEstoque.filter(a => (a.quantidadeAtual ?? 0) > 0).length} Estoque Baixo
                    </span>
                  </div>
                </div>

                {loading && alertasEstoque.length === 0 ? (
                  <div className="py-16 text-center text-neutral-400 text-sm flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
                    <span>Carregando alertas de estoque...</span>
                  </div>
                ) : alertasEstoque.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 text-center flex flex-col items-center gap-2 shadow-xl">
                    <span className="text-4xl">🎉</span>
                    <h4 className="text-lg font-bold text-emerald-300 font-['Manrope']">
                      Estoque em dia!
                    </h4>
                    <p className="text-xs text-emerald-400/80">
                      Nenhum produto está abaixo da quantidade mínima no momento.
                    </p>
                  </div>
                ) : (
                  /* Grid Responsivo de Alertas: 1 Coluna Mobile, 2 Tablet, 3 Desktop */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alertasEstoque.map((item) => {
                      const isEsgotado = (item.quantidadeAtual ?? 0) <= 0;
                      return (
                        <div
                          key={item.productId}
                          className={`p-6 rounded-3xl bg-white text-slate-900 border-2 flex flex-col justify-between gap-5 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 shadow-lg ${
                            isEsgotado
                              ? 'border-red-500 shadow-red-500/10'
                              : 'border-amber-400 shadow-amber-500/10'
                          }`}
                        >
                          <div className="flex flex-col gap-3">
                            {/* Badge Colorido Superior */}
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${
                                  isEsgotado
                                    ? 'bg-red-100 text-red-700 border border-red-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}
                              >
                                {isEsgotado ? '🚨 ESGOTADO' : '⚠️ ESTOQUE BAIXO'}
                              </span>

                              {item.barcode && (
                                <span className="text-[11px] font-mono text-slate-600 font-medium">
                                  #{item.barcode}
                                </span>
                              )}
                            </div>

                            {/* Nome do Produto em Destaque */}
                            <div>
                              <h4 className="font-['Manrope'] font-extrabold text-xl text-slate-900 leading-snug line-clamp-2">
                                {item.name}
                              </h4>
                            </div>

                            {/* Box Estoque Atual vs Mínimo ('5 / 10 un') */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold text-slate-600 block">
                                  Estoque / Mínimo:
                                </span>
                                <div className="text-2xl font-black font-mono mt-0.5">
                                  <span className={isEsgotado ? 'text-red-600' : 'text-amber-600'}>
                                    {item.quantidadeAtual}
                                  </span>
                                  <span className="text-slate-600 font-semibold text-lg">
                                    {' '}/ {item.quantidadeMinima} un
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-xs font-semibold text-slate-600 block">
                                  Preço de Venda:
                                </span>
                                <span className="text-base font-extrabold text-emerald-700 font-['Manrope']">
                                  R$ {Number(item.price || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 font-medium">
                              Déficit para repor:{' '}
                              <strong className="text-slate-900 font-bold">
                                {item.deficit || Math.max(0, item.quantidadeMinima - item.quantidadeAtual)} unidades
                              </strong>
                            </p>
                          </div>

                          {/* Botão Repor Estoque com Modal */}
                          <button
                            type="button"
                            onClick={() => handleAbrirModalReposicao(item)}
                            className={`w-full py-3.5 px-4 rounded-2xl font-['Cabin'] font-extrabold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                              isEsgotado
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                            }`}
                          >
                            <PlusIcon className="w-4 h-4 stroke-[3]" />
                            Repor Estoque
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SEÇÃO 2: TODOS OS PRODUTOS */}
              <div className="flex flex-col gap-5 pt-6 border-t border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-['Manrope'] font-extrabold text-2xl text-white flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-emerald-500/20 text-[#4ade80] border border-emerald-500/30">
                        📦
                      </span>
                      Todos os Produtos ({todosProdutos.length})
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Catálogo completo com controle de quantidade atual, estoque mínimo e preços
                    </p>
                  </div>

                  {/* Campo de Busca Rápida */}
                  <div className="w-full md:w-80">
                    <input
                      type="text"
                      placeholder="🔍 Buscar produto por nome ou código..."
                      value={searchProduto}
                      onChange={(e) => setSearchProduto(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-[#4ade80] transition-colors"
                    />
                  </div>
                </div>

                {todosProdutos.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 text-sm">
                    Nenhum produto cadastrado no momento.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todosProdutos
                      .filter((p) =>
                        p.name.toLowerCase().includes(searchProduto.toLowerCase()) ||
                        (p.barcode && p.barcode.includes(searchProduto))
                      )
                      .map((prod) => {
                        const qtdAtual = prod.quantidadeAtual ?? 0;
                        const qtdMin = prod.quantidadeMinima ?? 5;
                        const isEsgotado = qtdAtual <= 0;
                        const isBaixo = qtdAtual <= qtdMin && !isEsgotado;

                        return (
                          <div
                            key={prod.productId}
                            className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-xl flex flex-col justify-between gap-4 transition-all shadow-md"
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-['Manrope'] font-bold text-base text-white line-clamp-1">
                                  {prod.name}
                                </h4>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                                    isEsgotado
                                      ? 'bg-red-950/80 text-red-300 border-red-500/40'
                                      : isBaixo
                                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                  }`}
                                >
                                  {isEsgotado ? 'Esgotado' : isBaixo ? 'Baixo' : 'OK'}
                                </span>
                              </div>

                              {prod.barcode && (
                                <span className="text-xs font-mono text-neutral-500">
                                  #{prod.barcode}
                                </span>
                              )}

                              <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                                  <span className="text-neutral-400 block text-[11px]">Estoque / Mínimo:</span>
                                  <strong className={`text-sm font-bold font-mono ${
                                    isEsgotado ? 'text-red-400' : isBaixo ? 'text-amber-400' : 'text-white'
                                  }`}>
                                    {qtdAtual} / {qtdMin} un
                                  </strong>
                                </div>

                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                                  <span className="text-neutral-400 block text-[11px]">Preço de Venda:</span>
                                  <strong className="text-sm font-bold text-[#4ade80] font-['Manrope']">
                                    R$ {Number(prod.price || 0).toFixed(2)}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAbrirModalReposicao(prod)}
                              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#4ade80] hover:text-[#14532d] text-white text-xs font-bold font-['Cabin'] transition-all flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 cursor-pointer shadow-sm"
                            >
                              ✏️ Atualizar Quantidade
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* MODAL DE REPOSIÇÃO / ATUALIZAÇÃO DE ESTOQUE */}
              {reporModalOpen && reporItem && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="max-w-md w-full p-6 rounded-3xl bg-neutral-900 border border-white/20 shadow-2xl flex flex-col gap-5 text-white animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h3 className="font-['Manrope'] font-bold text-lg text-white">
                          Repor / Ajustar Estoque
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[280px]">
                          {reporItem.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReporModalOpen(false)}
                        className="text-neutral-400 hover:text-white text-base p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSalvarReposicao} className="flex flex-col gap-4">
                      <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Estoque Atual:</span>
                        <span className="font-mono text-base font-bold text-[#4ade80]">
                          {reporItem.quantidadeAtual} un
                        </span>
                      </div>

                      {/* Modo de Reposição: Adicionar ou Definir Fixo */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Tipo de Ajuste:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setReporModo('adicionar')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                              reporModo === 'adicionar'
                                ? 'bg-[#4ade80] text-[#14532d] border-[#4ade80]'
                                : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            ➕ Adicionar (+ un)
                          </button>
                          <button
                            type="button"
                            onClick={() => setReporModo('definir')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                              reporModo === 'definir'
                                ? 'bg-[#4ade80] text-[#14532d] border-[#4ade80]'
                                : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            ✏️ Nova Qtd Fixa
                          </button>
                        </div>
                      </div>

                      {/* Atalhos Rápidos para Adicionar */}
                      {reporModo === 'adicionar' && (
                        <div>
                          <label className="block text-xs font-semibold text-neutral-400 mb-1">
                            Atalhos Rápidos (+):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[5, 10, 20, 50, 100].map((qtd) => (
                              <button
                                key={qtd}
                                type="button"
                                onClick={() => setReporQtd(qtd)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors border ${
                                  reporQtd === qtd
                                    ? 'bg-[#14532d] text-[#4ade80] border-[#4ade80]'
                                    : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                                }`}
                              >
                                +{qtd}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          {reporModo === 'adicionar' ? 'Quantidade a Adicionar:' : 'Nova Quantidade em Estoque:'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={reporQtd}
                          onChange={(e) => setReporQtd(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-lg font-bold focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setReporModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={reporLoading}
                          className="px-6 py-2.5 rounded-xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-extrabold text-sm hover:bg-[#3ec972] transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {reporLoading ? 'Salvando...' : 'Confirmar Reposição'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* ABA 4: FIADO DIGITAL */}
          {/* ================================================================= */}
          {activeTab === 'fiado' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Formulário Novo Fiado */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col gap-4">
                <h3 className="font-['Manrope'] font-bold text-lg text-white">
                  Registrar Fiado Digital
                </h3>
                <form onSubmit={handleCriarFiado} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Nome do Cliente *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Seu Raimundo"
                      value={novoFiadoNome}
                      onChange={(e) => setNovoFiadoNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">WhatsApp do Cliente</label>
                    <input
                      type="text"
                      placeholder="Ex: (81) 98765-4321"
                      value={novoFiadoTelefone}
                      onChange={(e) => setNovoFiadoTelefone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Valor da Dívida (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ex: 45.00"
                      value={novoFiadoValor}
                      onChange={(e) => setNovoFiadoValor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Descrição das Compras</label>
                    <input
                      type="text"
                      placeholder="Ex: 2x Óleo + 1x Farinha + Pão"
                      value={novoFiadoDesc}
                      onChange={(e) => setNovoFiadoDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-bold text-sm hover:bg-[#3ec972] transition-all shadow-lg active:scale-95"
                  >
                    Salvar Registro de Fiado
                  </button>
                </form>
              </div>

              {/* Lista de Fiados Pendentes */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Manrope'] font-bold text-lg text-white">
                    Fiados Pendentes ({fiados.length})
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Total: <strong className="text-[#4ade80]">R$ {totalFiadosPendentes.toFixed(2)}</strong>
                  </span>
                </div>

                {fiados.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-neutral-500 text-sm">
                    Nenhum fiado pendente registrado!
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {fiados.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white truncate">{item.nomeCliente}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                              PENDENTE
                            </span>
                          </div>
                          {item.telefoneCliente && (
                            <span className="text-xs text-neutral-400 font-mono">{item.telefoneCliente}</span>
                          )}
                          {item.descricao && (
                            <p className="text-xs text-neutral-300 truncate">{item.descricao}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-['Manrope'] font-bold text-lg text-[#4ade80]">
                            R$ {item.valor.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handlePagarFiado(item.id, item.nomeCliente)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#14532d] hover:bg-[#1b6a3b] text-[#4ade80] border border-[#4ade80]/40 text-xs font-bold transition-all shadow-sm"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ABA 5: FINANCEIRO & CONTAS A PAGAR */}
          {/* ================================================================= */}
          {activeTab === 'financeiro' && (
            <div className="flex flex-col gap-6">
              {/* Top Banner de Destaque: Total Pendente */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-rose-950/60 via-red-950/40 to-neutral-900 border border-rose-500/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    💸
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-rose-300">
                      Gestão de Despesas & Contas
                    </span>
                    <h2 className="font-['Manrope'] font-extrabold text-3xl md:text-4xl text-white mt-0.5">
                      R$ {totalPendenteFinanceiro.toFixed(2)}
                    </h2>
                    <p className="text-xs text-neutral-300 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      Total de contas pendentes a pagar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={fetchContasPagar}
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    🔄 Atualizar Lista
                  </button>
                </div>
              </div>

              {/* Grid: Formulário na Esquerda + Lista de Contas na Direita */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Coluna Esquerda: Formulário de Adicionar Conta Manual */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col gap-4 h-fit">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">➕</span>
                    <h3 className="font-['Manrope'] font-bold text-lg text-white">
                      Adicionar Conta a Pagar
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Cadastre despesas manuais ou faturas de compras. O lembrete será sincronizado com o WhatsApp e Google Calendar.
                  </p>

                  <form onSubmit={handleCriarContaPagar} className="flex flex-col gap-3.5 mt-1">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Nome do Fornecedor / Conta *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Distribuidora Ambev / Luz / Aluguel"
                        value={novaContaFornecedor}
                        onChange={(e) => setNovaContaFornecedor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Valor a Pagar (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        placeholder="Ex: 450.00"
                        value={novaContaValor}
                        onChange={(e) => setNovaContaValor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-[#4ade80]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Data de Vencimento
                      </label>
                      <input
                        type="date"
                        value={novaContaVencimento}
                        onChange={(e) => setNovaContaVencimento(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4ade80]"
                      />
                      <span className="text-[11px] text-neutral-400 mt-1 block">
                        💡 Agendamento automático no Google Calendar
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={financeiroLoading}
                      className="w-full mt-2 py-3 rounded-xl bg-[#4ade80] text-[#14532d] font-['Cabin'] font-bold text-sm hover:bg-[#3ec972] transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {financeiroLoading ? 'Salvando...' : 'Salvar Conta a Pagar'}
                    </button>
                  </form>
                </div>

                {/* Coluna Direita: Cards das Contas a Pagar */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  
                  {/* Filtro e Título */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
                    <div>
                      <h3 className="font-['Manrope'] font-bold text-lg text-white">
                        Contas a Pagar ({contasPagar.length})
                      </h3>
                      <span className="text-xs text-neutral-400">
                        Acompanhe datas de vencimento e pagamentos efetuados
                      </span>
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                      {(['TODAS', 'PENDENTE', 'PAGO'] as const).map((filtro) => (
                        <button
                          key={filtro}
                          type="button"
                          onClick={() => setFiltroFinanceiro(filtro)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                            filtroFinanceiro === filtro
                              ? 'bg-white/20 text-white'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {filtro === 'TODAS' ? 'Todas' : filtro === 'PENDENTE' ? 'Pendentes' : 'Pagas'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Cards */}
                  {contasPagar.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center gap-3 text-neutral-500">
                      <span className="text-4xl">🎉</span>
                      <p className="text-sm font-medium">Nenhuma conta a pagar registrada!</p>
                      <p className="text-xs text-neutral-400">
                        Envie fotos de notas fiscais pelo WhatsApp ou cadastre uma conta no formulário ao lado.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contasPagar
                        .filter((conta) => filtroFinanceiro === 'TODAS' || conta.status === filtroFinanceiro)
                        .map((conta) => {
                          const venceBreve = isVencendoEmMenosDe3Dias(conta.dataVencimento, conta.status);
                          const isPendente = conta.status === 'PENDENTE';

                          return (
                            <div
                              key={conta.id}
                              className={`p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all relative overflow-hidden ${
                                venceBreve
                                  ? 'bg-red-950/30 border-2 border-red-500 shadow-lg shadow-red-500/10'
                                  : isPendente
                                  ? 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                                  : 'bg-emerald-950/20 border border-emerald-500/20 opacity-90'
                              }`}
                            >
                              {/* Alerta de vencimento urgente no topo do card */}
                              {venceBreve && (
                                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider flex items-center gap-1 shadow">
                                  <span>⚠️</span> Vence em &lt; 3 dias!
                                </div>
                              )}

                              <div>
                                {/* Header do Card: Fornecedor e Status Badge */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 pr-2">
                                    <h4 className="font-['Manrope'] font-bold text-base text-white truncate" title={conta.nomeFornecedor}>
                                      {conta.nomeFornecedor}
                                    </h4>
                                    <span className="text-[11px] text-neutral-400">
                                      Registrado em: {new Date(conta.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>

                                  <div className="shrink-0 pt-0.5">
                                    {isPendente ? (
                                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40">
                                        PENDENTE
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                                        PAGO
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Valor da Conta */}
                                <div className="mt-3">
                                  <span className="text-xs text-neutral-400 block">Valor a pagar:</span>
                                  <span className={`font-['Manrope'] font-extrabold text-2xl ${venceBreve ? 'text-rose-400' : 'text-[#4ade80]'}`}>
                                    R$ {conta.valor.toFixed(2)}
                                  </span>
                                </div>

                                {/* Data de Vencimento */}
                                {conta.dataVencimento && (
                                  <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                                    <span className="text-neutral-400">📅 Vencimento:</span>
                                    <span className={`font-bold font-mono px-2 py-0.5 rounded-md ${
                                      venceBreve
                                        ? 'bg-red-500/20 text-red-200 border border-red-500/40'
                                        : 'bg-white/5 text-neutral-200'
                                    }`}>
                                      {conta.dataVencimento}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Rodapé / Botão de Ação */}
                              {isPendente && (
                                <div className="pt-3 border-t border-white/10 flex items-center justify-end">
                                  <button
                                    onClick={() => handleMarcarComoPago(conta.id, conta.nomeFornecedor)}
                                    className="w-full py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                                  >
                                    <CheckIcon className="w-3.5 h-3.5" />
                                    Marcar como Pago
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
