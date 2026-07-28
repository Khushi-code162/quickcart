import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getOrdersApi,
  updateOrderStatusApi,
} from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'create' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(AuthContext);

  // Product Form State (for Create & Edit)
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    isFlashSale: false,
    flashSalePrice: '',
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Order status update state
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('CONFIRMED');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const categories = [
    'Electronics',
    'Clothing',
    'Footwear',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
  ];

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        getProductsApi({ limit: 100 }),
        getOrdersApi(),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data.products || []);
      }
      if (orderRes.success && orderRes.data) {
        setOrders(orderRes.data.orders || []);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Handle Form input change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit Create or Edit Product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.stock) {
      showToast('Please fill in all required product fields', 'error');
      return;
    }

    setSubmittingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        category: productForm.category,
        stock: Number(productForm.stock),
        isFlashSale: Boolean(productForm.isFlashSale),
        flashSalePrice: productForm.isFlashSale && productForm.flashSalePrice ? Number(productForm.flashSalePrice) : null,
      };

      if (editingProductId) {
        const res = await updateProductApi(editingProductId, payload);
        if (res.success) {
          showToast('Product updated successfully!', 'success');
        }
      } else {
        const res = await createProductApi(payload);
        if (res.success) {
          showToast('Product created successfully!', 'success');
        }
      }

      resetProductForm();
      fetchAdminData();
      setActiveTab('products');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Start Editing Product
  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Electronics',
      stock: product.stock || '',
      isFlashSale: product.isFlashSale || false,
      flashSalePrice: product.flashSalePrice || '',
    });
    setActiveTab('create');
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await deleteProductApi(id);
      if (res.success) {
        showToast('Product deleted successfully', 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  // Reset Product Form
  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '',
      isFlashSale: false,
      flashSalePrice: '',
    });
  };

  // Update Order Status Handler
  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) {
      showToast('Please select an order to update', 'error');
      return;
    }

    setUpdatingStatus(true);
    try {
      const res = await updateOrderStatusApi(selectedOrderId, selectedStatus, statusNote);
      if (res.success) {
        showToast(`Order status updated to ${selectedStatus}`, 'success');
        fetchAdminData();
        setSelectedOrderId('');
        setStatusNote('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Admin Dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Admin Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md tracking-wider uppercase">
              ADMIN CONTROL PANEL
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Management Dashboard</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage inventory, create flash sales, and update order statuses in real-time.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-initial ${
              activeTab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => {
              resetProductForm();
              setActiveTab('create');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-initial ${
              activeTab === 'create' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            {editingProductId ? 'Edit Product' : '+ Add Product'}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-initial ${
              activeTab === 'orders' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Tab Content 1: Inventory Products List */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900">Product Inventory</h3>
            <button
              onClick={() => {
                resetProductForm();
                setActiveTab('create');
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="p-4 rounded-l-xl">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Flash Sale</th>
                  <th className="p-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No products created yet. Click "+ Add Product" to create one!
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{p.name}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">₹{p.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            p.stock <= 0
                              ? 'bg-red-100 text-red-700'
                              : p.stock < 10
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        {p.isFlashSale ? (
                          <span className="bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            YES (₹{p.flashSalePrice})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-semibold">No</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                            title="Edit Product"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Product"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Create / Edit Product Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900">
              {editingProductId ? 'Edit Product Details' : 'Create New Product'}
            </h3>
            <button
              onClick={() => {
                resetProductForm();
                setActiveTab('products');
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleFormChange}
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                value={productForm.description}
                onChange={handleFormChange}
                placeholder="Detailed description of features and specifications..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  placeholder="2999"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleFormChange}
                  placeholder="50"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Flash Sale Toggle */}
            <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">Flash Sale Product</span>
                  <span className="text-xs text-slate-500 font-medium">Highlight this item in flash sale promotions</span>
                </div>
                <input
                  type="checkbox"
                  name="isFlashSale"
                  checked={productForm.isFlashSale}
                  onChange={handleFormChange}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                />
              </div>

              {productForm.isFlashSale && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Flash Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    name="flashSalePrice"
                    value={productForm.flashSalePrice}
                    onChange={handleFormChange}
                    placeholder="e.g. 1999"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium bg-white"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              {submittingProduct ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving Product...</span>
                </>
              ) : (
                <span>{editingProductId ? 'Update Product' : 'Create Product'}</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 3: Orders Status Management */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Status Update Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Update Order Status
              </h3>

              <form onSubmit={handleStatusUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Customer Order
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">-- Choose Order --</option>
                    {orders.map((o) => (
                      <option key={o._id} value={o._id}>
                        #{o._id.slice(-8).toUpperCase()} - {o.status} (₹{o.totalAmount})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    New Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="CONFIRMED">CONFIRMED (Blue)</option>
                    <option value="SHIPPED">SHIPPED (Purple)</option>
                    <option value="DELIVERED">DELIVERED (Green)</option>
                    <option value="CANCELLED">CANCELLED (Red)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Dispatched via Express Courier"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus || !selectedOrderId}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {updatingStatus ? (
                    <span>Updating Status...</span>
                  ) : (
                    <span>Apply Status Change</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Orders List Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                All Customer Orders
              </h3>

              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4">No customer orders placed yet.</p>
                ) : (
                  orders.map((o) => (
                    <div
                      key={o._id}
                      onClick={() => setSelectedOrderId(o._id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedOrderId === o._id
                          ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-slate-800">
                            #{o._id.slice(-8).toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 block font-medium">
                            User ID: {o.user}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">
                            ₹{(o.totalAmount || 0).toLocaleString()}
                          </span>
                          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Admin;
