import React from "react";
import { Link, useLocation } from "react-router-dom";
import {navItems} from "../../static/NavLinks.js";



function Navbar() {
    const location = useLocation();

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <ul className="800:flex text-md font-medium gap-3 text-muted-foreground">
            {navItems.map((item) => (
                <li key={item.path}>
                    <Link
                        to={item.path}
                        className={`relative inline-block py-1 transition-colors ${
                            isActive(item.path) ? "text-primary font-semibold" : "hover:text-primary"
                        }`}
                    >
                        {item.name}
                        <span
                            className={`absolute left-0 -bottom-0.5 h-0.5 bg-primary transition-all duration-300 w-full scale-x-0 origin-left ${
                                isActive(item.path) ? "scale-x-100" : "group-hover:scale-x-100"
                            }`}
                        ></span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default Navbar;
