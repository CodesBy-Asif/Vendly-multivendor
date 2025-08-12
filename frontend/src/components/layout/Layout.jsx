import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Top Navigation / Header */}
            <Header sticky={true} />

            {/* Main content area */}
            <main className="flex-1 bg-background text-foreground">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
