import { useState } from "react";
import "./MainMenu.css";

import Calendar from "./Calendar";
import MainActivity from "./MainActivity";
import TrainingPlan from "./TrainingPlan";
import Equipment from "./Equipment";

export default function MainMenu() {
    const [activeTab, setActiveTab] = useState("calendar");

    const renderContent = () => {
        switch (activeTab) {
            case "calendar":
                return <Calendar />;
            case "main":
                return <MainActivity />;
            case "training":
                return <TrainingPlan />;
            case "equipment":
                return <Equipment />;
            default:
                return null;
        }
    };

    return (
        <div className="main-menu-container">
            <div className="side-panel">
                <h2 className="menu-title">Menu</h2>

                <button 
                    className={`menu-btn ${activeTab === "calendar" ? "active" : ""}`}
                    onClick={() => setActiveTab("calendar")}
                >
                    Calendar
                </button>

                <button 
                    className={`menu-btn ${activeTab === "main" ? "active" : ""}`}
                    onClick={() => setActiveTab("main")}
                >
                    Main Activity
                </button>

                <button 
                    className={`menu-btn ${activeTab === "training" ? "active" : ""}`}
                    onClick={() => setActiveTab("training")}
                >
                    Training Plan
                </button>

                <button 
                    className={`menu-btn ${activeTab === "equipment" ? "active" : ""}`}
                    onClick={() => setActiveTab("equipment")}
                >
                    Equipment
                </button>
            </div>

            <div className="content-panel">
                {renderContent()}
            </div>
        </div>
    );
}
