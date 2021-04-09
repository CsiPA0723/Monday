import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import useKeyPress from "../hooks/useKeyPress";
import useOnClickOutside from "../hooks/useOnClickOutside";
import InlineEdit from "./InlineEdit";
import Food from "./Food";

export type NoteProps = {
  noteId: string;
  index: number;
  noteType: noteTypesEnum
  text: string;
  onSetNote: ({ text, type }: {text: string, type: noteTypesEnum}) => void;
};

const Container = styled.div<{ isDragging: boolean; noteType: keyof typeof noteTypes; }>`
  display: flex;
  background-color: #363544;
  align-items: center;
  outline: ${props => (props.isDragging ? "2px dotted #534caf" : "none")};
  outline-offset: 4px;
`;

export enum noteTypesEnum {
  NOTE = "note",
  HEAD = "head",
  FOOD = "food",
  // SPORT = "sport",
  // TASK = "task"
}

export const noteTypes = {
  "note": styled.div`
    padding: 2px 10px;
    margin-left: 10px;
  `,
  "head": styled.h1`
    padding: 2px 10px;
    margin: 5px 0px 5px 5px;
    border-bottom: 1px solid #72767d; margin-bottom: 10px;
  `,
  "food": styled.div``,
  // "sport": styled.div``,
  // "task": styled.div``
} as const;

function createNoteTypeOptions() {
  const array: {value: string, text: string}[] = [];
  for (const noteType in noteTypes) {
    array.push({
      value: noteType.toUpperCase(),
      text: noteType[0].toUpperCase()+noteType.slice(1)
    });
  }
  return array;
}

function Note(props: NoteProps) {
  const [isInputActive, setIsInputActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [note, setNote] = useState({ text: props.text, type: props.noteType });

  const enter = useKeyPress("Enter");
  const esc = useKeyPress("Escape");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      props.onSetNote(note);
      setIsInputActive(false);
      setIsFocused(false);
    }
  });

  useEffect(() => {
    if (isInputActive) {
      if (enter) {
        props.onSetNote(note);
        setIsInputActive(false);
        setIsFocused(false);
      }
      if (esc) {
        setNote({ text: props.text, type: props.noteType });
        setIsInputActive(false);
        setIsFocused(false);
      }
    }
  }, [enter, esc]);

  return (
    <div className="note" ref={wrapperRef}>
      <Draggable draggableId={props.noteId} index={props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            noteType={note.type}
            onMouseOut={() => { if (!isFocused) setIsInputActive(false); }}
            onMouseOver={() => { if (!isFocused && !snapshot.isDragging) setIsInputActive(true); }}
          >
            <div hidden={!isFocused}>
              <select
                name="noteTypeSelect"
                id="noteTypeSelect"
                onChange={(e) => setNote({...note, type: noteTypesEnum[e.target.value]})}
                value={note.type.toUpperCase()}
              >
                {createNoteTypeOptions().map(({ value, text }, i) => (
                  <option key={i} value={value}>{text}</option>
                ))}
              </select>
            </div>
            <div
              className="dragHandle"
              {...provided.dragHandleProps}
              hidden={isFocused}
            >
              <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM1.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4 1.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM5.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#72767d"></path>
              </svg>
            </div>
            {note.type !== noteTypesEnum.FOOD ? (
                <InlineEdit
                  component={noteTypes[note.type]}
                  note={note}
                  isInputActive={isInputActive}
                  onSetNote={(note) => setNote(note)}
                  onSetIsFocused={(v) => setIsFocused(v)}
                />
              ) : (
                <Food
                  note={note}
                  isInputActive={isInputActive}
                  onSetNote={(note) => setNote(note)}
                  onSetIsFocused={(v) => setIsFocused(v)}
                />
              )
            }
            <button
              type="button"
              className="delete-note"
              hidden={!isInputActive}
              onClick={() => props.onSetNote({text: "", type: null})}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentcolor">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
              </svg>
            </button>
          </Container>
        )}
      </Draggable>
    </div>
  );
}

export default Note;
