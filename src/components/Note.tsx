import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import useKeyPress from "../hooks/useKeyPress";
import useOnClickOutside from "../hooks/useOnClickOutside";
import InlineEdit from "./InlineEdit";
import Food from "./Food";
import { ReactComponent as DeleteIcon } from "../assets/svgs/backspace_black_24dp.svg";
import { ReactComponent as DragHandle } from "../assets/svgs/draghandle.svg";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import Weight from "./Weight";

export type NoteProps = {
  noteId: string;
  index: number;
  noteType: noteTypes
  text: string;
  onSetNote: ({ data, type }: noteData) => void;
};

export type noteData = {
  data: string;
  type: noteTypes
};

const Container = styled.div<{ isDragging: boolean; }>`
  display: flex;
  background-color: #363544;
  align-items: center;
  outline: ${props => (props.isDragging ? "2px dotted #534caf" : "none")};
  outline-offset: 4px;
`;

export enum noteTypes {
  NOTE = "note",
  TITLE = "title",
  FOOD = "food",
  WEIGHT = "weight",
};

const noteTypeMap = new Map([
  [
    noteTypes.NOTE,
    styled.div`
      padding: 2px 10px;
      margin-left: 10px;
    `
  ],
  [
    noteTypes.TITLE,
    styled.h1`
      padding: 2px 10px;
      margin: 5px 0px 5px 5px;
      border-bottom: 1px solid #72767d; margin-bottom: 10px;
    `
  ],
  [noteTypes.FOOD, styled.div``],
  [noteTypes.WEIGHT, styled.div``],
]);

function createNoteTypeOptions() {
  const array: {value: string, text: string}[] = [];
  noteTypeMap.forEach((_, noteType) => {
    array.push({
      value: noteType.toUpperCase(),
      text: capitalizeFirstLetter(noteType)
    });
  });
  return array;
}

function Note(props: NoteProps) {
  const [isInputActive, setIsInputActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [note, setNote] = useState<noteData>({ data: props.text, type: props.noteType });

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
        setNote({ data: props.text, type: props.noteType });
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
            onMouseOut={() => { if (!isFocused) setIsInputActive(false); }}
            onMouseOver={() => { if (!isFocused && !snapshot.isDragging) setIsInputActive(true); }}
          >
            <div hidden={!isFocused}>
              <select
                name="noteTypeSelect"
                id="noteTypeSelect"
                onChange={(e) => setNote({...note, type: noteTypes[e.target.value]})}
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
              <DragHandle fill="currentColor"/>
            </div>
            {(() => {
              if(note.type === noteTypes.FOOD) {
                return (
                  <Food
                    note={note}
                    isInputActive={isInputActive}
                    onSetNote={(note) => setNote(note)}
                    onSetIsFocused={(v) => setIsFocused(v)}
                  />
                );
              }
              if(note.type === noteTypes.WEIGHT) {
                return (
                  <Weight
                    note={note}
                    isInputActive={isInputActive}
                    onSetNote={(note) => setNote(note)}
                    onSetIsFocused={(v) => setIsFocused(v)}
                  />
                );
              }
              return (
                <InlineEdit
                  component={noteTypeMap.has(note.type) ? noteTypeMap.get(note.type) : "div"}
                  note={note}
                  isInputActive={isInputActive}
                  onSetNote={(note) => setNote(note)}
                  onSetIsFocused={(v) => setIsFocused(v)}
                />
              );
            })()}
            <button
              type="button"
              className="delete-note"
              hidden={!isInputActive}
              onClick={() => props.onSetNote({data: "", type: null})}
            >
              <DeleteIcon fill="currentColor"/>
            </button>
          </Container>
        )}
      </Draggable>
    </div>
  );
}

export default Note;
