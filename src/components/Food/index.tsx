import React, { useEffect, useState } from "react";
import AutoSuggest from "react-autosuggest";
import { noteData } from "../Note";
import { FoodStatic } from "../../database/models/food";

type FoodProps = {
  note: noteData;
  isInputActive: boolean;
  onSetNote: ({ data, type }: noteData) => void;
  onSetIsFocused: (value: boolean) => void;
};

export type foodData = { id: number, name: string, amount: string; };

function Food(props: FoodProps) {
  const [food, setFood] = useState<foodData>({
    id: props.note.data.includes(nameof<foodData>(f => f.id)) ? (JSON.parse(props.note.data) as foodData).id : null,
    name: props.note.data.includes(nameof<foodData>(f => f.name)) ? (JSON.parse(props.note.data) as foodData).name : "",
    amount: props.note.data.includes(nameof<foodData>(f => f.amount)) ? (JSON.parse(props.note.data) as foodData).amount : ""
  });
  const [suggestions, setSuggestions] = useState<FoodStatic[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodStatic>(null);

  useEffect(() => {
    props.onSetNote({ ...props.note, data: JSON.stringify(food) });
  }, [food]);

  useEffect(() => {
    function handleGetSuggestedFoods(suggestedFoods: FoodStatic[]) {
      setSuggestions(suggestedFoods);
    }
    function handleGetSelectedFood(foodData: FoodStatic) {
      if(foodData && foodData.id === food.id) setSelectedFood(foodData);
    }

    window.api.send("getSelectedFood", food.id);
    const removeGetSuggestedFoods = window.api.on("getSuggestedFoods", handleGetSuggestedFoods);
    const removeGetSelectedFood = window.api.on("getSelectedFood", handleGetSelectedFood);
    return () => {
      if(removeGetSuggestedFoods) removeGetSuggestedFoods();
      if(removeGetSelectedFood) removeGetSelectedFood();
    };
  }, []);

  return (
    <div className="food">
      <div className="label-input-container">
        <AutoSuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={({ value }) => window.api.send("getSuggestedFoods", value)}
          onSuggestionsClearRequested={() => setSuggestions([])}
          onSuggestionSelected={(_, { suggestion }) => {
            setSelectedFood(suggestion);
            setFood({
              ...food,
              id: suggestion.id,
              name: suggestion.name
            });
          }}
          getSuggestionValue={suggestion => suggestion.name}
          renderSuggestion={suggestion => (<div>{suggestion.name}</div>)}
          inputProps={{
            type: "text",
            name: "text",
            id: "text",
            placeholder: " ",
            required: true,
            value: food.name,
            onClick: () => props.onSetIsFocused(true),
            onChange: (_, change) => setFood({ ...food, name: change.newValue })
          }}
          renderInputComponent={(props) => (
            <div className="label-input">
              <input {...props} />
              <label htmlFor="text">Food</label>
            </div>
          )}
        />
        <div className="label-input">
          <input
            type="text"
            name="amount"
            id="amount"
            placeholder=" "
            required
            value={food.amount}
            onClick={() => props.onSetIsFocused(true)}
            onChange={e => setFood({ ...food, amount: e.target.value })}
          />
          <label htmlFor="amount">Amount</label>
        </div>
      </div>
      <div className="FCP-container">
        <div>{`${selectedFood ? selectedFood.fats : "..."} Fats`}</div>
        <div>{`${selectedFood ? selectedFood.carbs : "..."} Carbs`}</div>
        <div>{`${selectedFood ? selectedFood.proteins : "..."} Proteins`}</div>
      </div>
      <div className="kcal">{`${selectedFood ? selectedFood.kcal : "..."} kcal`}</div>
    </div>
  );
}

export default Food;
