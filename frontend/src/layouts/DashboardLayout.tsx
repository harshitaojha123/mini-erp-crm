import {
  LayoutDashboard,
  Users,
  Package,
  ArrowLeftRight,
  FileText,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"],
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
    roles: ["ADMIN", "SALES"],
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
    roles: ["ADMIN", "WAREHOUSE"],
  },
  {
    name: "Stock Movement",
    path: "/stock",
    icon: ArrowLeftRight,
    roles: ["ADMIN", "WAREHOUSE"],
  },
  {
    name: "Challans",
    path: "/challans",
    icon: FileText,
    roles: ["ADMIN", "SALES", "ACCOUNTS"],
  },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="text-blue-600"
            size={25}
          />

          <span className="font-bold text-slate-900">
            Mini ERP
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b px-6">
          <div className="rounded-xl bg-blue-600 p-2.5">
            <ShieldCheck
              className="text-white"
              size={24}
            />
          </div>

          <div>
            <h1 className="font-bold text-slate-900">
              Mini ERP
            </h1>

            <p className="text-xs text-slate-500">
              CRM Operations
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          {visibleNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 w-full border-t bg-white p-4">

          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name}
              </p>

              <p className="text-xs font-medium text-blue-600">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Content */}
      <main className="lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}