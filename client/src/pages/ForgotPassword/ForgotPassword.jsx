// built in hooks
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// custom  hook
import notif from "../../helpers/notif";
// firebase auth comps
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../helpers/firebase";

// react firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";

const ForgotPassword = () => {
  // login to site
  const navigate = useNavigate();
  const [userRegistrationData, setUserRegistrationData] = useState({
    email: "",
  });
  const [operationLoading, setOperationLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // check if an element from form is empty
    if (!userRegistrationData.email) {
      notif("verify inputs");
      return;
    }

    // loader
    setOperationLoading(true);

    // register the user
    try {
      const userCredential = await sendPasswordResetEmail(
        auth,
        userRegistrationData.email
      );

      notif("reset email sent successfully");
      setOperationLoading(false);

      // redirect to login ForgetPassword
      navigate("/");
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
      window.location.href = `${import.meta.env.NEXT_PUBLIC_CLIENT}/home`;
    }
  }, [user]);

  return (
    <div className="login-f">
      <div className="login-container">
        <div className="heading">
          {/* logo */}
          <h1>Prototype</h1>

          {/* login text */}
          <h2>Reset Password</h2>
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
          </div>

          {operationLoading ? (
            <button className="btn btn-primary">
              <span className="loading loading-spinner"></span>
              loading...
            </button>
          ) : (
            <button className="btn btn-primary">Reset Password</button>
          )}
          <Link to={"/"}>
            <button className="btn w-full">Back</button>
          </Link>
          <div className="helper-links">
            <Link to={"/"}>
              <p>Login</p>
            </Link>
            |
            <Link to={"/register"}>
              <p>Register</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
