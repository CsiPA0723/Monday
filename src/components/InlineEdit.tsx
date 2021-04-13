import React, { useEffect, useRef, useState } from "react";
import { noteData } from "./Note";

type InlineEditProps = {
  component: any;
  note: noteData;
  isInputActive: boolean;
  onSetNote: ({ data: text, type }: noteData) => void;
  onSetIsFocused: (value: boolean) => void;
};

type inlineData = { text: string };

function InlineEdit(props: InlineEditProps) {
  const textRef = useRef<HTMLDivElement>(null);
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