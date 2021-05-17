import { ChartData } from "chart.js";
import { dialog, ipcMain } from "electron";
import { FoodData } from "../../components/Food";
import { noteTypes } from "../../components/Note";
import { Food, Note } from "../../database";
import noteColumnId from "../../utils/noteColumnId";
import { NoteStatic } from "../../database/models/note";
import { WeightData } from "../../components/Weight";
import foodConvert from "../../utils/foodConvert";

const sorting = (a: NoteStatic, b: NoteStatic) => {
  const aDate = new Date(noteColumnId.split(a.column_id).date);
  const bDate = new Date(noteColumnId.split(b.column_id).date);
  return aDate.getTime() - bDate.getTime();
};

type mappedDataType = {
  kcal: number,
  proteins: number,
  fats: number,
  carbs: number,
  weight: number;
};

ipcMain.on("getChartData", (event, userId: string) => {
  try {
    const chartData: ChartData<"line", any, string> = {
      labels: [],
      datasets: []
    };
    const notes = Note.findAll([{ user_id: userId }, "AND", { type: noteTypes.FOOD }, "OR", { type: noteTypes.WEIGHT }]);

    if(notes) {
      const mapedData = new Map<string, mappedDataType>();
      for(const note of notes.sort(sorting)) {
        const date = noteColumnId.split(note.column_id).date;
        chartData.labels.push(date);

        if(note.type === noteTypes.FOOD) {
          const data: FoodData = JSON.parse(note.data);
          const food = Food.findByPk(data.id);
          if(!food) continue;
          const { carbs, fats, kcal, proteins } = foodConvert(food, data.amount, food.amount);
          const prevData = mapedData.get(date);
          mapedData.set(date, {
            ...prevData,
            kcal: prevData && prevData.kcal ? prevData.kcal + kcal : kcal,
            proteins: prevData && prevData.proteins ? prevData.proteins + proteins : proteins,
            fats: prevData && prevData.fats ? prevData.fats + fats : fats,
            carbs: prevData && prevData.carbs ? prevData.carbs + carbs : carbs
          });
        }

        if(note.type === noteTypes.WEIGHT) {
          const data: WeightData = JSON.parse(note.data);
          const prevData = mapedData.get(date);
          mapedData.set(date, {
            ...prevData,
            weight: Number(data && data.weight ? data.weight : 0)
          });
        }
      }

      const data = Array.from(mapedData).map(([date, obj]) => ({ x: date, ...obj }));

      chartData.datasets.push(
        {
          label: "Kcal",
          data: data,
          backgroundColor: "rgba(137, 218, 212, 0.5)",
          borderColor: "rgb(137, 218, 212)",
          borderWidth: 1,
          fill: false,
          parsing: {
            yAxisKey: nameof<mappedDataType>(t => t.kcal)
          },
          spanGaps: true
        },
        {
          label: "Proteins",
          data: data,
          backgroundColor: "rgba(137,218,139,0.5)",
          borderColor: "rgb(137,218,139)",
          borderWidth: 1,
          fill: false,
          parsing: {
            yAxisKey: nameof<mappedDataType>(t => t.proteins)
          },
          spanGaps: true
        },
        {
          label: "Fats",
          data: data,
          backgroundColor: "rgba(197,218,137,0.5)",
          borderColor: "rgb(197,218,137)",
          borderWidth: 1,
          fill: false,
          parsing: {
            yAxisKey: nameof<mappedDataType>(t => t.fats)
          },
          spanGaps: true
        },
        {
          label: "Carbs",
          data: data,
          backgroundColor: "rgba(218,171,137,0.5)",
          borderColor: "rgb(218,171,137)",
          borderWidth: 1,
          fill: false,
          parsing: {
            yAxisKey: nameof<mappedDataType>(t => t.carbs)
          },
          spanGaps: true
        },
        {
          label: "Weight (Kg)",
          data: data,
          backgroundColor: "rgba(114, 137, 218, 0.5)",
          borderColor: "rgb(114, 137, 218)",
          borderWidth: 1,
          fill: false,
          parsing: {
            yAxisKey: nameof<mappedDataType>(t => t.weight)
          },
          spanGaps: true
        }
      );
    }
    chartData.labels = Array.from(new Set(chartData.labels));
    event.reply("getChartData", chartData);
  } catch(error) {
    dialog.showErrorBox((error as Error)?.name, (error as Error)?.stack);
  }
});