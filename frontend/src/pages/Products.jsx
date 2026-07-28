import React, { useState, useEffect, useContext, useCallback } from 'react';
import { getProductsApi, addToCartApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, total: 0 });

  // Filters state
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  const { refreshCartCount, showToast } = useContext(AuthContext);

  // Categories list
  const categories = [
    'Electronics',
    'Clothing',
    'Footwear',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
      };
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const res = await getProductsApi(params);
      if (res.success && res.data) {
        setProducts(res.data.products || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  }, [category, minPrice, maxPrice, sort, page, showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId) => {
    try {
      const res = await addToCartApi({ productId, quantity: 1 });
      if (res.success) {
        showToast(res.message || 'Added to cart!', 'success');
        refreshCartCount();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add item to cart', 'error');
    }
  };

  const resetFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 border border-white/30">
            High Concurrency Flash Sale
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover Tech & Daily Deals at QuickKart
          </h1>
          <p className="text-orange-100 text-sm sm:text-base font-medium mt-2">
            Enjoy lightning fast ordering, real-time inventory tracking, and exclusive discounts.
          </p>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </h3>
              {(category || minPrice || maxPrice || sort) && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Default (Newest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State Illustration */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
              <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">No Products Found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                We couldn't find any products matching your selected criteria. Try adjusting your filters or price range.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid (3 columns desktop, 1 mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total items)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                        page === 1
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                      disabled={page === pagination.totalPages}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                        page === pagination.totalPages
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  );
};

export default Products;
