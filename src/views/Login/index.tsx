import React from "react";
import "./login.css";

function Login() {
  window.login.tryRememberMe();

  return (
    <div id="login">
      <h1>Login</h1>
      <label>Username</label><br />
      <input type="username" id="username" placeholder="username" /><br />
      <label>Password</label><br />
      <input type="password" id="password" placeholder="password" /><br />
      <input type="checkbox" id="remember_me" /><label>Remember me</label><br />
      <p>(Only check if you are this computer sole user!)</p>
      <br />
      <button
        onClick={() => {
          const userame = (document.getElementById("username") as HTMLInputElement);
          const password = (document.getElementById("password") as HTMLInputElement);
          const rememberMe = (document.getElementById("remember_me") as HTMLInputElement);
          console.log(rememberMe.checked);
          window.login.authenticate(userame.value, password.value, rememberMe.checked);
        }}
      >
        Login
      </button>
    </div>
  )
}

export default Login;
