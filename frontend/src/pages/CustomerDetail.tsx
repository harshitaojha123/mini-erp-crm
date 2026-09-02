import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  X,
  MessageSquare,
} from "lucide-react";
import api from "../services/api";

type FollowUp = {
  id: number;
  note: string;
  createdAt: string;
  createdBy?: {
    id: number;
    name: string;
    role: string;
  };
};

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
  createdAt: string;
  followUps: FollowUp[];
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFollowUp, setShowFollowUp] =
    useState(false);

  const [followUpNote, setFollowUpNote] =
    useState("");

  const [saving, setSaving] = useState(false);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/customers/${id}`
      );

      console.log(
        "CUSTOMER DETAIL:",
        response.data
      );

      setCustomer(response.data.data);
    } catch (err: any) {
      console.error(
        "Customer detail error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load customer"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const addFollowUp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!followUpNote.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post(
        `/customers/${id}/follow-ups`,
        {
          note: followUpNote.trim(),
        }
      );

      setFollowUpNote("");
      setShowFollowUp(false);

      await loadCustomer();
    } catch (err: any) {
      console.error(
        "Follow-up error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to add follow-up"
      );
    } finally {
      setSaving(false);
    }
  };

  const statusClass = () => {
    if (customer?.status === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (customer?.status === "INACTIVE") {
      return "bg-slate-100 text-slate-600";
    }

    return "bg-blue-50 text-blue-700";
  };

  const typeLabel = () => {
    if (customer?.type === "WHOLESALE") {
      return "Wholesale";
    }

    if (customer?.type === "DISTRIBUTOR") {
      return "Distributor";
    }

    return "Retail";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">
            Loading customer...
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() =>
              navigate("/customers")
            }
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Customers
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
            {error || "Customer not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() =>
              navigate("/customers")
            }
            className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Customers
          </button>

          <button
            onClick={() =>
              setShowFollowUp(true)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Follow-up
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CUSTOMER HERO */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
                {customer.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {customer.name}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass()}`}
                  >
                    {customer.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {customer.businessName}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <p className="text-xs text-slate-400">
                Customer Type
              </p>

              <p className="mt-1 font-semibold text-slate-700">
                {typeLabel()}
              </p>
            </div>

          </div>
        </div>

        {/* CUSTOMER INFORMATION */}

        <div className="mb-6 grid gap-6 lg:grid-cols-2">

          {/* CONTACT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Customer Information
            </h2>

            <div className="space-y-5">

              <div className="flex gap-3">
                <Phone
                  size={19}
                  className="mt-0.5 text-blue-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Mobile
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {customer.mobile}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail
                  size={19}
                  className="mt-0.5 text-blue-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {customer.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Building2
                  size={19}
                  className="mt-0.5 text-blue-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Business
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {customer.businessName}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin
                  size={19}
                  className="mt-0.5 text-blue-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {customer.address}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <User
                  size={19}
                  className="mt-0.5 text-blue-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    GST Number
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {customer.gstNumber ||
                      "Not provided"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* FOLLOW-UP INFO */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Follow-up Information
            </h2>

            <div className="space-y-5">

              <div className="flex gap-3">
                <Calendar
                  size={19}
                  className="mt-0.5 text-blue-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Next Follow-up
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {customer.followUpDate
                      ? new Date(
                          customer.followUpDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "No date scheduled"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MessageSquare
                  size={19}
                  className="mt-0.5 text-blue-600"
                />

                <div>
                  <p className="text-xs text-slate-400">
                    Customer Notes
                  </p>

                  <p className="mt-1 whitespace-pre-wrap font-medium text-slate-700">
                    {customer.notes ||
                      "No notes added"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FOLLOW-UP HISTORY */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Follow-up History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Previous customer interactions
            </p>
          </div>

          {customer.followUps &&
          customer.followUps.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {customer.followUps.map(
                (followUp) => (
                  <div
                    key={followUp.id}
                    className="p-6"
                  >
                    <div className="flex gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <MessageSquare
                          size={18}
                          className="text-blue-600"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-semibold text-slate-800">
                            {followUp.createdBy
                              ?.name ||
                              "User"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {new Date(
                              followUp.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {followUp.note}
                        </p>

                        {followUp.createdBy
                          ?.role && (
                          <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                            {followUp.createdBy.role}
                          </span>
                        )}

                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="p-10 text-center">
              <MessageSquare
                size={40}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="font-medium text-slate-600">
                No follow-ups yet
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Add a follow-up note to record customer activity.
              </p>

              <button
                onClick={() =>
                  setShowFollowUp(true)
                }
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Follow-up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOLLOW-UP MODAL */}

      {showFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Follow-up
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record an interaction with{" "}
                  {customer.name}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowFollowUp(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={addFollowUp}
              className="p-6"
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Follow-up Note *
              </label>

              <textarea
                value={followUpNote}
                onChange={(e) =>
                  setFollowUpNote(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="e.g. Customer interested in bulk order. Call again next week..."
                autoFocus
                required
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowFollowUp(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !followUpNote.trim()
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}