import React from "react";
import { Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

// helpers
import postReq from "../../helpers/postReq";

// react query
import { useQuery } from "react-query";

const Users = () => {
  const handleTableData = async () => {
    // send req
    return await postReq({}, "/api/list-users");
  };
  const {
    data: tableData,
    isLoading: tableLoading,
    refetch: getPaginate,
  } = useQuery(["table"], handleTableData, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return (
    <>
      <Header page={"Users"} />
      {/* users */}
      <div className="centerer home-container">
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
                        <Link to={`/user/${data?._id}`}>
                          {data?.first_name}{" "}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/user/${data?._id}`}>{data?.last_name}</Link>
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
      </div>
    </>
  );
};

export default Users;
