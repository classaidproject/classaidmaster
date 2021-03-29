import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { enrollURL, userwaitListURL } from "../../api";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

function AllCourse({
  course,
  user,
  setAddCourseWindow,
  setWaitListWindow,
  token,
  fetchCourse,
}) {
  const [courseList, setCourseList] = useState([]);

  function pairCourse() {
    const newCourseList = course.courses.map(function (element) {
      const target = course.waitlist.filter((x) => x.course_id === element._id);
      if (target.length > 0) return { ...element, waitlist_id: target[0]._id };
      else return { ...element, waitlist_id: null };
    });
    const enrollCourseArray = course.mycourses.map((course) => course._id);
    const filterEnrolledCourse = newCourseList.filter(
      (course) => !enrollCourseArray.includes(course._id)
    );
    setCourseList(filterEnrolledCourse);
  }

  useEffect(() => {
    pairCourse();
  }, [fetchCourse]);

  function createWaitList(event) {
    event.preventDefault();
    axios
      .post(
        enrollURL(),
        {
          user_id: user._id,
          course_id: event.target.value,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then(() => fetchCourse());
    setWaitListWindow(true);
  }

  function removeWaitList(event) {
    event.preventDefault();
    axios.delete(userwaitListURL(event.target.value));
    fetchCourse();
  }

  return (
    <div className="all-course-section-container">
      <div className="back-link">
        <Link to="/">
          <NavigateBeforeIcon />
          Back
        </Link>
      </div>
      <div className="course-head">
        <h3>{user.is_admin ? "Join or create course" : "Join course"}</h3>
        {/* <input type="text" ref={seachCourseRef} placeholder="Search course" /> */}
      </div>
      <div className="course-container">
        {user.is_admin ? (
          <div className="course">
            <img src="https://via.placeholder.com/80" alt="" />
            <span>Create a course</span>
            <hr />
            <button
              className="create-course-button"
              onClick={() => setAddCourseWindow(true)}
            >
              Create course
            </button>
          </div>
        ) : null}
        {courseList.map((course) => (
          <div className="course" key={course._id}>
            <img src="https://via.placeholder.com/80" alt="" />
            <span>
              {course.course}
              {course.name}
            </span>
            <hr />
            {user._id === course.author_id ? (
              <Link className="author-button" to={`/course/${course.course}`}>
                Go to course
              </Link>
            ) : (
              <>
                {course.waitlist_id !== null ? (
                  <button value={course.waitlist_id} onClick={removeWaitList}>
                    Cancle
                  </button>
                ) : (
                  <button value={course._id} onClick={createWaitList}>
                    Join course
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllCourse;
