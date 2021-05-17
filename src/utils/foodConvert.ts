import regExpPatterns from "./regExpPatterns";
import Convert from "convert";
import { FoodStatic } from "../database/models/food";

// TODO throw erros on bad converting

export default function foodConvert(food: FoodStatic, fromData: string, toData: string) {
  const [, fromAmount, fromUnit] = regExpPatterns.foodAmount.exec(fromData) || [null, 100, "g"];
  const [, toAmount, toUnit] = regExpPatterns.foodAmount.exec(toData) || [null, 100, "g"];
  const convAmount = Convert(Number(fromAmount)).from((fromUnit as any)).to((toUnit as any));
  const modifier = convAmount / Number(toAmount);
  const kcal = Math.round(food.kcal * modifier);
  const proteins = Math.round(food.proteins * modifier);
  const fats = Math.round(food.fats * modifier);
  const carbs = Math.round(food.carbs * modifier);

  return { kcal, proteins, fats, carbs };
}