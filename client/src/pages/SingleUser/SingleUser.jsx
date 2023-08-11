import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

// helpers
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";

// react query
import { useQuery } from "react-query";

const SingleUser = () => {
  const { uid } = useParams();
  const [term, setTerm] = useState([]);
  const [loadingApply, setLoadingApply] = useState(false);

  // table data
  const handleTableData = async () => {
    // send req
    return await postReq({ term }, "/api/job-matches");
  };
  const {
    data: tableData,
    isLoading: tableLoading,
    refetch: getPaginate,
  } = useQuery(["filtered-jobs", term.length], handleTableData, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  //   user data
  const handleUserData = async () => {
    // send req
    return await postReq({ uid }, "/api/single-user");
  };
  const {
    data: userData,
    isLoading: userLoading,
    refetch: getPaginateUser,
  } = useQuery(["single-user"], handleUserData, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {
    if (userData) {
      setTerm(userData?.payload[0]?.userSkills);
    }
  }, [userData]);

  // start applying
  const handleApply = async () => {
    setLoadingApply(true);
    // get job ids
    let jobIds = [];
    for (let i = 0; i < tableData?.payload?.length; i++) {
      jobIds.push(tableData.payload[i]._id);
    }

    // send req
    try {
      const response = await postReq({ userId: uid, jobIds }, "/api/apply");
      notif(response?.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApply(false);
    }
  };

  return (
    <>
      <Header page={`Single User - '${userData?.payload[0]?.first_name}'`} />

      <div className="centerer home-container">
        <div className="single-user-container">
          {/* table */}
          <div className="overflow-x-auto">
            <table className="table proto-table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Indice</th>
                  <th>Job Url</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {!tableLoading &&
                  tableData &&
                  tableData.payload.map((data, key) => {
                    return (
                      <tr key={key}>
                        <th>{key + 1}</th>
                        <td>
                          <Link to={`/job/${data?._id}`}>{data?.jobTitle}</Link>
                        </td>
                        <td>
                          <Link to={`/job/${data?._id}`}>{data?.indice}</Link>
                        </td>
                        <td>
                          <Link to={`/job/${data?._id}`}>
                            {data?.jobUrl?.slice(0, 40)}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* about user */}
          <div className="about-user">
            <ul>
              <li>
                <p>First name</p>
                <p>{userData?.payload[0]?.first_name}</p>
              </li>
              <li>
                <p>Email</p>
                <p>{userData?.payload[0]?.email}</p>
              </li>
              <li>
                <p>Resume file</p>
                <a href={userData?.payload[0]?.resume_file} target="_blank">
                  Link
                </a>
              </li>
              <li>
                <p>Terms</p>
                <p>
                  {userData?.payload[0]?.userSkills.map((elm, key) => (
                    <span key={key}>{elm}, </span>
                  ))}
                </p>
              </li>
              {loadingApply ? (
                <button className="btn btn-primary w-full">
                  <span className="loading loading-spinner"></span> Applying...
                </button>
              ) : (
                <button
                  className="btn btn-primary w-full"
                  onClick={handleApply}
                >
                  Apply to matches
                </button>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleUser;
