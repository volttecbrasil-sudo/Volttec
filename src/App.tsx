import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ShoppingCart,
  CreditCard,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Headphones,
  Zap,
  Clock,
  Sparkles,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  Search,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  User,
  Menu,
  Smartphone,
  Laptop,
  Settings,
  Lock,
  Moon,
  Sun,
  Filter,
  Share2,
  Award,
  Info,
  Check,
  Scale,
  Send,
  MessageSquare,
  Copy,
  AlertCircle,
  QrCode,
  Eye
} from 'lucide-react';

import { RealTimeShipments } from './components/RealTimeShipments';
import { ProductCard } from './components/ProductCard';

// Product Interface
interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  category: string;
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  description: string;
  features: string[];
  specs: {
    [key: string]: string;
  };
  colors: { name: string; hex: string }[];
  stock: number;
}

// Dummy/Mock Reviews
interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export default function App() {
  // 1. STATE INITIALIZATION
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedColor: string }[]>(() => {
    const saved = localStorage.getItem('volttec_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('volttec_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  // Custom states requested by user
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; isRegistered: boolean }>(() => {
    const saved = localStorage.getItem('volttec_profile');
    return saved ? JSON.parse(saved) : { name: '', email: '', isRegistered: false };
  });
  
  // Voucher/Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percent' | 'fixed' } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Toast System for user feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Checkout flow state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment' | 'completed'>('shipping');
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    address: '',
    number: '',
    city: '',
    state: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [orderId, setOrderId] = useState('');

  // Support Chatbox Simulator state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    { sender: 'bot', text: 'Olá! Sou o assistente virtual da VoltTec. Como posso ajudar você hoje?', time: '01:32' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<number>(() => Math.floor(Math.random() * 7) + 14);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Save Cart and Favorites to localStorage
  useEffect(() => {
    localStorage.setItem('volttec_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('volttec_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Real-time online users count fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const change = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : -(Math.floor(Math.random() * 2) + 1);
        const next = prev + change;
        if (next < 10) return 12;
        if (next > 28) return 26;
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(() => {
    const consent = localStorage.getItem('volttec_cookie_consent');
    return !consent;
  });

  const handleAcceptCookies = () => {
    localStorage.setItem('volttec_cookie_consent', 'accepted');
    setShowCookieBanner(false);
    showToast('Preferências de cookies salvas: Permitido.', 'success');
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('volttec_cookie_consent', 'declined');
    setShowCookieBanner(false);
    showToast('Preferências de cookies salvas: Não permitido.', 'info');
  };

  // 2. PRODUCT DATA DEFINITIONS
  const products: Product[] = useMemo(() => [
    {
      id: 'prod-smartwatch',
      title: 'Volt Smartwatch Cyber Ultra',
      price: 1899.00,
      originalPrice: 2499.00,
      category: 'electronics',
      categoryLabel: 'Eletrônicos',
      rating: 4.9,
      reviewsCount: 124,
      image: '/src/assets/images/product_smartwatch_1779327111113.png',
      badge: 'Bestseller',
      description: 'O relógio inteligente definitivo construído em titânio aeroespacial, tela Micro-LED tátil de altíssima definição com brilho de 2000 nits, e monitoramento biométrico computacional de alta frequência.',
      features: [
        'Chassis de Titânio Aeroespacial Forjado de alta durabilidade',
        'Bateria de Grafeno com autonomia de até 14 dias',
        'Monitor Cardíaco óptico de 4ª geração e Oxigênio Sanguíneo',
        'Resistência à água profissional de até 100 metros (10 ATM)',
        'Integração instantânea com iOS e Android via Bluetooth 5.4'
      ],
      specs: {
        'Material': 'Titânio Aeroespacial + Vidro de Safira',
        'Processador': 'Volt Core-M1 Híbrido',
        'Bateria': 'Grafeno, Reabastecimento indutivo 15W',
        'Conexão': 'Bluetooth 5.4 LE, GPS Dual Band Integrado',
        'Peso': '49g'
      },
      colors: [
        { name: 'Titânio Natural', hex: '#a1a1aa' },
        { name: 'Preto Coal', hex: '#18181b' },
        { name: 'Bronze Cobre', hex: '#ca8a04' }
      ],
      stock: 6
    },
    {
      id: 'prod-headphones',
      title: 'Volt Headphone ANC Pro-X',
      price: 1499.00,
      originalPrice: 1999.00,
      category: 'electronics',
      categoryLabel: 'Eletrônicos',
      rating: 4.8,
      reviewsCount: 98,
      image: '/src/assets/images/product_headphones_1779327152487.png',
      badge: 'Lançamento',
      description: 'Ausculte o silêncio absoluto. Com cancelamento ativo de ruído híbrido de 48dB acoplado a falantes revestidos de Berílio premium de 40mm, o Pro-X redefine áudio fidelidade sem fio.',
      features: [
        'Drivers de Berílio de 40mm para agudos cristalinos e graves profundos',
        'Cancelamento Ativo de Ruído Inteligente (ANC) com detecção em tempo real',
        'Espumas viscoelásticas ultra macias magnéticas revestidas de couro legítimo',
        'Até 60 horas de reprodução contínua de áudio de estúdio',
        'Suporte a codecs Hi-Res Wireless, LDAC e AAC'
      ],
      specs: {
        'Driver': '40mm Revestido em Berílio',
        'Cancelamento': 'Ativo Híbrido Ajustável até -48dB',
        'Autonomia': '60h (ANC desativado) ou 40h (ANC ativado)',
        'Frequência': '4Hz - 45.000 Hz',
        'Peso': '280g'
      },
      colors: [
        { name: 'Preto Grafite', hex: '#1e293b' },
        { name: 'Bronze Premium', hex: '#ca8a04' },
        { name: 'Prata Espacial', hex: '#cbd5e1' }
      ],
      stock: 12
    },
    {
      id: 'prod-speaker',
      title: 'Volt Aura Speaker Pro-Bass',
      price: 989.00,
      originalPrice: 1299.00,
      category: 'electronics',
      categoryLabel: 'Eletrônicos',
      rating: 4.9,
      reviewsCount: 76,
      image: '/src/assets/images/product_speaker_1779327170271.png',
      badge: 'Som 360°',
      description: 'Caixa de som cilíndrica de alta fidelidade com arquitetura de som ativa 360°, radiator passivo de graves profundos e um anel de luz ambiente em acrilico orgânico que flui no ritmo das suas músicas.',
      features: [
        'Som espacial multidirecional de 360 graus de 45W RMS de potência',
        'Anel de Luz LED Aura RGB personalizável via aplicativo',
        'Certificação IPX7 à prova d\'água para uso à beira da piscina',
        'Bateria de recarga rápida de alta duração (até 20 horas de som)',
        'Suporte a conexões simultâneas Multi-Speaker estéreo'
      ],
      specs: {
        'Potência': '45W RMS Digital Inteligente',
        'Proteção': 'IPX7 Totalmente Impermeável',
        'Bateria': 'Até 20 horas de reprodução contínua',
        'Luminosidade': 'Sincronização reativa a áudio integrada',
        'Peso': '650g'
      },
      colors: [
        { name: 'Carbono Escuro', hex: '#0f172a' },
        { name: 'Verde Aurora', hex: '#0ea5e9' }
      ],
      stock: 9
    },
    {
      id: 'prod-keyboard',
      title: 'Volt Teclado Mecânico Halo RGB',
      price: 649.00,
      originalPrice: 899.00,
      category: 'accessories',
      categoryLabel: 'Acessórios',
      rating: 4.7,
      reviewsCount: 52,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
      badge: 'High-Tech',
      description: 'Teclado mecânico compacto premium de formato 75% com chassi translúcido fosco, switches mecânicos lineares lubrificados de fábrica e conectividade tri-mode robusta.',
      features: [
        'Switches lineares premium pré-lubrificados por precisão robótica',
        'Corpo de acrílico opaco com difusão RGB espetacular de 18 modos',
        'Conexão USB-C, 2.4GHz e 3 canais de Bluetooth 5.1 simultâneos',
        'Keycaps PBT Double-shot anti-desgaste e anti-escorregamento',
        'Montagem estrutural em Gasket Mount para som acústico único'
      ],
      specs: {
        'Formato': '75% Compacto Ergonômico',
        'Switches': 'Volt Linear Silencioso base amarela',
        'Iluminação': 'RGB Per-Key + Underglow Lateral',
        'Autonomia': 'Bateria 4000mAh (Até 150h sem LED)',
        'Peso': '920g'
      },
      colors: [
        { name: 'Gelo Translúcido', hex: '#e2e8f0' },
        { name: 'Obsidiana Escura', hex: '#1e293b' }
      ],
      stock: 4
    },
    {
      id: 'prod-charger',
      title: 'Volt Base Indução Qi2 Wood',
      price: 329.00,
      originalPrice: 429.00,
      category: 'accessories',
      categoryLabel: 'Acessórios',
      rating: 4.6,
      reviewsCount: 37,
      image: 'https://images.unsplash.com/photo-1622445262465-2481c4541241?auto=format&fit=crop&q=80&w=400',
      badge: 'Sustentável',
      description: 'Carregador rápido premium de indução com certificação oficial Qi2. Fabricado com madeira nogueira legítima e alumínio usinado, suporta até 15W de reabastecimento magnético fluido.',
      features: [
        'Madeira de nogueira natural certificada esculpida à mão',
        'Compatibilidade magnética padrão Qi2 aprimorado',
        'Carregamento ultra rápido de 15W otimizado para maior eficiência térmica',
        'Cabo de alimentação trançado premium de 1.5 metros incluso',
        'Circuito interno inteligente de proteção térmica de 3 estágios'
      ],
      specs: {
        'Entrada': 'USB-C de 9V/2.22A ou superior',
        'Saída de Indução': '5W / 7.5W / 10W / 15W Automático',
        'Eficiência': 'Até 85% de conversão de energia',
        'Ímãs': 'Alinhamento magnético duplo N52 super resistente',
        'Diâmetro': '62mm compactos'
      },
      colors: [
        { name: 'Nogueira Escura', hex: '#713f12' },
        { name: 'Carvalho Claro', hex: '#ca8a04' }
      ],
      stock: 18
    },
    {
      id: 'prod-hub',
      title: 'Volt Hub Multiportas Nexus 8-em-1',
      price: 419.00,
      originalPrice: 549.00,
      category: 'accessories',
      categoryLabel: 'Acessórios',
      rating: 4.5,
      reviewsCount: 42,
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400',
      badge: 'Produtividade',
      description: 'Expansão perfeita para seu setup de trabalho ou notebook profissional. Chassis durável em alumínio anodizado escovado com dissipação térmica avançada de cobre.',
      features: [
        'Transmissão de Vídeo HDMI 4K em 60Hz suave e instantânea',
        'Fornecimento de energia USB-C Power Delivery de até 100W',
        'Leitor de Cartões SD e MicroSD rápidos UHS-I simultâneos',
        'Conectividade Ethernet gigabit cabeada ultra veloz de até 1000Mbps',
        '3 Portas USB-A de alta velocidade USB 3.2 de 10Gbps estáveis'
      ],
      specs: {
        'Interface': 'Cabo integrado USB-C de fita de titânio',
        'Portas': '1x HDMI, 1x RJ45, 1x PD-C, 1x USB-C, 3x USB-A, SD/TF Reader',
        'Largura de Banda': 'Até 10 Gbps de transferência de alto barramento',
        'Material': 'Alumínio Escovado Espacial de alta dissipação',
        'Peso': '110g'
      },
      colors: [
        { name: 'Cobre Escuro', hex: '#ca8a04' },
        { name: 'Cinza Espacial', hex: '#475569' }
      ],
      stock: 15
    },
    {
      id: 'prod-powerbank-solar',
      title: 'Powerbank Solar Volt Extreme 30K',
      price: 299.00,
      originalPrice: 699.00,
      category: 'deals',
      categoryLabel: 'Ofertas Imperdíveis',
      rating: 4.9,
      reviewsCount: 215,
      image: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=400',
      badge: '60% OFF',
      description: 'O carregador definitivo para suas aventuras ao ar livre. Equipado com painéis solares retráteis de alta eficiência, lanterna LED de emergência IP68 e bateria de 30.000mAh capaz de alimentar múltiplos dispositivos.',
      features: [
        'Painéis solares Premium de polissilício com conversão otimizada',
        'Células de bateria de polímero de lítio densas de 30.000mAh',
        'Portas extras USB-C Power Delivery de 45W bidirecionais',
        'Lanterna tática embutida com 3 modos: Forte, Baixo e SOS',
        'Chassis blindado antichoque impermeável com certificação IP68'
      ],
      specs: {
        'Capacidade': '30.000 mAh de alta duração',
        'Painel Solar': 'Monocristalino Rebatível de 6W',
        'Saída USB-C': '5V-3A, 9V-3A, 12V-3A (Max 45W)',
        'Lanternas': '180 Lúmens SMD de longo alcance',
        'Peso': '420g'
      },
      colors: [
        { name: 'Preto Tático', hex: '#18181b' },
        { name: 'Laranja Energético', hex: '#f97316' }
      ],
      stock: 35
    },
    {
      id: 'prod-led-strip',
      title: 'Fita LED Smart Volt Aura RGBIC',
      price: 189.00,
      originalPrice: 399.00,
      category: 'deals',
      categoryLabel: 'Ofertas Imperdíveis',
      rating: 4.8,
      reviewsCount: 187,
      image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=400',
      badge: 'Metade do Preço',
      description: 'Ilumine seu espaço de jogo ou trabalho com fita de LED RGBIC endereçável premium. Permite exibir múltiplas cores na mesma linha ao mesmo tempo com transições fluidas e controle via voz por app.',
      features: [
        'Tecnologia avançada RGBIC capaz de exibir múltiplas cores simultâneas',
        'Sincronização musical de alta precisão via microfone embutido de cobre',
        'Suporte dedicado com assistentes virtuais de automação via Wi-Fi 2.4G',
        'Fita de 5 metros com dupla face de engenharia 3M de alta colagem',
        '16 milhões de tons RGB calibrados e diversos modos pré-configurados'
      ],
      specs: {
        'Comprimento': '5 metros expansíveis',
        'Chips LED': '150 LEDs RGBIC endereçáveis integrados',
        'Alimentação': 'Adaptador bivolt de 12V/2A Certificado',
        'Conexão': 'Wi-Fi 2.4GHz + Bluetooth 5.0 LE',
        'Vida Útil': '50.000 horas estimadas'
      },
      colors: [
        { name: 'Branco Difuso', hex: '#ffffff' }
      ],
      stock: 42
    },
    {
      id: 'prod-earbuds-wave',
      title: 'Volt Earbuds Wave ANC Pro',
      price: 499.00,
      originalPrice: 799.00,
      category: 'bestsellers',
      categoryLabel: 'Mais Vendidos',
      rating: 4.9,
      reviewsCount: 342,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400',
      badge: '#1 Mais Vendido',
      description: 'Earbuds de alta fidelidade com cancelamento ativo de ruído ultra profundo de 50dB, certificação de áudio espacial com rastreamento dinâmico de cabeça e latência zero para jogos.',
      features: [
        'Cancelamento de Ruído Híbrido ANC Pro+ adaptativo de até 50dB',
        'Drivers magnéticos duplos de grafeno e neodímio para som puro',
        'Até 45 horas de autonomia de reprodução total com estojo USB-C',
        'Algoritmo inteligente de IA com 6 microfones para chamadas límpidas',
        'Modo Gamer de ultrabaixa latência de até 35ms estável'
      ],
      specs: {
        'Cancelamento': 'Ativo de Ruído de até 50dB Híbrido Adaptativo',
        'Drivers': 'Dual 11mm Dinâmicos Coaxiais',
        'Autonomia': '10h direto (45h com estojo de carregamento)',
        'Proteção': 'IP54 resistente a poeira, suor e respingos',
        'Conexão': 'Bluetooth 5.4 Dual Stream'
      },
      colors: [
        { name: 'Preto Mate', hex: '#0f172a' },
        { name: 'Branco Cerâmico', hex: '#f8fafc' }
      ],
      stock: 28
    },
    {
      id: 'prod-ring-light',
      title: 'Luminária Volt Aura Ring Smart Wood',
      price: 349.00,
      originalPrice: 499.00,
      category: 'bestsellers',
      categoryLabel: 'Mais Vendidos',
      rating: 4.8,
      reviewsCount: 154,
      image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=400',
      badge: 'Sucesso de Vendas',
      description: 'Uma obra-prima para seu criado-mudo ou escritório. Luminária inteligente em carvalho selecionado com carregador de indução integrado e painel digital com relógio e alarme.',
      features: [
        'Anel iluminador LED curvo com brilho suave ajustável antiofuscante',
        'Base de madeira natural de reflorestamento com toque agradável',
        'Carregador por indução ultrarrápido magnético embutido para celular',
        'Display em LED dimmerizável com relógio digital integrado e alarme',
        'Controle de temperatura de luz: Do extremo quente para o frio'
      ],
      specs: {
        'Diâmetro do Anel': '18cm com difusor curvo fosco',
        'Carregamento': 'Indução Sem fio inteligente até 15W',
        'Brilho': 'Até 400 Lúmens contínuos programáveis',
        'Temperatura': '2700K (fogo) a 6500K (estúdio)',
        'Alimentação': 'USB-C de alta performance bivolt automatizada'
      },
      colors: [
        { name: 'Nogueira Rústica', hex: '#854d0e' },
        { name: 'Marfim Polar', hex: '#fef08a' }
      ],
      stock: 14
    },
    {
      id: 'prod-projector-cinemax',
      title: 'Projetor Portátil Volt CineMax 4K',
      price: 1599.00,
      originalPrice: 2199.00,
      category: 'electronics',
      categoryLabel: 'Eletrônicos',
      rating: 4.9,
      reviewsCount: 104,
      image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=400',
      badge: 'Cinema 4K',
      description: 'Crie seu cinema em qualquer lugar com foco inteligente guiado por laser, 1200 ANSI lúmens para imagens brilhantes e som espacial Dolby Atmos imersivo de 16W.',
      features: [
        'Resolução de alta precisão 4K Ultra HD com HDR15 ativo',
        'Foco automático laser automático e ajuste trapezoidal contínuo',
        'Sistema Smart TV integrado para acesso instantâneo a todos os aplicativos',
        'Brilho potente de 1200 ANSI Lúmens reproduzidos de forma rica',
        'Som espacial certificado Dolby Atmos de 16W de alta amplitude'
      ],
      specs: {
        'Resolução': '3840x2160 Pixels (4K nativo)',
        'Brilho': '1200 ANSI Lúmens de alto brilho',
        'Lente': 'Vidro com revestimento Schott de alto contraste',
        'Vida útil Lâmpada': '30.000 Horas em modo Eco',
        'Conexões': 'Wi-Fi 6, Bluetooth 5.2, HDMI e-ARC, USB-C'
      },
      colors: [
        { name: 'Cinza Metálico', hex: '#64748b' },
        { name: 'Preto Fosco', hex: '#0f172a' }
      ],
      stock: 11
    },
    {
      id: 'prod-alexa-aura',
      title: 'Assistente Hub Volt Aura Dot Touch',
      price: 649.00,
      originalPrice: 899.00,
      category: 'electronics',
      categoryLabel: 'Eletrônicos',
      rating: 4.8,
      reviewsCount: 116,
      image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=400',
      badge: 'Casa Inteligente',
      description: 'O cérebro definitivo para sua casa inteligente. Painel LCD multitoque de 4 polegadas acoplado a um driver acústico Hi-Fi de 20W para controlar toda sua automação e curtir suas playlists.',
      features: [
        'Tela LCD IPS multitoque de alta resolução com relógio dinâmico',
        'Driver de áudio personalizado de 20W com radiador passivo de graves',
        'Microfones direcionais de longo alcance com cancelamento de ruído',
        'Hub Zigbee + Matter integrados para acoplamento nativo e instantâneo',
        'Suporte a chamadas multimídia de alta definição completas'
      ],
      specs: {
        'Tela': 'Touch-screen IPS de 4 polegadas integrada',
        'Áudio': 'Som Direcional de 20W de alta nitidez',
        'Sensibilidade Microfone': 'Até 12 metros de captação',
        'Protocolos': 'Zigbee 3.0, Matter, Wi-Fi Dual, Bluetooth 5.0',
        'Peso': '360g'
      },
      colors: [
        { name: 'Branco Névoa', hex: '#f1f5f9' },
        { name: 'Preto Grafite', hex: '#1e293b' }
      ],
      stock: 18
    }
  ], []);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeCategory, searchQuery, products]);

  // Memoized category lists for high-speed shelf rendering
  const dealsProducts = useMemo(() => products.filter(p => p.category === 'deals'), [products]);
  const bestsellersProducts = useMemo(() => products.filter(p => p.category === 'bestsellers'), [products]);
  const electronicsProducts = useMemo(() => products.filter(p => p.category === 'electronics'), [products]);
  const accessoriesProducts = useMemo(() => products.filter(p => p.category === 'accessories'), [products]);

  // Handle color selection for model
  useEffect(() => {
    if (selectedProduct) {
      setSelectedColor(selectedProduct.colors[0].name);
    }
  }, [selectedProduct]);

  // 3. CART SYSTEM ACTIONS
  const addToCart = useCallback((product: Product, quantity = 1, colorName?: string) => {
    const chosenColor = colorName || product.colors[0].name;
    setCart((prev) => {
      const existing = prev.find(
        item => item.product.id === product.id && item.selectedColor === chosenColor
      );

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          setTimeout(() => showToast(`Desculpe, limite de estoque atingido (${product.stock} unidades).`, 'error'), 0);
          return prev;
        }
        setTimeout(() => showToast(`${product.title} (${chosenColor}) adicionado ao carrinho!`, 'success'), 0);
        return prev.map(item =>
          (item.product.id === product.id && item.selectedColor === chosenColor)
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        if (quantity > product.stock) {
          setTimeout(() => showToast(`Desculpe, limite de estoque atingido (${product.stock} unidades).`, 'error'), 0);
          return prev;
        }
        setTimeout(() => showToast(`${product.title} (${chosenColor}) adicionado ao carrinho!`, 'success'), 0);
        return [...prev, { product, quantity, selectedColor: chosenColor }];
      }
    });
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: string, colorName: string, delta: number) => {
    setCart((prev) => {
      let isOverStock = false;
      const updated = prev.map(item => {
        if (item.product.id === productId && item.selectedColor === colorName) {
          const nextQty = item.quantity + delta;
          if (nextQty > item.product.stock) {
            isOverStock = true;
            return item;
          }
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean) as { product: Product; quantity: number; selectedColor: string }[];
      
      if (isOverStock) {
        setTimeout(() => showToast(`Limite de estoque para este produto: ${productId} unidades.`, 'error'), 0);
      }
      return updated;
    });
  }, [showToast]);

  const removeFromCart = useCallback((productId: string, colorName: string) => {
    setCart((prev) => prev.filter(item => !(item.product.id === productId && item.selectedColor === colorName)));
    showToast('Produto removido do carrinho.', 'info');
  }, [showToast]);

  // 4. FAVORITES ACTION
  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        setTimeout(() => showToast('Produto removido dos favoritos.', 'info'), 0);
        return prev.filter(id => id !== productId);
      } else {
        setTimeout(() => showToast('Produto adicionado aos favoritos!', 'success'), 0);
        return [...prev, productId];
      }
    });
  }, [showToast]);

  // 5. COMPARE SYSTEM ACTIONS
  const toggleCompare = useCallback((product: Product) => {
    setCompareList((prev) => {
      const isCompared = prev.some(p => p.id === product.id);
      if (isCompared) {
        setTimeout(() => showToast('Produto removido da comparação.', 'info'), 0);
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 3) {
          setTimeout(() => showToast('Você pode comparar no máximo 3 produtos ao mesmo tempo.', 'error'), 0);
          return prev;
        }
        setTimeout(() => {
          setIsCompareOpen(true);
          showToast('Produto adicionado para comparação!', 'success');
        }, 0);
        return [...prev, product];
      }
    });
  }, [showToast]);

  // Cart values calculation
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return (cartSubtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // Apply Promo Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const coupon = couponInput.trim().toUpperCase();

    if (coupon === 'VOLTTEC10') {
      setAppliedCoupon({ code: 'VOLTTEC10', discount: 10, type: 'percent' });
      setCouponSuccess('Cupom VOLTTEC10 (10% de desconto) aplicado com sucesso!');
      setCouponInput('');
      showToast('Desconto de 10% aplicado!', 'success');
    } else if (coupon === 'VOLT100') {
      if (cartSubtotal < 500) {
        setCouponError('O cupom VOLT100 exige uma compra mínima de R$ 500,00.');
        showToast('Compra mínima de R$ 500 necessária para VOLT100.', 'error');
      } else {
        setAppliedCoupon({ code: 'VOLT100', discount: 100, type: 'fixed' });
        setCouponSuccess('Cupom VOLT100 (R$ 100,00 de desconto) aplicado com sucesso!');
        setCouponInput('');
        showToast('Desconto de R$ 100 aplicado!', 'success');
      }
    } else {
      setCouponError('Cupom inválido ou expirado.');
      showToast('Cupom inválido.', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    showToast('Cupom removido.', 'info');
  };

  // Simulated Checkout completion
  const handleStartCheckout = () => {
    if (cart.length === 0) {
      showToast('Seu carrinho está vazio.', 'error');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep('shipping');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.email || !shippingForm.address || !shippingForm.city) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }
    setCheckoutStep('payment');
  };

  const handleFinishPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
        showToast('Por favor, preencha os dados do cartão.', 'error');
        return;
      }
    }
    const simulatedId = 'VT-' + Math.floor(100000 + Math.random() * 90000);
    setOrderId(simulatedId);
    setCheckoutStep('completed');
    setCart([]);
    setAppliedCoupon(null);
    showToast('Pedido finalizado com sucesso!', 'success');
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() === '') return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    showToast('Cadastro realizado! Cupom VOLT100 liberado no seu e-mail.', 'success');
  };

  // Simulated Chatbot Support Answers
  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;

    const userMsg = chatInput;
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: timeStr }]);
    setChatInput('');
    setIsChatTyping(true);

    setTimeout(() => {
      let botResponse = 'Obrigado por entrar em contato! Nossa equipe técnica retornará em breve. Para respostas rápidas, tente selecionar uma das dúvidas frequentes.';
      const msgLower = userMsg.toLowerCase();

      if (msgLower.includes('prazo') || msgLower.includes('entrega') || msgLower.includes('frete')) {
        botResponse = 'O prazo de entrega expresso para capitais do Brasil é de 2 a 5 dias úteis. Regiões metropolitanas contam com frete grátis segurado e rastreamento completo pela VoltTec Logística.';
      } else if (msgLower.includes('garantia') || msgLower.includes('defeito')) {
        botResponse = 'Todos os produtos VoltTec contam com a Garantia Shiled Oficial de 30 dias com substituição expressa do aparelho caso haja defeitos de fabricação de hardware.';
      } else if (msgLower.includes('atend') || msgLower.includes('humanizado') || msgLower.includes('suporte')) {
        botResponse = 'Olá! Estou encaminhando você agora mesmo para o nosso suporte técnico humanizado pelo WhatsApp Oficial VoltTec. Um profissional da nossa equipe dará continuidade ao seu atendimento em instantes! Podendo também clicar no botão flutuante de atendimento para abrir direto no seu celular. Para contato de suporte ou dúvidas sobre demonstração, você pode nos chamar via WhatsApp pelo número (+55 11 99876-5432) ou através do e-mail oficial: volttecbrasil@gmail.com. ⚡';
      } else if (msgLower.includes('cupom') || msgLower.includes('desconto')) {
        botResponse = 'Atualmente temos os cupons ativos: VOLTTEC10 (10% de desconto) e VOLT100 (R$ 100 de desconto em compras acima de R$ 500). Digite-os na janela do seu carrinho para ativá-los!';
      } else if (msgLower.includes('pagamento') || msgLower.includes('pix') || msgLower.includes('cartao')) {
        botResponse = 'Aceitamos pagamentos instantâneos via Pix com 5% de desconto adicional ou parcelamento em até 12 vezes sem juros em todos os cartões de crédito internacionais.';
      } else if (msgLower.includes('verificado') || msgLower.includes('original')) {
        botResponse = 'A VoltTec é uma marca com selo Verificado Oficial. Todos os nossos lotes de mercadorias passam por perícia técnica rigorosa e acompanham Nota Fiscal Eletrônica (NFe) e certificado de autenticidade homologado.';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse, time: timeStr }]);
      setIsChatTyping(false);
    }, 1000);
  };

  const handleQuickQuestionClick = (question: string) => {
    setChatInput(question);
  };

  // Customer Reviews List (Static simulation)
  const reviews: Review[] = [
    { id: 1, name: 'Rodrigo Medeiros', rating: 5, date: '12/04/2026', comment: 'O relógio de titânio é animal! O acabamento é muito foda e a bateria tá durando demais, bati 5 dias seguidos sem precisar carregar. Comprarei mais vezes com certeza!', verified: true },
    { id: 2, name: 'Amanda Albuquerque', rating: 5, date: '28/03/2026', comment: 'Achei q o cancelamento de ruído era marketing mas isola tudo msm! Uso pra programar e agr não consigo voltar pro meu fone antigo de jeito nenhum kkk super recomendo!', verified: false },
    { id: 3, name: 'Bruno F. Souza', rating: 4, date: '05/02/2026', comment: 'Som 360 da caixinha é muito forte, o grave não distorce nada e os leds dão um estilo massa demais no setup. Demorou só 3 dias pra chegar em Belo Horizonte, bem embalado.', verified: true },
    { id: 4, name: 'Thiago Camargo', rating: 5, date: '18/05/2026', comment: 'Comprei o teclado mecânico translúcido e pqp, pessoalmente é ainda mais bonito! O clique é bem gostoso e a iluminação dele é diferenciada.', verified: false },
    { id: 5, name: 'Larissa Mendes', rating: 5, date: '02/05/2026', comment: 'Estava meio receosa pelas fotos, mas a base de indução em madeira legítima deu outra cara pro meu criado-mudo. Carrega rápido e o acabamento é impecável e clean.', verified: true },
    { id: 6, name: 'Felipe Nogueira', rating: 4, date: '29/04/2026', comment: 'O cabo blindado deles é excelente, bem robusto mesmo e aguenta o tranco. Só o envio q demorou 1 dia a mais por causa da chuva aq na minha cidade, mas o atendimento explicou tudo certinho.', verified: false },
    { id: 7, name: 'Gabriela Vasconcellos', rating: 4, date: '15/05/2026', comment: 'A luminária inteligente é linda demais, o app é super prático de usar. Só não dou 5 estrelas pq o cabo de força podia ser um pouquinho mais comprido, mas de resto tá sensacional.', verified: true },
    { id: 8, name: 'Matheus Garcia', rating: 4, date: '10/05/2026', comment: 'O carregador magnético de carro segura muito bem o celular msm nos buracos daqui da rua. Só achei o LED dele um tiquinho forte pra dirigir à noite, mas resolveu meu problema de bateria 100%.', verified: false },
    { id: 9, name: 'Juliana Portela', rating: 4, date: '04/05/2026', comment: 'Comprei o fone de ouvido esportivo e o som é excelente pra treinar correndo. Ele encaixa muito bem e não cai, só demorou um dia a mais pra transportadora liberar o código de rastreio.', verified: true }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col relative">

      {/* --- PROMOTIONAL HIGH CONVERTING TOP BAR --- */}
      <div className="bg-gradient-to-r from-amber-600 to-indigo-950 py-1.5 overflow-hidden w-full select-none border-b border-white/5">
        <div className="animate-marquee flex whitespace-nowrap gap-12 text-[11px] font-bold tracking-wider text-slate-100 uppercase">
          <div className="flex gap-12 shrink-0">
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
          </div>
          <div className="flex gap-12 shrink-0" aria-hidden="true">
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
            <span>Frete Expresso Grátis/Envios em até 24 horas</span>
          </div>
        </div>
      </div>

      {/* --- PREMIUM NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-[#070b13]/85 backdrop-blur-md border-b border-white/5 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo brand and categories menu combined on left */}
          <div className="flex items-center gap-3">
            {/* Three bars category trigger button */}
            <button
              onClick={() => setIsCategoryMenuOpen(true)}
              className="p-2 rounded-full bg-slate-900/40 hover:bg-slate-800/80 border border-white/5 hover:border-white/10 text-slate-300 hover:text-amber-400 transition-all flex items-center justify-center relative shadow-[0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer"
              title="Escolher Categorias"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand Logo with Verified Badge */}
            <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Volt
              </span>
              {/* Premium energetic lightning bolt matching the layout */}
              <div className="relative flex items-center justify-center -mx-0.5">
                <div className="absolute -inset-1 bg-amber-500/35 rounded-full blur-[4px] opacity-75 animate-pulse" />
                <Zap className="h-5 w-5 text-amber-500 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] relative z-10" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-[#f49f4f] bg-clip-text text-transparent">
                Tec
              </span>
              {/* Real aesthetic verified badge next to the name */}
              <div className="group relative flex items-center justify-center ml-1" title="Selo Oficial Verificado da VoltTec">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-400 p-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] flex items-center justify-center animate-pulse">
                  <Check className="h-3 w-3 text-white stroke-[4px]" />
                </span>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-[9px] text-cyan-200 px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Selo Oficial de Autenticidade
                </span>
              </div>
            </div>
          </div>

          {/* Search bar middle */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar eletrônicos de alta performance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/45 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 inset-y-0 flex items-center text-slate-400 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Actions on right */}
          <div className="flex items-center gap-4">
            
            {/* Real-time online users counter */}
            <div 
              className="bg-emerald-500/5 border border-emerald-500/20 rounded-full px-2.5 py-1.5 flex items-center gap-2 text-[10px] sm:text-xs text-emerald-400 font-medium whitespace-nowrap shadow-sm shadow-emerald-950/20 select-none animate-pulse"
              title="Quantidade de pessoas ativas neste momento visualizando produtos"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <Eye className="h-3.5 w-3.5 text-emerald-400 shrink-0 animate-pulse" />
              <span>
                <strong className="font-bold text-emerald-400">{onlineUsers}</strong>{' '}
                <span className="text-slate-300">Views tempo real</span>
              </span>
            </div>

            {/* Compare items button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="relative bg-slate-950/80 border border-amber-600/30 text-amber-400 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Scale className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Comparar ({compareList.length})</span>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* User Profile / Register button */}
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="p-2 text-slate-300 hover:text-amber-400 transition-colors relative cursor-pointer"
              aria-label="Área do cliente VoltTec"
              title={userProfile.isRegistered ? `Perfil de ${userProfile.name}` : "Central do Cliente / Registro"}
            >
              <User className={`h-5 w-5 ${userProfile.isRegistered ? 'text-amber-400' : ''}`} />
              {userProfile.isRegistered ? (
                <span className="absolute bottom-1.5 right-1.5 bg-emerald-500 rounded-full w-2 h-2 border border-[#070b13]" />
              ) : (
                <span className="absolute top-1.5 right-1.5 bg-amber-500 rounded-full w-1.5 h-1.5 animate-pulse" />
              )}
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="p-2 text-slate-300 hover:text-red-500 transition-colors relative"
              aria-label="Abrir favoritos"
            >
              <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon with Amount */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-white/20 p-2.5 rounded-full text-slate-100 flex items-center gap-2 transition-all relative"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-4.5 w-4.5 text-amber-400" />
              <span className="hidden sm:inline text-xs font-bold text-slate-200">
                {cart.reduce((s, i) => s + i.quantity, 0)} {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'itens'}
              </span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search input (under navy bar) */}
      <div className="md:hidden p-4 bg-[#070b13] border-b border-white/5">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar eletrônicos premium..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-amber-500/55 text-white"
          />
        </div>
      </div>

      <main className="flex-1">

        {/* --- EXCLUSIVE EXQUISITE HERO BANNER --- */}
        <section id="hero-banner" className="relative h-[480px] w-full overflow-hidden flex items-center bg-[#050811] px-4 md:px-12 py-12">
          
          {/* Ambient background styling */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/src/assets/images/hero_banner_volttec_1779327095646.png" 
              alt="VoltTec Banner Premium"
              className="w-full h-full object-cover object-center opacity-45 transform scale-105 filter blur-xs"
            />
            {/* Custom dark luxurious gradients on top of image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#03050a] via-[#050811]/90 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent z-10" />
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Core textual info */}
            <div className="lg:col-span-12 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" />
                <span>Coleção Exclusiva de Lançamento</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Tecnologia de Qualidade para o <span className="bg-gradient-to-r from-amber-450 via-amber-400 to-amber-600 bg-clip-text text-transparent">Seu Dia a Dia</span>
              </h1>

              <p className="text-sm md:text-base text-slate-350 max-w-xl leading-relaxed">
                Desenvolvemos eletrônicos avançados com atenção milimétrica a cada curva de frequência, potência de processamento e acabamento industrial em titânio e cobre. Sinta o amanhã hoje com a VoltTec.
              </p>

              <div className="flex flex-wrap gap-4 pt-1">
                <button 
                  onClick={() => {
                    const topProduct = products[0];
                    setSelectedProduct(topProduct);
                  }}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full border border-white/10 hover:border-white/20 inline-flex items-center gap-2 transition-all backdrop-blur-xs"
                >
                  <span>Ofertas Imperdíveis</span>
                  <Award className="h-4 w-4 text-amber-500" />
                </button>
              </div>

              {/* Verified Badge info footer inside hero */}
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 font-medium">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Marca Registrada e Verificada Oficialmente. Originalidade assegurada.</span>
              </div>
            </div>

          </div>
        </section>

        {/* --- BRAND VALUE PROPOSITION --- */}
        <section className="bg-slate-950 border-y border-white/5 py-6 px-1.5 sm:px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1 sm:gap-6 content-center text-center">
            
            <div className="flex flex-col items-center p-0.5 sm:p-3">
              <div className="p-1.5 sm:p-3 bg-indigo-950/50 rounded-full border border-indigo-500/20 mb-1.5 sm:mb-3">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </div>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-100 leading-tight">
                Garantia
              </h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-450 mt-0.5 sm:mt-1 leading-tight min-h-[24px] sm:min-h-0">
                Substituição imediata homologada
              </p>
            </div>

            <div className="flex flex-col items-center p-0.5 sm:p-3">
              <div className="p-1.5 sm:p-3 bg-indigo-950/50 rounded-full border border-indigo-500/20 mb-1.5 sm:mb-3">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </div>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-100 leading-tight">
                Frete Expresso Grátis
              </h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-450 mt-0.5 sm:mt-1 leading-tight min-h-[24px] sm:min-h-0">
                Envio prioritário 100% segurado
              </p>
            </div>

            <div className="flex flex-col items-center p-0.5 sm:p-3">
              <div className="p-1.5 sm:p-3 bg-indigo-950/50 rounded-full border border-indigo-500/20 mb-1.5 sm:mb-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </div>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-100 leading-tight">
                Atendimento 100% Humanizado
              </h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-450 mt-0.5 sm:mt-1 leading-tight min-h-[24px] sm:min-h-0">
                A solução está na Volttec
              </p>
            </div>

            <div className="flex flex-col items-center p-0.5 sm:p-3">
              <div className="p-1.5 sm:p-3 bg-indigo-950/50 rounded-full border border-indigo-500/20 mb-1.5 sm:mb-3">
                <Headphones className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </div>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-100 leading-tight">
                Suporte Técnico VoltTec
              </h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-slate-450 mt-0.5 sm:mt-1 leading-tight min-h-[24px] sm:min-h-0">
                WhatsApp e e-mail oficial
              </p>
            </div>

          </div>
        </section>

        {/* --- INTERACTIVE CATALOGUE GRID --- */}
        <section id="store-grid" className="max-w-7xl mx-auto py-16 px-4 md:px-8">
          
          {/* Main titles and Search query state */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="h-3 w-3" />
                <span>Equipamentos Oficiais</span>
              </div>
              <div className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black tracking-widest transition-all gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 select-none cursor-default">
                <h2 className="text-sm md:text-base font-black tracking-widest leading-none">
                  PRATELEIRA VOLTTEC
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1">Use os filtros para encontrar a fusão ideal de tecnologia e design industrial.</p>
            </div>

            {/* Filter tags */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'deals', label: '🔥 Ofertas Imperdíveis' },
                { id: 'bestsellers', label: '⭐ Mais Vendidos' },
                { id: 'electronics', label: '🔋 Eletrônicos' },
                { id: 'accessories', label: '🔌 Acessórios' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-600 text-black shadow-md shadow-amber-900/30'
                      : 'bg-slate-900 text-slate-350 border border-white/5 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search state report */}
          {searchQuery && (
            <div className="bg-slate-900 border border-white/5 rounded-xl p-4 mb-8 flex items-center justify-between text-xs">
              <div>
                Resultados para a busca: <span className="text-amber-400 font-bold">"{searchQuery}"</span> ({filteredProducts.length} itens encontrados)
              </div>
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white underline">
                Limpar Busca
              </button>
            </div>
          )}

          {/* Core products layout */}
          {filteredProducts.length > 0 ? (
            <div className="relative group/slider px-2">
              {/* Left Arrow Button for Slider - Always visible and active */}
              <button
                onClick={(e) => {
                  const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                  if (container) {
                    const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                    container.scrollBy({ left: -offset, behavior: 'smooth' });
                  }
                }}
                className="absolute left-1 sm:left-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                title="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Slider Container with disabled free drag/scroll-x */}
              <div className="slider-container flex overflow-x-hidden gap-6 pb-6 pt-2 px-[15vw] sm:px-4 snap-x snap-mandatory scroll-smooth select-none">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="w-[70vw] sm:w-[290px] shrink-0 snap-center">
                    <ProductCard
                      product={prod}
                      isFavorite={favorites.includes(prod.id)}
                      isCompared={compareList.some(p => p.id === prod.id)}
                      onSelect={setSelectedProduct}
                      onToggleFavorite={toggleFavorite}
                      onToggleCompare={toggleCompare}
                      onAddToCart={addToCart}
                    />
                  </div>
                ))}
              </div>

              {/* Right Arrow Button for Slider - Always visible and active */}
              <button
                onClick={(e) => {
                  const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                  if (container) {
                    const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                    container.scrollBy({ left: offset, behavior: 'smooth' });
                  }
                }}
                className="absolute right-1 sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                title="Próximo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 bg-slate-950 rounded-2xl border border-white/5 space-y-4">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">Nenhum produto correspondente</h3>
              <p className="text-xs max-w-md mx-auto">Não encontramos eletrônicos que correspondam aos filtros ou termo digitado. Tente pesquisar outro termo ou redefinir filtros.</p>
              <button 
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="bg-amber-600 text-black text-xs font-bold py-2 px-4 rounded-full mt-2 cursor-pointer"
              >
                Ver todos os Produtos
              </button>
            </div>
          )}
        </section>

        {/* --- CATEGORY-SPECIFIC SHELVES --- */}
        {!searchQuery && activeCategory === 'all' && (
          <div className="space-y-16 pb-16">
            
            {/* Shelf 1: 🔥 Ofertas Imperdíveis */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div>
                  <div className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black tracking-widest transition-all gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 select-none cursor-default">
                    <h3 className="text-sm md:text-base font-black tracking-widest leading-none">
                      OFERTAS IMPERDÍVEIS
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Descontos bombásticos por tempo limitado ou até durarem os estoques do lote especial de importação.</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveCategory('deals');
                    const storeGrid = document.getElementById('store-grid');
                    if (storeGrid) storeGrid.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group/slider">
                {/* Left Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: -offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-1 sm:left-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Slider Container with disabled free drag/scroll-x */}
                <div className="slider-container flex overflow-x-hidden gap-6 pb-6 pt-2 px-[15vw] sm:px-4 snap-x snap-mandatory scroll-smooth select-none">
                  {dealsProducts.map(p => (
                    <div key={p.id} className="w-[70vw] sm:w-[290px] shrink-0 snap-center">
                      <ProductCard
                        product={p}
                        isFavorite={favorites.includes(p.id)}
                        isCompared={compareList.some(comp => comp.id === p.id)}
                        onSelect={setSelectedProduct}
                        onToggleFavorite={toggleFavorite}
                        onToggleCompare={toggleCompare}
                        onAddToCart={addToCart}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-1 sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </section>

            {/* Shelf 2: ⭐ Mais Vendidos */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div>
                  <div className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black tracking-widest transition-all gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 select-none cursor-default">
                    <h3 className="text-sm md:text-base font-black tracking-widest leading-none">
                      MAIS VENDIDOS
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Os produtos preferidos de nossa comunidade técnica de alta performance.</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveCategory('bestsellers');
                    const storeGrid = document.getElementById('store-grid');
                    if (storeGrid) storeGrid.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Ver todos</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group/slider">
                {/* Left Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: -offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-1 sm:left-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Slider Container with disabled free drag/scroll-x */}
                <div className="slider-container flex overflow-x-hidden gap-6 pb-6 pt-2 px-[15vw] sm:px-4 snap-x snap-mandatory scroll-smooth select-none">
                  {bestsellersProducts.map(p => (
                    <div key={p.id} className="w-[70vw] sm:w-[290px] shrink-0 snap-center">
                      <ProductCard
                        product={p}
                        isFavorite={favorites.includes(p.id)}
                        isCompared={compareList.some(comp => comp.id === p.id)}
                        onSelect={setSelectedProduct}
                        onToggleFavorite={toggleFavorite}
                        onToggleCompare={toggleCompare}
                        onAddToCart={addToCart}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-1 sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </section>

            {/* Shelf 3: 🔋 Eletrônicos Avançados */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div>
                  <div className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black tracking-widest transition-all gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 select-none cursor-default">
                    <h3 className="text-sm md:text-base font-black tracking-widest leading-none">
                      ELETRÔNICOS AVANÇADOS
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">De Smartwatches Ultra a projetores digitais 4K e caixas sonoras com refinado design industrial.</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveCategory('electronics');
                    const storeGrid = document.getElementById('store-grid');
                    if (storeGrid) storeGrid.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Ver todos</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group/slider">
                {/* Left Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: -offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-1 sm:left-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Slider Container with disabled free drag/scroll-x */}
                <div className="slider-container flex overflow-x-hidden gap-6 pb-6 pt-2 px-[15vw] sm:px-4 snap-x snap-mandatory scroll-smooth select-none">
                  {electronicsProducts.map(p => (
                    <div key={p.id} className="w-[70vw] sm:w-[290px] shrink-0 snap-center">
                      <ProductCard
                        product={p}
                        isFavorite={favorites.includes(p.id)}
                        isCompared={compareList.some(comp => comp.id === p.id)}
                        onSelect={setSelectedProduct}
                        onToggleFavorite={toggleFavorite}
                        onToggleCompare={toggleCompare}
                        onAddToCart={addToCart}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-1 sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </section>

            {/* Shelf 4: 🔌 Acessórios & Cabos */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <div>
                  <div className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black tracking-widest transition-all gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 select-none cursor-default">
                    <h3 className="text-sm md:text-base font-black tracking-widest leading-none">
                      ACESSÓRIOS & CABOS
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Expansão de conectividade com carregadores, bases de indução em madeira e teclados mecânicos premium.</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveCategory('accessories');
                    const storeGrid = document.getElementById('store-grid');
                    if (storeGrid) storeGrid.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Ver todos</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group/slider">
                {/* Left Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: -offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-1 sm:left-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Slider Container with disabled free drag/scroll-x */}
                <div className="slider-container flex overflow-x-hidden gap-6 pb-6 pt-2 px-[15vw] sm:px-4 snap-x snap-mandatory scroll-smooth select-none">
                  {accessoriesProducts.map(p => (
                    <div key={p.id} className="w-[70vw] sm:w-[290px] shrink-0 snap-center">
                      <ProductCard
                        product={p}
                        isFavorite={favorites.includes(p.id)}
                        isCompared={compareList.some(comp => comp.id === p.id)}
                        onSelect={setSelectedProduct}
                        onToggleFavorite={toggleFavorite}
                        onToggleCompare={toggleCompare}
                        onAddToCart={addToCart}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow Button for Slider - Always visible and active */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.slider-container');
                    if (container) {
                      const offset = window.innerWidth < 640 ? window.innerWidth * 0.74 : 310;
                      container.scrollBy({ left: offset, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-1 sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 bg-[#0e1424]/95 hover:bg-[#070b13] text-amber-500 hover:text-amber-400 border border-amber-500/25 rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  title="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </section>

          </div>
        )}

        {/* --- REAL-TIME SHIPMENTS TRACKER --- */}
        <RealTimeShipments />

        {/* --- CUSTOMER SOCIAL PROOF / REVIEW LOGS --- */}
        <section className="max-w-7xl mx-auto py-16 px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black tracking-widest transition-all gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 select-none cursor-default">
              <h2 className="text-sm md:text-base font-black tracking-widest leading-none">
                FEEDBACKS DE NOSSOS CLIENTES
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Transparência auditada. Veja o relato de quem comprou e testou nossos eletrônicos premium.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 relative flex flex-col justify-between transition-all hover:scale-[1.01]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <Check className="h-3 w-3 text-[#3b82f6] bg-[#3b82f6]/10 p-0.5 rounded-full" title="Comprador Verificado" />
                        )}
                      </h4>
                      <span className="text-[10px] text-[#475569]">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                
                <div className="mt-4">
                  {rev.verified ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 px-2.5 py-1 rounded w-fit">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Compra Segura Verificada</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium bg-white/5 px-2.5 py-1 rounded w-fit">
                      <span>Avaliação de Visitante</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* --- FOOTER EXCLUSIVO PREMIUM --- */}
      <footer className="bg-[#03060c] border-t border-white/5 pt-16 pb-12 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
          
          {/* Logo column */}
          <div className="space-y-4 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
              <span className="text-2xl font-black text-white tracking-tight">Volt</span>
              <div className="relative flex items-center justify-center -mx-0.5">
                <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur-[3px] opacity-65" />
                <Zap className="h-4.5 w-4.5 text-amber-500 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] relative z-10" />
              </div>
              <span className="text-2xl font-black text-amber-400 tracking-tight">Tec</span>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-400 p-0.5 rounded-full flex items-center justify-center ml-1">
                <Check className="h-2.5 w-2.5 text-white stroke-[4px]" />
              </span>
            </div>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Inovação radical em eletrônicos de consumo premium. Projetando produtos refinados em titânio e áudio de alta amostragem.
            </p>
            <div className="text-slate-500 text-[10px] space-y-1">
              <p>VoltTec Brasil S.A.</p>
              <p>CNPJ: 45.192.502/0001-90</p>
              <p>E-mail: volttecbrasil@gmail.com</p>
            </div>
            
            {/* Redes sociais do Rodapé */}
            <div className="pt-2 space-y-2">
              <p className="text-[9px] uppercase tracking-wider text-slate-450 font-bold">Conecte-se Conosco / Clique Aqui</p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.instagram.com/volttec_brasil?igsh=MWFtNTk4b2Y4NGx3Zg%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-white/5 rounded-full border border-white/10 text-slate-300 hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-pink-500/5"
                  title="Siga no Instagram (@volttec_brasil)"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a 
                  href="https://tiktok.com/@volttecbrasil" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-white/5 rounded-full border border-white/10 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-cyan-500/5"
                  title="Siga no TikTok (@volttecbrasil)"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
                </a>
                <a 
                  href="https://wa.me/5511998765432" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 bg-white/5 rounded-full border border-white/10 text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-emerald-500/5"
                  title="Fale no WhatsApp (+55 11 99876-5432)"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Nav links columns */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Produtos</h4>
            <ul className="text-[11px] sm:text-xs text-slate-400 space-y-2">
              <li><a href="#store-grid" className="hover:text-amber-400 transition-colors">Wearables de Grafeno</a></li>
              <li><a href="#store-grid" className="hover:text-amber-400 transition-colors">Aparelhos de Áudio Pro</a></li>
              <li><a href="#store-grid" className="hover:text-amber-400 transition-colors">Bases Magnéticas Wood</a></li>
              <li><a href="#store-grid" className="hover:text-amber-400 transition-colors">Teclados Translúcidos</a></li>
            </ul>
          </div>

          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Segurança &amp; Termos</h4>
            <ul className="text-[11px] sm:text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> <span>Rastreamento em Blockchain</span></li>
              <li className="flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-cyan-400 shrink-0" /> <span>Transação Segura SSL</span></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Políticas de Devolução</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacidade LGPD</a></li>
            </ul>
          </div>

          <div className="space-y-3 col-span-2 lg:col-span-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Central VoltTec</h4>
            <p className="text-[11px] text-slate-450 leading-relaxed">Suporte prioritário 24/7. Abra a aba de conversação no canto inferior direito para auxílio de garantia imediato.</p>
            <a 
              href="https://wa.me/5511998765432"
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900 hover:bg-slate-850 hover:text-amber-400 text-slate-200 border border-white/10 text-[11px] sm:text-xs px-3 py-2 rounded-xl transition-all inline-flex items-center gap-2 font-semibold"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>Chame Nossa Equipe</span>
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-[10px] text-slate-500 font-medium">
          <p>© 2026 VoltTec Premium Inc. Todos os direitos reservados. Design e engenharia exclusivos.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Termos de Uso</span>
            <span className="hover:underline cursor-pointer">Licenças de Firmware</span>
          </div>
        </div>
      </footer>


      {/* --- SIDE DRAWER: FAVORITOS --- */}
      {isFavoritesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsFavoritesOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
          
          <div className="relative w-full max-w-md bg-[#070b13] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-20">
            
            {/* Header drawer */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <h3 className="text-base font-extrabold text-white">Meus Favoritos ({favorites.length})</h3>
              </div>
              <button onClick={() => setIsFavoritesOpen(false)} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {favorites.map(favId => {
                const prod = products.find(p => p.id === favId);
                if (!prod) return null;

                return (
                  <div key={prod.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-xl flex gap-4 items-center">
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-14 w-14 object-contain" 
                    />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{prod.title}</h4>
                      <p className="text-xs font-extrabold text-[#f49f4f] mt-1">R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          addToCart(prod, 1);
                          toggleFavorite(prod.id);
                        }}
                        className="bg-amber-600 hover:bg-amber-500 text-black text-[10px] uppercase font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        Comprar
                      </button>
                      <button 
                        onClick={() => toggleFavorite(prod.id)}
                        className="text-[10px] text-slate-500 hover:text-red-500 text-center transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}

              {favorites.length === 0 && (
                <div className="text-center py-16 text-slate-500 space-y-3">
                  <Heart className="h-8 w-8 mx-auto text-slate-600" />
                  <p className="text-xs">Nenhum eletrônico adicionado aos favoritos ainda.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5">
              <button 
                onClick={() => setIsFavoritesOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider text-center"
              >
                Voltar à Loja
              </button>
            </div>

          </div>
        </div>
      )}


      {/* --- SIDE DRAWER: SHOPPING CART --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
          
          <div className="relative w-full max-w-md bg-[#070b13] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-20">
            
            {/* Header drawer */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-white">Carrinho VoltTec ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {cart.map(item => (
                <div key={`${item.product.id}-${item.selectedColor}`} className="bg-slate-900/60 border border-white/5 p-4 rounded-xl flex gap-3 items-center">
                  <img 
                    src={item.product.image} 
                    alt={item.product.title} 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 object-contain" 
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.product.title}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{item.selectedColor}</span>
                    <p className="text-xs font-bold text-[#f49f4f] mt-1">R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    
                    {/* Item Count Selector */}
                    <div className="flex items-center gap-2 mt-2 bg-slate-950 px-2 py-1 rounded w-fit border border-white/5">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, -1)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-white font-bold px-1">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, 1)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                    className="p-1.5 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-16 text-slate-500 space-y-3">
                  <ShoppingCart className="h-8 w-8 mx-auto text-slate-600" />
                  <p className="text-xs">Seu carrinho está vazio.</p>
                </div>
              )}
            </div>

            {/* Bottom summary and Coupon Section */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4 bg-slate-950">
                
                {/* Coupon Input Form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="DIGITE CUPOM"
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-200 placeholder:text-slate-600 focus:outline-[#ea580c] focus:outline-1"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 hover:text-amber-400 text-slate-200 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Aplicar
                  </button>
                </form>

                {/* Coupon message displays */}
                {couponError && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {couponError}</p>}
                {couponSuccess && (
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold bg-emerald-500/5 p-2 rounded">
                    <span>{couponSuccess}</span>
                    <button type="button" onClick={handleRemoveCoupon} className="text-red-400 hover:underline">Remover</button>
                  </div>
                )}

                {/* Subtotal & Total display */}
                <div className="space-y-1.5 text-xs pt-2">
                  <div className="flex justify-between text-slate-450">
                    <span>Subtotal:</span>
                    <span>R$ {cartSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Desconto:</span>
                      <span>- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-white font-extrabold pt-2 border-t border-white/5">
                    <span>Total estimado:</span>
                    <span className="text-[#f49f4f]">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button 
                  onClick={handleStartCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl text-center flex items-center justify-center gap-2 mt-2"
                >
                  <span>Avançar para Checkout Seguro</span>
                  <Lock className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}


      {/* --- MODAL: DETALHES DO PRODUTO --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-3xl bg-[#070b13] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col">
            
            {/* Close action */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-800 text-slate-350 hover:text-white p-2 rounded-full border border-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Images view */}
                <div className="space-y-4">
                  <div className="bg-[#050912] rounded-xl p-6 h-64 md:h-80 flex items-center justify-center border border-white/5 relative">
                    <span className="absolute top-3 left-3 bg-indigo-950/80 border border-indigo-500/20 text-slate-100 text-[10px] font-bold px-2.5 py-1 rounded">
                      Selo de Origem OK
                    </span>
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.title} 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="max-h-[220px] max-w-full object-contain mx-auto" 
                    />
                  </div>
                  
                  {/* Share info buttons */}
                  <div className="flex gap-2 text-[10px] font-bold text-slate-450 justify-center">
                    <button 
                      onClick={() => showToast('Link de produto copiado!', 'success')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-lg hover:text-slate-200"
                    >
                      <Share2 className="h-3 w-3" /> COMPARTILHAR
                    </button>
                    <button 
                      onClick={() => toggleCompare(selectedProduct)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-lg hover:text-slate-200"
                    >
                      <Scale className="h-3 w-3" /> COMPARAR ESPECIFICAÇÕES
                    </button>
                  </div>
                </div>

                {/* Info and specs */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-amber-500 font-semibold uppercase">{selectedProduct.categoryLabel}</span>
                    <h3 className="text-xl font-extrabold text-white mt-1">{selectedProduct.title}</h3>
                    
                    {/* Stars rating */}
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(selectedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        ))}
                      </div>
                      <span className="text-slate-400">({selectedProduct.reviewsCount} avaliações qualificadas)</span>
                    </div>

                    <p className="text-xs text-slate-350 mt-4 leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {/* Color selection layout */}
                    <div className="mt-4 space-y-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Selecione uma tonalidade premium:</span>
                      <div className="flex gap-3">
                        {selectedProduct.colors.map(col => (
                          <button
                            key={col.name}
                            onClick={() => setSelectedColor(col.name)}
                            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 text-slate-100 rounded-full border transition-all ${
                              selectedColor === col.name
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-white/10 bg-slate-950 hover:bg-slate-900'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: col.hex }} />
                            <span>{col.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-500 line-through">R$ {selectedProduct.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span className="text-2xl font-black text-amber-500">R$ {selectedProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Disponível para pronta entrega. Despachado em até 24 Corridas úteis.</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct, 1, selectedColor);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Adicionar ao Carrinho</span>
                      </button>
                      <button
                        onClick={() => {
                          toggleFavorite(selectedProduct.id);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 py-4 px-5 rounded-xl transition-colors"
                        title="Favoritar"
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Technical features table */}
              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-amber-500" />
                    <span>Diferenciais Exclusivos VoltTec</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} className="text-[11px] text-slate-350 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Info className="h-4 w-4 text-amber-500" />
                    <span>Ficha de Engenharia</span>
                  </h4>
                  <div className="divide-y divide-white/5 bg-slate-950 border border-white/5 rounded-xl overflow-hidden">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-[10px] p-3">
                        <span className="text-slate-400 font-medium uppercase">{key}</span>
                        <span className="text-slate-200 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}


      {/* --- BOX DRAWER: SPEC COMPARE WINDOW --- */}
      {isCompareOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-[#070b13] border-t border-white/10 shadow-2xl p-6 transition-all max-h-[75vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-400 animate-bounce" />
                <h3 className="text-base font-extrabold text-white">Painel de Comparação Técnica ({compareList.length}/3)</h3>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCompareList([])}
                  className="text-xs text-slate-400 hover:text-white underline font-semibold"
                >
                  Limpar Todos
                </button>
                <button onClick={() => setIsCompareOpen(false)} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {compareList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {compareList.map(prod => (
                  <div key={prod.id} className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 space-y-4 flex flex-col justify-between relative">
                    
                    <button 
                      onClick={() => toggleCompare(prod)}
                      className="absolute top-2 right-2 hover:bg-white/10 p-1.5 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                      title="Excluir da comparação"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="space-y-2">
                      <img 
                        src={prod.image} 
                        alt={prod.title} 
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-24 w-full object-contain mx-auto" 
                      />
                      <h4 className="text-sm font-extrabold text-white text-center mt-2 line-clamp-1">{prod.title}</h4>
                      <div className="text-center">
                        <span className="text-xs text-slate-500 line-through">R$ {prod.originalPrice.toLocaleString('pt-BR')}</span>
                        <p className="text-sm font-bold text-amber-500">R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5 text-[10px] space-y-1 pt-2">
                      <div className="flex justify-between p-2">
                        <span className="text-slate-500">CATEGORIA:</span>
                        <span className="text-slate-350 font-bold">{prod.categoryLabel}</span>
                      </div>
                      <div className="flex justify-between p-2">
                        <span className="text-slate-500">ESTOQUE ATUAL:</span>
                        <span className="text-emerald-450 font-bold">{prod.stock} un</span>
                      </div>
                      
                      {/* Unique Specs entries of that product */}
                      {Object.entries(prod.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-2">
                          <span className="text-slate-500 uppercase">{key}:</span>
                          <span className="text-slate-200 text-right max-w-[60%]">{value}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        addToCart(prod, 1);
                        setIsCompareOpen(false);
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs py-2 rounded-xl"
                    >
                      Adicionar ao Carrinho
                    </button>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <p className="text-xs">Selecione até 3 produtos da prateleira clicando no botão de balança ao lado de cada um para compará-los.</p>
              </div>
            )}

          </div>
        </div>
      )}


      {/* --- INTERACTIVE CHATBOX SUPPORT SIMULATOR --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Support floating button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 p-3.5 rounded-full shadow-[0_0_20px_rgba(217,119,6,0.5)] text-slate-100 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          aria-label="Abrir suporte técnico"
        >
          {isChatOpen ? <X className="h-6 w-6 text-[#070b13]" /> : <MessageSquare className="h-6 w-6 text-[#070b13]" />}
        </button>

        {/* Support main Window */}
        {isChatOpen && (
          <div className="w-[340px] md:w-[380px] bg-[#070b13] border border-white/10 rounded-2xl shadow-2xl mt-3 flex flex-col overflow-hidden max-h-[460px] relative">
            
            {/* Header chat */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="w-8 h-8 rounded-full bg-amber-600/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-xs">VT</span>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#070b13] rounded-full" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    <span>VoltTec IA Assist</span>
                    <Check className="h-2.5 w-2.5 text-blue-400" />
                  </h4>
                  <p className="text-[9px] text-slate-400">Atendimento Técnico Verificado</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message logs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[280px] bg-[#050811]/60">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-amber-600 text-[#070b13] font-medium rounded-tr-none' 
                      : 'bg-[#0d1427] border border-white/5 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              
              {isChatTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-[#0d1427] border border-white/5 text-slate-350 p-2.5 rounded-xl rounded-tl-none text-xs flex items-center gap-1.5 font-semibold">
                    <span>Digitando</span>
                    <span className="inline-flex gap-0.5"><span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" /><span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" /></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Quick action helper buttons */}
            <div className="p-2 border-t border-white/5 space-x-1 space-y-1.5 flex flex-wrap bg-slate-950/80">
              {[
                'Prazo de entrega',
                'Como funciona a Garantia?',
                'Atend. Humanizado'
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestionClick(q)}
                  className="bg-slate-900 hover:bg-slate-850 hover:text-amber-400 text-slate-400 border border-white/5 text-[9px] font-bold px-2.5 py-1 rounded transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form submit */}
            <form onSubmit={handleChatSend} className="p-3 border-t border-white/5 flex gap-2 bg-[#070b13]">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escreva sua dúvida aqui..."
                className="flex-1 bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-[#070b13] p-2.5 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        )}
      </div>


      {/* --- MULTI-STEP CHECKOUT SEGURE DIALOG --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsCheckoutOpen(null)} className="absolute inset-0 bg-black/85" />
          
          <div className="relative w-full max-w-lg bg-[#070b13] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between col-span-1 bg-slate-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">Ambiente de Pagamento Criptografado SSL</h3>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Steps tracker indicators */}
            <div className="px-6 py-3.5 bg-slate-900/30 border-b border-white/5 flex items-center justify-around text-xs">
              <div className={`flex items-center gap-1.5 font-bold ${checkoutStep === 'shipping' ? 'text-amber-500' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>Dados de Envio</span>
              </div>
              <div className="h-px bg-white/5 w-12" />
              <div className={`flex items-center gap-1.5 font-bold ${checkoutStep === 'payment' ? 'text-amber-500' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>Pagamento</span>
              </div>
              <div className="h-px bg-white/5 w-12" />
              <div className={`flex items-center gap-1.5 font-bold ${checkoutStep === 'completed' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>Concluído</span>
              </div>
            </div>

            {/* Form scroll blocks */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
              
              {/* STEP 1: SHIPPING FORM */}
              {checkoutStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nome Completo *</label>
                    <input
                      required
                      type="text"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">E-mail para Rastrear *</label>
                      <input
                        required
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telefone com WhatsApp *</label>
                      <input
                        required
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CEP *</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.zip}
                        onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                        placeholder="00000-000"
                        className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Endereço de Entrega *</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Número *</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.number}
                        onChange={(e) => setShippingForm({ ...shippingForm, number: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cidade *</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estado *</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl text-center mt-3"
                  >
                    Prosseguir p/ Pagamento Seguro
                  </button>
                </form>
              )}

              {/* STEP 2: PAYMENT OPTIONS FORM */}
              {checkoutStep === 'payment' && (
                <form onSubmit={handleFinishPayment} className="space-y-6">
                  
                  {/* Selector Tabs */}
                  <div className="grid grid-cols-2 gap-3 h-12">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'pix'
                          ? 'border-amber-505 bg-amber-500/10 text-white'
                          : 'border-white/5 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="h-4 w-4 text-amber-500" />
                      <span>Pix Instantâneo (5% OFF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'border-amber-505 bg-amber-500/10 text-white'
                          : 'border-white/5 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>

                  {/* Payment sub sections */}
                  {paymentMethod === 'pix' ? (
                    <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 text-center space-y-4">
                      <div className="p-3 bg-white rounded-xl w-36 h-36 mx-auto flex items-center justify-center shadow-lg">
                        {/* Fake premium dynamic QR Code SVG */}
                        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                          <rect x="0" y="0" width="100" height="100" fill="white" />
                          <rect x="10" y="10" width="25" height="25" fill="black" />
                          <rect x="15" y="15" width="15" height="15" fill="white" />
                          <rect x="18" y="18" width="9" height="9" fill="black" />
                          <rect x="65" y="10" width="25" height="25" fill="black" />
                          <rect x="70" y="15" width="15" height="15" fill="white" />
                          <rect x="73" y="18" width="9" height="9" fill="black" />
                          <rect x="10" y="65" width="25" height="25" fill="black" />
                          <rect x="15" y="70" width="15" height="15" fill="white" />
                          <rect x="18" y="73" width="9" height="9" fill="black" />
                          {/* Inner pixels pattern */}
                          <rect x="40" y="20" width="5" height="10" fill="black" />
                          <rect x="50" y="10" width="10" height="5" fill="black" />
                          <rect x="45" y="30" width="10" height="10" fill="black" />
                          <rect x="40" y="50" width="15" height="5" fill="black" />
                          <rect x="70" y="45" width="5" height="15" fill="black" />
                          <rect x="80" y="65" width="10" height="20" fill="black" />
                          <rect x="65" y="80" width="15" height="5" fill="black" />
                        </svg>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 text-xs font-semibold">Desconto Adicional de Pix de 5% ativado</span>
                        <h4 className="text-lg font-black text-white">R$ {(cartTotal * 0.95).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                      </div>

                      <p className="text-[10px] text-slate-350 max-w-sm mx-auto leading-relaxed">
                        Pague com Pix copiando a chave abaixo. O seu processamento de envio VoltTec será homologado de maneira automática no momento em que a transação for concluída.
                      </p>

                      <div className="flex bg-[#050811] border border-white/5 rounded-lg p-2 items-center justify-between text-xs">
                        <span className="font-mono text-[9px] text-slate-450 truncate max-w-[80%]">volttec.checkout.pix.0192502-0001-90.sha256_vt</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('volttec.checkout.pix.0192502-0001-90.sha256_vt');
                            showToast('Código de Pix copiado!', 'success');
                          }}
                          className="text-amber-500 font-bold hover:underline"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Número do Cartão *</label>
                        <input
                          required
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardForm.number}
                          onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                          className="w-full bg-slate-950 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nome Impresso no Cartão *</label>
                        <input
                          required
                          type="text"
                          value={cardForm.name}
                          onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                          className="w-full bg-slate-950 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vencimento (MM/AA) *</label>
                          <input
                            required
                            type="text"
                            placeholder="MM/AA"
                            value={cardForm.expiry}
                            onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                            className="w-full bg-slate-950 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CVV *</label>
                          <input
                            required
                            type="text"
                            maxLength={4}
                            placeholder="000"
                            value={cardForm.cvv}
                            onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                            className="w-full bg-slate-950 border border-white/5 rounded-lg py-2 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-950 border border-white/5 p-4 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-450 font-medium">Total a Pagar agora:</span>
                    <span className="text-[#f49f4f] font-extrabold text-base">R$ {(paymentMethod === 'pix' ? cartTotal * 0.95 : cartTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl text-center"
                  >
                    Confirmar e Finalizar Compra
                  </button>

                  <p className="text-[9px] text-slate-500 text-center flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> Transação resguardada pela tecnologia de segurança VoltTec Shield.
                  </p>
                </form>
              )}

              {/* STEP 3: TRANSACTION SUCCESSFUL COMPLETED VIEW */}
              {checkoutStep === 'completed' && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 scale-110">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-[#fdfdfd]">Transação Autorizada com Sucesso!</h3>
                    <p className="text-xs text-slate-350 max-w-sm mx-auto leading-relaxed">
                      Seu pedido de eletrônicos foi processado de forma segura pela VoltTec. O comprovante de autenticidade em blockchain e a Nota Fiscal Eletrônica já foram despachados para o seu e-mail corporativo.
                    </p>
                  </div>

                  {/* Summary dynamic order details */}
                  <div className="bg-slate-950 border border-white/5 p-4 rounded-xl max-w-sm mx-auto divide-y divide-white/5 text-[10px] space-y-1.5 text-left">
                    <div className="flex justify-between p-1.5">
                      <span className="text-slate-500">CÓDIGO DE PEDIDO:</span>
                      <span className="text-slate-200 font-mono font-bold tracking-wider">{orderId}</span>
                    </div>
                    <div className="flex justify-between p-1.5">
                      <span className="text-slate-500">CLIENTE COMPRADOR:</span>
                      <span className="text-slate-200 font-semibold">{shippingForm.name}</span>
                    </div>
                    <div className="flex justify-between p-1.5">
                      <span className="text-slate-500">PREVISÃO DE ENTREGA:</span>
                      <span className="text-emerald-400 font-bold">2 a 4 Dias Úteis (Expresso)</span>
                    </div>
                    <div className="flex justify-between p-1.5 pt-2 border-t font-semibold">
                      <span className="text-slate-400 font-bold">MÉTODO DE PAGAMENTO:</span>
                      <span className="text-amber-500 uppercase">{paymentMethod}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutStep('shipping');
                    }}
                    className="w-full max-w-xs bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs uppercase py-3.5 rounded-xl text-center mx-auto block"
                  >
                    Voltar para a Página Inicial
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* --- SIDE DRAWER: CATEGORIES (THREE BARS) --- */}
      {isCategoryMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start animate-fade-in">
          <div onClick={() => setIsCategoryMenuOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer" />
          
          <div className="relative w-full max-w-xs bg-[#070b13] border-r border-white/10 h-full flex flex-col justify-between shadow-2xl z-20">
            
            {/* Header drawer */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => { setActiveCategory('all'); setSearchQuery(''); setIsCategoryMenuOpen(false); }}>
                <span className="text-xl font-black text-white tracking-tight">Volt</span>
                <div className="relative flex items-center justify-center -mx-0.5">
                  <Zap className="h-4.5 w-4.5 text-amber-500 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                </div>
                <span className="text-xl font-black text-amber-400 tracking-tight">Tec</span>
              </div>
              <button onClick={() => setIsCategoryMenuOpen(false)} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Navegar Categorias</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'Todos os Eletrônicos' },
                    { id: 'deals', label: '🔥 Ofertas Imperdíveis' },
                    { id: 'bestsellers', label: '⭐ Mais Vendidos' },
                    { id: 'electronics', label: '🔋 Eletrônicos' },
                    { id: 'accessories', label: '🔌 Acessórios & Cabos' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsCategoryMenuOpen(false);
                        const storeGrid = document.getElementById('store-grid');
                        if (storeGrid) storeGrid.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-amber-600 text-black font-extrabold shadow-lg shadow-amber-600/20'
                          : 'bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:text-white border border-white/5'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>


            </div>

            {/* Support button representation at bottom */}
            <div className="p-6 border-t border-white/5 flex flex-col gap-2 bg-slate-950/40">
              <div className="text-[10px] text-slate-500 text-center">Precisa de ajuda especializada de hardware?</div>
              <button
                onClick={() => {
                  setIsCategoryMenuOpen(false);
                  setIsChatOpen(true);
                }}
                className="w-full bg-amber-600/10 border border-amber-500/25 hover:bg-amber-600/20 text-amber-400 hover:text-amber-350 text-xs font-bold py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat Técnico de Suporte</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- FLOATING DIALOG MODAL: USER ACCOUNT / REGISTER --- */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsRegisterOpen(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity cursor-pointer" />
          
          <div className="relative w-full max-w-md bg-[#090e1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-fade-in">
            
            {/* Header modal */}
            <div className="p-6 border-b border-white/5 bg-slate-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-white">Central do Cliente VoltTec</h3>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Account registration dynamic states */}
            <div className="p-6 space-y-6">
              
              {userProfile.isRegistered ? (
                // 1. REGISTERED STATE VIEW (VIP CLIENT PANEL)
                <div className="space-y-6 text-center">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full blur-md opacity-35 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-amber-500/30 flex items-center justify-center relative z-10">
                      <User className="h-8 w-8 text-amber-400" />
                    </div>
                    <span className="absolute bottom-1 right-2 bg-gradient-to-r from-blue-600 to-cyan-400 p-1 rounded-full shadow-lg flex items-center justify-center z-20">
                      <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <h4 className="text-base font-bold text-white">{userProfile.name}</h4>
                      <span className="bg-amber-600/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20">VIP Verificado</span>
                    </div>
                    <p className="text-xs text-slate-400">{userProfile.email}</p>
                  </div>

                  {/* VIP Club Reward copy widget */}
                  <div className="bg-slate-900/85 border border-white/5 p-4 rounded-xl space-y-3">
                    <p className="text-xs text-slate-300 font-medium">Sua Recompensa por se Registrar:</p>
                    <div className="flex items-center justify-between bg-slate-950 px-3 py-2.5 rounded-lg border border-amber-500/20">
                      <span className="font-mono text-sm font-bold text-amber-400">VOLTCLUB10</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('VOLTCLUB10');
                          showToast('Cupom VIP copiado com sucesso!', 'success');
                        }}
                        className="text-[10px] bg-amber-600 hover:bg-amber-500 text-black font-black uppercase px-3 py-1.5 rounded transition-all cursor-pointer"
                      >
                        Copiar
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Dá mais 10% de desconto adicional nas compras do carrinho! Use ao finalizar o pedido!</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsRegisterOpen(false)}
                      className="flex-1 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold uppercase py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Continuar Comprando
                    </button>
                    <button
                      onClick={() => {
                        const cleared = { name: '', email: '', isRegistered: false };
                        setUserProfile(cleared);
                        localStorage.removeItem('volttec_profile');
                        showToast('Você desvinculou sua conta VIP.', 'info');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 hover:text-red-400 text-slate-400 text-xs font-bold uppercase px-4 py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                // 2. UNREGISTERED STATE VIEW (FORM)
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const name = fd.get('name') as string;
                    const email = fd.get('email') as string;
                    
                    if (!name || !email) {
                      showToast('Preencha os campos obrigatórios.', 'error');
                      return;
                    }

                    const profile = { name, email, isRegistered: true };
                    setUserProfile(profile);
                    localStorage.setItem('volttec_profile', JSON.stringify(profile));
                    showToast(`Parabéns ${name}! Cadastro completo. Copie seu Cupom VIP!`, 'success');
                  }}
                  className="space-y-4"
                >
                  <div className="text-center space-y-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20">
                      <Sparkles className="h-3 w-3" />
                      <span>Cadastre-se e Ganhe Descontos Exclusivos</span>
                    </div>
                    <h4 className="text-xs text-slate-400 leading-relaxed">Crie sua conta VIP para registrar o status de garantia de hardware e liberar o cupom oficial do clube.</h4>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-450 font-semibold uppercase block">Seu Nome Completo *</label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Ex: Rodrigo Souza"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-450 font-semibold uppercase block">Seu Melhor E-mail *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-450 font-semibold uppercase block">Área de Principal Interesse</label>
                    <select
                      name="interest"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="electronics">Eletrônicos e Casa Inteligente</option>
                      <option value="accessories">Acessórios de Alta Tensão</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" required id="agreeClub" className="rounded bg-slate-900 border-white/10 accent-amber-500 cursor-pointer" />
                    <label htmlFor="agreeClub" className="text-[10px] text-slate-450 leading-tight cursor-pointer">
                      Aceito participar do VoltTec VIP Club e receber ofertas e privilégios exclusivos de lote verificado.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-amber-950/20 cursor-pointer"
                  >
                    Ativar Conta VIP VoltTec
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}


      {/* --- TOAST SYSTEM FLOAT PORTAL MESSAGE --- */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in-down">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-[#0f1d14]/95 border-emerald-500/30 text-emerald-400' 
              : toast.type === 'error'
              ? 'bg-[#220d0f]/95 border-red-500/30 text-red-400'
              : 'bg-[#09152a]/95 border-blue-500/20 text-blue-300'
          }`}>
            <span className="p-1 rounded-full bg-white/5 flex items-center justify-center">
              {toast.type === 'success' ? <Check className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            </span>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-[10px] text-slate-400 hover:text-white underline font-bold px-1 ml-2">X</button>
          </div>
        </div>
      )}

      {/* --- COOKIE CONSENT BANNER BOTTOM --- */}
      {showCookieBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0 z-50 bg-[#0e1424]/95 backdrop-blur-md border border-white/10 md:border-t md:border-x-0 md:border-b-0 rounded-2xl md:rounded-none shadow-[0_-10px_30px_rgba(0,0,0,0.60)] p-3.5 sm:p-5 md:p-6 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 animate-fade-in-up">
          <div className="max-w-4xl space-y-1 text-left">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span className="p-0.5 rounded bg-amber-500/10 text-amber-500 text-xs">🍪</span>
              Sua privacidade é nossa prioridade
            </h4>
            <p className="text-[10.5px] sm:text-xs text-slate-300 leading-relaxed md:leading-normal">
              Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento correto do nosso site, analisar o desempenho técnico, personalizar ofertas e aprimorar a sua experiência na VoltTec. Ao clicar em <strong className="text-amber-400">"Aceitar Cookies"</strong>, você concorda com o armazenamento dessas informações em seu dispositivo.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={handleDeclineCookies}
              className="flex-1 md:flex-none text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl transition-all cursor-pointer text-center"
            >
              Não Permitir
            </button>
            <button
              onClick={handleAcceptCookies}
              className="flex-1 md:flex-none text-black bg-amber-600 hover:bg-amber-500 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl transition-all shadow-md shadow-amber-950/20 cursor-pointer text-center"
            >
              Aceitar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
