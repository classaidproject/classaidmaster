import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import axios from "axios";
import { removeCourseURL, unenrollURL } from "../../../../api";

export default function LeftSection({
  selectCourse,
  courseAuthor,
  setAddMemberWindow,
  fetchCourse,
  token,
  setChatWindow,
  resetWindow,
  setUserWindow,
  setQuizWindow,
  setRankingWindow,
}) {
  const history = useHistory();
  const [removeCourse, setRemoveCourse] = useState(false);
  const { user } = useSelector((state) => state.login);

  function unrollFromCourse() {
    axios
      .post(
        unenrollURL(),
        {
          course_id: selectCourse.selected._id,
          user_id: user._id,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then(function () {
        alert("SUCESS UNROLLED");
        history.push("/");
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  useEffect(() => {
    if (removeCourse) {
      history.push("/");
      fetchCourse();
    }
  }, [removeCourse]);

  return (
    <div className="left-section">
      <div className="back-link">
        <Link to="/">
          <NavigateBeforeIcon />
          Back
        </Link>
      </div>
      <img src="https://via.placeholder.com/80" alt="" />
      <div>
        <span>{selectCourse.selected.name}</span>
        <ul>
          <li
            onClick={() => {
              resetWindow();
              setChatWindow(true);
            }}
          >
            General
          </li>
          <li
            onClick={() => {
              resetWindow();
              setRankingWindow(true);
            }}
          >
            Ranking
          </li>
          <li
            onClick={() => {
              resetWindow();
              setUserWindow(true);
            }}
          >
            Manage course
          </li>
          {courseAuthor ? (
            <>
              <li onClick={() => setAddMemberWindow(true)}>Add member</li>
              <li
                onClick={() => {
                  resetWindow();
                  setQuizWindow(true);
                }}
              >
                Quiz
              </li>
              <DeleteCourse
                course_id={selectCourse.selected._id}
                token={token}
                setRemoveCourse={setRemoveCourse}
              />
            </>
          ) : null}
          {courseAuthor ? null : (
            <li onClick={unrollFromCourse}>Leave the course</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function DeleteCourse({ token, course_id, setRemoveCourse }) {
  function deleteCourseHanle(event) {
    event.preventDefault();
    axios
      .post(
        removeCourseURL(course_id),
        {},
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then(() => {
        alert("REMOVE COURSE SUCCESS");
        setRemoveCourse(true);
      })
      .catch((err) => console.log(err));
  }
  return <li onClick={deleteCourseHanle}>Delete the course</li>;
}
