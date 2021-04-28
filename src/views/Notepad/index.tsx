import React, { useEffect, useState } from "react";
import "../../assets/scss/notepad.scss";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Notes, { noteData } from "../../components/Notes";
import { noteTypes } from "../../components/Note";
import formatDate from "../../utils/formatDate";
import BasicViewProps from "../../@types/views";
import { ReactComponent as ArrowLeft } from "../../assets/svgs/arrow_left.svg"
import { ReactComponent as ArrowRight } from "../../assets/svgs/arrow_right.svg"
import noteColumnId from "../../utils/noteColumnId";

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

    function handleGetNotes(stringData: string) {
      const gotData = (JSON.parse(stringData) as notesData);
      const columnId = noteColumnId.make("notes", date, userId);
      if (gotData.columnOrder.length === 0) {
        gotData.columns[columnId] = {
          id: columnId,
          idOrder: ["note-0"],
          rows: {
            "note-0": {
              noteId: "note-0",
              data: JSON.stringify({ text: "Edit ME or add new note to create notes for this date!" }),
              type: noteTypes.NOTE
            }
          },
          title: "Notes"
        };
        gotData.columnOrder = [columnId];
        setData(gotData);
      }
      setData({ ...data, ...gotData });
    }

    const removeGetNotes = window.api.on("getNotes", handleGetNotes);
    return () => {
      removeGetNotes?.();
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
          <ArrowLeft fill="currentColor"/>
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
          <ArrowRight fill="currentColor"/>
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
