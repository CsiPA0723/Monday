import React, { useEffect } from "react";
import { noteTypesEnum } from "../Note";

type FoodProps = {
  note: { text: string, type: noteTypesEnum; };
  isInputActive: boolean;
  onSetNote: ({ text, type }: { text: string, type: noteTypesEnum; }) => void;
  onSetIsFocused: (value: boolean) => void;
};

function Food(props: FoodProps) {
  useEffect(() => {
    props.onSetNote({ text: props.note.text, type: props.note.type });
  }, [props.note.text]);

  return (
    <div className="food">
      <div className="label-input-container">
        <div className="label-input">
          <input
            type="text"
            name="text"
            id="text"
            placeholder=" "
            required
            value={props.note.text}
            onClick={() => props.onSetIsFocused(true)}
            onChange={e => props.onSetNote({ ...props.note, text: e.target.value })}
          />
          <label htmlFor="text">Food</label>
        </div>
        <div className="label-input">
          <input
            type="text"
            name="amount"
            id="amount"
            placeholder=" "
            required
            value={props.note.text}
            onClick={() => props.onSetIsFocused(true)}
            onChange={e => props.onSetNote({ ...props.note, text: e.target.value })}
          />
          <label htmlFor="amount">Amount</label>
        </div>
      </div>
      <div className="FCP-container">
        <div>{`100 Fat`}</div>
        <div>{`100 Carbs`}</div>
        <div>{`100 Protein`}</div>
      </div>
      <div className="kcal">{`100 kcal`}</div>
    </div>
  );
}

export default Food;
