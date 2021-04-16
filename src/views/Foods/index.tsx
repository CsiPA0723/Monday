import React, { useEffect, useState } from 'react';
import { FoodStatic } from "../../database/models/food";
import BasicViewProps from "../BasicViewProps";
import "../../assets/scss/foods.scss";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

function Foods({ userId }: BasicViewProps) {
  const [foods, setFoods] = useState<FoodStatic[]>([]);

  useEffect(() => {
    window.api.send("getFood", userId);

    function handleGetFood(_, gotFoods: FoodStatic[]) {
      setFoods(gotFoods);
    }

    window.api.on("getFood", handleGetFood);
    return () => {
      window.api.off("getFood", handleGetFood);
    };
  }, []);

  return (
    <div className="foods">
      <h1>Foods</h1>
      <div className="label-input-container" style={{position: "sticky"}}>
        {Object.getOwnPropertyNames(foods[0]||{}).slice(2, -2).map((propNames, index) => (
          <div
            key={index}
            className="label-input"
          >
            {propNames[0].toUpperCase() + propNames.slice(1)}
          </div>
        ))}
      </div>
      {foods.map((food, index) => (
        <Row 
          key={index}
          name={food.name}
          amount={food.amount}
          carbs={food.carbs}
          fats={food.carbs}
          proteins={food.proteins}
          kcal={food.kcal}
        />
      ))}
    </div>
  );
}

export default Foods;

type RowProps = {
  name: string,
  amount: string,
  carbs: number,
  fats: number,
  proteins: number,
  kcal: number
}

function Row({name, amount, carbs, fats, proteins, kcal}: RowProps) {

  return (
    <div className="label-input-container">
      <Column name={"Name"} data={name} />
      <Column name={"Amount"} data={amount}/>
      <Column name={"Carbs"} data={carbs}/>
      <Column name={"Fats"} data={fats}/>
      <Column name={"Proteins"} data={proteins}/>
      <Column name={"Kcal"} data={kcal}/>
    </div>
  );
}

function Column({name, data}: {name: string, data: string|number}) {
  const [text, setText] = useState(data);

  return (
    <div className="label-input">
      <input
        type="text"
        name={name}
        value={text}
        placeholder=" "
        required
        onChange={e => setText(e.target.value)}
      />
      <label htmlFor={name}>{name}</label>
    </div>
  );
}
