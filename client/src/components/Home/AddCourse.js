import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { addCourseURL } from "../../api";
import toster from "react-hot-toast";

function AddCourse({ closeWindow, fetchCourse }) {
  const code = useRef(null);
  const name = useRef(null);
  const { token } = useSelector((state) => state.login);

  const [error, setError] = useState(null);

  function formsubmitHandle(e) {
    e.preventDefault();
    axios
      .post(
        addCourseURL(),
        {
          course: code.current.value,
          name: name.current.value,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then(() => {
        toster.success("Add couse success");
        closeWindow();
        fetchCourse();
      })
      .catch((err) => setError(err.response.data.details[0].message));
  }
  return (
    <div className="float-window">
      <div className="float-window-container">
        <div className="user-container">
          <h4>Create your course</h4>
          <form onSubmit={formsubmitHandle}>
            <div className="error">{error && error}</div>
            <div>
              <label htmlFor="code">Course code</label>
              <input type="text" ref={code} />
            </div>
            <div>
              <label htmlFor="code">Course name</label>
              <input type="text" ref={name} />
            </div>
            <button type="submit">AddCourse</button>
          </form>
        </div>
        <div className="button-container">
          <button onClick={closeWindow}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
