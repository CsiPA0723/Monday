import React, { useEffect, useState } from "react";
import "../../assets/scss/notepad.scss";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Notes, { noteData } from "../../components/Notes";
import { noteTypesEnum } from "../../components/Note";
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
    window.api.send("getNotes", date, userId);

    function handleGetNotes(_, stringData: string) {
      const gotData = (JSON.parse(stringData) as notesData);
      const columnId = `notes-${formatDate(date)}_${userId}`;
      if (gotData.columnOrder.length === 0) {
        gotData.columns[columnId] = {
          id: columnId,
          idOrder: ["note-0"],
          rows: {
            "note-0": {
              dbId: null,
              noteId: "note-0",
              data: "Edit ME or add new note to create notes for this date!",
              type: noteTypesEnum.NOTE
            }
          },
          title: "Notes"
        };
        gotData.columnOrder = [columnId];
        setData(gotData);
      }
      setData({ ...data, ...gotData });
    }

    window.api.on("getNotes", handleGetNotes);

    return () => {
      window.api.off("getNotes", handleGetNotes);
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
    window.api.send("setNotes", newState, userId);
  };

  return (
    <div id="notepad">
      <div className="date-container">
        <div
          className="date-left"
          onClick={() => {
            const dDate = new Date(date);
            dDate.setDate(dDate.getDate() - 1);
            setDate(formatDate(dDate));
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="currentcolor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </div>
        <input
          type="date"
          name="date-picker"
          id="date-picker"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={"1970-01-01"}
        />
        <div
          className="date-right"
          onClick={() => {
            const dDate = new Date(date);
            dDate.setDate(dDate.getDate() + 1);
            setDate(formatDate(dDate));
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="currentcolor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
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
                  newNotes[note.noteId] = note;
                  newNoteIds.push(note.noteId);
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
                window.api.send("setNotes", newState, userId);
              }}
            />
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default Notepad;
