import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../service/Logout.js";

const AccountMenu = (prop) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const toggleDropdown = () => setOpen(!open);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LogoutUser" });
    logout();
    navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-lg sm:bg-background sm:px-3 sm:py-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <CgProfile className="text-3xl" />
        <span className={`text-sm ${!prop.bottom ? "hidden" : ""} sm:block`}>
          {isAuthenticated ? user?.full_name : "Login"}
        </span>
      </button>

      {open && (
        <div
          className={`absolute -right-[10px] md:left-0 w-max md:w-full ${
            prop.bottom ? "bottom-full mb-2" : " mt-2 top-full"
          } bg-white shadow-lg rounded-md py-2 z-50`}
        >
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard/profile"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Dashboard
              </Link>
              <Link
                to="/account"
                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
