import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  messageURL,
  unenrollURL,
  fileUploadURL,
  fetchFileURL,
} from "../../../../api";
import Chat from "./RightSection/Chat";
import WaitList from "./RightSection/WaitList";
import Quiz from "./RightSection/Quiz";
import QuizScreen from "./RightSection/Quiz/QuizScreen";
import Ranking from "./RightSection/Ranking";
import toast from "react-hot-toast";

function LeftSection({
  socket,
  courseSelect,
  chatWindow,
  userWindow,
  quizWindow,
  setAddMemberWindow,
  rankingWindow,
  initCourse,
}) {
  const login = useSelector((state) => state.login);
  const selectCourse = useSelector((state) => state.selectCourse);
  const [messages, setMessages] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const [fillterOnlineUser, setFillterOnlineUser] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [canTakeQuiz, setCanTakeQuiz] = useState(
    selectCourse.selected.author_id !== login.user._id
  );
  const [generalWindow, setGeneralWindow] = useState(true);
  const [materailWindow, setMaterailWindow] = useState(false);
  const [file, setFile] = useState([]);

  function closeSubwindow() {
    setGeneralWindow(false);
    setMaterailWindow(false);
  }

  const fetchMaterail = useCallback(() => {
    if (materailWindow)
      axios
        .get(fetchFileURL(selectCourse.selected._id))
        .then((res) => setFile(res.data))
        .catch((err) => console.log(err));
    // console.log("FETMATERAIL");
  }, [materailWindow, selectCourse.selected]);

  useEffect(() => {
    fetchMaterail();
  }, [fetchMaterail]);

  const getMessage = useCallback(() => {
    if (typeof selectCourse.selected._id !== "undefined")
      axios
        .get(messageURL(selectCourse.selected._id))
        .then((res) => {
          setMessages(res.data);
          // toast.success("Load message success");
          // console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response);
          toast.error("Something went wrong");
        });
  }, [selectCourse.selected._id]);

  useEffect(() => {
    getMessage();
  }, [getMessage]);

  useEffect(() => {
    if (courseSelect !== "" && courseSelect !== "login") {
      socket.open();
      setMessages([]);
      socket.emit(
        "join",
        {
          _id: login.user._id,
          name: login.user.name,
          email: login.user.email,
          online: true,
        },
        courseSelect
      );
      socket.on("currentOnlineUser", ({ users }) => {
        setOnlineUser(users);
        fillterUser();
      });
    }
    if (courseSelect === "") {
      socket.close();
    }
  }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [
        ...messages,
        { user: message.user.name, text: message.text },
      ]);
    });

    socket.on("currentOnlineUser", ({ users }) => {
      setOnlineUser(users);
      fillterUser();
    });

    socket.on("quizboi", ({ quiz }) => {
      if (canTakeQuiz) {
        setQuiz(quiz);
      }
      //When time out quiz disapper
      setTimeout(function () {
        setQuiz(null);
      }, 6000);
    });
  }, []);

  function fillterUser() {
    const online = onlineUser.map((user) => user._id);
    const filterOnlinerUser = selectCourse.users.filter(
      (user) => !online.includes(user._id)
    );
    setFillterOnlineUser(filterOnlinerUser);
  }

  return (
    <div className="right-section">
      {quiz && <QuizScreen data={quiz} setQuiz={setQuiz} />}
      <div className="rigth-section-head">
        {chatWindow ? (
          <>
            <h2>General</h2>
            <ul>
              <li
                className={generalWindow ? "selected" : null}
                onClick={() => {
                  closeSubwindow();
                  setGeneralWindow(true);
                }}
              >
                Chat
              </li>
              <li
                className={materailWindow ? "selected" : null}
                onClick={() => {
                  closeSubwindow();
                  setMaterailWindow(true);
                }}
              >
                Material
              </li>
            </ul>
          </>
        ) : null}
        {userWindow ? (
          <>
            <div className="container-two-side">
              <div>
                <h2>{selectCourse.selected.course}</h2>
                <span>{selectCourse.selected.name}</span>
              </div>
              <button
                onClick={() => {
                  setAddMemberWindow(true);
                }}
              >
                Add Member
              </button>
            </div>
          </>
        ) : null}
        {rankingWindow ? <h2>Ranking</h2> : null}
        {quizWindow ? (
          <>
            <h2>Quiz</h2>
          </>
        ) : null}
      </div>
      <div className="right-section-container">
        {chatWindow ? (
          <>
            {generalWindow ? (
              <Chat
                getMessage={getMessage}
                socket={socket}
                messages={messages}
              />
            ) : null}
            {materailWindow ? (
              <div className="file-upload-container">
                <FileUpload
                  fetchMaterail={fetchMaterail}
                  user_id={login.user._id}
                  course_id={selectCourse.selected._id}
                />
                <FileContent file={file} />
              </div>
            ) : null}
          </>
        ) : null}
        {rankingWindow ? <Ranking id={selectCourse.selected._id} /> : null}
        {userWindow ? (
          <UserWindow
            selectCourse={selectCourse}
            login={login}
            onlineUser={onlineUser}
            fillterOnlineUser={fillterOnlineUser}
            initCourse={initCourse}
          />
        ) : null}
        {quizWindow ? <Quiz socket={socket} /> : null}
      </div>
    </div>
  );
}

function FileUpload({ fetchMaterail, user_id, course_id }) {
  const [uploadfile, setUploadfile] = useState();
  const descriptionRef = useRef(null);
  const formRef = useRef(null);
  function submitHandle(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadfile.file[0]);
    formData.append("description", descriptionRef.current.value);
    axios
      .post(fileUploadURL(course_id, user_id), formData)
      .then((response) => {
        console.log(response);
        fetchMaterail();
        formRef.current.reset();
        toast.success("File uploaded");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  }

  function fileChange(e) {
    setUploadfile({ file: e.target.files });
  }
  return (
    <form onSubmit={submitHandle} ref={formRef} className="file-upload-head">
      <h4>File Upload</h4>
      <div>
        <input
          type="file"
          onChange={fileChange}
          required
          className="file-upload-input"
        />
        <input
          type="text"
          ref={descriptionRef}
          placeholder="File name (Optional)"
          className="file-name-input"
        />
      </div>
      <button className="upload-button" type="submit">
        Upload
      </button>
    </form>
  );
}

function FileContent({ file }) {
  //file strcture
  //clound_path,_id,public_id,description,course_id,user_id,modify_date map:name
  return (
    <div className="file-upload-content">
      <div className="row">
        <div>Name</div>
        <div>Modified</div>
        <div>Modified By</div>
        <div></div>
      </div>
      {file.length > 0 ? (
        file.map((doc, idx) => (
          <div className="row">
            <div key={file._id}>
              <a href={doc.clound_path}>
                {doc.description.length > 0
                  ? `${doc.description}`
                  : `FILE: ${idx}`}
              </a>
            </div>
            <div>{convertDate(doc.modify_date)}</div>
            <div>{doc.name}</div>
            <div>delete</div>
          </div>
        ))
      ) : (
        <div className="row">
          <h4>No file in course</h4>
        </div>
      )}
    </div>
  );
}

function convertDate(timestamp) {
  const reduceDate = timestamp.split("T")[0];
  const date = reduceDate.split("-")[2];
  const month = parseInt(reduceDate.split("-")[1]) - 1;
  const year = reduceDate.split("-")[0];
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[month]} ${date}, ${year}`;
}

function UserWindow({
  selectCourse,
  login,
  onlineUser,
  fillterOnlineUser,
  initCourse,
}) {
  function unrollHandle(event) {
    event.preventDefault();
    axios
      .post(
        unenrollURL(),
        {
          course_id: selectCourse.selected._id,
          user_id: event.target.value,
        },
        {
          headers: {
            "auth-token": login.token,
          },
        }
      )
      .then(function () {
        console.log("UNROLLED");
        initCourse();
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  return (
    <>
      <div className="user-container">
        <h3>Owners</h3>
        <ul className="row head">
          <li>Name</li>
          <li>Email</li>
          <li>Role</li>
          <li></li>
        </ul>
        <ul className="row">
          <li>{selectCourse.courseAuthor.name}</li>
          <li>{selectCourse.courseAuthor.email}</li>
          <li>Owner</li>
          <li></li>
        </ul>
        {login.user._id === selectCourse.selected.author_id ? (
          <WaitList />
        ) : null}
        <div>
          <h3>Member</h3>
          <ul className="row head">
            <li>Name</li>
            <li>Email</li>
            <li>Status</li>
            <li></li>
          </ul>
          {onlineUser.map(function (user) {
            return (
              <ul key={user._id} className="row">
                <li>{user.name}</li>
                <li>{user.email}</li>
                <li>{user.online ? "ONLINE" : "OFFLINE"}</li>
                <li>
                  {(selectCourse.selected.author_id === login.user._id ||
                    login.user._id === user._id) &&
                  user._id !== selectCourse.selected.author_id ? (
                    <button onClick={unrollHandle} value={user._id}>
                      UNROLL
                    </button>
                  ) : null}
                </li>
              </ul>
            );
          })}
          {fillterOnlineUser.map(function (user) {
            return (
              <ul key={user._id} className="row">
                <li>{user.name}</li>
                <li>{user.email}</li>
                <li>{user.online ? "ONLINE" : "OFFLINE"}</li>
                <li>
                  {(selectCourse.selected.author_id === login.user._id ||
                    login.user._id === user._id) &&
                  user._id !== selectCourse.selected.author_id ? (
                    <button onClick={unrollHandle} value={user._id}>
                      UNROLL
                    </button>
                  ) : null}
                </li>
              </ul>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default LeftSection;
