import React, { HTMLAttributes, InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import useKeyPress from "../hooks/useKeyPress";
import useOnClickOutside from "../hooks/useOnClickOutside";

type LabelInputProps = {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: HTMLAttributes<HTMLLabelElement>;
  inputProps: {
    type: InputHTMLAttributes<HTMLInputElement>["type"]
    name: InputHTMLAttributes<HTMLInputElement>["name"]
    value: InputHTMLAttributes<HTMLInputElement>["value"]
  } & InputHTMLAttributes<HTMLInputElement>;
  labelText: string;
  onSetValue: (value: InputHTMLAttributes<HTMLInputElement>["value"]) => void;
};

function LabelInput(props: LabelInputProps) {
  const [value, setValue] = useState(props.inputProps.value);
  const [isFocused, setIsFocused] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const enter = useKeyPress("Enter");
  const esc = useKeyPress("Escape");

  useOnClickOutside(wrapper, () => {
    if(isFocused) {
      props.onSetValue(value);
      setIsFocused(false);
    }
  });

  useEffect(() => {
    if(isFocused) {
      if(enter) {
        props.onSetValue(value);
        setIsFocused(false);
        input.current.blur();
      }
      if(esc) {
        setValue(props.inputProps.value);
        setIsFocused(false);
        input.current.blur();
      }
    }
  }, [enter, esc])

  return (
    <div {...props.wrapperProps} ref={wrapper}>
      <input
        placeholder=" "
        {...props.inputProps}
        ref={input}
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <label htmlFor={props.inputProps.name} {...props.labelProps}>{props.labelText}</label>
    </div>
  );
}

export default LabelInput;
