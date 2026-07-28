import React, { useState } from 'react';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
    DELIVERED: 'bg-green-100 text-green-800 border-green-300',
    CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  };

  const badgeClass = statusStyles[order.status] || 'bg-slate-100 text-slate-800 border-slate-300';

  const itemsCount = order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden mb-4">
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-800">
                #{order._id ? order._id.slice(-8).toUpperCase() : 'ORDER'}
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                {order.status}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-medium block">Total ({itemsCount} items)</span>
            <span className="text-lg font-black text-slate-900">₹{(order.totalAmount || 0).toLocaleString()}</span>
          </div>

          <div className="p-2 rounded-lg text-slate-400 hover:text-slate-600">
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expandable Order Details */}
      {expanded && (
        <div className="p-5 bg-slate-50/70 border-t border-slate-200/80 animate-fade-in">
          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="mb-4 bg-white p-3.5 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Shipping Address
              </h5>
              <p className="text-sm font-medium text-slate-800">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          )}

          {/* Items List */}
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Order Items</h5>
          <div className="space-y-2">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {item.product?.name || `Product ID: ${item.product}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        Price at Order: ₹{(item.priceAtOrder || item.PriceAtOrder || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-medium block">Qty: {item.quantity}</span>
                    <span className="text-sm font-bold text-slate-900">
                      ₹{((item.priceAtOrder || item.PriceAtOrder || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No detailed item info available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
