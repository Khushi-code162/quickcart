import React, { useState } from 'react';

const CartItem = ({ item, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(item.productId);
    } finally {
      setRemoving(false);
    }
  };

  const itemTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-orange-200 transition-all gap-4">
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center shrink-0 overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
              {item.name ? item.name.charAt(0) : 'P'}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">{item.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">Unit Price: <span className="font-semibold text-slate-700">₹{(item.price || 0).toLocaleString()}</span></p>
          <div className="inline-flex items-center gap-1.5 mt-1.5 bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs font-semibold text-slate-700">
            <span>Qty:</span>
            <span className="text-orange-600 font-bold">{item.quantity}</span>
          </div>
        </div>
      </div>

      {/* Subtotal & Delete Action */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400 block font-medium">Item Total</span>
          <span className="text-lg font-black text-slate-900">₹{itemTotal.toLocaleString()}</span>
        </div>

        <button
          onClick={handleRemove}
          disabled={removing}
          title="Remove Item"
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
        >
          {removing ? (
            <svg className="w-5 h-5 animate-spin text-red-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
};

export default CartItem;
