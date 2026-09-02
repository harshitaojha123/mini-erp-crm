import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Eye,
  X,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type Customer = {
  id: number;
  name: string;
  mobile: string;
  email?: string | null;
  businessName: string;
  gstNumber?: string | null;
  type: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address: string;
  status: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate?: string | null;
  notes?: string | null;
  createdAt?: string;
};

type CustomerForm = {
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber: string;
  type: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address: string;
  status: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate: string;
  notes: string;
};

const emptyForm: CustomerForm = {
  name: "",
  mobile: "",
  email: "",
  businessName: "",
  gstNumber: "",
  type: "RETAIL",
  address: "",
  status: "LEAD",
  followUpDate: "",
  notes: "",
};

export default function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [form, setForm] = useState<CustomerForm>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD CUSTOMERS
  // =========================

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/customers", {
        params: {
          search: search.trim() || undefined,
          page: 1,
          limit: 100,
        },
      });

      console.log("CUSTOMERS API:", response.data);

      const data = response.data?.data;

      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        setCustomers([]);
      }
    } catch (err: any) {
      console.error("Load customers error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = async (customer: Customer) => {
    try {
      setError("");

      const response = await api.get(
        `/customers/${customer.id}`
      );

      const data = response.data.data;

      setEditingCustomer(data);

      setForm({
        name: data.name || "",
        mobile: data.mobile || "",
        email: data.email || "",
        businessName: data.businessName || "",
        gstNumber: data.gstNumber || "",
        type: data.type || "RETAIL",
        address: data.address || "",
        status: data.status || "LEAD",
        followUpDate: data.followUpDate
          ? data.followUpDate.substring(0, 10)
          : "",
        notes: data.notes || "",
      });

      setShowModal(true);
    } catch (err: any) {
      console.error("Get customer error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load customer"
      );
    }
  };

  // =========================
  // HANDLE FORM CHANGE
  // =========================

  const updateField = (
    field: keyof CustomerForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================
  // SAVE CUSTOMER
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (form.name.trim().length < 2) {
      setError("Customer name must be at least 2 characters.");
      return;
    }

    if (form.mobile.trim().length < 10) {
      setError("Valid mobile number is required.");
      return;
    }

    if (form.businessName.trim().length < 2) {
      setError("Business name is required.");
      return;
    }

    if (form.address.trim().length < 3) {
      setError("Address is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(),

        // Empty email must NOT be sent as ""
        email: form.email.trim() || undefined,

        businessName: form.businessName.trim(),

        // Backend expects gstNumber
        gstNumber:
          form.gstNumber.trim() || undefined,

        // Backend expects type
        type: form.type,

        address: form.address.trim(),

        status: form.status,

        followUpDate:
          form.followUpDate || undefined,

        notes: form.notes.trim() || undefined,
      };

      console.log("CUSTOMER PAYLOAD:", payload);

      if (editingCustomer) {
        await api.put(
          `/customers/${editingCustomer.id}`,
          payload
        );
      } else {
        await api.post(
          "/customers",
          payload
        );
      }

      setShowModal(false);
      setEditingCustomer(null);
      setForm(emptyForm);

      await loadCustomers();
    } catch (err: any) {
      console.error(
        "Save customer error:",
        err
      );

      const errors =
        err?.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)
          .flat()
          .find(Boolean);

        setError(
          String(
            firstError ||
              "Validation failed"
          )
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Failed to save customer"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // STATUS DISPLAY
  // =========================

  const getStatusClass = (
    status: Customer["status"]
  ) => {
    if (status === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "LEAD") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getTypeLabel = (
    type: Customer["type"]
  ) => {
    if (type === "WHOLESALE") {
      return "Wholesale";
    }

    if (type === "DISTRIBUTOR") {
      return "Distributor";
    }

    return "Retail";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage customer relationships and follow-ups
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={19} />
            Add Customer
          </button>
        </div>

        {/* ================= ERROR ================= */}

        {error && !showModal && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= SEARCH ================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, mobile, business or email..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mobile
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Business
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Follow-up
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-sm text-slate-500"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center"
                    >
                      <Users
                        size={40}
                        className="mx-auto mb-3 text-slate-300"
                      />

                      <p className="font-medium text-slate-600">
                        No customers found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Add your first customer to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {customer.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {customer.email ||
                                "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {customer.mobile}
                      </td>

                      {/* Business */}
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {customer.businessName}
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {getTypeLabel(customer.type)}
                      </td>

                      {/* Follow-up */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {customer.followUpDate
                          ? new Date(
                              customer.followUpDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/customers/${customer.id}`
                              )
                            }
                            title="View customer"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(customer)
                            }
                            title="Edit customer"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={18} />
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
      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCustomer
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingCustomer
                    ? "Update customer details"
                    : "Enter customer details"}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Name *
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      updateField(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Enter customer name"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Mobile *
                  </label>

                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      updateField(
                        "mobile",
                        e.target.value
                      )
                    }
                    placeholder="Enter mobile number"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField(
                        "email",
                        e.target.value
                      )
                    }
                    placeholder="customer@example.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Business */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Business Name *
                  </label>

                  <input
                    value={form.businessName}
                    onChange={(e) =>
                      updateField(
                        "businessName",
                        e.target.value
                      )
                    }
                    placeholder="Enter business name"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* GST */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    GST Number
                  </label>

                  <input
                    value={form.gstNumber}
                    onChange={(e) =>
                      updateField(
                        "gstNumber",
                        e.target.value
                      )
                    }
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Follow-up Date */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Follow-up Date
                  </label>

                  <input
                    type="date"
                    value={form.followUpDate}
                    onChange={(e) =>
                      updateField(
                        "followUpDate",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer Type *
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      updateField(
                        "type",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="RETAIL">
                      Retail
                    </option>

                    <option value="WHOLESALE">
                      Wholesale
                    </option>

                    <option value="DISTRIBUTOR">
                      Distributor
                    </option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status *
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      updateField(
                        "status",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="LEAD">
                      Lead
                    </option>

                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Address *
                  </label>

                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      updateField(
                        "address",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Enter customer address"
                    required
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notes
                  </label>

                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      updateField(
                        "notes",
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Add customer notes..."
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">

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
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCustomer
                    ? "Update Customer"
                    : "Save Customer"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}