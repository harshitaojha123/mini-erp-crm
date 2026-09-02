import { useEffect, useState } from "react";
import {
  Users,
  Package,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  Boxes,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

type DashboardStats = {
  customers: number;
  products: number;
  lowStock: number;
  challans: number;
};

type Challan = {
  id: number;
  challanNumber: string;
  status: string;
  totalQuantity: number;
  createdAt: string;
  customer?: {
    name: string;
  };
};

type Product = {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    products: 0,
    lowStock: 0,
    challans: 0,
  });

  const [recentChallans, setRecentChallans] = useState<Challan[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [dashboardResult, challansResult, productsResult] =
        await Promise.allSettled([
          api.get("/dashboard"),
          api.get("/challans"),
          api.get("/products"),
        ]);

      if (dashboardResult.status === "fulfilled") {
        const data = dashboardResult.value.data.data || {};

        const customers =
          typeof data.customers === "object"
            ? data.customers?.total ?? 0
            : Number(data.customers ?? 0);

        const products =
          typeof data.products === "object"
            ? data.products?.total ?? 0
            : Number(data.products ?? 0);

        const challans =
          typeof data.challans === "object"
            ? data.challans?.total ?? 0
            : Number(data.challans ?? 0);

        const lowStock =
          typeof data.lowStock === "object"
            ? data.lowStock?.total ?? 0
            : Number(data.lowStock ?? 0);

        setStats({
          customers,
          products,
          challans,
          lowStock,
        });
      }

      if (productsResult.status === "fulfilled") {
        const raw = productsResult.value.data.data;

        const products: Product[] = Array.isArray(raw)
          ? raw
          : raw?.products || raw?.items || [];

        const lowStock = products.filter(
          (product) =>
            Number(product.currentStock) <= Number(product.minStock)
        );

        setStats((previous) => ({
          ...previous,
          products: products.length,
          lowStock: lowStock.length,
        }));

        setLowStockProducts(lowStock.slice(0, 5));
      }

      if (challansResult.status === "fulfilled") {
        const raw = challansResult.value.data.data;

        const challans: Challan[] = Array.isArray(raw)
          ? raw
          : raw?.challans || raw?.items || [];

        setStats((previous) => ({
          ...previous,
          challans: challans.length,
        }));

        setRecentChallans(
          [...challans]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
        );
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Customers",
      value: stats.customers,
      icon: Users,
      description: "Active CRM records",
      path: "/customers",
      iconClass: "bg-blue-50 text-blue-600",
      valueClass: "text-slate-900",
    },
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      description: "Products in inventory",
      path: "/products",
      iconClass: "bg-violet-50 text-violet-600",
      valueClass: "text-slate-900",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      icon: AlertTriangle,
      description: stats.lowStock > 0 ? "Requires attention" : "Inventory healthy",
      path: "/products",
      iconClass:
        stats.lowStock > 0
          ? "bg-amber-50 text-amber-600"
          : "bg-emerald-50 text-emerald-600",
      valueClass:
        stats.lowStock > 0 ? "text-amber-600" : "text-emerald-600",
    },
    {
      title: "Total Challans",
      value: stats.challans,
      icon: FileText,
      description: "Sales transactions",
      path: "/challans",
      iconClass: "bg-indigo-50 text-indigo-600",
      valueClass: "text-slate-900",
    },
  ];

  const getStatusStyle = (status: string) => {
    if (status === "CONFIRMED") {
      return {
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: CheckCircle2,
        label: "Confirmed",
      };
    }

    if (status === "CANCELLED") {
      return {
        className: "bg-red-50 text-red-700 border-red-100",
        icon: XCircle,
        label: "Cancelled",
      };
    }

    return {
      className: "bg-amber-50 text-amber-700 border-amber-100",
      icon: Clock3,
      label: "Draft",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Operations Overview
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Monitor customers, inventory and sales activity from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.title}
                type="button"
                onClick={() => navigate(card.path)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-blue-500" />
                </div>

                <p className="mt-6 text-sm font-semibold text-slate-500">
                  {card.title}
                </p>

                <p
                  className={`mt-1 text-4xl font-bold tracking-tight ${
                    card.valueClass
                  }`}
                >
                  {loading ? "—" : card.value}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      card.title === "Low Stock Items" && stats.lowStock > 0
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  {card.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Jump directly to common operations.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white p-2 shadow-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Manage Customers
                  </p>
                  <p className="text-xs text-slate-500">CRM records</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition hover:border-violet-200 hover:bg-violet-50"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white p-2 shadow-sm">
                  <Boxes className="h-4 w-4 text-violet-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Manage Inventory
                  </p>
                  <p className="text-xs text-slate-500">Products & stock</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/challans")}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white p-2 shadow-sm">
                  <FileText className="h-4 w-4 text-indigo-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Sales Challans
                  </p>
                  <p className="text-xs text-slate-500">Create & track</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
            </button>
          </div>
        </div>

        {/* Activity sections */}
        <div className="mt-6 grid gap-6 xl:grid-cols-5">
          {/* Recent challans */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-3">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-slate-900">Recent Challans</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest sales activity
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/challans")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>

            {recentChallans.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No challans yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Sales activity will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentChallans.map((challan) => {
                  const status = getStatusStyle(challan.status);
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={challan.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                          <FileText className="h-5 w-5 text-indigo-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {challan.challanNumber}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {challan.customer?.name || "Unknown customer"}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>

                        <p className="mt-1.5 text-[11px] text-slate-400">
                          Qty: {challan.totalQuantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Low stock */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-slate-900">Low Stock Alert</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Products requiring attention
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Inventory looks healthy
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  No products are below their minimum stock.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockProducts.map((product) => {
                  const percentage =
                    Number(product.minStock) > 0
                      ? Math.min(
                          100,
                          (Number(product.currentStock) /
                            Number(product.minStock)) *
                            100
                        )
                      : 0;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => navigate("/products")}
                      className="w-full px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            SKU: {product.sku}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-600">
                            {product.currentStock}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Min {product.minStock}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
