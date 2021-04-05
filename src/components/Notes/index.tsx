import React from 'react';
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import Note, { NoteProps, noteTypesEnum } from "../Note";

export type noteData = { id: string, type: NoteProps["noteType"], text: string; };

type NotesProps = {
  notesId: string;
  notes: noteData[];
  setNotes: (notes: noteData[]) => void;
};

const Container = styled.div``;

function Notes(props: NotesProps) {
  return (
    <>
      <Droppable droppableId={props.notesId}>
        {provided => (
          <Container
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.notes.map((note, index) => (
              <Note
                key={note.id}
                index={index}
                noteId={note.id}
                noteType={note.type}
                text={note.text}
                onSetText={text => {
                  const index = props.notes.findIndex(n => n.id === note.id);
                  if (text.length === 0) {
                    const newNotes = Array.from(props.notes);
                    newNotes.splice(index, 1);
                    return props.setNotes([...newNotes]);
                  }
                  props.notes[index].text = text;
                  props.setNotes([...props.notes]);
                }}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
      <button
        className="add-note-button"
        onClick={() => {
          const newNotes = Array.from(props.notes);
          const sortedNotes = props.notes.sort((a, b) => parseInt(a.id.split("-")[1]) - parseInt(b.id.split("-")[1]));
          const splittedLastNoteId = sortedNotes[props.notes.length - 1]?.id.split("-");
          const noteName = splittedLastNoteId && splittedLastNoteId[0] || "note";
          const noteNumber = splittedLastNoteId && splittedLastNoteId[1] || "-1";
          const newNoteId = `${noteName}-${parseInt(noteNumber) + 1}`;
          newNotes.push({
            id: newNoteId,
            text: "Edit me!",
            type: noteTypesEnum.NOTE
          });
          props.setNotes([...newNotes]);
        }}
      />
    </>
  );
}

export default Notes;
