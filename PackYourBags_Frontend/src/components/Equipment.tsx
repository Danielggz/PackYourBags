import { useEffect, useState } from "react";
import "./Equipment.css";
import { API_BASE_URL } from "../config/api";
import { useWeatherForecast } from "../utils/WeatherForecast";
import type { DailyWeather } from "../utils/WeatherForecast";

type EquipmentItem = {
    itemId: number;
    name: string;
    checked: boolean;
};

export default function Equipment() {

    const essentialItems: EquipmentItem[] = [
        { itemId: 1,  name: "First Aid Kit", checked: false },
        { itemId: 2,  name: "Fully Charged Phone / GPS enabled", checked: false },
        { itemId: 3, name: "Headlamp or Flashlight", checked: false },
        { itemId: 4, name: "Emergency Whistle", checked: false }
    ];

    const trail_basedItems: EquipmentItem[] = [
        { itemId: 5, name: "Water (1L minimum)", checked: false },
        { itemId: 6, name: "Water (2–3L minimum)", checked: false },
        { itemId: 7, name: "Snacks / Energy Food", checked: false },
        { itemId: 8, name: "Trekking Poles", checked: false },
        { itemId: 9, name: "Extra Layers", checked: false }
    ];

    const weather_basedItems: EquipmentItem[] = [
        { itemId: 10, name: "Waterproof Jacket", checked: false },
        { itemId: 11, name: "Rain Cover for Backpack", checked: false },
        { itemId: 12, name: "Sun Protection (hat, sunscreen)", checked: false },
        { itemId: 13, name: "Sunglasses", checked: false },
        { itemId: 14, name: "Warm Layers (fleece/jacket)", checked: false },
        { itemId: 15, name: "Gloves", checked: false },
        { itemId: 16, name: "Windproof Jacket", checked: false },
    ];

    //Dinamic lists
    const [trailItems, setTrailItems] = useState<EquipmentItem[]>([]);
    const [weatherItems, setWeatherItems] = useState<EquipmentItem[]>([]);
    //Full item list
    const [items, setItems] = useState<EquipmentItem[]>(essentialItems);
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");
    //Coordinates of main trail
    const [coords, setCoords] = useState<{ lat: number | null, lon: number | null }>({
        lat: null,
        lon: null
    });
    //Weather forecast
    const [forecastLoaded, setForecastLoaded] = useState(false);

    //Get weather hook (default coordinates to 0)
    const forecast = useWeatherForecast(coords.lat ?? 0, coords.lon ?? 0);
    
    //Fetch main trail and data
    useEffect(() => {
        async function loadTrail() {
            const res = await fetch(`${API_BASE_URL}/api/trails/getMainTrail`, {
                credentials: "include"
            });
            if (!res.ok) return;

            const trail = await res.json();
            const recommendations = getTrailRecommendations(trail);
            setTrailItems(recommendations);

            //set the coordinates
            setCoords({ lat: trail.lat, lon: trail.lon });
        }

        loadTrail();
    }, []);

    useEffect(() => {
        if (!forecast || forecast.length === 0) return;

        const weatherRec = getWeatherRecommendations(forecast);
        setWeatherItems(weatherRec);
        setForecastLoaded(true);
    }, [forecast]);

    //Load saved list from database
    useEffect(() => {
        async function loadEquipment() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/equipment/get`, {
                    credentials: "include"
                });
                if (!res.ok) return;

                const saved: EquipmentItem[] = await res.json();

                // Essentials
                setItems(prev =>
                    prev.map(item => {
                        const match = saved.find(s => s.itemId === item.itemId);
                        return match ? { ...item, checked: match.checked } : item;
                    })
                );

                // Trail items
                setTrailItems(prev =>
                    prev.map(item => {
                        const match = saved.find(s => s.itemId === item.itemId);
                        return match ? { ...item, checked: match.checked } : item;
                    })
                );

                // Weather items
                setWeatherItems(prev =>
                    prev.map(item => {
                        const match = saved.find(s => s.itemId === item.itemId);
                        return match ? { ...item, checked: match.checked } : item;
                    })
                );
            } catch (err) {
                console.error("Failed to load equipment", err);
            }
        }

        //Load when items are ready
        if (trailItems.length > 0 || weatherItems.length > 0) {
            loadEquipment();
        }
    }, [trailItems, weatherItems]);

    //Check list
    const toggleItem = (itemId: number) => {
        setItems(prev => prev.map(i => i.itemId === itemId ? { ...i, checked: !i.checked } : i));
        setTrailItems(prev => prev.map(i => i.itemId === itemId ? { ...i, checked: !i.checked } : i));
        setWeatherItems(prev => prev.map(i => i.itemId === itemId ? { ...i, checked: !i.checked } : i));
    };

    //Save selected options
    async function saveEquipment() {
        setSaving(true);
        setSavedMessage("");

        //merge lists
        const allItems = [
            ...items,        // essentials
            ...trailItems,   // trail-based
            ...weatherItems  // weather-based
        ];

        console.log(allItems);

        // Remove duplicates by itemId
        const uniqueItems = Array.from(new Map(allItems.map(i => [i.itemId, i])).values());

        try {
            await fetch(`${API_BASE_URL}/api/equipment/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(uniqueItems)
            });

            console.log(items);

            setSavedMessage("Equipment saved!");
        } catch (err) {
            console.error("Failed to save equipment", err);
            setSavedMessage("Error saving equipment");
        }

        setSaving(false);

        setTimeout(() => setSavedMessage(""), 2000);
    }

    //Get recommendations based on the main trail
    function getTrailRecommendations(trail: any): EquipmentItem[] {
        const rec: EquipmentItem[] = [];

        // Distance-based
        if (trail.lengthKm > 5 && trail.lengthKm < 10) {
            rec.push(trail_basedItems.find(i => i.itemId === 5)!); // 1L Water
            rec.push(trail_basedItems.find(i => i.itemId === 7)!); // Snacks
        }
        if (trail.lengthKm > 10 && trail.lengthKm < 15) {
            rec.push(trail_basedItems.find(i => i.itemId === 6)!); // 2-3L Water
            rec.push(trail_basedItems.find(i => i.itemId === 7)!); // Snacks
        }
        if (trail.lengthKm > 15) {
            rec.push(trail_basedItems.find(i => i.itemId === 6)!); // 2-3L Water
            rec.push(trail_basedItems.find(i => i.itemId === 7)!); // Snacks
            rec.push(trail_basedItems.find(i => i.itemId === 9)!); // Extra layers
        }

        // Ascent-based
        if (trail.ascentMetres > 200) {
            rec.push(trail_basedItems.find(i => i.itemId === 8)!); // Trekking poles
        }
        if (trail.ascentMetres > 500) {
            rec.push(trail_basedItems.find(i => i.itemId === 9)!); // Extra layers
        }

        // Remove duplicates
        return Array.from(new Map(rec.map(i => [i.itemId, i])).values());
    }

    function getWeatherRecommendations(forecast: DailyWeather[]): EquipmentItem[] {
        if (!forecast || forecast.length === 0) return [];

        const nextDays = forecast.slice(0, 3);

        const willRain = nextDays.some(d => d.symbol.includes("rain"));
        const willBeSunny = nextDays.some(d => d.symbol.includes("sun"));
        const willBeCold = nextDays.some(d => d.maxTemp < 5);
        const willBeWindy = nextDays.some(d => d.wind > 20);

        const recommendations: EquipmentItem[] = [];

        if (willRain) {
            recommendations.push(weather_basedItems.find(i => i.itemId === 10)!); //Waterproof Jacket
            recommendations.push(weather_basedItems.find(i => i.itemId === 11)!); //Rain Cover for Backpack
        }

        if (willBeSunny) {
            recommendations.push(weather_basedItems.find(i => i.itemId === 12)!); //Sun Protection (hat, sunscreen)
            recommendations.push(weather_basedItems.find(i => i.itemId === 13)!); //Sunglasses
        }

        if (willBeCold) {
            recommendations.push(weather_basedItems.find(i => i.itemId === 14)!); //Warm Layers (fleece/jacket)
            recommendations.push(weather_basedItems.find(i => i.itemId === 15)!); //Gloves
        }

        if (willBeWindy) {
            recommendations.push(weather_basedItems.find(i => i.itemId === 16)!); //WindProof jacket
        }

        return Array.from(new Map(recommendations.map(i => [i.itemId, i])).values());
    }

    return (
        <div className="equipment-container">
            <h2>Essential Hiking Equipment</h2>
            <p className="equipment-subtitle">
                Basic items for every activity outdoors
            </p>

            <div className="equipment-list">
                {items.map(item => (
                    <label key={item.itemId} className="equipment-item">
                        <span className={`checkbox ${item.checked ? "checked" : ""}`}></span>
                        <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.itemId)} />
                        <span className="equipment-name">{item.name}</span>
                    </label>
                ))}
            </div>

            <br/>

            <h3>Recommended for This Trail</h3>
            <p className="equipment-subtitle">
                Recommended for the main trail difficulty (length and ascension)
            </p>

            <div className="equipment-list">
                {trailItems.map(item => (
                    <label key={item.itemId} className="equipment-item">
                        <span className={`checkbox ${item.checked ? "checked" : ""}`}></span>
                        <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.itemId)} />
                        <span className="equipment-name">{item.name}</span>
                    </label>
                ))}
            </div><br/>

            <h3>Weather‑Based Recommendations</h3>
            <p className="equipment-subtitle">
                Recommended based on the current weather predictions for the trail
            </p>

            {!forecastLoaded && (
                <p className="equipment-subtitle">Weather forecast not available yet...</p>
            )}

            {forecastLoaded && weatherItems.length === 0 && (
                <p className="equipment-subtitle">No weather‑specific gear needed.</p>
            )}

            <div className="equipment-list">
                {weatherItems.map(item => (
                    <label key={item.itemId} className="equipment-item">
                        <span className={`checkbox ${item.checked ? "checked" : ""}`}></span>
                        <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.itemId)} />
                        <span className="equipment-name">{item.name}</span>
                    </label>
                ))}
            </div><br/>

            <div className="btnSaveEquipment">
                <button type="button" className="btn btn-primary" onClick={saveEquipment} disabled={saving} >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div><br/>

            {savedMessage && (
                <p className="save-message">
                    <span className="alert alert-success">{savedMessage}</span>
                </p>
            )}
        </div>
    );
}
