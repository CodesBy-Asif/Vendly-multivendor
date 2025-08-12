import { LogOut, User } from "lucide-react";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { FaMapMarkerAlt, FaRegCreditCard } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BiSidebar } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../service/Logout.js";

const navItems = [
  { name: "profile", icon: <User size={24} />, label: "Profile" },
  { name: "orders", icon: <HiOutlineShoppingBag size={24} />, label: "Orders" },
  {
    name: "refund",
    icon: <HiOutlineReceiptRefund size={24} />,
    label: "Refund",
  },
  { name: "inbox", icon: <AiOutlineMessage size={24} />, label: "Inbox" },
  {
    name: "track-order",
    icon: <MdOutlineLocalShipping size={24} />,
    label: "Track Order",
  },
  { name: "address", icon: <FaMapMarkerAlt size={24} />, label: "Address" },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: "LogoutUser" }); // Clear Redux state
    logout(); // Optional: clear localStorage/session
    navigate("/"); // Redirect to home/login
    if (window.innerWidth < 768) setSidebarOpen(false); // Close sidebar if mobile
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    if (window.innerWidth < 768) setSidebarOpen(false); // close on mobile
  };

  return (
    <aside
      className={`min-h-[75vh] ${
        sidebarOpen ? "absolute " : ""
      } h-[100%] bg-accent border-r border-border
        ${sidebarOpen ? "w-64" : "w-max"}
        transition-all duration-300 ease-in-out
        md:relative z-50`}
    >
      {/* Mobile toggle button (shown on small screens only) */}
      <div className={"sticky top-0"}>
        {/* Desktop header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {sidebarOpen && <h2 className="text-lg font-bold">Dashboard</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <BiSidebar size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.name)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-left
              ${
                activeTab === item.name
                  ? "text-primary font-medium bg-muted"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span>{item.icon}</span>
              {sidebarOpen && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-left text-muted-foreground hover:text-primary"
          >
            <LogOut size={24} />
            {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </nav>
      </div>
    </aside>
  );
}
