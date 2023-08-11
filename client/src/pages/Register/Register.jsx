// built in hooks
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// custom  hook
import notif from "../../helpers/notif";
import postReq from "../../helpers/postReq";
// firebase auth comps
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../helpers/firebase";

// react firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";

const Register = () => {
  // login to site
  const [userRegistrationData, setUserRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [operationLoading, setOperationLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // check if an element from form is empty
    if (
      !userRegistrationData.name ||
      !userRegistrationData.email ||
      !userRegistrationData.password
    ) {
      notif("verify inputs");
      return;
    }

    // loader
    setOperationLoading(true);

    // register the user
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userRegistrationData.email,
        userRegistrationData.password
      );

      // send request to the server
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userRegistrationData.name,
      };
      const serverAnswer = await postReq(userData, "/api/new-user");

      if (serverAnswer.code === "bad") {
        notif(serverAnswer.message);
      }

      if (serverAnswer.message === "ok") {
        notif("log in successfully");
      }

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
          <h2>Register to the prototype</h2>
        </div>

        {/* form */}
        <form onSubmit={handleLogin}>
          <label htmlFor="name">Name</label>
          <div className="inputs">
            <input
              id="name"
              type="text"
              placeholder="jon doe"
              className="input input-bordered input-primary w-full"
              value={userRegistrationData.name}
              onChange={(e) =>
                setUserRegistrationData({
                  ...userRegistrationData,
                  name: e.target.value,
                })
              }
            />
            <label htmlFor="email">Email</label>
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
            <button className="btn btn-primary">Register</button>
          )}
          <div className="helper-links">
            <Link to={"/"}>
              <p>Login</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
