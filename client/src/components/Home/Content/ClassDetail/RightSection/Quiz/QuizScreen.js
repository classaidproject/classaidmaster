import React from "react";
import { recordScoreURL } from "../../../../../../api";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function QuizScreen({ data, setQuiz }) {
  const { user } = useSelector((state) => state.login);

  function eventHandle(event) {
    setQuiz(null);
    toast.error("False try again next quiz!");
  }

  function scoreHandle(event) {
    setQuiz(null);
    axios
      .patch(recordScoreURL(user._id, data._id))
      .then((res) =>
        toast("Good Job!", {
          icon: "👏",
        })
      )
      .catch((err) => console.log(err));
  }

  return (
    <div className="float-window">
      <div className="float-window-container">
        <div className="quiz-box">
          <div>
            <h3>Question</h3>
            <h4>{data.question}</h4>
          </div>
          <ul>
            {data.choice.map((ele, index) => {
              if (ele === data.answer)
                return (
                  <li key={index}>
                    <button onClick={scoreHandle}>{ele}</button>
                  </li>
                );
              else
                return (
                  <li key={index}>
                    <button onClick={eventHandle}>{ele}</button>
                  </li>
                );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default QuizScreen;
