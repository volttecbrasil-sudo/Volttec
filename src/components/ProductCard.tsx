import React from 'react';
import { Heart, Scale, Star, Zap, ShoppingCart } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  isCompared: boolean;
  onSelect: (p: Product) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  isCompared,
  onSelect,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
}) => {
  return (
    <div 
      className="bg-gradient-to-b from-[#0e1424]/90 to-[#070b13]/90 border border-white/5 hover:border-amber-500/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-350 hover:-translate-y-1 relative flex flex-col justify-between group"
    >
      {/* Absolute positioning details */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5Packed font-medium">
        {product.badge && (
          <span className="bg-[#ea580c] text-neutral-100 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
            {product.badge}
          </span>
        )}
        {product.stock <= 6 && (
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold px-2 py-0.5 rounded">
            Apenas {product.stock} em estoque
          </span>
        )}
      </div>

      {/* Absolute top right actions */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 opacity-95 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`p-2 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer ${
            isFavorite
              ? 'bg-red-950/80 border-red-500/30 text-red-500'
              : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-red-500 hover:bg-slate-800'
          }`}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer ${
            isCompared
              ? 'bg-amber-950/80 border-amber-500/30 text-amber-400'
              : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-amber-400 hover:bg-slate-800'
          }`}
          title={isCompared ? "Remover da comparação" : "Comparar especificações"}
        >
          <Scale className="h-4 w-4" />
        </button>
      </div>

      {/* Top product imagery section */}
      <div 
        onClick={() => onSelect(product)} 
        className="cursor-pointer bg-[#050912] p-6 h-64 flex items-center justify-center relative overflow-hidden group-hover:bg-[#070c17] transition-all"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424]/40 to-transparent pointer-events-none" />
        <img 
          src={product.image} 
          alt={product.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="max-h-[190px] max-w-full object-contain my-auto transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Bottom textual section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold">{product.categoryLabel}</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelect(product)} 
            className="text-base text-white font-bold cursor-pointer hover:text-amber-400 transition-colors line-clamp-1"
          >
            {product.title}
          </h3>
          
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-8">
            {product.description}
          </p>
        </div>

        {/* Price with monthly installments */}
        <div className="pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500 line-through">
              R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-lg font-extrabold text-[#f49f4f] tracking-tight">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-semibold">
            <Zap className="h-3 w-3" />
            <span>ou até 12x de R$ {(product.price / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sem juros</span>
          </div>
        </div>

        {/* Custom actionable footer */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onSelect(product)}
            className="flex-1 bg-slate-900 hover:bg-slate-850 text-white border border-white/5 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
          >
            Detalhes
          </button>
          <button
            onClick={() => onAddToCart(product, 1)}
            className="flex-1 bg-amber-600 hover:bg-amber-500 text-[#070b13] font-black text-xs uppercase tracking-wider py-3 rounded-xl inline-flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Comprar</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
