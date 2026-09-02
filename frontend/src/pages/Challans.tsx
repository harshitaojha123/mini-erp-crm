import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Clock3,
  X,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

type Customer = {
  id: number;
  name: string;
  businessName: string;
  mobile: string;
};

type Product = {
  id: number;
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
};

type ChallanItem = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  productName: string;
  sku: string;
};

type Challan = {
  id: number;
  challanNumber: string;
  status: "DRAFT" | "CONFIRMED" | "CANCELLED";
  totalQuantity: number;
  createdAt: string;
  customer: Customer;
  items: ChallanItem[];
  createdBy?: {
    id: number;
    name: string;
    role: string;
  };
};

type FormItem = {
  productId: string;
  quantity: string;
};

export default function Challans() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<FormItem[]>([
    { productId: "", quantity: "1" },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [challanResponse, customerResponse, productResponse] =
        await Promise.all([
          api.get("/challans"),
          api.get("/customers?limit=100"),
          api.get("/products"),
        ]);

      setChallans(challanResponse.data.data || []);
      setCustomers(customerResponse.data.data || []);
      setProducts(productResponse.data.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load challan information"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setCustomerId("");
    setItems([{ productId: "", quantity: "1" }]);
    setError("");
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      { productId: "", quantity: "1" },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;

    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const updateItem = (
    index: number,
    field: keyof FormItem,
    value: string
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const getProduct = (productId: string) => {
    return products.find((product) => product.id === Number(productId));
  };

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = getProduct(item.productId);

      if (!product) return sum;

      return sum + product.unitPrice * (Number(item.quantity) || 0);
    }, 0);
  }, [items, products]);

  const createChallan = async (
    shouldConfirm: boolean
  ) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!customerId) {
        setError("Please select a customer.");
        return;
      }

      const validItems = items.filter(
        (item) =>
          item.productId &&
          Number(item.quantity) > 0
      );

      if (validItems.length === 0) {
        setError("Please add at least one product.");
        return;
      }

      const duplicateProducts = new Set<number>();

      for (const item of validItems) {
        const productId = Number(item.productId);

        if (duplicateProducts.has(productId)) {
          setError(
            "The same product cannot be added more than once."
          );
          return;
        }

        duplicateProducts.add(productId);

        const product = getProduct(item.productId);

        if (!product) {
          setError("One or more selected products are invalid.");
          return;
        }

        if (Number(item.quantity) > product.currentStock) {
          setError(
            `Insufficient stock for ${product.name}. Available: ${product.currentStock}`
          );
          return;
        }
      }

      const payload = {
        customerId: Number(customerId),
        items: validItems.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      // Step 1: Create the challan.
      const response = await api.post("/challans", payload);

      const createdChallan: Challan =
        response.data.data;

      // Step 2: If user selected Confirmed,
      // confirm the newly-created draft.
      if (shouldConfirm) {
        await api.patch(
          `/challans/${createdChallan.id}/confirm`
        );

        setSuccess(
          `${createdChallan.challanNumber} created and confirmed successfully. Stock has been deducted.`
        );
      } else {
        setSuccess(
          `${createdChallan.challanNumber} created as draft successfully.`
        );
      }

      closeModal();
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create challan"
      );
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = async (id: number) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(`/challans/${id}/cancel`);

      setSuccess("Challan cancelled successfully.");
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to cancel challan"
      );
    }
  };

  const statusConfig = {
    DRAFT: {
      label: "Draft",
      icon: Clock3,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },
    CONFIRMED: {
      label: "Confirmed",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: X,
      className:
        "bg-red-50 text-red-700 border-red-200",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Sales Challans
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create and manage sales challans
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Challan
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {error && !showModal && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Challans
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {challans.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Draft Challans
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {
              challans.filter(
                (challan) => challan.status === "DRAFT"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Confirmed Challans
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {
              challans.filter(
                (challan) =>
                  challan.status === "CONFIRMED"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Cancelled Challans
          </p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {challans.filter((challan) => challan.status === "CANCELLED").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Challan History
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-16">
            <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : challans.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-3 font-semibold text-slate-900">
              No challans yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first sales challan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">
                    Challan
                  </th>

                  <th className="px-5 py-3">
                    Customer
                  </th>

                  <th className="px-5 py-3">
                    Products
                  </th>

                  <th className="px-5 py-3">
                    Quantity
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="px-5 py-3">
                    Created
                  </th>
                  <th className="px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {challans.map((challan) => {
                  const status =
                    statusConfig[challan.status];

                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={challan.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {challan.challanNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          #{challan.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {challan.customer?.name ||
                            "—"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {challan.customer
                            ?.businessName || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {challan.items?.map((item) => (
                            <div
                              key={item.id}
                              className="text-sm text-slate-700"
                            >
                              {item.productName}{" "}
                              <span className="text-slate-400">
                                × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-900">
                          {challan.totalQuantity}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {new Date(
                          challan.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-5 py-4">
                        {challan.status === "DRAFT" ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Cancel ${challan.challanNumber}?`)) {
                                handleCancel(challan.id);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Sales Challan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add customer and products
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-6 py-6">
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Customer */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Customer
                </label>

                <select
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name} —{" "}
                      {customer.businessName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Products
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Select products and quantities
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Product
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => {
                    const product = getProduct(
                      item.productId
                    );

                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_140px_44px]">
                          {/* Product */}
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                              Product
                            </label>

                            <select
                              value={item.productId}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "productId",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                              <option value="">
                                Select product
                              </option>

                              {products.map((product) => (
                                <option
                                  key={product.id}
                                  value={product.id}
                                >
                                  {product.name} —{" "}
                                  {product.sku} — Stock:{" "}
                                  {product.currentStock}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quantity */}
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                              Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            {product && (
                              <p className="mt-1 text-[11px] text-slate-500">
                                Available:{" "}
                                {product.currentStock}
                              </p>
                            )}
                          </div>

                          {/* Remove */}
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(index)
                              }
                              disabled={items.length === 1}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {product && (
                          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-xs">
                            <span className="text-slate-500">
                              Unit Price: ₹
                              {Number(
                                product.unitPrice
                              ).toLocaleString("en-IN")}
                            </span>

                            <span className="font-semibold text-slate-700">
                              Line Total: ₹
                              {(
                                product.unitPrice *
                                (Number(item.quantity) ||
                                  0)
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Total Quantity
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    {totalQuantity}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-indigo-100 pt-2">
                  <span className="text-sm font-medium text-slate-600">
                    Estimated Total Value
                  </span>

                  <span className="text-lg font-bold text-indigo-700">
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => createChallan(false)}
                disabled={saving}
                className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Save as Draft"}
              </button>

              <button
                type="button"
                onClick={() => createChallan(true)}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                {saving
                  ? "Processing..."
                  : "Create & Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}