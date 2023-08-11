// built in hooks
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// custom  hook
import notif from "../../helpers/notif";
// firebase auth comps
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../helpers/firebase";

// react firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  // login to site
  const [userRegistrationData, setUserRegistrationData] = useState({
    email: "",
    password: "",
  });
  const [operationLoading, setOperationLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // check if an element from form is empty
    if (!userRegistrationData.email || !userRegistrationData.password) {
      notif("verify inputs");
      return;
    }

    // loader
    setOperationLoading(true);

    // register the user
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userRegistrationData.email,
        userRegistrationData.password
      );

      notif("login successfully");

      setOperationLoading(false);
    } catch (error) {
      notif(
        error.message
          .replace("Firebase:", "")
          .replace("Error", "")
          .replace("(", "")
          .replace(")", "")
          .replace("auth", "")
          .replace("/", "")
          .replaceAll("-", " ")
      );
      setOperationLoading(false);
    }
  };

  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      // redirect to dash
      window.location.href = `${import.meta.env.VITE_HOST}/home`;
    }
  }, [user]);

  return (
    <div className="login-f">
      <div className="login-container">
        <div className="heading">
          {/* logo */}
          <h1>Prototype</h1>

          {/* login text */}
          <h2>Log in to the dashboard</h2>
        </div>

        {/* form */}
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <div className="inputs">
            <input
              id="email"
              type="text"
              placeholder="jon@doe.com"
              className="input input-bordered input-primary w-full"
              value={userRegistrationData.email}
              onChange={(e) =>
                setUserRegistrationData({
                  ...userRegistrationData,
                  email: e.target.value,
                })
              }
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="*******"
              className="input input-bordered input-primary w-full"
              value={userRegistrationData.password}
              onChange={(e) =>
                setUserRegistrationData({
                  ...userRegistrationData,
                  password: e.target.value,
                })
              }
            />
          </div>

          {operationLoading ? (
            <button className="btn btn-primary">
              <span className="loading loading-spinner"></span>
              loading...
            </button>
          ) : (
            <button className="btn btn-primary">Login</button>
          )}
          <div className="helper-links">
            <Link to={"/register"}>
              <p>Register</p>
            </Link>
            |
            <Link to={"/forgot-password"}>
              <p>Forgot Password</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
