import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await onAddToCart(product._id);
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isFlashSale = product.isFlashSale;
  const effectivePrice = isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price;

  // Visual placeholder gradient based on product category
  const categoryGradients = {
    electronics: 'from-blue-500 to-indigo-600',
    fashion: 'from-pink-500 to-rose-600',
    clothing: 'from-purple-500 to-indigo-600',
    footwear: 'from-amber-500 to-orange-600',
    home: 'from-emerald-500 to-teal-600',
    books: 'from-amber-600 to-yellow-700',
    sports: 'from-cyan-500 to-blue-600',
  };

  const gradient = categoryGradients[product.category?.toLowerCase()] || 'from-orange-500 to-amber-600';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Product Image / Placeholder Header */}
      <div className="relative w-full h-52 bg-slate-100 overflow-hidden flex items-center justify-center">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback Styled Banner */}
        <div
          className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 text-white text-center transition-transform duration-500 group-hover:scale-105 ${
            product.images && product.images[0] ? 'hidden' : 'flex'
          }`}
        >
          <svg className="w-14 h-14 mb-2 opacity-90 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">{product.category}</span>
        </div>

        {/* Flash Sale Badge */}
        {isFlashSale && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            FLASH SALE
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Badge & Name */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100 uppercase tracking-wider">
              {product.category || 'General'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Stock: {product.stock}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors" title={product.name}>
            {product.name}
          </h3>

          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.description || 'High quality product available with fast delivery on QuickKart.'}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ₹{effectivePrice.toLocaleString()}
              </span>
              {isFlashSale && product.price > effectivePrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            {isFlashSale && product.price > effectivePrice && (
              <span className="text-[11px] font-bold text-emerald-600">
                Save ₹{(product.price - effectivePrice).toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : adding
                ? 'bg-orange-400 text-white cursor-wait'
                : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-500/25 active:scale-95'
            }`}
          >
            {adding ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
