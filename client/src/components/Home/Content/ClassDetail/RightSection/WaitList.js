import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { waitListURL, waitListChangeURL } from "../../../../../api";

function WaitList() {
  const { selected } = useSelector((state) => state.selectCourse);
  const { token } = useSelector((state) => state.login);
  const [list, setList] = useState([]);

  const getWaitList = useCallback(() => {
    if (typeof selected._id !== "undefined")
      axios.get(waitListURL(selected._id)).then((res) => {
        setList(res.data);
      });
  }, [selected._id]);

  useEffect(() => {
    getWaitList();
  }, [getWaitList]);

  function enrollHandle(event) {
    event.preventDefault();
    console.log(event.target.value);
    axios
      .post(
        waitListChangeURL(),
        {
          _id: event.target.value,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then(function (res) {
        getWaitList();
        console.log(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  return (
    <div>
      <h3>WAIT LIST</h3>
      {list.length > 0 ? (
        <>
          {" "}
          {list.map(function (element) {
            return (
              <ul key={element._id} className="row">
                <li>{element.name}</li>
                <li>{element.email}</li>
                <li></li>
                <li>
                  <button onClick={enrollHandle} value={element._id}>
                    Enroll
                  </button>
                </li>
              </ul>
            );
          })}
        </>
      ) : (
        <ul className="row">
          <li>No waitlist yet</li>
        </ul>
      )}
    </div>
  );
}

export default WaitList;
