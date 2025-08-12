import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./layout/Header.jsx";
import { Outlet } from "react-router-dom";

export default function ShopLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header currentPath={location.pathname} />
      <div className="flex flex-row h-full w-full">
        <div className="relative h-[-webkit-fill-available]">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 max-w-[90%] md:ml-0 p-6 h-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
