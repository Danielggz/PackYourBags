import React, { useState } from "react";
import "./Calendar.css";

export default function Calendar() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);

    const goPrev = () => {
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        if (prev >= minMonth) {
            setCurrentMonth(prev);
        }
    };

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

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
        const isPastDay = isCurrentMonth && d < today.getDate();

        cells.push(
            <div
                key={d}
                className={`calendar-cell ${isPastDay ? "disabled" : ""}`}
            >
                <div className="calendar-cell-header">{d}</div>
                <div className="calendar-cell-body"></div>
            </div>
        );
    }

    return (
        <div className="calendar-wrapper">
            <div className="calendar-header">
                <button 
                    className="nav-btn" 
                    onClick={goPrev}
                    disabled={currentMonth <= minMonth}
                >
                    ◀
                </button>

                <h2>{monthName} {year}</h2>

                <button
                    className="nav-btn"
                    onClick={goNext}
                    disabled={currentMonth >= maxMonth}
                >
                    ▶
                </button>
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
