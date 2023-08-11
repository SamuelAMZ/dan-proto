import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

// contexts
import UserContext from "../../contexts/UserContext";

// icons
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { FiSearch, FiUsers } from "react-icons/fi";
import { BiMessageSquareDots } from "react-icons/bi";
import {
  TbBrandTelegram,
  TbBrandGoogleAnalytics,
  TbArrowBigDownLines,
} from "react-icons/tb";
import { SiIndeed } from "react-icons/si";
import { BsBagPlus, BsCalendarCheck } from "react-icons/bs";

// helpers
import postReq from "../../helpers/postReq";

// react query
import { useQuery } from "react-query";

// import loading
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// firebase
import { auth } from "../../helpers/firebase";

// react firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";

const Home = () => {
  // keep track of the user instance
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <Header page={"Home"} />
      {/* home */}
      <div className="centerer home-container">
        {/* stats */}

        <div className="stats-container-jd">
          <div className="stat-jd">
            <div>
              <p>Users</p>
              <p className="desc">2</p>
            </div>
            <AiOutlineUsergroupDelete />
          </div>
          <div className="stat-jd">
            <div>
              <p>Jobs</p>
              <p className="desc">3</p>
            </div>
            <BsBagPlus />
          </div>
          <div className="stat-jd">
            <div>
              <p>Auto Apply Today</p>
              <p className="desc">5</p>
            </div>
            <BsCalendarCheck />
          </div>
          <div className="stat-jd">
            <div>
              <p>Auto Apply Total</p>
              <p className="desc">23</p>
            </div>
            <TbArrowBigDownLines />
          </div>
        </div>

        {/* quick links */}
        <h3 className="quick-link-title">Quick Links</h3>
        <div className="quick-links stats-container-jd">
          <Link to="/users">
            <div className="stat-jd">
              <div>
                <p>Users</p>
                <p className="desc">Add new user</p>
              </div>
              <FiUsers />
            </div>
          </Link>
          <Link to="/jobs">
            <div className="stat-jd">
              <div>
                <p>Jobs</p>
                <p className="desc">Add new position</p>
              </div>
              <BsBagPlus />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
