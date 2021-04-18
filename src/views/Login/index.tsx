import React, { useEffect, useState } from "react";
import "../../assets/scss/login.scss";

function Login() {
  const [details, setDetails] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [loginOrRegist, setLoginOrRegist] = useState<"login" | "regist">("login");

  useEffect(() => {
    function initLogin() {
      setLoginOrRegist("login");
    }

    const removeRegisterUser = window.api.on("registerUser", initLogin);
    return () => {
      if(removeRegisterUser) removeRegisterUser();
    };
  }, []);

  if (loginOrRegist === "login") {
    return (
      <div className="login">
        <form onSubmit={(e) => {
          e.preventDefault();
          const { username, password, rememberMe } = details;
          window.api.send("authenticate", username, password, rememberMe ? 1 : 0);
        }}>
          <h1>Login</h1>
          <div>
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              required
              onChange={(e) => setDetails({ ...details, username: e.target.value })}
            />
            <label htmlFor="username">Username</label>
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              required
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
            />
            <label htmlFor="password">Password</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="remember_me"
              name="remember_me"
              onChange={(e) => setDetails({ ...details, rememberMe: e.target.checked })}
            />
            <label htmlFor="remember_me">Remember me</label>
            <p>(Only check if you are this computer sole user!)</p>
          </div>

          <input type="submit" value="Login" />
          <a onClick={() => {
            setLoginOrRegist("regist");
          }}>
            To Register {">"}
          </a>
        </form>
      </div>
    );
  } else if (loginOrRegist === "regist") {
    return (
      <div className="login">
        <form onSubmit={(e) => {
          e.preventDefault();
          const { username, password } = details;
          window.api.send("registerUser", username, password);
        }}>
          <h1>Register</h1>
          <div>
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              required
              onChange={(e) => setDetails({ ...details, username: e.target.value })}
            />
            <label htmlFor="username">Username</label>
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              required
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
            />
            <label htmlFor="password">Password</label>
            <div className="requirements">
              Your password must be at least 6 characters as well as contain at
              least one uppercase, one lowercase, and one number.
            </div>
          </div>
          <input type="submit" value="Register" />
          <a onClick={() => {
            setLoginOrRegist("login");
          }}>
            {"<"} Back to Login
          </a>
        </form>
      </div>
    );
  }
}

export default Login;
