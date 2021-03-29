import React, { useRef } from "react";
import { Link, Redirect } from "react-router-dom";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { Register } from "../reducers/actions/loginAction";

import toster from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const { register_error } = useSelector((state) => state.login);

  const refEmail = useRef();
  const refPassword = useRef();
  const refName = useRef();
  const refAdmin = useRef();

  const adminCheck = () => {
    return Boolean(refAdmin.current.value === "true");
  };

  function signupHandle(e) {
    e.preventDefault();
    const registerObject = {
      name: refName.current.value,
      email: refEmail.current.value,
      password: refPassword.current.value,
      is_admin: adminCheck(),
    };
    dispatch(
      Register(registerObject, () => toster.success("Register Success"))
    );
  }

  return (
    <div className="register-container">
      {register_error === "SUCCESS" ? <Redirect to="/login" /> : null}
      <h4 id="classaid">Join ClassAid</h4>
      <h1>Create your account</h1>
      {register_error && <div className="error">{register_error}</div>}
      <form className="form" onSubmit={signupHandle}>
        <div>
          <span>Name</span>
          <input ref={refName} type="text" required />
        </div>
        <div>
          <span>Email</span>
          <input ref={refEmail} type="text" required />
        </div>
        <div>
          <span>Password</span>
          <input ref={refPassword} type="password" required />
        </div>
        <div>
          <span>Role</span>
          <select ref={refAdmin}>
            <option value={false}>Student</option>
            <option value={true}>Teacher</option>
          </select>
        </div>
        <div className="login-button-group">
          <button type="submit">Create account</button>
        </div>
      </form>
      <div className="login-page">
        <span>Already member? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
