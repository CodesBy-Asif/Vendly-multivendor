import { LogOut, LayoutDashboard } from "lucide-react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAddBusiness,
  MdOutlineEventAvailable,
  MdDiscount,
} from "react-icons/md";
import { FaMoneyCheckAlt, FaRegCreditCard } from "react-icons/fa";
import { AiOutlineMessage, AiOutlineSetting } from "react-icons/ai";
import { BiSidebar } from "react-icons/bi";
import { IoCubeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { logoutShop } from "../../service/Logout.js";

const shopNavItems = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={24} />,
    path: "/shop/dashboard",
  },
  {
    name: "all-orders",
    label: "All Orders",
    icon: <HiOutlineShoppingBag size={24} />,
    path: "/shop/dashboard/orders",
  },
  {
    name: "all-products",
    label: "All Products",
    icon: <IoCubeOutline size={24} />,
    path: "/shop/dashboard/products",
  },
  {
    name: "create-product",
    label: "Create Product",
    icon: <MdOutlineAddBusiness size={24} />,
    path: "/shop/dashboard/products/create",
  },
  {
    name: "all-events",
    label: "All Events",
    icon: <MdOutlineEventAvailable size={24} />,
    path: "/shop/dashboard/events",
  },
  {
    name: "create-event",
    label: "Create Event",
    icon: <MdOutlineAddBusiness size={24} />,
    path: "/shop/dashboard/events/create",
  },
  {
    name: "withdraw-money",
    label: "Withdraw Money",
    icon: <FaMoneyCheckAlt size={24} />,
    path: "/shop/dashboard/withdraw",
  },
  {
    name: "shop-inbox",
    label: "Shop Inbox",
    icon: <AiOutlineMessage size={24} />,
    path: "/shop/dashboard/inbox",
  },
  {
    name: "coupons",
    label: "Coupons",
    icon: <MdDiscount size={24} />,
    path: "/shop/dashboard/coupons",
  },
  {
    name: "refunds",
    label: "Refunds",
    icon: <FaRegCreditCard size={24} />,
    path: "/shop/dashboard/refunds",
  },
  {
    name: "settings",
    label: "Settings",
    icon: <AiOutlineSetting size={24} />,
    path: "/shop/dashboard/settings",
  },
];

export default function ShopSidebar({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LogoutSeller" });
    logoutShop();
    navigate("/");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <aside
      className={`min-h-[75vh] ${
        sidebarOpen ? "absolute" : ""
      } h-full bg-accent border-r border-border
      ${sidebarOpen ? "w-64" : "w-max"}
      transition-all duration-300 ease-in-out
      md:relative z-50`}
    >
      <div className="sticky top-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          {sidebarOpen && <h2 className="text-lg font-bold">Shop Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <BiSidebar size={24} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {shopNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors ${
                  isActive
                    ? "text-primary font-medium bg-muted"
                    : "text-muted-foreground hover:text-primary"
                }`
              }
              onClick={() => {
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
            >
              <span>{item.icon}</span>
              {sidebarOpen && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
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
