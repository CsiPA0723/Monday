import React, { useEffect, useRef, useState } from 'react';
import LabelInput from "../../../../components/LabelInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type PasswordProps = {
  userId: string;
}

function Password({ userId }: PasswordProps) {
  const initalState = { text: "", shown: false };

  const errorDiv = useRef<HTMLDivElement>(null);

  const [oldPassword, setOldPassword] = useState(initalState);
  const [password, setPassword] = useState(initalState);
  const [confirmPassword, setConfirmPassword] = useState(initalState);

  const [error, setError] = useState(initalState);

  useEffect(() => {
    function handleSetPassword() {
      setOldPassword(initalState);
      setPassword(initalState);
      setConfirmPassword(initalState);
      setError(initalState);
    }

    const removeSetPassword = window.api.on("setPassword", handleSetPassword);
    return () => {
      if (removeSetPassword) removeSetPassword();
    };
  }, []);

  return (
    <div className="pass-wrapper">
      <h3>Set Password</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (password.text === confirmPassword.text) {
            setError(initalState);
            window.api.send("setPassword", userId, oldPassword.text, password.text);
          } else {
            setError({
              text: `Error: Passwords not matching!`,
              shown: true
            });
          }
        }}
      >
        <LabelInput
          wrapperProps={{
            className: "has-float-label",
          }}
          wrapperPlusChildren={[
            <i key={0}>
              <FontAwesomeIcon
                icon={oldPassword.shown ? faEyeSlash : faEye}
                onClick={() => setOldPassword({ ...oldPassword, shown: !oldPassword.shown })}
              />
            </i>
          ]}
          labelText="Old Password"
          inputProps={{
            name: "oldPassword",
            type: oldPassword.shown ? "text" : "password",
            value: oldPassword.text,
            required: true
          }}
          onSetValue={(value) => {
            setOldPassword({ ...oldPassword, text: value });
          }}
        />
        <LabelInput
          wrapperProps={{
            className: "has-float-label"
          }}
          wrapperPlusChildren={[
            (<i key={0}>
              <FontAwesomeIcon
                icon={password.shown ? faEyeSlash : faEye}
                onClick={() => setPassword({ ...password, shown: !password.shown })}
              />
            </i>),
            (<div  key={1} className="requirements">
              Your password must be at least 6 characters as well as contain at
              least one uppercase, one lowercase, and one number.
            </div>)
          ]}
          labelText="Password"
          inputProps={{
            name: "password",
            type: password.shown ? "text" : "password",
            value: password.text,
            required: true,
            pattern: "(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
          }}
          onSetValue={(value) => {
            setPassword({ ...password, text: value });
          }}
        />
        <LabelInput
          wrapperProps={{
            className: "has-float-label"
          }}
          wrapperPlusChildren={[
            <i key={0}>
              <FontAwesomeIcon
                icon={confirmPassword.shown ? faEyeSlash : faEye}
                onClick={() => setConfirmPassword({ ...confirmPassword, shown: !confirmPassword.shown })}
              />
            </i>
          ]}
          labelText="Confirm"
          inputProps={{
            name: "confirmPassword",
            type: confirmPassword.shown ? "text" : "password",
            value: confirmPassword.text,
            required: true
          }}
          onSetValue={(value) => {
            setConfirmPassword({ ...confirmPassword, text: value });
          }}
        />
        <button type="submit">Submit</button>
        <div className="error" ref={errorDiv}>
          {error.text}
        </div>
      </form>
    </div>
  );
}

export default Password;
