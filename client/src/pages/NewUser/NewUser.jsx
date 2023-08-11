import React, { useState } from "react";

// comps
import Header from "../../components/Header/Header";

// helpers
import postReq from "../../helpers/postReq";

// firebase
import { auth } from "../../helpers/firebase";

// react firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";

const NewUser = () => {
  const [userRegistrationData, setUserRegistrationData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    resume_file: "",
    phone: "",
    linkedin_url: "",
    country: "",
    address: "",
  });
  const [fileUploaded, setFileUploaded] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // keep track of the user instance
  const [user, loading] = useAuthState(auth);

  //   upload
  const handleFileChange = (event) => {
    setFileUploaded(event.target.files[0]);
  };

  const handleCreation = async (e) => {
    e.preventDefault();
    setOperationLoading(true);

    // upload file
    const formData = new FormData();
    formData.append("file", fileUploaded);

    const uploadFile = async () => {
      let headers = new Headers();
      headers.append("GET", "POST", "OPTIONS");
      headers.append(
        "Access-Control-Allow-Origin",
        `${import.meta.env.VITE_DOMAIN}/`
      );
      headers.append("Access-Control-Allow-Credentials", "true");

      try {
        // fetch
        let req = await fetch(
          `${import.meta.env.VITE_DOMAIN}/api/upload-file`,
          {
            mode: "cors",
            method: "POST",
            headers: headers,
            body: formData,
            credentials: "include",
          }
        );

        const serverRes = await req.json();
        return serverRes;
      } catch (error) {
        console.log(error);
      }
    };
    let fileUploadedData = await uploadFile();

    console.log(fileUploadedData.url);

    //  add resume link to form state
    setUserRegistrationData({
      ...userRegistrationData,
      resume_file: fileUploadedData.url,
    });

    // create user
    try {
      const data = await postReq(
        { ...userRegistrationData, resume_file: fileUploadedData.url },
        "/api/new-job-user"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setOperationLoading(false);
    }

    // redirect to dash
    window.location.href = `${import.meta.env.VITE_HOST}/users`;
  };

  return (
    <>
      <Header page={"New User"} />
      {/* users */}
      <div className="centerer home-container">
        <div className="form-container">
          <form onSubmit={handleCreation}>
            <label htmlFor="email">Email</label>
            <div className="inputs">
              <input
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
              <label>First Name</label>
              <input
                type="text"
                placeholder="jon"
                className="input input-bordered input-primary w-full"
                value={userRegistrationData.first_name}
                onChange={(e) =>
                  setUserRegistrationData({
                    ...userRegistrationData,
                    first_name: e.target.value,
                  })
                }
              />
              <label>Last Name</label>
              <input
                type="text"
                placeholder="doe"
                className="input input-bordered input-primary w-full"
                value={userRegistrationData.last_name}
                onChange={(e) =>
                  setUserRegistrationData({
                    ...userRegistrationData,
                    last_name: e.target.value,
                  })
                }
              />
              <label>Resume</label>
              <input
                type="file"
                name="file"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />
              <label>Phone</label>
              <input
                type="text"
                placeholder="000000"
                className="input input-bordered input-primary w-full"
                value={userRegistrationData.phone}
                onChange={(e) =>
                  setUserRegistrationData({
                    ...userRegistrationData,
                    phone: e.target.value,
                  })
                }
              />
              <label>Country</label>
              <input
                type="text"
                placeholder="USA"
                className="input input-bordered input-primary w-full"
                value={userRegistrationData.country}
                onChange={(e) =>
                  setUserRegistrationData({
                    ...userRegistrationData,
                    country: e.target.value,
                  })
                }
              />
              <label>Address</label>
              <input
                type="text"
                placeholder="2786 Hallie Haven new york"
                className="input input-bordered input-primary w-full"
                value={userRegistrationData.address}
                onChange={(e) =>
                  setUserRegistrationData({
                    ...userRegistrationData,
                    address: e.target.value,
                  })
                }
              />
              <label>Linkedin</label>
              <input
                type="text"
                placeholder="https://www.linkedin.com/in/angela"
                className="input input-bordered input-primary w-full"
                value={userRegistrationData.linkedin_url}
                onChange={(e) =>
                  setUserRegistrationData({
                    ...userRegistrationData,
                    linkedin_url: e.target.value,
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
              <button className="btn btn-primary">Create User</button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default NewUser;
