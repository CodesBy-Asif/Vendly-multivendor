import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-4xl font-Title font-bold mb-3">Vendly</h2>
          <p className="text-sm text-white/80">
            Empowering digital experiences with high-quality products and
            seamless service. Built with passion and precision.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-white/80">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/shop" className="hover:underline">
                Shop
              </a>
            </li>
            <li>
              <a href="/Events" className="hover:underline">
                Events
              </a>
            </li>
            <li>
              <a href="/Products" className="hover:underline">
                products
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-sm text-white/80">
            <li>
              <a href="/faq" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="/help" className="hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
          <p className="text-sm text-white/80 mb-3">
            Join our newsletter for the latest updates and offers.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 border-primary-foreground border text-primary-foreground w-full rounded-l-md rign focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary-foreground text-primary font-semibold px-4 py-2 rounded-r-md hover:bg-muted"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div
        className={
          "border-t flex justify-between px-16 border-white/20 mt-10 pt-6 text-center text-sm text-white/60"
        }
      >
        <div>
          &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
        </div>
        <div>Design and developed by CodesbyAsif</div>
      </div>
    </footer>
  );
};

export default Footer;
