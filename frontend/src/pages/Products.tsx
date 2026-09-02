import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  X,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStock: number;
  warehouse: string;
};

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  unitPrice: "",
  currentStock: "",
  minStock: "",
  warehouse: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");
      const data = response.data.data;

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || data.items || []
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      unitPrice: String(product.unitPrice ?? ""),
      currentStock: String(product.currentStock ?? ""),
      minStock: String(product.minStock ?? ""),
      warehouse: product.warehouse || "",
    });

    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      unitPrice: Number(form.unitPrice),
      currentStock: Number(form.currentStock),
      minStock: Number(form.minStock),
      warehouse: form.warehouse,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadProducts();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          `Failed to ${editingId ? "update" : "create"} product`
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(value) ||
      product.sku?.toLowerCase().includes(value) ||
      product.category?.toLowerCase().includes(value) ||
      product.warehouse?.toLowerCase().includes(value)
    );
  });

  const lowStockCount = products.filter(
    (product) => product.currentStock <= product.minStock
  ).length;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Products & Inventory
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage products, pricing and stock levels
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Summary */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={19}
                className="text-amber-600"
              />

              <p className="text-sm font-medium text-amber-700">
                Low Stock Items
              </p>
            </div>

            <p className="mt-2 text-3xl font-bold text-amber-700">
              {lowStockCount}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product, SKU, category or warehouse..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {error && !showModal && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    SKU
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Unit Price
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                    Warehouse
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock =
                      product.currentStock <= product.minStock;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {product.name}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.sku}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.category}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          ₹{Number(product.unitPrice).toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                isLowStock
                                  ? "text-red-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {product.currentStock}
                            </span>

                            <span className="text-xs text-slate-400">
                              / min {product.minStock}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.warehouse}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() => openEdit(product)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                              title="Edit Product"
                            >
                              <Pencil size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>

                <p className="text-xs text-slate-500">
                  Enter product and inventory information
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              {error && (
                <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">

                <Input
                  label="Product Name *"
                  value={form.name}
                  onChange={(v) =>
                    setForm({ ...form, name: v })
                  }
                  required
                />

                <Input
                  label="SKU / Code *"
                  value={form.sku}
                  onChange={(v) =>
                    setForm({ ...form, sku: v })
                  }
                  required
                />

                <Input
                  label="Category *"
                  value={form.category}
                  onChange={(v) =>
                    setForm({ ...form, category: v })
                  }
                  required
                />

                <Input
                  label="Unit Price *"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(v) =>
                    setForm({ ...form, unitPrice: v })
                  }
                  required
                />

                <Input
                  label="Current Stock *"
                  type="number"
                  min="0"
                  value={form.currentStock}
                  onChange={(v) =>
                    setForm({ ...form, currentStock: v })
                  }
                  required
                />

                <Input
                  label="Minimum Stock Alert *"
                  type="number"
                  min="0"
                  value={form.minStock}
                  onChange={(v) =>
                    setForm({ ...form, minStock: v })
                  }
                  required
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Warehouse *"
                    value={form.warehouse}
                    onChange={(v) =>
                      setForm({ ...form, warehouse: v })
                    }
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  min,
  step,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        min={min}
        step={step}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}