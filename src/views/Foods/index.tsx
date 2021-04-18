import React, { useEffect, useRef, useState } from 'react';
import { FoodStatic } from "../../database/models/food";
import BasicViewProps from "../BasicViewProps";
import "../../assets/scss/foods.scss";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useKeyPress from "../../hooks/useKeyPress";
import formatDate from "../../utils/formatDate";

function Foods({ userId }: BasicViewProps) {
  const [foods, setFoods] = useState<Map<number, FoodStatic>>(new Map());

  useEffect(() => {
    window.api.send("getFood", userId);

    function handleGetFood(gotFoods: FoodStatic[]) {
      setFoods(new Map(gotFoods.map(food => [food.id, food])));
    }

    function handleSetFoodResponse() {
      window.api.send("getFood", userId);
    }

    const removeGetFood = window.api.on("getFood", handleGetFood);
    const removeSetFood = window.api.on("setFood", handleSetFoodResponse);
    return () => {
      if(removeGetFood) removeGetFood();
      if(removeSetFood) removeSetFood();
    };
  }, []);

  return (
    <div className="foods">
      <h1>Foods</h1>
      <div className="label-input-container">
        {Object.getOwnPropertyNames(Array.from(foods.values())[0]||{}).slice(2, -2).map((propNames, index) => (
          <div
            key={index}
            className="label-input"
          >
            {propNames[0].toUpperCase() + propNames.slice(1)}
          </div>
        ))}
      </div>
      {Array.from(foods.keys()).map((food, index) => (
        <Row 
          key={index}
          food={foods.get(food)}
          onFoodSet={food => {
            if(food.name.length === 0) {
              const success = foods.delete(food.id);
              if(success) setFoods(foods);
            } else setFoods(foods.set(food.id, food));
            window.api.send("setFood", food);
          }}
        />
      ))}
      <button
        className="add-note-button"
        onClick={() => {
          window.api.send("setFood", ({
            id: null,
            user_id: userId,
            name: "Edit me!",
            amount: "0g",
            carbs: 0,
            fats: 0,
            proteins: 0,
            kcal: 0,
            updatedAt: formatDate(),
            createdAt: formatDate()
          } as FoodStatic))
        }}
      >
        Add Food
      </button>
    </div>
  );
}

export default Foods;

type RowProps = {
  food: FoodStatic,
  onFoodSet: (food: FoodStatic) => void;
}

function Row({food, onFoodSet}: RowProps) {
  const [foodData, setFoodData] = useState(food);

  useEffect(() => onFoodSet(foodData), [foodData]);

  return (
    <div>
      <div className="label-input-container">
      {Object.getOwnPropertyNames(food||{}).slice(2, -2).map((propName, index) => (
        <Column
          key={index}
          name={propName[0].toLocaleUpperCase()+propName.slice(1)}
          data={foodData[propName]}
          onTextSet={(name, value) => {
            const newState = Object.assign({}, foodData);
            newState[name] = value;
            setFoodData(newState);
          }}
        />
      ))}
    </div>
      <button
        type="button"
        className="delete-note"
        onClick={() => onFoodSet({ ...foodData, name: "" })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentcolor">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
        </svg>
      </button>
    </div>
    
    
  );
}

type ColumnProps = {
  name: string,
  data: string|number,
  onTextSet: (name: string, value: string) => void;
};

function Column({name, data, onTextSet}: ColumnProps) {
  const [text, setText] = useState(data);
  const [isFocused, setIsFocused] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const enter = useKeyPress("Enter");
  const esc = useKeyPress("Escape");

  useOnClickOutside(wrapper, () => {
    if(isFocused) {
      onTextSet(name.toLowerCase(), text.toString());
      setIsFocused(false);
    }
  });

  useEffect(() => {
    if(isFocused) {
      if(enter) {
        onTextSet(name.toLowerCase(), text.toString());
        setIsFocused(false);
      }
      if(esc) {
        setText(data);
        setIsFocused(false);
        input.current.blur();
      }
    }
  }, [enter, esc])

  return (
    <div ref={wrapper} className="label-input">
      <input
        ref={input}
        type="text"
        name={name}
        value={text}
        placeholder=" "
        required
        onClick={() => setIsFocused(true)}
        onChange={e => setText(e.target.value)}
      />
      <label htmlFor={name}>{name}</label>
    </div>
  );
}
