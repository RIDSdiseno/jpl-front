import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import MobileSidebar from "./sidebar/MobileSidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <Sidebar open={sidebarOpen} />

      <MobileSidebar open={mobileOpen} setOpen={setMobileOpen} />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}