import React, { HTMLAttributes, InputHTMLAttributes, ReactElement, useEffect, useRef, useState } from 'react';
import useKeyPress from "../hooks/useKeyPress";
import useOnClickOutside from "../hooks/useOnClickOutside";

type LabelInputProps<T extends InputHTMLAttributes<HTMLInputElement>["value"]> = {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  wrapperPlusChildren?: ReactElement[]
  labelProps?: HTMLAttributes<HTMLLabelElement>;
  inputProps: {
    type: InputHTMLAttributes<HTMLInputElement>["type"]
    name: InputHTMLAttributes<HTMLInputElement>["name"]
    value: T;
  } & Omit<InputHTMLAttributes<HTMLInputElement>, "value">;
  labelText: string;
  onSetValue: (value: T) => void;
};

function LabelInput<T extends InputHTMLAttributes<HTMLInputElement>["value"]>(props: LabelInputProps<T>) {
  const [value, setValue] = useState<T>(null);
  const [isFocused, setIsFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const enter = useKeyPress("Enter");
  const esc = useKeyPress("Escape");

  useEffect(() => {
    setValue(props.inputProps.value);
  }, [props.inputProps.value])

  useOnClickOutside(input, () => {
    if(isFocused) {
      props.onSetValue(value);
      input.current.blur();
    }
  });

  useEffect(() => {
    if(isFocused) {
      if(enter) {
        props.onSetValue(value);
        input.current.blur();
      }
      if(esc) {
        setValue(props.inputProps.value);
        input.current.blur();
      }
    }
  }, [enter, esc])

  return (
    <div {...props.wrapperProps}>
      <input
        placeholder=" "
        {...props.inputProps}
        ref={input}
        value={value ? value : ""}
        onChange={e => {
          if(typeof e.target.value === typeof props.inputProps.value) {
            setValue((e.target.value as T));
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <label htmlFor={props.inputProps.name} {...props.labelProps}>{props.labelText}</label>
      {...props.wrapperPlusChildren}
    </div>
  );
}

export default LabelInput;
