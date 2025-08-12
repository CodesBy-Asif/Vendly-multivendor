import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../layout/Header.jsx";
import Sidebar from "./Sidebar";
import TabContent from "./TabContent.jsx";

export default function DashboardLayout() {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab || "profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    // If tab param changes, update activeTab
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);
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
    <div className="min-h-[90vh] bg-background text-foreground">
      <Header />
      <div className="flex flex-row w-full">
        <div className="relative h-[-webkit-fill-available]">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <main className="flex-1 md:ml-0 p-6">
          <TabContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}
