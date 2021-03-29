import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RefreshLogin } from "./reducers/actions/loginAction";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import "./styles/App.scss";

import UserLogin from "./Auth/UserLogin";
import UserSignup from "./Auth/UserSignup";

import io from "socket.io-client";
// const ENDPOINT = "localhost:5000";
const ENDPOINT = "https://chat-class-aid.herokuapp.com";
const connectionOptions = {
  autoConnect: false,
  transports: ["websocket"],
};
const socket = io(ENDPOINT, connectionOptions);

function App() {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.login);
  const [login, setLogin] = useState(isLogin || false);

  useEffect(() => {
    setLogin(isLogin);
  }, [isLogin]);

  useEffect(() => {
    if (
      localStorage.getItem("token") !== null &&
      localStorage.getItem("user") !== null
    ) {
      dispatch(RefreshLogin());
      setLogin(true);
    } else setLogin(false);
  }, [dispatch]);

  return (
    <div className="App">
      <Toaster />
      {!login ? <Redirect to="/login" /> : <Redirect to="/" />}
      <Route path="/login" exact>
        <UserLogin />
      </Route>
      <Route path="/signup" exact>
        <UserSignup />
      </Route>
      <Route path={["/", "/course/:id", "/addCourse", "/joinCourse"]} exact>
        <Home socket={socket} login={login} setLogin={setLogin} />
      </Route>
      <Route path="*">
        {!login ? <Redirect to="/login" /> : <Redirect to="/" />}
      </Route>
    </div>
  );
}

export default App;
