import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "../reducers/actions/loginAction";
import { Link } from "react-router-dom";

function UserLogin() {
  const dispatch = useDispatch();
  const [buttonClicked, setButtonClicked] = useState(false);
  const { login_error } = useSelector((state) => state.login);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function LoginHandle(event) {
    event.preventDefault();
    setButtonClicked(true);
    dispatch(Login(emailRef.current.value, passwordRef.current.value));
    setButtonClicked(false);
  }

  return (
    <div className="login-container">
      <h1>Sign in to ClassAid</h1>
      {login_error && <div className="form-error">{login_error}</div>}
      <form onSubmit={LoginHandle} className="login-form">
        <div>
          <span>Email address</span>
          <input type="text" ref={emailRef} required />
        </div>
        <div>
          <span>Password</span>
          <input type="password" ref={passwordRef} required />
        </div>
        <div>
          <button type="submit" className={buttonClicked ? "clicked" : null}>
            Sign In
          </button>
        </div>
      </form>
      <div className="signup-container">
        <span>New to ClassAid?</span>
        <Link to="/signup">Create an account.</Link>
      </div>
    </div>
  );
}

export default UserLogin;
