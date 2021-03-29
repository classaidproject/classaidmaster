import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  unloadCourse,
  loadSelectedCourse,
} from "../../../reducers/actions/selectedCourseAction";
import Addmember from "../AddMember";

import LeftSection from "./ClassDetail/LeftSection";
import RightSection from "./ClassDetail/RightSection";

function ClassDetail({ socket, fetchCourse }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);
  const selectCourse = useSelector((state) => state.selectCourse);

  const [courseSelect] = useState(location.pathname.split("/")[2]);
  const [courseAuthor, setCourseAuthor] = useState(false);

  const [addMemberWindow, setAddMemberWindow] = useState(false);
  const [chatWindow, setChatWindow] = useState(true);
  const [rankingWindow, setRankingWindow] = useState(false);
  const [userWindow, setUserWindow] = useState(false);
  const [quizWindow, setQuizWindow] = useState(false);

  function initCourse() {
    dispatch(unloadCourse());
    dispatch(loadSelectedCourse(courseSelect, user._id));
  }

  useEffect(() => {
    initCourse();
  }, []);

  useEffect(() => {
    setCourseAuthor(selectCourse.selected.author_id === user._id);
  }, [user, selectCourse]);

  function closeWindow() {
    setAddMemberWindow(false);
  }

  function resetWindow() {
    setChatWindow(false);
    setUserWindow(false);
    setQuizWindow(false);
    setRankingWindow(false);
  }

  return (
    <>
      {addMemberWindow ? (
        <Addmember
          token={token}
          selected={selectCourse.selected}
          closeWindow={closeWindow}
          initCourse={initCourse}
        />
      ) : null}
      <div className="class-detail-container">
        <LeftSection
          selectCourse={selectCourse}
          courseAuthor={courseAuthor}
          token={token}
          fetchCourse={fetchCourse}
          setChatWindow={setChatWindow}
          setAddMemberWindow={setAddMemberWindow}
          resetWindow={resetWindow}
          setUserWindow={setUserWindow}
          setQuizWindow={setQuizWindow}
          setRankingWindow={setRankingWindow}
        />
        <div className="right-section">
          {selectCourse.isLoading ? (
            "LOADING"
          ) : (
            <>
              {/* {user._id === selectCourse.selected.author_id ? (
                <AdminCourse socket={socket} />
              ) : null} */}
              <RightSection
                socket={socket}
                courseSelect={courseSelect}
                initCourse={initCourse}
                chatWindow={chatWindow}
                userWindow={userWindow}
                quizWindow={quizWindow}
                rankingWindow={rankingWindow}
                setAddMemberWindow={setAddMemberWindow}
              />
              {/* {!selectCourse.enrolled ? (
                <button onClick={enrollHandle}>
                  Join wait list for this class
                </button>
              ) : (
                <>
                  {quiz !== null ? (
                    <QuizScreen data={quiz} setQuiz={setQuiz} />
                  ) : null}
                  <Messenger
                    messages={messages}
                    socket={socket}
                    courseId={selectCourse.selected._id}
                    token={token}
                  />
                  <MessageHistory courseId={selectCourse.selected._id} />
                  <OnlineList name="online users" list={onlineUser} />
                  <UserList
                    name="user in course"
                    author={selectCourse.selected.author_id}
                    user={user}
                    enroll={true}
                    list={selectCourse.users}
                  />
                  <UserList
                    name="user not in course"
                    author={selectCourse.selected.author_id}
                    user={user}
                    enroll={false}
                    list={selectCourse.enrollList}
                  />
                </>
              )} */}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ClassDetail;
