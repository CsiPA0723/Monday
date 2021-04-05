import React, { useEffect, useState } from "react";
import "../../assets/scss/notepad.scss";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Notes, { noteData } from "../../components/Notes";
import formatDate from "../../utils/formatDate";
import BasicViewProps from "../BasicViewProps";

export type notesData = {
  columns: {
    [key: string]: {
      id: string;
      title: string;
      idOrder: string[];
      rows: { [key: string]: noteData; };
    };
  };
  columnOrder: string[];
};

function Notepad({ userId }: BasicViewProps) {
  const [data, setData] = useState<notesData>({
    columns: {},
    columnOrder: []
  });

  const [date, setDate] = useState(formatDate());

  useEffect(() => {
    window.notepad.send("getNotes", date, userId);

    function handleGetNotes(_, stringData: string) {
      console.log(stringData);
      const gotData = JSON.parse(stringData);
      console.log(gotData);
      if(gotData.columnOrder.length === 0) {
        gotData.columns[`notes-${formatDate()}`] = {
          id: `notes-${formatDate()}`,
          idOrder: ["note-0"],
          rows: {
            "note-0": {
              id: "note-0",
              text: "Edit ME or add new note to create notes for this date!",
              type: "note"
            }
          },
          title: "Notes"
        };
        gotData.columnOrder = [`notes-${formatDate()}`];
        setData(gotData);
      }
      setData({...data, ...gotData});
    }

    window.notepad.on("getNotes", handleGetNotes);

    return () => {
      window.notepad.off("getNotes", handleGetNotes);
    };
  }, [date]);

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const column = data.columns[source.droppableId];
    const newNoteIds = Array.from(column.idOrder);
    newNoteIds.splice(source.index, 1);
    newNoteIds.splice(destination.index, 0, draggableId);

    const newColumn: typeof data.columns.rows = {
      ...column,
      idOrder: newNoteIds
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
      <div className="date-container">
        <span>{"<"}</span>
        <input
          type="date"
          name="date-picker"
          id="date-picker"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={"1970-01-01"}
        />
        <span>{">"}</span>
      </div>
      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const notes = column.idOrder.map(id => column.rows[id]);
          return (
            <Notes
              key={column.id}
              notesId={column.id}
              notes={notes}
              setNotes={(notes) => {
                let newNotes: notesData["columns"][string]["rows"] = {};
                let newNoteIds: notesData["columns"][string]["id"][] = [];
                for (const note of notes) {
                  newNotes[note.id] = note;
                  newNoteIds.push(note.id);
                }
                const newColumn: notesData["columns"][string] = {
                  ...column,
                  idOrder: newNoteIds,
                  rows: newNotes
                };
                const newState: notesData = {
                  ...data,
                  columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn
                  },
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
