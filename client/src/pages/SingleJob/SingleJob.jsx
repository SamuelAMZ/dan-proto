import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

// helpers
import postReq from "../../helpers/postReq";

// react query
import { useQuery } from "react-query";

const SingleJob = () => {
  const { jobId } = useParams();
  const [term, setTerm] = useState([]);

  // table data
  const handleTableData = async () => {
    // send req
    return await postReq({ term }, "/api/user-matches");
  };
  const {
    data: tableData,
    isLoading: tableLoading,
    refetch: getPaginate,
  } = useQuery(["filtered-users", term.length], handleTableData, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  //   user data
  const handleJobData = async () => {
    // send req
    return await postReq({ jobId }, "/api/single-job");
  };
  const {
    data: jobData,
    isLoading: jobLoading,
    refetch: getPaginateJob,
  } = useQuery(["single-job"], handleJobData, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {
    if (jobData) {
      setTerm(jobData?.payload[0]?.terms);
    }
  }, [jobData]);

  return (
    <>
      <Header page={`Single Job - '${jobData?.payload[0]?.jobTitle}'`} />

      <div className="centerer home-container">
        <div className="single-user-container">
          {/* table */}
          <div className="overflow-x-auto">
            <table className="table proto-table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
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
                          {" "}
                          <Link to={`/user/${data?._id}`}>
                            {data?.first_name}
                          </Link>
                        </td>
                        <td>
                          {" "}
                          <Link to={`/user/${data?._id}`}>
                            {data?.last_name}
                          </Link>
                        </td>
                        <td>
                          {" "}
                          <Link to={`/user/${data?._id}`}>{data?.email}</Link>
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
                <p>Title</p>
                <p>{jobData?.payload[0]?.jobTitle}</p>
              </li>
              <li>
                <p>Job Url</p>
                <a href={jobData?.payload[0]?.jobUrl} target="_blank">
                  Link
                </a>
              </li>
              <li>
                <p>Terms</p>
                <p>
                  {jobData?.payload[0]?.terms?.map((elm) => (
                    <span>{elm}, </span>
                  ))}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleJob;
