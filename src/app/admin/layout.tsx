"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Settings, LogOut, LayoutDashboard, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  // If on login page, don't show sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Protect other admin routes
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: "0 1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", color: "var(--primary)" }}>Admin Portal</h2>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{user.email}</p>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/leads" className={`sidebar-link ${pathname === "/leads" ? "active" : ""}`}>
            <Users size={20} />
            Lead Management
          </Link>
        </nav>

        <div style={{ marginTop: "auto", padding: "0 1.5rem" }}>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary" 
            style={{ width: "100%", justifyContent: "flex-start", border: "none" }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
