import React, { useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { createQuizURL } from "../../../../../../api";
import toster from "react-hot-toast";

function CreateQuiz({ setQuiz }) {
  const choice = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const ans = useRef(null);
  const score = useRef(null);
  const Question = useRef(null);
  const formRef = useRef(null);
  const { selected } = useSelector((state) => state.selectCourse);
  const { token } = useSelector((state) => state.login);
  function submitHandle(event) {
    event.preventDefault();
    const answer = choice[ans.current.value - 1].current.value;
    const quizObject = {
      question: Question.current.value,
      choice: [
        choice[0].current.value,
        choice[1].current.value,
        choice[2].current.value,
        choice[3].current.value,
      ],
      score: score.current.value,
      answer,
    };
    axios
      .post(createQuizURL(selected._id), quizObject, {
        headers: {
          "auth-token": token,
        },
      })
      .then((res) => {
        console.log(res);
        toster.success("Create quiz success");
        setQuiz();
        formRef.current.reset();
      });
  }
  return (
    <div className="create-quiz-container">
      <h3>Create Quiz</h3>
      <form onSubmit={submitHandle} ref={formRef}>
        <div>
          <label htmlFor="Questtion">Question</label>
          <input type="text" ref={Question} required />
        </div>
        <div>
          <label htmlFor="Choice">Choice 1</label>
          <input type="text" ref={choice[0]} required />
        </div>
        <div>
          <label htmlFor="Choice">Choice 2</label>
          <input type="text" ref={choice[1]} required />
        </div>
        <div>
          <label htmlFor="Choice">Choice 3</label>
          <input type="text" ref={choice[2]} required />
        </div>
        <div>
          <label htmlFor="Choice">Choice 4</label>
          <input type="text" ref={choice[3]} required />
        </div>
        <div>
          <div className="half">
            <label htmlFor="answer">What is true choie</label>
            <select ref={ans}>
              <option value="1">Choice 1</option>
              <option value="2">Choice 2</option>
              <option value="3">Choice 3</option>
              <option value="4">Choice 4</option>
            </select>
          </div>
          <div className="half">
            <label htmlFor="score">Score</label>
            <input type="text" ref={score} required />
          </div>
        </div>
        <button type="submit">Creat Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
