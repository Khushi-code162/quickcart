import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartApi, removeFromCartApi, placeOrderApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import AddressModal from '../components/AddressModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  const { refreshCartCount, showToast } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCartApi();
      if (res.success && res.data && res.data.cart) {
        setCart(res.data.cart);
      } else {
        setCart({ items: [], total: 0 });
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = async (productId) => {
    try {
      const res = await removeFromCartApi(productId);
      if (res.success) {
        showToast('Item removed from cart', 'success');
        fetchCart();
        refreshCartCount();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove item', 'error');
    }
  };

  const handlePlaceOrder = async (shippingAddress) => {
    try {
      const res = await placeOrderApi({ shippingAddress });
      if (res.success && res.data && res.data.order) {
        setCart({ items: [], total: 0 });
        refreshCartCount();
        setIsModalOpen(false);
        setOrderSuccess(true);
        setLastOrderId(res.data.order._id);
        showToast('Order placed successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
      throw err;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching your QuickKart cart..." />;
  }

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-slide-down">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h2>
          <p className="text-slate-500 text-sm mt-2">
            Thank you for shopping with QuickKart. Your order{' '}
            <span className="font-bold text-orange-600">#{lastOrderId?.slice(-8).toUpperCase()}</span> is now being processed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = cart.items || [];
  const totalAmount = cart.total || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Shop
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty Cart Illustration */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-28 h-28 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Your Cart is Empty</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our flash sale products and find great deals!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} onRemove={handleRemoveItem} />
            ))}
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="text-slate-400 font-normal">Included</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-900">Total Payable</span>
                <span className="text-2xl font-black text-orange-600">₹{totalAmount.toLocaleString()}</span>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base rounded-2xl shadow-xl hover:shadow-orange-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Place Order</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>100% Secure Express Checkout</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Address Checkout Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePlaceOrder}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default Cart;
