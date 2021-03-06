import React, { useEffect, useRef, useState } from "react";
import { StyledComponent } from "styled-components";
import { noteData } from "./Note";

type InlineEditProps = {
  component: StyledComponent<any, any, any, any>| string
  note: noteData;
  isInputActive: boolean;
  onSetNote: ({ data: text, type }: noteData) => void;
  onSetIsFocused: (value: boolean) => void;
};

export type inlineData = { text: string };

function InlineEdit(props: InlineEditProps) {
  const textRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inline, setInline] = useState<inlineData>({
    text: props.note.data.includes("text") ? (
      (JSON.parse(props.note.data) as inlineData).text
    ) : "Edit me!"
  });
  
  function updateStyle() {
    const textStyle = getComputedStyle(textRef.current);
    inputRef.current.style.font = textStyle.font;
    inputRef.current.style.margin = textStyle.margin;
    inputRef.current.style.padding = textStyle.padding;
  }
  
  useEffect(updateStyle, [textRef, inputRef, props.note]);
  
  useEffect(() => {
    props.onSetNote({ data: JSON.stringify(inline), type: props.note.type });
  }, [inline]);

  return (
    <>
      {React.createElement(
        props.component,
        {
          ref: textRef,
          className: "editable",
          hidden: props.isInputActive
        }, inline.text
      )}
      <input
        ref={inputRef}
        value={inline.text}
        onClick={() => props.onSetIsFocused(true)}
        onChange={e => setInline({ text: e.target.value })}
        hidden={!props.isInputActive}
        className={`editable ${props.isInputActive ? "inputIsActive" : ""}`}
      />
    </>
  );
}

export default InlineEdit;