import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config/api";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TrainingPlan.css";

type TrailFeature = {
    type: "Feature";
    geometry: { type: string; coordinates: any };
    properties: {
        TrailID: number;
        Name?: string;
        County?: string;
        Difficulty?: string;
        LengthKm?: number;
        TimeToComplete?: string;
        AscentMetres?: number;
        Description?: string;
        [key: string]: any;
    };
};

export default function TrainingPlan() {
    const [trainingTrailIds, setTrainingTrailIds] = useState<number[]>([]);

    // Load training trails from backend
    useEffect(() => {
        async function loadTrainingTrails() {
            try {
                const trainingsData = await getTrainingTrailsInfo();
                console.log("TRAINING TRAILS:", trainingsData);

                // Extract IDs from backend objects
                const ids = trainingsData.map((t: any) => t.idTrail);
                setTrainingTrailIds(ids);
            } catch (err) {
                console.error("Failed to load training trails:", err);
            }
        }

        loadTrainingTrails();
    }, []);

    return (
        <div className="training-plan-container">
            <h2>Your Training Plan</h2>

            {trainingTrailIds.length === 0 && (
                <p>No trainings assigned yet.</p>
            )}

            {trainingTrailIds.map((id) => (
                <TrainingPlanItem key={id} trailId={id} />
            ))}
        </div>
    );
}

function TrainingPlanItem({ trailId }: { trailId: number }) {
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<L.LayerGroup | null>(null);
    const [trail, setTrail] = useState<TrailFeature | null>(null);

    // Create map
    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map(`training-map-${trailId}`, {
                center: [53.3, -8.9],
                zoom: 7,
                zoomControl: false
            });
            mapRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19
            }).addTo(map);
        }
    }, [trailId]);

    // Fetch trail geometry from ArcGIS
    useEffect(() => {
        const url =
            `https://services-eu1.arcgis.com/CltcWyRoZmdwaB7T/ArcGIS/rest/services/GetIrelandActiveTrailRoutes/FeatureServer/0/query?where=TrailID%3D${trailId}&outFields=*&f=geojson`;

        async function loadTrail() {
            try {
                const res = await fetch(url);
                const data = await res.json();

                if (!data.features || data.features.length === 0) return;

                const feature = data.features[0];

                const normalized: TrailFeature = {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        TrailID: Number(
                            feature.properties.TrailID ??
                            feature.properties.trailid ??
                            feature.properties.TRAILID ??
                            feature.properties.TrailId
                        )
                    }
                };

                setTrail(normalized);
                drawTrail(normalized);
            } catch (err) {
                console.error("Failed to load trail:", err);
            }
        }

        loadTrail();
    }, [trailId]);

    // Draw trail on map
    function drawTrail(feature: TrailFeature) {
        if (!mapRef.current) return;

        if (layerRef.current) {
            mapRef.current.removeLayer(layerRef.current);
        }

        const group = L.layerGroup();

        const line = L.geoJSON(feature, {
            style: {
                color: "green",
                weight: 4,
                opacity: 0.9
            }
        });

        line.addTo(group);

        let start: [number, number] | null = null;

        if (feature.geometry.type === "LineString") {
            start = feature.geometry.coordinates[0];
        }

        if (feature.geometry.type === "MultiLineString") {
            const firstLine = feature.geometry.coordinates[0];
            if (firstLine && firstLine.length > 0) start = firstLine[0];
        }

        if (start) {
            const [lng, lat] = start;
            L.circleMarker([lat, lng], {
                radius: 5,
                color: "green",
                fillColor: "green",
                fillOpacity: 1
            }).addTo(group);
        }

        group.addTo(mapRef.current);
        layerRef.current = group;

        const bounds = L.geoJSON(feature).getBounds();
        mapRef.current.fitBounds(bounds);
    }

    return (
        <div className="training-item">
            <div id={`training-map-${trailId}`} className="training-map"></div>

            {trail && (
                <div className="training-info">
                    <h3>{trail.properties.Name}</h3>
                    <p><strong>County:</strong> {trail.properties.County}</p>
                    <p><strong>Difficulty:</strong> {trail.properties.Difficulty}</p>
                    <p><strong>Length:</strong> {trail.properties.LengthKm} km</p>
                    <p><strong>Ascent:</strong> {trail.properties.AscentMetres} m</p>
                    <p><strong>Time:</strong> {trail.properties.TimeToComplete}</p>
                </div>
            )}
        </div>
    );
}

async function getTrainingTrailsInfo() {
    const res = await fetch(`${API_BASE_URL}/api/trails/getTrainingTrails`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    return await res.json();
}
