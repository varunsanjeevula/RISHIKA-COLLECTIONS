'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', image_url: '', category: 'clothes'
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    if (error) showMessage('error', 'Failed to load products');
    setLoading(false);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', image_url: '', category: 'clothes' });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const result = await res.json();
      
      if (res.ok) {
        setFormData({ ...formData, image_url: result.url });
        showMessage('success', 'Image uploaded successfully!');
      } else {
        showMessage('error', `Upload failed: ${result.error}`);
      }
    } catch (error) {
      showMessage('error', 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      category: formData.category
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from('products').update(productData).eq('id', editingProduct.id));
    } else {
      ({ error } = await supabase.from('products').insert([productData]));
    }

    if (error) {
      showMessage('error', `Failed to ${editingProduct ? 'update' : 'add'} product: ${error.message}`);
    } else {
      showMessage('success', `Product ${editingProduct ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchProducts();
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      showMessage('error', 'Failed to delete product');
    } else {
      showMessage('success', 'Product deleted successfully!');
      fetchProducts();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage your products</p>
        </div>
        <button className="admin-add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <div className="admin-form-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Royal Silk Saree" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Product description..." rows={3} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min="0" step="0.01" placeholder="2499" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="clothes">Clothes</option>
                  <option value="jewellery">Jewellery</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Image Upload</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploadingImage}
                  style={{ padding: '8px', background: 'var(--color-bg-secondary)', cursor: 'pointer' }}
                />
                <input 
                  type="text" 
                  value={formData.image_url} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                  placeholder="Or paste image URL here..." 
                />
              </div>
              {uploadingImage && <div style={{ color: 'var(--color-gold)', fontSize: '0.8rem', marginTop: '4px' }}>Uploading image...</div>}
            </div>
            {formData.image_url && (
              <div className="form-image-preview">
                <Image src={formData.image_url} alt="Preview" width={200} height={200} style={{ objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            )}
            <div className="form-actions">
              <button type="button" className="form-cancel-btn" onClick={resetForm}>Cancel</button>
              <button type="submit" className="form-submit-btn" disabled={saving}>
                {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading products...</div>
      ) : (
        <>
          <div className="admin-filters">
            <button className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Products</button>
            <button className={`filter-tab ${activeTab === 'clothes' ? 'active' : ''}`} onClick={() => setActiveTab('clothes')}>Clothes</button>
            <button className={`filter-tab ${activeTab === 'jewellery' ? 'active' : ''}`} onClick={() => setActiveTab('jewellery')}>Jewellery</button>
          </div>
          <div className="admin-products-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td><span className="admin-product-number">#{String(index + 1).padStart(2, '0')}</span></td>
                  <td>
                    <div className="admin-product-img">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <div className="admin-no-img">No image</div>
                      )}
                    </div>
                  </td>
                  <td><strong>{product.name}</strong></td>
                  <td><span className="admin-category-badge">{product.category}</span></td>
                  <td>₹{product.price.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-edit-btn" onClick={() => handleEdit(product)} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button className="admin-delete-btn" onClick={() => handleDelete(product.id)} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="admin-empty">No products found in this category.</div>
          )}
        </div>
        </>
      )}
    </div>
  );
}
