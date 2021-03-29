import React, { useEffect, useState, useRef } from "react";
import { Route, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BookIcon from "@material-ui/icons/Book";

import CourseList from "../components/Home/CourseList";
import AllCourse from "../components/Home/AllCourse";
import ClassDetail from "../components/Home/Content/ClassDetail";
import AddCourse from "../components/Home/AddCourse";
import JoinWaitList from "../components/Home/JoinWaitList";
import CourseNotFound from "../components/Home/Content/CourseNotFound";
import UserControl from "../components/UserControl";

import { loadCourse } from "../reducers/actions/courseAction";
import { Logout, RefreshLogin } from "../reducers/actions/loginAction";

import axios from "axios";
import toast from "react-hot-toast";

import { updateProfileURL } from "../api";

function Home({ socket, setLogin }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.login);
  const course = useSelector((state) => state.course);
  const [authorCourse, setAuthorCourse] = useState([]);
  const [isNoCourse, setIsNoCourse] = useState(true);

  const [loading, setLoading] = useState(true);

  const [addCourseWindow, setAddCourseWindow] = useState(false);
  const [waitListWindow, setWaitListWindow] = useState(false);
  const [changeProfilePictureWindow, setChangeProfilePictureWindow] = useState(
    false
  );

  const closeWindow = () => {
    setAddCourseWindow(false);
    setWaitListWindow(false);
    setChangeProfilePictureWindow(false);
  };

  function fetchCourse() {
    if (typeof user !== "undefined")
      dispatch(
        loadCourse(user._id, () => {
          initPage();
        })
      );
  }

  function initPage() {
    setLoading(false);
    if (user.is_admin) {
      const courseFilter = course.courses.filter(
        (course) => course.author_id === user._id
      );
      setAuthorCourse(courseFilter);
    }
  }

  useEffect(() => {
    fetchCourse();
  }, [location, user, loading, setLogin]);

  useEffect(() => {
    if (authorCourse.length === 0 && course.mycourses.length === 0)
      setIsNoCourse(true);
    else setIsNoCourse(false);
  }, [authorCourse, course]);

  function LogoutHandle() {
    dispatch(Logout());
  }

  return (
    <div className="home">
      {addCourseWindow ? (
        <AddCourse fetchCourse={fetchCourse} closeWindow={closeWindow} />
      ) : null}
      {waitListWindow ? <JoinWaitList closeWindow={closeWindow} /> : null}
      {changeProfilePictureWindow ? (
        <ProfilePictureWindow closeWindow={closeWindow} user={user} />
      ) : null}
      <nav className="nav">
        <div>
          <Link to="/" id="logo">
            ClassAid
          </Link>
        </div>
        <UserControl
          LogoutHandle={LogoutHandle}
          user={user}
          setChangeProfilePictureWindow={setChangeProfilePictureWindow}
        />
      </nav>
      <div className="bottom">
        <SideNav />
        <div className="content">
          <Route path="/joinCourse" exact>
            <AllCourse
              course={course}
              setAddCourseWindow={setAddCourseWindow}
              setWaitListWindow={setWaitListWindow}
              fetchCourse={fetchCourse}
              user={user}
              token={token}
            />
          </Route>
          <Route path="/" exact>
            <div className="course-section-container">
              <div className="course-head">
                <h3>Course</h3>
                <Link to="/joinCourse">
                  {user.is_admin ? "Join or create course" : "Join course"}
                </Link>
              </div>
              {isNoCourse ? (
                <CourseNotFound />
              ) : (
                <>
                  {user.is_admin ? (
                    <CourseList
                      name="Author course"
                      courses={authorCourse}
                      user={user}
                    />
                  ) : null}
                  <CourseList
                    name="Your course"
                    courses={course.mycourses}
                    user={user}
                  />
                </>
              )}
            </div>
          </Route>
          <Route path={"/course/:id"} exact>
            <ClassDetail socket={socket} fetchCourse={fetchCourse} />
          </Route>
        </div>
      </div>
    </div>
  );
}

function SideNav() {
  return (
    <div className="side-nav">
      <div>
        <BookIcon />
        <span>Course</span>
      </div>
    </div>
  );
}

function ProfilePictureWindow({ closeWindow, user }) {
  const [uploadfile, setUploadfile] = useState([]);
  const dispatch = useDispatch();
  const nameRef = useRef(null);
  function submitHandle(e) {
    e.preventDefault();
    const formData = new FormData();
    if (uploadfile.length > 0) formData.append("file", uploadfile[0]);
    if (nameRef.current.value.length > 0)
      formData.append("name", nameRef.current.value);
    axios
      // .post("https://httpbin.org/anything", formData)
      .patch(updateProfileURL(user._id), formData)
      .then((response) => {
        toast.success("Profile updated");
        dispatch(RefreshLogin());
        closeWindow();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  }

  function fileChange(e) {
    setUploadfile(e.target.files);
    // console.log(e.target.files);
  }

  return (
    <div className="float-window">
      <form className="float-window-container" onSubmit={submitHandle}>
        <div>
          <h2>User profile</h2>
          <div className="hidden-input">
            {uploadfile.length > 0 ? (
              <h5>{uploadfile[0].name}</h5>
            ) : (
              <span>Select picture to upload</span>
            )}
            <input type="file" onChange={fileChange} />
          </div>
          <input
            type="text"
            placeholder={user.name}
            ref={nameRef}
            className="file-name-input"
          />
        </div>
        <div className="button-container two-button">
          <button type="submit" className="secondary-btn">
            Update profile
          </button>
          <button onClick={closeWindow}>Close</button>
        </div>
      </form>
    </div>
  );
}

export default Home;
