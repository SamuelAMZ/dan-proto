import React from "react";

// icons
import { BsPlusLg } from "react-icons/bs";

const Header = ({ page }) => {
  return (
    <div className="header-container">
      <div className="header-elm">
        <div className="page-title">
          <h2>{page}</h2>
        </div>
        {/* new btn */}
        <div className="right-side">
          <a href="/user/new">
            <button className="btn btn-primary">
              <BsPlusLg /> <p>New User</p>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
