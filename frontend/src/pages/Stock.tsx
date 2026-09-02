import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from "lucide-react";
import api from "../services/api";

type Product = {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
};

type Movement = {
  id: number;
  quantity: number;
  type: string;
  reason: string;
  createdAt: string;
  product?: {
    name: string;
    sku: string;
  };
  createdBy?: {
    name: string;
  };
};

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    type: "IN",
    reason: "",
  });

  // LOAD PRODUCTS + STOCK
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      // Products are loaded separately so stock API
      // cannot prevent the dropdown from working.
      try {
        const productResponse = await api.get("/products");

        console.log(
          "PRODUCT API:",
          productResponse.data
        );

        const data = productResponse.data?.data;

        let list: Product[] = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data?.products)) {
          list = data.products;
        } else if (Array.isArray(data?.items)) {
          list = data.items;
        } else if (Array.isArray(data?.data)) {
          list = data.data;
        }

        console.log("PRODUCTS FOUND:", list);

        setProducts(list);
      } catch (productError) {
        console.error(
          "PRODUCT API ERROR:",
          productError
        );

        setProducts([]);
        setError("Could not load products.");
      }

      // Stock movements
      try {
      const stockResponse = await api.get("/stock/movements");

        console.log(
          "STOCK API:",
          stockResponse.data
        );

        const data = stockResponse.data?.data;

        let list: Movement[] = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data?.movements)) {
          list = data.movements;
        } else if (Array.isArray(data?.items)) {
          list = data.items;
        } else if (Array.isArray(data?.data)) {
          list = data.data;
        }

        setMovements(list);
      } catch (stockError) {
        console.error(
          "STOCK API ERROR:",
          stockError
        );

        // Keep products working even if stock history fails.
        setMovements([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // SAVE MOVEMENT
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!form.productId) {
      setError("Please select a product.");
      return;
    }

    if (
      !form.quantity ||
      Number(form.quantity) <= 0
    ) {
      setError(
        "Quantity must be greater than 0."
      );
      return;
    }

    if (!form.reason.trim()) {
      setError("Please enter a reason.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/stock/movements", {
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        type: form.type,
        reason: form.reason.trim(),
      });

      setShowModal(false);

      setForm({
        productId: "",
        quantity: "",
        type: "IN",
        reason: "",
      });

      await loadData();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to create stock movement."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredMovements =
    movements.filter((movement) => {
      const value = search.toLowerCase();

      return (
        movement.product?.name
          ?.toLowerCase()
          .includes(value) ||
        movement.product?.sku
          ?.toLowerCase()
          .includes(value) ||
        movement.reason
          ?.toLowerCase()
          .includes(value) ||
        movement.type
          ?.toLowerCase()
          .includes(value)
      );
    });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Stock Movement
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track inventory IN and OUT movements
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setForm({
                productId: "",
                quantity: "",
                type: "IN",
                reason: "",
              });
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Movement
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search product, SKU, type or reason..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && !showModal && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Quantity
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Movement
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Reason
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Created By
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredMovements.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No stock movements yet.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map(
                    (movement) => (
                      <tr
                        key={movement.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {movement.product
                              ?.name || "—"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {movement.product
                              ?.sku || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-semibold">
                          {movement.quantity}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              movement.type ===
                              "IN"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {movement.type ===
                            "IN" ? (
                              <ArrowDownToLine
                                size={14}
                              />
                            ) : (
                              <ArrowUpFromLine
                                size={14}
                              />
                            )}

                            {movement.type}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {movement.reason}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {movement.createdBy
                            ?.name || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {new Date(
                            movement.createdAt
                          ).toLocaleString()}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Stock Movement
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record inventory movement
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* PRODUCT DROPDOWN */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product *
                </label>

                <select
                  value={form.productId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      productId:
                        e.target.value,
                    })
                  }
                  required
                  className="w-full appearance-auto rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    -- Select Product --
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} | SKU:{" "}
                      {product.sku} | Stock:{" "}
                      {product.currentStock}
                    </option>
                  ))}
                </select>

                {products.length === 0 && (
                  <p className="mt-2 text-sm text-red-500">
                    No products loaded.
                  </p>
                )}
              </div>

              {/* MOVEMENT TYPE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Movement Type *
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        type: "IN",
                      })
                    }
                    className={`rounded-xl border py-3 font-semibold ${
                      form.type === "IN"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Stock IN
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        type: "OUT",
                      })
                    }
                    className={`rounded-xl border py-3 font-semibold ${
                      form.type === "OUT"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Stock OUT
                  </button>

                </div>
              </div>

              {/* QUANTITY */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantity *
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* REASON */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Reason *
                </label>

                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reason: e.target.value,
                    })
                  }
                  placeholder="e.g. New purchase, damaged stock..."
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    products.length === 0
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Movement"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}