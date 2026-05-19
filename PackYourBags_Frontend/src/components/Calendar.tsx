import { useState, useEffect } from "react";
import "./Calendar.css";
import { useWeatherForecast } from "../utils/WeatherForecast";
import type { DailyWeather } from "../utils/WeatherForecast";
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
    //Modal
    const [selectedWeather, setSelectedWeather] = useState<DailyWeather | null>(null);
    const [showWeatherModal, setShowWeatherModal] = useState(false);

    //Symbols for weather display
    const symbolToIcon: Record<string, string> = {
        Sun: sun,
        DrizzleSun: drizzleSun,
        Cloud: cloudy,
        LightCloud: partialCloudy,
        PartlyCloud: partialCloudy,
        Drizzle: lightRain,
        LightRain: lightRain,
        Rain: rain,
        HeavyRain: heavyRain,
        Sleet: sleet,
        Snow: snowflake,
        Thunderstorm: thunderstorm,
    };


    useEffect(() => {
        async function loadActivities() {
            const data = await getAllActivities();
            setActivities(data);
        }
        loadActivities();
    }, []);

    //get main trail
    const mainTrail = activities.find(a => a.trailType === "Main");

    const lat = mainTrail?.lat;
    const lon = mainTrail?.lon;

    //Call hook with main trail coordinates
    let forecast: DailyWeather[] = [];
    //Check if lat and lon are defined
    if (lat !== undefined && lon !== undefined) {
        forecast = useWeatherForecast(lat, lon);
    }

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

                {/* Empty cells before first day */}
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-cell empty"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(year, currentMonth.getMonth(), day);
                    const isoDate = dateObj.toISOString().split("T")[0];
                    const weather = getWeatherForDate(dateObj);

                    const isPastDay =
                        isCurrentMonth && day < today.getDate();

                    return (
                        <div key={day} className={`calendar-cell ${isPastDay ? "disabled" : ""}`}>
                            <div className="calendar-cell-header">
                                {day}

                                {weather && (
                                    <div className="weather-icon">
                                        <img src={symbolToIcon[weather.symbol]} alt={weather.symbol} className="weather-icon-img" style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedWeather(weather);
                                                setShowWeatherModal(true);
                                            }}/>
                                    </div>
                                )}
                            </div>

                            <div className="calendar-cell-body">
                                {activitiesByDate[isoDate] &&
                                    activitiesByDate[isoDate].map((act, idx) => (
                                        <div key={idx} className="activity-box" onClick={() => goToActivity(act)} >
                                            <div className="activity-title">{act.title}</div>
                                            <div className="activity-name">{act.name}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showWeatherModal && selectedWeather && (
            <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }} onClick={() => setShowWeatherModal(false)} >
                <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()} >
                    <div className="modal-content weather-modal">

                        <div className="modal-header weather-modal-header">
                            <h5 className="modal-title">
                                Weather for {selectedWeather.date}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowWeatherModal(false)} ></button>
                        </div>

                        <div className="modal-body weather-modal-body">

                            <div className="weather-modal-icon-wrapper">
                                <img src={symbolToIcon[selectedWeather.symbol]} alt={selectedWeather.symbol} className="weather-modal-icon"/>
                                <div className="weather-modal-symbol">
                                    {selectedWeather.symbol}
                                </div>
                            </div>

                            <div className="weather-modal-details">
                                <p><strong>Min Temp:</strong> {selectedWeather.minTemp}°C</p>
                                <p><strong>Max Temp:</strong> {selectedWeather.maxTemp}°C</p>
                                <p><strong>Wind Speed:</strong> {selectedWeather.wind} km/h </p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowWeatherModal(false)} >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        )}
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
        if (act.trailType === "Main") {
            setActiveTab("main");
        } else if (act.trailType === "Training") {
            setActiveTab("trainings");
        }
    }
}
