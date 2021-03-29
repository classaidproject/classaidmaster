import React, { useRef, useCallback, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import { messageURL } from "../../../../../api";
import { useSelector } from "react-redux";
import ReactEmoji from "react-emoji";
import Send from "@material-ui/icons/Send";
import Arrow from "@material-ui/icons/ArrowUpward";

function Chat({ getMessage, messages, socket }) {
  const msgRef = useRef(null);
  const { token, user } = useSelector((state) => state.login);
  const selectCourse = useSelector((state) => state.selectCourse);

  function keyHandle(event) {
    if (event.code === "Enter") sendMessage();
  }

  function sendMessage() {
    if (msgRef.current.value !== "") {
      socket.emit("sendMsg", msgRef.current.value);
      axios
        .post(
          messageURL(selectCourse.selected._id),
          {
            message: msgRef.current.value,
          },
          {
            headers: {
              "auth-token": token,
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
        })
        .catch((err) => console.log(err.response));
      msgRef.current.value = "";
    }
  }
  return (
    <div className="Chatx">
      {/* <div
        onClick={() => {
          getMessage();
        }}
        className="button-fetch"
      >
        <Arrow /> LoadMessage
      </div> */}
      <ScrollToBottom className="scroll">
        {messages.map((message) => (
          <MESSASGE message={message} name={user.name} />
        ))}
      </ScrollToBottom>
      <div className="chat-input">
        <input
          type="text"
          ref={msgRef}
          onKeyDown={keyHandle}
          placeholder="Start a new converstaion."
        />
        <div className="send-button" onClick={sendMessage}>
          <Send />
        </div>
      </div>
    </div>
  );
}

function MESSASGE({ message, name }) {
  let isSentByCurrentUser = false;
  if (message.user === name) isSentByCurrentUser = true;
  return (
    <>
      {isSentByCurrentUser ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{message.user}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">
              {ReactEmoji.emojify(message.text)}
            </p>
          </div>
        </div>
      ) : (
        <div className="messageContainer justifyStart">
          <div className="messageBox backgroundLight">
            <p className="messageText colorDark">
              {ReactEmoji.emojify(message.text)}
            </p>
          </div>
          <p className="sentText pl-10 ">{message.user}</p>
        </div>
      )}
    </>
  );
}

export default Chat;
