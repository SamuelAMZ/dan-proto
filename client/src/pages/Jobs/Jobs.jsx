import React from "react";
import { Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

// helpers
import postReq from "../../helpers/postReq";

// react query
import { useQuery } from "react-query";

const Jobs = () => {
  const handleTableData = async () => {
    // send req
    return await postReq({}, "/api/list-jobs");
  };
  const {
    data: tableData,
    isLoading: tableLoading,
    refetch: getPaginate,
  } = useQuery(["jobs"], handleTableData, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return (
    <>
      <Header page={"Jobs"} />
      {/* users */}
      <div className="centerer home-container">
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
      </div>
    </>
  );
};

export default Jobs;
