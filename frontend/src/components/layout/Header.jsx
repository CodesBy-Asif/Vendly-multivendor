import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { LuNotepadText } from "react-icons/lu";
import { categories } from "../../static/Categories.js";
import { useIsMobile } from "../../hooks/isMobile.js";
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import DropDown from "./DropDown.jsx";
import Navbar from "./Navbar.jsx";
import AccountMenu from "./AccountMenu.jsx";
import MobileSidebar from "./MobileSidebar.jsx";
import WishlistSidebar from "./WishlistSidebar.jsx";
import CartSidebar from "./CartSidebar.jsx";
import { useSelector } from "react-redux";

function Header({ sticky }) {
  const [SearchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [Focus, setFocus] = useState(false);
  const inputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showWishlistSidebar, setShowWishlistSidebar] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { favorites } = useSelector((state) => state.favorites);
  const { cart } = useSelector((state) => state.cart);

  const { isMobile } = useIsMobile();
  useEffect(() => {
    const checkFocus = () => {
      if (document.activeElement === inputRef.current) {
        setFocus(true);
      } else {
        setFocus(false);
      }
    };

    window.addEventListener("click", checkFocus); // you can use other events too

    return () => {
      window.removeEventListener("click", checkFocus);
    };
  }, []);
  useEffect(() => {
    if (isMobile) {
      setFocus(false);
      setShowMobileSidebar(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isMobile]);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const filteredData = products.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResults(filteredData);
  };

  return (
    <>
      <header className="bg-accent z-10 border-b border-border shadow-sm relative">
        <div className="flex gap-8 sm:px-8 px-4 py-4 justify-between items-center ">
          <Link to={"/"}>
            <h1 className="800:text-3xl text-2xl tracking-wider font-Title  text-primary">
              Vendly
            </h1>
          </Link>
          {!isMobile && (
            <div className="flex w-[50%]  relative">
              <input
                ref={inputRef}
                name="search"
                className={
                  "w-full p-2   text-sm text-gray-900 bg-gray-50 rounded-l-lg border-s-gray-200 border-s-2 border border-gray-300 focus:outline-none focus-visible:primary"
                }
                placeholder={"Search Product......"}
                value={SearchQuery}
                onChange={handleSearch}
              />
              <button
                className={
                  "bg-primary text-primary-foreground px-4 py-2 rounded-r-lg"
                }
                onClick={() => {}}
              >
                {" "}
                Search
              </button>
              {searchResults.length > 0 && SearchQuery.length > 0 && Focus && (
                <div className="absolute flex flex-col gap-2 p-2 z-[21] top-full w-full overflow-y-scroll max-h-[40vh] bg-background shadow-lg ">
                  {searchResults.map((result) => (
                    <Link
                      key={result._id}
                      to={`/product/${result._id}`}
                      className={
                        "flex justify-start items-center gap-4 hover:bg-primary/10 rounded-md transition-all"
                      }
                    >
                      <div className={"p-2 bg- rounded-md w-fit"}>
                        <img
                          src={result.images[0].url}
                          alt="Product Image"
                          className={"w-16 h-16 rounded-md "}
                        />
                      </div>
                      <div className={"p-2"}>
                        <h3 className={"text-sm font-semibold"}>
                          {result.name}
                        </h3>
                        <p className={"text-xs text-gray-500"}>
                          ${result.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className={"flex items-center justify-center gap-2"}>
            {isMobile && (
              <button
                className="bg-muted text-muted-foreground sm:px-4 sm:py-2 px-2 py-1 rounded-lg text-sm"
                onClick={() => setShowMobileSearch(true)}
              >
                <BiSearch className={"text-xl"} />
              </button>
            )}
            {!isMobile &&
              (seller ? (
                <a
                  href="/shop/dashboard"
                  className="bg-primary rounded-xl text-nowrap text-primary-foreground px-4 py-2"
                >
                  Go to Shop
                  <IoIosArrowForward className="inline-block w-4 h-4" />
                </a>
              ) : (
                <a
                  href="/shop/create"
                  className="bg-primary rounded-xl text-nowrap text-primary-foreground px-4 py-2"
                >
                  Become Seller
                  <IoIosArrowForward className="inline-block w-4 h-4" />
                </a>
              ))}

            {isMobile && (
              <button
                className="text-foreground sm:px-4 sm:py-2 px-2 py-1 rounded-lg text-sm"
                onClick={() => {
                  setShowMobileSidebar(true);
                }}
              >
                <AiOutlineMenu className={"text-2xl"} />
              </button>
            )}
          </div>
        </div>
      </header>
      {isMobile && (
        <MobileSidebar
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
        />
      )}
      <div className={`${sticky ? "sticky top-0" : ""} z-[5]`}>
        <div className=" w-full items-center justify-between flex relative shadow-md shadow-border py-4 px-6 bg-accent">
          <div
            className={`flex gap-2 sm:gap-4 ${
              showDropdown
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            } px-2 py-1 sm:px-4 sm:py-2 font-medium justify-between rounded-xl items-center cursor-pointer`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex items-center gap-1">
              <LuNotepadText />
              <h1>All Categories</h1>
            </div>
            <IoIosArrowDown />
          </div>
          {!isMobile && <Navbar />}
          <div className="flex gap-1 sm:gap-3 items-center">
            <button
              onClick={() => {
                setShowWishlistSidebar(true);
              }}
              className="relative flex items-center gap-2 px-1 py-1 rounded-lg  text-muted-foreground hover:text-primary transition-colors"
            >
              <AiOutlineHeart className=" text-xl sm:text-2xl" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowCartSidebar(true)}
              className="relative flex items-center gap-2 px-1 py-1 rounded-lg text-muted-foreground hover:text-primary transition-colors"
            >
              <AiOutlineShoppingCart className="text-2xl sm:text-3xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            <AccountMenu />
          </div>
        </div>
        {showDropdown && <DropDown Catagories={categories} />}
      </div>
      {showCartSidebar && (
        <CartSidebar
          isOpen={showCartSidebar}
          onClose={() => setShowCartSidebar(false)}
        />
      )}
      {showWishlistSidebar && (
        <WishlistSidebar
          isOpen={showWishlistSidebar}
          onClose={() => setShowWishlistSidebar(false)}
        />
      )}
      {isMobile && showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-background p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <button
              className="text-sm text-gray-600"
              onClick={() => {
                setShowMobileSearch(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
            >
              <AiOutlineClose size={20} fontSize="2xl" fontWeight="bold" />
            </button>
          </div>

          <div className="flex  relative">
            <input
              ref={inputRef}
              name="search"
              className={
                "w-full p-2 z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-s-gray-200 border-s-2 border border-gray-300 focus:outline-none focus-visible:border-blue-500"
              }
              placeholder={"Search Product......"}
              value={SearchQuery}
              onChange={handleSearch}
            />
            <button
              className={
                "bg-primary text-primary-foreground px-4 py-2 rounded-r-lg"
              }
              onClick={() => {}}
            >
              {" "}
              Search
            </button>
            {searchResults.length > 0 && SearchQuery.length > 0 && Focus && (
              <div className="absolute flex flex-col gap-2 p-2 top-full w-full overflow-y-scroll max-h-[40vh] bg-background shadow-lg ">
                {searchResults.map((result) => (
                  <Link
                    key={result._id}
                    to={`/product/${result._id}`}
                    className={
                      "flex justify-start items-center gap-4 hover:bg-primary/10 rounded-md transition-all"
                    }
                  >
                    <div className={"p-2 bg- rounded-md w-fit"}>
                      <img
                        src={result.images[0].url}
                        alt="Product Image"
                        className={"w-16 h-16 rounded-md "}
                      />
                    </div>
                    <div className={"p-2"}>
                      <h3 className={"text-sm font-semibold"}>{result.name}</h3>
                      <p className={"text-xs text-gray-500"}>${result.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {searchResults.length > 0
              ? searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={`/product/${result.id}`}
                    className="flex items-center gap-4 p-2 border-b border-border hover:bg-gray-50"
                    onClick={() => setShowMobileSearch(false)}
                  >
                    <img
                      src={result.thumbnail}
                      className="w-12 h-12 rounded"
                      alt=""
                    />
                    <div>
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-gray-500">${result.price}</p>
                    </div>
                  </Link>
                ))
              : SearchQuery && (
                  <p className="text-sm text-gray-500">No results found.</p>
                )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
