import React, { useEffect, useRef, useState } from 'react';
import { FoodStatic } from "../../database/models/food";
import BasicViewProps from "../../@types/views";
import "../../assets/scss/foods.scss";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useKeyPress from "../../hooks/useKeyPress";
import formatDate from "../../utils/formatDate";
import { ReactComponent as DeleteIcon } from "../../assets/svgs/delete.svg";

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
      {Array.from(foods.keys()).map((food) => (
        <Row 
          key={food}
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
        className="add-food-button"
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
      />
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
    <div className="food-row">
      <div className="label-input-container">
      {Object.getOwnPropertyNames(foodData||{}).slice(2, -2).map((propName, index) => (
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
        className="delete-food"
        onClick={() => onFoodSet({ ...foodData, name: "" })}
      >
        <DeleteIcon fill="currentColor"/>
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
        input.current.blur();
      }
      if(esc) {
        setText(data);
        setIsFocused(false);
        input.current.blur();
      }
    }
  }, [enter, esc])

  return (
    <div ref={wrapper} className="label-input has-float-label">
      <input
        ref={input}
        type="text"
        name={name}
        value={text}
        placeholder=" "
        required
        onChange={e => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <label htmlFor={name}>{name}</label>
    </div>
  );
}
