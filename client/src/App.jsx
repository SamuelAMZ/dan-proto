import React from "react";
import { Routes, Route } from "react-router-dom";
// css tailwind
import "./styles/tailwind.css";
// css components
import "./styles/index.min.css";
// react query
import { QueryClient, QueryClientProvider } from "react-query";
// components
import Sidebar from "./components/Sidebar/Sidebar";
// pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import NotFound from "./pages/404/NotFound";
import Home from "./pages/Home/Home";
import Users from "./pages/Users/Users";
import NewUser from "./pages/NewUser/NewUser";
import Jobs from "./pages/Jobs/Jobs";
import SingleUser from "./pages/SingleUser/SingleUser";
import SingleJob from "./pages/SingleJob/SingleJob";
import Logout from "./pages/Logout/Logout";

// subpages
// contexts
import { UserProvider } from "./contexts/UserContext";

const App = () => {
  // react query
  const client = new QueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        <>
          {/* auth */}
          {/*  */}

          {/* component code */}
          <div className="site-container">
            <div className="notif"></div>

            <UserProvider>
              {/* sidebar */}
              <Sidebar />

              {/* main */}
              <div className="main">
                <Routes>
                  {/* auth pages */}
                  <Route path="/" exact element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  {/* dashboad pages */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/user/new" element={<NewUser />} />
                  <Route path="/user/:uid" element={<SingleUser />} />
                  <Route path="/job/:jobId" element={<SingleJob />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/logout" element={<Logout />} />
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </UserProvider>
          </div>
        </>
      </QueryClientProvider>
    </>
  );
};

export default App;
