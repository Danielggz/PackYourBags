import { useState, useEffect } from "react";
import "./Calendar.css";
import { WeatherForecast } from "../utils/WeatherForecast";
import { API_BASE_URL } from "../config/api";

import sun from "../assets/icons/sun.png";
import drizzleSun from "../assets/icons/drizzle-sun.png"
import cloudy from "../assets/icons/cloudy.png";
import partialCloudy from "../assets/icons/partial-cloudy.png";
import lightRain from "../assets/icons/light-rain.png";
import rain from "../assets/icons/rain.png";
import heavyRain from "../assets/icons/heavy-rain.png";
import sleet from "../assets/icons/sleet.png";
import snowflake from "../assets/icons/snowflake.png";
import thunderstorm from "../assets/icons/thunderstorm.png";


export default function Calendar({ setActiveTab }: { setActiveTab: (tab: string) => void }) {

    //state for trails
    const [activities, setActivities] = useState<any[]>([]);

    //Symbols for weather display
    const symbolToIcon: Record<string, string> = {
        Sun: sun,
        DrizzleSun: drizzleSun,
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

    useEffect(() => {
        async function loadActivities() {
            const data = await getAllActivities();
            setActivities(data);
        }
        loadActivities();
    }, []);

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

    //Use trail information to generate date objects
    const activitiesByDate: Record<string, any[]> = {};
    activities.forEach((a) => {
        if (!a || !a.plannedActivityDate) return;

        //Format date to the right way (dd-mm-yyyy)
        const isoDate = new Date(a.plannedActivityDate).toISOString().split("T")[0];

        if (!activitiesByDate[isoDate]) {
            activitiesByDate[isoDate] = [];
        }

        //Use trailType to check for type of training and set title
        let title = "Activity";
            if (a.trailType === "Main") title = "Main Trail";
            if (a.trailType === "Training") title = "Training Trail";

            // Push info object
            activitiesByDate[isoDate].push({
                title: title,
                name: a.name,
                trailType: a.trailType,
                idTrail: a.idTrail
            });
    });

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
        cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    // Generate day tiles
    for (let d = 1; d <= daysInMonth; d++) {
        const isPastDay = isCurrentMonth && d < today.getDate();

        const dateObj = new Date(year, currentMonth.getMonth(), d);
        //Format date
        const isoDate = dateObj.toISOString().split("T")[0];
        const weather = getWeatherForDate(dateObj);

        cells.push(
            <div key={d} className={`calendar-cell ${isPastDay ? "disabled" : ""}`} >
                <div className="calendar-cell-header">
                    {d}
                    {/* Add symbols for weather */}
                    {weather && (
                        <div className="weather-icon">
                            <img src={symbolToIcon[weather.symbol] || "?"} alt={weather.symbol} className="weather-icon-img" />
                        </div>
                    )}
                </div>

                <div className="calendar-cell-body">
                    {/* Add Trail activity */}
                    {activitiesByDate[isoDate] &&
                        activitiesByDate[isoDate].map((act, idx) => (
                            <div key={idx} className="activity-box" onClick={() => goToActivity(act)} >
                                <div className="activity-title">{act.title}</div>
                                <div className="activity-name">{act.name}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
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

    function getWeatherForDate(date: Date) {
        const d = date.toISOString().split("T")[0];
        return forecast.find((f) => f.date === d);
    }

    //Call backend to retrieve user's activities
    async function getAllActivities(){
        const res = await fetch(`${API_BASE_URL}/api/trails/getAllTrails`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        return await res.json();
    }

    //Redirect to locations
    function goToActivity(act: any) {
        console.log("here!");
        if (act.trailType === "Main") {
            setActiveTab("main");
        } else if (act.trailType === "Training") {
            setActiveTab("trainings");
        }
    }
}
