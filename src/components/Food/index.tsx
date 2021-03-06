import React, { useEffect, useState } from "react";
import AutoSuggest from "react-autosuggest";
import { noteData } from "../Note";
import { FoodStatic } from "../../database/models/food";
import regExpPatterns from "../../utils/regExpPatterns";
import foodConvert from "../../utils/foodConvert";

type FoodProps = {
  note: noteData;
  isInputActive: boolean;
  onSetNote: ({ data, type }: noteData) => void;
  onSetIsFocused: (value: boolean) => void;
};

export type FoodData = { id: number, name: string, amount: string; };

function Food(props: FoodProps) {
  const [food, setFood] = useState<FoodData>({
    id: props.note.data.includes(nameof<FoodData>(f => f.id)) ? (JSON.parse(props.note.data) as FoodData).id : null,
    name: props.note.data.includes(nameof<FoodData>(f => f.name)) ? (JSON.parse(props.note.data) as FoodData).name : "",
    amount: props.note.data.includes(nameof<FoodData>(f => f.amount)) ? (JSON.parse(props.note.data) as FoodData).amount : ""
  });
  const [suggestions, setSuggestions] = useState<FoodStatic[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodStatic>(null);
  const [calcedFoodData, setCalcedFoodData] = useState<ReturnType<typeof foodConvert>>(null);

  useEffect(() => {
    props.onSetNote({
      ...props.note,
      data: JSON.stringify(food)
    });
  }, [food]);

  useEffect(() => {
    if(selectedFood && regExpPatterns.foodAmount.test(food.amount)) {
      setCalcedFoodData(foodConvert(selectedFood, food.amount, selectedFood.amount));
    }
  }, [selectedFood]);

  useEffect(() => {
    function handleGetSuggestedFoods(suggestedFoods: FoodStatic[]) {
      setSuggestions(suggestedFoods);
    }

    function handleGetSelectedFood(foodData: FoodStatic) {
      if(foodData && foodData.id === food.id) {
        setSelectedFood(foodData);
        setFood({
          ...food,
          name: foodData.name,
          ...(!regExpPatterns.foodAmount.test(food.amount) ? { amount: "100g" } : null)
        });
      }
    }

    window.api.send("getSelectedFood", food.id);
    const removeGetSuggestedFoods = window.api.on("getSuggestedFoods", handleGetSuggestedFoods);
    const removeGetSelectedFood = window.api.on("getSelectedFood", handleGetSelectedFood);
    return () => {
      removeGetSuggestedFoods?.();
      removeGetSelectedFood?.();
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
            onFocus: () => props.onSetIsFocused(true),
            onBlur: () => props.onSetIsFocused(false),
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
            pattern={regExpPatterns.foodAmount.source}
            onFocus={() => props.onSetIsFocused(true)}
            onBlur={() => props.onSetIsFocused(false)}
            onChange={e => {
              setFood({ ...food, amount: e.target.value });
              if(regExpPatterns.foodAmount.test(e.target.value) && selectedFood) {
                setCalcedFoodData(foodConvert(selectedFood, e.target.value, selectedFood.amount));
              }
            }}
          />
          <label htmlFor="amount">Amount</label>
          <div className="requirements">
            Must have at least one number and the unit!
          </div>
        </div>
      </div>
      <div className="FCP-container">
        <div>{`${calcedFoodData ? calcedFoodData.fats : "..."} Fats`}</div>
        <div>{`${calcedFoodData ? calcedFoodData.carbs : "..."} Carbs`}</div>
        <div>{`${calcedFoodData ? calcedFoodData.proteins : "..."} Proteins`}</div>
      </div>
      <div className="kcal">{`${calcedFoodData ? calcedFoodData.kcal : "..."} kcal`}</div>
    </div>
  );
}

export default Food;
