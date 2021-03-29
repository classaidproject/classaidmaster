import React from "react";
import { Link } from "react-router-dom";

function CourseList({ courses, name }) {
  return (
    <>
      <h5>{name}</h5>
      <div className="course-container">
        {courses.map((course) => (
          <Link to={`/course/${course.course}`} key={course._id}>
            <div className="course">
              <img src="https://via.placeholder.com/80" alt="" />
              <span>{course.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default CourseList;
