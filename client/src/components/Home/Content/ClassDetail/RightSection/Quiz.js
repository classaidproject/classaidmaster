import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CreateQuiz from "./Quiz/CreateQuiz";
import QuizList from "./Quiz/QuizList";
import { getQuizURL } from "../../../../../api";

function Quiz({ socket }) {
  const { selected } = useSelector((state) => state.selectCourse);
  const { token } = useSelector((state) => state.login);
  const [quizlist, setQuizList] = useState([]);

  const setQuiz = useCallback(() => {
    if (typeof selected._id !== "undefined") {
    }
    axios
      .get(getQuizURL(selected._id), {
        headers: {
          "auth-token": token,
        },
      })
      .then((res) => {
        setQuizList(res.data);
      });
  }, [selected._id, token]);

  useEffect(() => {
    setQuiz();
  }, [setQuiz]);
  return (
    <div className="quiz-container">
      <CreateQuiz setQuiz={setQuiz} />
      <QuizList setQuiz={setQuiz} quizlist={quizlist} socket={socket} />
    </div>
  );
}

export default Quiz;
