import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineArrowDown,
} from "react-icons/ai";
import { IoFilter } from "react-icons/io5";
import { BsPlusLg } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

// helpers
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";

// react query
import { useQuery } from "react-query";

// import loading
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Table = ({ conf }) => {
  const [pageNumber, setPageNumber] = useState("0");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [removing, setRemoving] = useState(false);
  const location = useLocation();

  // get table data
  const handleTableData = async () => {
    // send req
    return await postReq(
      {
        page: pageNumber,
        perPage: conf.perPage,
        searchKeyword,
        target: conf.target,
      },
      "/api/pagination"
    );
  };

  const {
    data: tableData,
    isLoading: tableLoading,
    error,
    refetch: getPaginate,
  } = useQuery(
    [location.pathname, pageNumber, searchKeyword, conf.refresh],
    handleTableData,
    {
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  //  handle next and prev
  const handleNext = () => {
    // check if page available
    if (
      Number(pageNumber) + 1 ===
      Math.ceil(tableData.payload.totalItemsLength / Number(conf.perPage))
    ) {
      // notif page end
      return;
    }

    // move page to next
    setPageNumber(String(Number(pageNumber) + 1));
  };

  const handlePrev = () => {
    // check if page available
    if (Number(pageNumber) === 0) {
      // notif page end
      return;
    }

    // move page to next
    setPageNumber(String(Number(pageNumber) - 1));
  };

  // handle search
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchKeyword) {
      return;
    }

    setPageNumber("0");
    getPaginate();
  };

  // remove items
  const handleRemove = async (e, target) => {
    const targetId = e.target.getAttribute("id");

    if (!targetId) {
      return notif("error removing item, retry later");
    }

    setRemoving(true);

    const reqData = {
      id: targetId.trim(),
      target: target.trim(),
    };

    // sending request
    try {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("GET", "POST", "OPTIONS");
      headers.append(
        "Access-Control-Allow-Origin",
        `${import.meta.env.REACT_APP_DOMAIN}`
      );
      headers.append("Access-Control-Allow-Credentials", "true");

      const response = await fetch(
        `${import.meta.env.REACT_APP_DOMAIN}/api/remove-table-item`,
        {
          mode: "cors",
          method: "POST",
          headers: headers,
          body: JSON.stringify(reqData),
          credentials: "include",
        }
      );

      const serverMessage = await response.json();

      if (serverMessage.code === "500") {
        console.log(serverMessage.message);
      }

      // set data
      if (serverMessage.code === "ok") {
        setRemoving(false);

        // show success message
        notif("removed successfully");

        // refresh table
        getPaginate();
      }
    } catch (err) {
      console.log(err);
      setRemoving(false);
    }
  };

  return (
    <div className="overflow-x-auto table-container">
      {/* header */}
      <div
        className={
          conf && conf.target !== "linkedin-jobs"
            ? "table-header expand-search"
            : "table-header"
        }
      >
        {/* linkedin-jobs */}
        {conf && conf.target === "linkedin-jobs" && (
          <div className="actions">
            <div className="dropdown dropdown-bottom dropdown-start">
              <button className="btn changed">
                <IoFilter /> <p>Actions</p>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>Select All</a>
                  <a>Deselect All</a>
                  <a>Remove</a>
                </li>
              </ul>
            </div>
            <a href="/new">
              <button className="btn btn-primary">
                <BsPlusLg /> <p>New Search</p>
              </button>
            </a>
            {tableData && tableData.code === "ok" && (
              <p>{tableData.payload.totalItemsLength} items</p>
            )}
          </div>
        )}

        {/* search form */}
        {!(error || tableData?.payload === "table conf error") && (
          <div className="search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search in table"
                className="input input-bordered w-full"
                value={searchKeyword}
                onChange={(e) => {
                  setPageNumber("0");
                  setSearchKeyword(e.target.value);
                }}
              />
              <button className="btn btn-primary">
                <FiSearch />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* table */}
      <table className="table table-zebra w-full">
        {/* thead*/}
        {conf &&
        conf.target === "linkedin-jobs" &&
        !(tableData?.payload === "nothing") ? (
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="checkbox checkbox-primary" />
              </th>
              <th>Name</th>
              <th>Status</th>
              <th>Platform</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
        ) : (
          <thead>
            <tr>
              <th>Items</th>
              <th></th>
            </tr>
          </thead>
        )}

        <tbody>
          {/* loading */}
          {tableLoading &&
            new Array(Number(conf.perPage)).fill("").map((elm, idx) => {
              return (
                <tr key={idx}>
                  <SkeletonTheme baseColor="#8b8b8b35" highlightColor="#f9fafb">
                    <td>
                      <Skeleton count={1} />
                    </td>
                    <td>
                      <Skeleton count={1} />
                    </td>
                    <td>
                      <Skeleton count={1} />
                    </td>
                    <td>
                      <Skeleton count={1} />
                    </td>
                    <td>
                      <Skeleton count={1} />
                    </td>
                    <td>
                      <Skeleton count={1} />
                    </td>
                  </SkeletonTheme>
                </tr>
              );
            })}

          {/* error on nothing found */}
          {(error ||
            tableData?.payload === "nothing" ||
            tableData?.payload === "table conf error") && (
            <>
              <div className="nodata">
                <img src="/img/nodata.png" alt="no data found" />
                <h3>No record found</h3>
              </div>
            </>
          )}

          {/* linkedin-jobs */}
          {tableData &&
            conf.target === "linkedin-jobs" &&
            tableData.code === "ok" &&
            tableData.payload.list.map((elm, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                    />
                  </td>
                  <td>
                    <Link to={`/search/${elm._id}`}>
                      {elm.keyword.substr(0, 20)}
                      {elm.keyword.length >= 20 && "..."}
                    </Link>
                  </td>
                  <td>{elm.status}</td>
                  <td>Linkedin</td>
                  <td>{elm.createdAt.split("T")[0]}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/search/${elm._id}`}>
                        <AiOutlineEdit />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* footer */}
      <div className="table-footer">
        {tableData && tableData.code === "ok" && (
          <div className="elms">
            <button className="btn" onClick={handlePrev}>
              Previous
            </button>
            <p>
              Page {Number(pageNumber) + 1} of{" "}
              {Math.ceil(
                tableData.payload.totalItemsLength / Number(conf.perPage)
              )}
            </p>

            <button className="btn" onClick={handleNext}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
