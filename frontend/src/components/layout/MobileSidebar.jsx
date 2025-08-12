import React from "react";
import { Link } from "react-router-dom";
import {
    AiOutlineClose
} from "react-icons/ai";
import AccountMenu from "./AccountMenu.jsx";
import {navItems} from "../../static/NavLinks.js";
import {IoIosArrowForward} from "react-icons/io";

const MobileSidebar = ({ isOpen, onClose }) => {


    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

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
        <div className={""}>
            <button className={"bg-primary   w-full sm:block rounded-xl text-nowrap text-primary-foreground px-4 py-2 "}
                    onClick={() => {
                    }}>Become Seller <IoIosArrowForward className={"inline-block w-4 h-4"}/>
            </button>
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
