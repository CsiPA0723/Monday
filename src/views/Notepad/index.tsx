import React, { useState } from "react";
import "../../assets/scss/notepad.scss";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Notes, { noteData } from "../../components/Notes";

function Notepad() {
  const [data, setData] = useState<{
    notes: { [key: string]: noteData; };
    columns: { [key: string]: { id: string, noteIds: string[]; }; };
    columnOrder: string[];
  }>({
    notes: {
      "note-0": { id: "note-0", text: "Test1", type: "head" },
      "note-1": { id: "note-1", text: "Testing", type: "note" },
      "note-2": { id: "note-2", text: "Testing", type: "note" },
      "note-3": { id: "note-3", text: "Testing", type: "note" },
    },
    columns: {
      notes: {
        id: "notes",
        noteIds: ["note-0", "note-1", "note-2", "note-3"],
      }
    },
    columnOrder: ["notes"]
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const column = data.columns[source.droppableId];
    const newNoteIds = Array.from(column.noteIds);
    newNoteIds.splice(source.index, 1);
    newNoteIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      noteIds: newNoteIds
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn
      }
    };

    setData(newState);
  };

  return (
    <div id="notepad">
      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const notes = column.noteIds.map(noteId => data.notes[noteId]);
          return (
            <Notes
              key={column.id}
              notesId={column.id}
              notes={notes}
              setNotes={(notes) => {
                let newNotes: typeof data["notes"] = {};
                let newNoteIds = [];
                for (const note of notes) {
                  newNotes[note.id] = note;
                  newNoteIds.push(note.id);
                }
                const newColumn = {
                  ...column,
                  noteIds: newNoteIds
                };
                const newState = {
                  ...data,
                  columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn
                  },
                  notes: newNotes
                };
                setData(newState);
              }}
            />
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default Notepad;
