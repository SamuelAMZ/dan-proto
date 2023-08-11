import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// helpers
import notif from "../../helpers/notif";
// firebase
import { signOut } from "firebase/auth";
import { auth } from "../../helpers/firebase";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await signOut(auth);
      notif("logout successfully");
      navigate("/");
    })();
  }, []);

  return <div>Logout...</div>;
};

export default Logout;
