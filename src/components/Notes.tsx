import React from 'react';
import { Droppable } from "react-beautiful-dnd";

import Note, { noteTypesEnum } from "./Note";

export type noteData = { dbId: number; noteId: string, type: noteTypesEnum, text: string; };

type NotesProps = {
  notesId: string;
  notes: noteData[];
  setNotes: (notes: noteData[]) => void;
};

function Notes(props: NotesProps) {
  return (
    <>
      <Droppable droppableId={props.notesId}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.notes.map((note, index) => (
              <Note
                key={note.noteId}
                noteDBId={note.dbId}
                index={index}
                noteId={note.noteId}
                noteType={note.type}
                text={note.text}
                onSetNote={({ text, type }: {text: string, type: noteTypesEnum}) => {
                  const index = props.notes.findIndex(n => n.noteId === note.noteId);
                  if (text.length === 0) {
                    const newNotes = Array.from(props.notes);
                    newNotes.splice(index, 1);
                    return props.setNotes([...newNotes]);
                  }
                  props.notes[index].text = text;
                  props.notes[index].type = type;
                  props.setNotes([...props.notes]);
                }}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button
        className="add-note-button"
        onClick={() => {
          const newNotes = Array.from(props.notes);
          const sortedNotes = props.notes.sort((a, b) => parseInt(a.noteId.split("-")[1]) - parseInt(b.noteId.split("-")[1]));
          const splittedLastNoteId = sortedNotes[props.notes.length - 1]?.noteId.split("-");
          const noteName = splittedLastNoteId && splittedLastNoteId[0] || "note";
          const noteNumber = splittedLastNoteId && splittedLastNoteId[1] || "-1";
          const newNoteId = `${noteName}-${parseInt(noteNumber) + 1}`;
          newNotes.push({
            dbId: null,
            noteId: newNoteId,
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
