import { useState } from "react";
import "./Calendar.css";
import { WeatherForecast } from "../utils/WeatherForecast";

import sun from "../assets/icons/sun.png";
import cloudy from "../assets/icons/cloudy.png";
import partialCloudy from "../assets/icons/partial-cloudy.png";
import lightRain from "../assets/icons/light-rain.png";
import rain from "../assets/icons/rain.png";
import heavyRain from "../assets/icons/heavy-rain.png";
import sleet from "../assets/icons/sleet.png";
import snowflake from "../assets/icons/snowflake.png";
import thunderstorm from "../assets/icons/thunderstorm.png";


export default function Calendar() {

    //Symbols for weather display
    const symbolToIcon: Record<string, string> = {
        Sun: sun,
        Cloud: cloudy,
        LightCloud: partialCloudy,
        PartlyCloud: partialCloudy,
        LightRain: lightRain,
        Rain: rain,
        HeavyRain: heavyRain,
        Sleet: sleet,
        Snow: snowflake,
        Thunderstorm: thunderstorm,
    };

    const forecast = WeatherForecast();

    //New date obj
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    //Only show months for this month + three next
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);

    //Move to next month
    const goPrev = () => {
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        if (prev >= minMonth) {
            setCurrentMonth(prev);
        }
    };

    //Move to previous month
    const goNext = () => {
        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        if (next <= maxMonth) {
            setCurrentMonth(next);
        }
    };

    const monthName = currentMonth.toLocaleString("default", { month: "long" });
    const year = currentMonth.getFullYear();

    // Build calendar grid
    const firstDay = new Date(year, currentMonth.getMonth(), 1);
    const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();

    const isCurrentMonth =
        currentMonth.getFullYear() === today.getFullYear() &&
        currentMonth.getMonth() === today.getMonth();

    const cells = [];

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
        cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    // Generate day tiles
    for (let d = 1; d <= daysInMonth; d++) {
        const isPastDay = isCurrentMonth && d < today.getDate();

        const dateObj = new Date(year, currentMonth.getMonth(), d);
        const weather = getWeatherForDate(dateObj);

        cells.push(
            <div key={d} className={`calendar-cell ${isPastDay ? "disabled" : ""}`} >
                <div className="calendar-cell-header">
                    {d}

                    {weather && (
                        <div className="weather-icon">
                            <img src={symbolToIcon[weather.symbol] || "?"} alt={weather.symbol} className="weather-icon-img" />
                        </div>
                    )}
                </div>

                <div className="calendar-cell-body"></div>
            </div>
        );
    }

    function getWeatherForDate(date: Date) {
        const d = date.toISOString().split("T")[0];
        return forecast.find((f) => f.date === d);
    }

    return (
        <div className="calendar-wrapper">
            <div className="calendar-header">
                <button  className="nav-btn"  onClick={goPrev} disabled={currentMonth <= minMonth} > ◀ </button>
                <h2>{monthName} {year}</h2>
                <button className="nav-btn" onClick={goNext} disabled={currentMonth >= maxMonth} > ▶ </button>
            </div>

            <div className="calendar-grid">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                    <div key={d} className="calendar-day-label">{d}</div>
                ))}
                {cells}
            </div>
        </div>
    );
}
