import { ChartData } from "chart.js";
import React, { useEffect, useState } from 'react';
import BasicViewProps from "../../@types/views";
import LineGraph from "../../components/LineGraph";

function getGreeting() {
  const hours = new Date().getHours();
  if(22 <= hours || hours < 4) return "Good Night";
  if(18 <= hours) return "Good Evening";
  if(10 <= hours) return "Good Day";
  if(4 <= hours) return "Good Morning";
}

function Home({ userId, userSettings }: BasicViewProps) {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });

  useEffect(() => {
    window.api.send("getChartData", userId);

    function handleChartData(gotChartData: ChartData) {
      console.log(gotChartData);
      setChartData({ ...chartData, ...gotChartData });
    }

    const removeGetChartData = window.api.on("getChartData", handleChartData);
    return () => {
      removeGetChartData?.();
    };
  }, []);
  return (
    <>
      <h1>{getGreeting()}{userSettings && userSettings.name ?  ` ${userSettings.name}` : ""}!</h1>
      <LineGraph data={chartData}/>
    </>
  );
}

export default Home;
