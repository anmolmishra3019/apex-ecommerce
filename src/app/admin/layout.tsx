import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 overflow-y-auto">
        <header className="h-16 px-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black text-white uppercase tracking-wider">
              Notice Studio Operations Console
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#004fff]" />
              <span>Razorpay Sandbox Connected</span>
            </div>
            <div className="w-8 h-8 bg-[#004fff] flex items-center justify-center font-black text-white text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
