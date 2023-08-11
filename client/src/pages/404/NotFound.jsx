import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // not found pages redirect to 404 page
  useEffect(() => {
    if (!location.pathname.includes("/404")) {
      navigate("/404");
    }
  }, [location.pathname]);

  return (
    <div className="centerer notfound">
      <h1>404</h1>
      <Link to={"/home"}>
        <button className="btn btn-primary">Go back to home</button>
      </Link>
    </div>
  );
};

export default NotFound;
