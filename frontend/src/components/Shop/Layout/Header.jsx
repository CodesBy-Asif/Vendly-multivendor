import React from "react";
import { Package, ShoppingBag, MessageCircle, Settings } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "Products", icon: Package, path: "/shop/dashboard/products" },
    { name: "Orders", icon: ShoppingBag, path: "/shop/dashboard/orders" },
    { name: "Messages", icon: MessageCircle, path: "/shop/dashboard/inbox" },
    { name: "Settings", icon: Settings, path: "/shop/dashboard/settings" },
  ];

  return (
    <header className="bg-accent shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <h1 className="text-2xl md:text-3xl font-Title tracking-wider text-primary">
                Vendly
              </h1>
            </Link>
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center space-x-2 md:space-x-6">
            {navItems.map(({ name, icon: Icon, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "text-primary font-medium bg-muted"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`
                }
              >
                <Icon
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="hidden md:inline">{name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
