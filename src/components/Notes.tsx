import React from 'react';
import { Droppable } from "react-beautiful-dnd";
import { inlineData } from "./InlineEdit";

import Note, { noteTypes } from "./Note";

export type noteData = { noteId: string, type: noteTypes, data: string; };

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
                index={index}
                noteId={note.noteId}
                noteType={note.type}
                text={note.data}
                onSetNote={({ data, type }) => {
                  const index = props.notes.findIndex(n => n.noteId === note.noteId);
                  const jsonData: Object = data.startsWith("{") ? JSON.parse(data) : null;
                  if (data.length === 0 || (
                    jsonData &&
                    jsonData.hasOwnProperty(nameof<inlineData>(i => i.text)) &&
                    (jsonData as inlineData).text.length === 0)
                  ) {
                    const newNotes = Array.from(props.notes);
                    newNotes.splice(index, 1);
                    return props.setNotes([...newNotes]);
                  }
                  props.notes[index].data = data;
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
            noteId: newNoteId,
            data: JSON.stringify({ text: "Edit me!" }),
            type: noteTypes.NOTE
          });
          props.setNotes([...newNotes]);
        }}
      />
    </>
  );
}

export default Notes;
