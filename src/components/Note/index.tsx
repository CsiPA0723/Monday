import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import useKeyPress from "../../hooks/useKeyPress";
import useOnClickOutside from "../../hooks/useOnClickOutside";

export type NoteProps = {
  noteId: string;
  index: number;
  noteType: noteTypesEnum
  text: string;
  onSetText: (inputValue: string) => void;
};

const Container = styled.div<{ isDragging: boolean; noteType: keyof typeof noteTypes; }>`
  display: flex;
  background-color: #363544;
  align-items: center;
  outline: ${props => (props.isDragging ? "2px dotted #534caf" : "none")};
  outline-offset: 4px;
  transition: outline 0.5s ease;
  ${props => (props.noteType === "head" ? (`border-bottom: 1px solid #72767d; margin-bottom: 10px;`) : "")}
`;

export enum noteTypesEnum {
  NOTE = "note",
  HEAD = "head",
  FOOD = "food",
  SPORT = "sport",
  TASK = "task"
}

const noteTypes = {
  "note": styled.div`
    padding: 2px 10px;
    margin-left: 10px;
  `,
  "head": styled.h1`
    padding: 2px 10px;
    margin: 5px 0px 5px 5px;
  `,
  "food": styled.div``,
  "sport": styled.div``,
  "task": styled.div``
} as const;

// TODO: on enter if still hovering, only turn off focus

function Note(props: NoteProps) {
  const [isInputActive, setIsInputActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(props.text);

  const enter = useKeyPress("Enter");
  const esc = useKeyPress("Escape");
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function updateStyle() {
    const textStyle = getComputedStyle(textRef.current);
    inputRef.current.style.font = textStyle.font;
    inputRef.current.style.margin = textStyle.margin;
    inputRef.current.style.padding = textStyle.padding;
  }

  useEffect(() => {
    updateStyle();
    setInputValue(props.text);
  }, [props.text]);

  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      props.onSetText(inputValue);
      setIsInputActive(false);
      setIsFocused(false);
    }
  });

  useEffect(updateStyle, [textRef, inputRef]);

  useEffect(() => {
    if (isInputActive) {
      if (enter) {
        props.onSetText(inputValue);
        setIsInputActive(false);
        setIsFocused(false);
      }
      if (esc) {
        setInputValue(props.text);
        setIsInputActive(false);
        setIsFocused(false);
      }
    }
  }, [enter, esc]);

  return (
    <div
      ref={wrapperRef}
    >
      <Draggable draggableId={props.noteId} index={props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            className="note"
            noteType={props.noteType}
            onMouseOut={() => { if (!isFocused) setIsInputActive(false); }}
            onMouseOver={() => { if (!isFocused && !snapshot.isDragging) setIsInputActive(true); }}
          >
            <div className="dragHandle" {...provided.dragHandleProps}>
              <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM1.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4 1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM5.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#72767d"></path>
              </svg>
            </div>
            {React.createElement(
              noteTypes[props.noteType],
              {
                ref: textRef,
                className: "editable",
                hidden: isInputActive ? true : false
              }, inputValue
            )}
            <input
              ref={inputRef}
              style={{ width: "100%", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
              value={inputValue}
              onClick={() => setIsFocused(true)}
              onChange={e => {
                setInputValue(e.target.value);
              }}
              hidden={isInputActive ? false : true}
              className={`editable ${isInputActive ? "inputIsActive" : ""}`}
            />
          </Container>
        )}
      </Draggable>
    </div>
  );
}

export default Note;
