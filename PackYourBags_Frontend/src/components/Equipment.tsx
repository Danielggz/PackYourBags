import { useState } from "react";
import "./Equipment.css";

export default function Equipment() {

    const initialItems = [
        { id: 1, label: "Hiking Boots / Trail Shoes", checked: false },
        { id: 2, label: "Weather‑appropriate Clothing (layers)", checked: false },
        { id: 3, label: "Waterproof Jacket", checked: false },
        { id: 4, label: "Backpack (20–30L)", checked: false },
        { id: 5, label: "Water (1–2L minimum)", checked: false },
        { id: 6, label: "Snacks / Energy Food", checked: false },
        { id: 7, label: "Map or GPS‑enabled Phone", checked: false },
        { id: 8, label: "Fully Charged Phone", checked: false },
        { id: 9, label: "First Aid Kit", checked: false },
        { id: 10, label: "Headlamp or Flashlight", checked: false },
        { id: 11, label: "Sun Protection (hat, sunscreen)", checked: false },
        { id: 12, label: "Emergency Whistle", checked: false }
    ];

    const [items, setItems] = useState(initialItems);

    const toggleItem = (id: number) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    return (
        <div className="equipment-container">
            <h2>Essential Hiking Equipment</h2>
            <p className="equipment-subtitle">
                Tick the items you already have. This list covers the basics needed for safe hiking.
            </p>

            <div className="equipment-list">
                {items.map(item => (
                    <label key={item.id} className="equipment-item">
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                        />
                        <span className="equipment-label">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}