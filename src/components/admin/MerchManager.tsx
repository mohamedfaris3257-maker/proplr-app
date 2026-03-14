'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_aed: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price_aed: string;
  image_url: string;
  category: string;
  stock: string;
  is_active: boolean;
}

const defaultForm: ProductFormData = {
  name: '',
  description: '',
  price_aed: '',
  image_url: '',
  category: '',
  stock: '',
  is_active: true,
};

export function MerchManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditingProduct(null);
    setForm(defaultForm);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price_aed: String(product.price_aed),
      image_url: product.image_url || '',
      category: product.category || '',
      stock: String(product.stock),
      is_active: product.is_active,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price_aed: parseFloat(form.price_aed) || 0,
      image_url: form.image_url.trim() || null,
      category: form.category.trim() || null,
      stock: parseInt(form.stock) || 0,
      is_active: form.is_active,
    };

    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setModalOpen(false);
    setSaving(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    setDeleteId(null);
    fetchProducts();
  }

  async function toggleActive(product: Product) {
    const supabase = createClient();
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-text-muted text-sm">Loading products...</div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
            Merch Store
          </h1>
          <p style={{ color: '#6e7591', fontSize: 14 }}>Manage products and inventory</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Create Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="card p-8 text-center">
          <Package className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-text-secondary text-sm">No products yet. Create your first product.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">Product</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">Price (AED)</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">Stock</th>
                  <th className="text-left text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-right text-xs font-semibold text-text-muted px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-text-muted" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-text-primary">{product.name}</p>
                          {product.category && (
                            <p className="text-xs text-text-muted">{product.category}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">
                      {Number(product.price_aed).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-text-primary' : 'text-red'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(product)}
                        className="flex items-center gap-1.5"
                      >
                        {product.is_active ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-green" />
                            <span className="text-xs font-semibold text-green">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-text-muted" />
                            <span className="text-xs font-semibold text-text-muted">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(product.id)}
                          className="text-red hover:bg-red/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Product name..."
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Price (AED) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price_aed}
                onChange={(e) => setForm((f) => ({ ...f, price_aed: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Stock *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="0"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Apparel, Accessories..."
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="accent-[#3d9be9]"
            />
            <label htmlFor="is_active" className="text-sm text-text-primary cursor-pointer">Active (visible in shop)</label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              loading={saving}
              onClick={handleSave}
              disabled={!form.name.trim() || !form.price_aed}
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
