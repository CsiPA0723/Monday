import React, { useEffect, useState } from "react";
import { noteData } from "./Note";

type FoodProps = {
    note: noteData;
    isInputActive: boolean;
    onSetNote: ({ data, type }: noteData) => void;
    onSetIsFocused: (value: boolean) => void;
};

export type foodData = { name: string, amount: string };

function Food(props: FoodProps) {
  const [food, setFood] = useState<foodData>({
    name: props.note.data.includes(nameof<foodData>(f => f.name)) ? (
        (JSON.parse(props.note.data) as foodData).name
    ) : "",
    amount: props.note.data.includes(nameof<foodData>(f => f.amount)) ?  (
        (JSON.parse(props.note.data) as foodData).amount
    ) : ""
  });

  useEffect(() => {
    props.onSetNote({...props.note, data: JSON.stringify(food)});
  }, [food]);

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
            value={food.name}
            onClick={() => props.onSetIsFocused(true)}
            onChange={e => setFood({...food, name: e.target.value})}
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
            value={food.amount}
            onClick={() => props.onSetIsFocused(true)}
            onChange={e => setFood({...food, amount: e.target.value})}
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
