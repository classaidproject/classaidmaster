import React from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { loadSelectedCourse } from "../../reducers/actions/selectedCourseAction";
import axios from "axios";
import { enrollURL } from "../../api";

function AddMember({ closeWindow, token, selected, initCourse }) {
  const dispatch = useDispatch();
  const { enrollList } = useSelector((state) => state.selectCourse);
  const { user } = useSelector((state) => state.login);
  function enrollHandle(e) {
    e.preventDefault();
    axios
      .post(
        enrollURL(),
        {
          user_id: e.target.value,
          course_id: selected._id,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then((response) => {
        console.log(response.data.course_id);
        initCourse();
        toast.success("Add member success");
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  return (
    <div className="float-window">
      <div className="float-window-container">
        <div className="user-container">
          <h4>Add members to course</h4>
          <ul>
            {enrollList.map((user) => (
              <li key={user._id} style={style}>
                <span>{user.name}</span>{" "}
                <button value={user._id} onClick={enrollHandle}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="button-container">
          <button onClick={closeWindow}>Close</button>
        </div>
      </div>
    </div>
  );
}

const style = {
  padding: "0.25rem 0",
};

export default AddMember;
