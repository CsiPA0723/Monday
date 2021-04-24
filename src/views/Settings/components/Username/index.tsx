import React, { useEffect, useState } from 'react';
import LabelInput from "../../../../components/LabelInput";

type UsernameProps = {
  userId: string;
};

function Username({ userId }: UsernameProps) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    function handleUsername(gotUsername: string) {
      if(gotUsername) setUsername(gotUsername);
    }

    window.api.send("getUsername", userId);
    const removeGetUsername = window.api.on("getUsername", handleUsername);
    const removeSetUsername = window.api.on("setUsername", handleUsername);
    return () => {
      if(removeGetUsername) removeGetUsername();
      if(removeSetUsername) removeSetUsername();
    };
  }, []);

  return (
    <div>
      <h3>Set Username</h3>
      <LabelInput
        wrapperProps={{
          className: "has-float-label"
        }}
        labelText="Username"
        inputProps={{
          name: "username",
          type: "username",
          value: username
        }}
        onSetValue={(value) => {
          setUsername(value);
          window.api.send("setUsername", userId, value, username);
        }}
      />
    </div>
  );
}

export default Username;
