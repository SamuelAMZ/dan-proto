import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

// icons
import { AiOutlineHome } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { BsBagPlus } from "react-icons/bs";

const Sidebar = () => {
  // loaction
  const location = useLocation();

  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname.includes("/404") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/forgot-password")
    ) {
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, [location.pathname]);

  return (
    <>
      {allowed && (
        <>
          <div className="sidebar">
            {/* heading */}
            <div className="heading">
              <Link to={"/home"}>
                <h1>Prototype</h1>
              </Link>
            </div>

            {/* menu elements */}
            <ul className="menu-container">
              {/* separator
              <span className="seperator-element"></span> */}
              <Link to={"/home"}>
                <li
                  className={location.pathname === "/home" ? "active-menu" : ""}
                >
                  <AiOutlineHome />
                  <p>Dashboard</p>
                </li>
              </Link>
              <Link to={"/users"}>
                <li
                  className={
                    location.pathname.includes("/users") ? "active-menu" : ""
                  }
                >
                  <FiUsers />
                  <p>Users</p>
                </li>
              </Link>
              <Link to={"/jobs"}>
                <li
                  className={location.pathname === "/jobs" ? "active-menu" : ""}
                >
                  <BsBagPlus />
                  <p>Jobs</p>
                </li>
              </Link>
              {/* logout */}
              <Link to={"/logout"}>
                <li>
                  <HiOutlineLogout />
                  <p>Logout</p>
                </li>
              </Link>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
