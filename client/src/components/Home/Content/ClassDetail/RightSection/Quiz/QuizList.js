import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { removeQuizURL } from "../../../../../../api";
import toast from "react-hot-toast";

function QuizList({ setQuiz, quizlist, socket }) {
  const { selected } = useSelector((state) => state.selectCourse);
  const { token } = useSelector((state) => state.login);

  function quizHandle(event) {
    event.preventDefault();
    socket.emit("quiztime", event.target.value, selected.course);
    toast.success("Emit quiz");
  }

  function removeHandle(event) {
    event.preventDefault();
    axios
      .post(
        removeQuizURL(selected._id, event.target.value),
        {},
        {
          headers: {
            "auth-token": token,
          },
        }
      )
      .then(() => {
        setQuiz();
        toast.success("Remove quiz success");
      });
  }

  return (
    <>
      <div className="quiz-list">
        <h2>QuizList</h2>
        {quizlist && (
          <div className="row">
            {quizlist.map(function (element) {
              return (
                <div key={element._id} className="card">
                  <h3>Question : {element.question}</h3>
                  <h4>score : {element.score}</h4>
                  <div>
                    <button value={element._id} onClick={quizHandle}>
                      Start Quiz
                    </button>
                    <button value={element._id} onClick={removeHandle}>
                      DELETE
                    </button>
                  </div>
                  {/* <ul>
                    {element.choice.map(function (x, index) {
                      return <li key={index}>{x}</li>;
                    })}
                  </ul> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default QuizList;
