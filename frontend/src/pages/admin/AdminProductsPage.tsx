import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../types';
import { productService, resolveImageUrl } from '../../services/api';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    title: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    stockCount: 0
  });
  const [formError, setFormError] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ title: '', description: '', price: 0, category: '', imageUrl: '', stockCount: 0 });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stockCount: product.stockCount
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    });
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please choose an image file.');
      return;
    }
    try {
      const imageUrl = await productService.uploadImage(file);
      setFormData((current) => ({ ...current, imageUrl }));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to upload image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.price || formData.price <= 0) {
      setFormError('Please provide a valid title and price.');
      return;
    }

    try {
      if (editingProduct) {
        const updateData: UpdateProductRequest = { ...formData };
        await productService.update(editingProduct.id, updateData);
        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...formData, id: editingProduct.id, updatedAt: new Date().toISOString() } : p)));
      } else {
        const newProduct = await productService.create(formData);
        setProducts([...products, newProduct]);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      setFormError(error instanceof Error ? error.message : 'Unable to save product.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <AdminLayout
      title="Products"
      subtitle={`${products.length} product(s) in your catalog`}
      actions={<button className="btn btn-primary" onClick={openAddModal}>+ Add Product</button>}
    >
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={resolveImageUrl(product.imageUrl)} alt={product.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.375rem', background: '#f3f4f6' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{product.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{product.description.substring(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td style={{ fontWeight: 600, color: '#2563eb' }}>${product.price.toFixed(2)}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: product.stockCount === 0 ? '#fee2e2' : product.stockCount <= 10 ? '#fef3c7' : '#dcfce7',
                    color: product.stockCount === 0 ? '#b91c1c' : product.stockCount <= 10 ? '#a16207' : '#15803d'
                  }}>
                    {product.stockCount === 0 ? 'Out' : product.stockCount}
                  </span>
                </td>
                <td style={{ color: '#6b7280', fontSize: '0.875rem' }}>{product.updatedAt?.substring(0, 10) || '-'}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-outline" onClick={() => openEditModal(product)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-error">{formError}</div>}

                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input type="text" name="title" className="form-input" value={formData.title} onChange={handleFormChange} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select name="category" className="form-select" value={formData.category} onChange={handleFormChange} required>
                      <option value="">Select...</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Books">Books</option>
                      <option value="Sports">Sports</option>
                      <option value="Beauty">Beauty</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input type="number" name="price" className="form-input" step="0.01" min="0" value={formData.price} onChange={handleFormChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Count</label>
                  <input type="number" name="stockCount" className="form-input" min="0" value={formData.stockCount} onChange={handleFormChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input type="url" name="imageUrl" className="form-input" placeholder="https://..." value={formData.imageUrl} onChange={handleFormChange} />
                  <div
                    className={`image-dropzone${isDraggingImage ? ' is-dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDraggingImage(false); const file = e.dataTransfer.files[0]; if (file) handleImageFile(file); }}
                  >
                    <input id="product-image-file" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageFile(file); }} />
                    <label htmlFor="product-image-file">Drop an image here or choose a file</label>
                    {formData.imageUrl && <img src={resolveImageUrl(formData.imageUrl)} alt="Product preview" className="image-preview" />}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-textarea" value={formData.description} onChange={handleFormChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;
