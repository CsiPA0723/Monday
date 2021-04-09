import React, { useEffect, useRef } from "react";
import { noteTypesEnum } from "./Note";

type InlineEditProps = {
  component: any;
  note: { text: string, type: noteTypesEnum };
  isInputActive: boolean;
  onSetNote: ({ text, type }: {text: string, type: noteTypesEnum}) => void;
  onSetIsFocused: (value: boolean) => void;
};

function InlineEdit(props: InlineEditProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  function updateStyle() {
    const textStyle = getComputedStyle(textRef.current);
    inputRef.current.style.font = textStyle.font;
    inputRef.current.style.margin = textStyle.margin;
    inputRef.current.style.padding = textStyle.padding;
  }
  
  useEffect(updateStyle, [textRef, inputRef, props.note]);
  
  useEffect(() => {
    updateStyle();
    props.onSetNote({ text: props.note.text, type: props.note.type });
  }, [props.note.text]);

  return (
    <>
      {React.createElement(
        props.component,
        {
          ref: textRef,
          className: "editable",
          hidden: props.isInputActive
        }, props.note.text
      )}
      <input
        ref={inputRef}
        value={props.note.text}
        onClick={() => props.onSetIsFocused(true)}
        onChange={e => props.onSetNote({...props.note, text: e.target.value})}
        hidden={!props.isInputActive}
        className={`editable ${props.isInputActive ? "inputIsActive" : ""}`}
      />
    </>
  );
}

export default InlineEdit;