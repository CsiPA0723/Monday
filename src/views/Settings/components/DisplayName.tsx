import React from 'react';
import LabelInput from "../../../components/LabelInput";

type DisplayNameProps = {
  name: string;
  onSet: (name: string) => void;
}

function DisplayName(props: DisplayNameProps) {
  return (
    <div>
      <h3>Set Display Name</h3>
      <LabelInput
        wrapperProps={{
          className: "has-float-label"
        }}
        inputProps={{
          name: "name",
          type: "text",
          value: props.name
        }}
        labelText="Display Name"
        onSetValue={(value) => props.onSet(value.toString())}
      />
    </div>
  );
}

export default DisplayName;
