import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import AccountMenu from "./AccountMenu.jsx";
import { navItems } from "../../static/NavLinks.js";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";

const MobileSidebar = ({ isOpen, onClose }) => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 w-64 h-full bg-background p-4 flex flex-col justify-between shadow-lg animate-slide-in">
        {/* Header */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary">Menu</h2>
            <button onClick={onClose}>
              <AiOutlineClose className="text-2xl" />
            </button>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            {navItems.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center text-lg gap-3 text-muted-foreground hover:text-primary font-medium"
                onClick={onClose}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        {/* Account Button */}
        <div className="relative flex flex-col gap-4 ">
          <div className={"w-full h-fit"}>
            {seller ? (
              <a
                href="/shop/dashboard"
                className="bg-primary flex justify-between w-full items-center rounded-xl text-nowrap text-primary-foreground px-4 py-2"
              >
                Go to Shop
                <IoIosArrowForward className="inline-block w-4 h-4" />
              </a>
            ) : (
              <a
                href="/shop/create"
                className="bg-primary  flex  w-full justify-between items-center rounded-xl text-nowrap text-primary-foreground px-4 py-2"
              >
                Become Seller
                <IoIosArrowForward className="inline-block w-4 h-4" />
              </a>
            )}
          </div>
          <div className=" bottom-0 border border-border  rounded-xl px-4 py-2 right-0 w-full z-10">
            <AccountMenu bottom={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
