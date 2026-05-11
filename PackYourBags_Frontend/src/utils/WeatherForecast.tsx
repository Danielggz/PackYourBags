import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

type DailyWeather = {
  date: string;
  symbol: string;
  minTemp: number;
  maxTemp: number;
  wind: number;
};

export function WeatherForecast() {
  const [forecast, setForecast] = useState<DailyWeather[]>([]);

  useEffect(() => {
    async function loadWeather() {
      try {
        const url = `${API_BASE_URL}/weather?lat=53.3498&lon=-6.2603`;

        const res = await fetch(url);
        const xml = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");

        const times = Array.from(doc.getElementsByTagName("time"));

        const dailyMap: Record<
          string,
          {
            date: string;
            temps: number[];
            symbols: string[];
            winds: number[];
          }
        > = {};

        times.forEach((t) => {
          const from = t.getAttribute("from") || "";
          const date = from.split("T")[0];

          const tempAttr = t.querySelector("temperature")?.getAttribute("value");
          const temp = tempAttr ? Number(tempAttr) : null;

          const symbol = t.querySelector("symbol")?.getAttribute("id") || null;

          const windAttr = t.querySelector("windSpeed")?.getAttribute("mps");
          const wind = windAttr ? Number(windAttr) : null;

          if (!dailyMap[date]) {
            dailyMap[date] = {
              date,
              temps: [],
              symbols: [],
              winds: [],
            };
          }

          if (temp !== null) dailyMap[date].temps.push(temp);
          if (symbol !== null) dailyMap[date].symbols.push(symbol);
          if (wind !== null) dailyMap[date].winds.push(wind);
        });

        const dailyForecast: DailyWeather[] = Object.values(dailyMap).map((d) => {
          const minTemp = d.temps.length ? Math.min(...d.temps) : 0;
          const maxTemp = d.temps.length ? Math.max(...d.temps) : 0;

          // Most common symbol
          const symbol =
            d.symbols.length > 0
              ? d.symbols.sort(
                  (a, b) =>
                    d.symbols.filter((v) => v === a).length -
                    d.symbols.filter((v) => v === b).length
                ).pop()!
              : "";

          const avgWind =
            d.winds.length > 0
              ? d.winds.reduce((a, b) => a + b, 0) / d.winds.length
              : 0;

          return {
            date: d.date,
            symbol,
            minTemp,
            maxTemp,
            wind: avgWind,
          };
        });

        setForecast(dailyForecast.slice(0, 7));
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    }

    loadWeather();
  }, []);

  console.log(forecast);

  return forecast;
}
