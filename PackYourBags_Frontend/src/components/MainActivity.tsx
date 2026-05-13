import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config/api";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MainActivity.css"
// import { API_BASE_URL } from "../config/api";

//Object for normalize properties
type TrailFeature = {
    type: "Feature";
    geometry: { type: string; coordinates: any };
    properties: {
        TrailID: number;
        Name?: string;
        County?: string;
        Activity?: string;
        Description?: string;
        Difficulty?: string;
        LengthKm?: number;
        TimeToComplete?: string;
        AscentMetres?: number;
        ExternalLinks?: string;
        Website?: string;
        [key: string]: any;
    };
};

export default function MainActivity() {
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<L.LayerGroup | null>(null);

    const [trail, setTrail] = useState<TrailFeature | null>(null);

    // Load map for the main trail
    useEffect(() => {
        if (mapRef.current) return;
        const map = L.map("main-map", {
            center: [53.3, -8.9],
            zoom: 7,
            zoomControl: false
        });
        mapRef.current = map;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }).addTo(map);
    }, []);

    //Load trail
    useEffect(() => {
        async function loadTrail() {
            try {
                //Get trail info from backend
                const trailData = await getTrailInfo();
                const trailID = trailData.idTrail;
                //Send api request with the right id for trail
                const url = `https://services-eu1.arcgis.com/CltcWyRoZmdwaB7T/ArcGIS/rest/services/GetIrelandActiveTrailRoutes/FeatureServer/0/query?where=TrailID%3D${trailID}&outFields=*&f=geojson`;
                const res = await fetch(url);
                const data = await res.json();

                if (!data.features || data.features.length === 0) {
                    console.error("Trail not found");
                    return;
                }
                const feature = data.features[0];
                //Normalize feature for map
                const normalized: TrailFeature = {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        trailID: Number(
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
    }, []);


    // Draw a single trail
    function drawTrail(feature: TrailFeature) {
        if (!mapRef.current) return;
        // Remove old layer
        if (layerRef.current) {
            mapRef.current.removeLayer(layerRef.current);
        }
        const group = L.layerGroup();
        // Draw line
        const line = L.geoJSON(feature, {
            style: {
                color: "blue",
                weight: 5,
                opacity: 1
            }
        });
        line.addTo(group);

        // Add start marker
        let start: [number, number] | null = null;
        if (feature.geometry.type === "LineString") {
            start = feature.geometry.coordinates[0];
        }
        if (feature.geometry.type === "MultiLineString") {
            const firstLine = feature.geometry.coordinates[0];
            if (firstLine && firstLine.length > 0) {
                start = firstLine[0];
            }
        }
        if (start) {
            const [lng, lat] = start;
            L.circleMarker([lat, lng], {
                radius: 6,
                color: "blue",
                fillColor: "blue",
                fillOpacity: 1
            }).addTo(group);
        }

        group.addTo(mapRef.current);
        layerRef.current = group;

        // Fit map to trail
        const bounds = L.geoJSON(feature).getBounds();
        setTimeout(() => {
            mapRef.current!.invalidateSize();
            mapRef.current!.fitBounds(bounds, { padding: [40, 40] });
        }, 100);
            }

    //Get info from backend and return as json
    async function getTrailInfo() {
        const res = await fetch(`${API_BASE_URL}/api/trails/getMainTrail`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include" //Session
              });
        return await res.json();
    }

    return (
        <div className="main-activity-container">

            {/* MAP */}
            <div id="main-map"></div>

            {/* INFO PANEL */}
            {trail && (
                <div className="trail-info-panel">
                    <div className="trail-info-card">
                        <h2>{trail.properties.Name}</h2>
                        <p><strong>County:</strong> {trail.properties.County}</p>
                        <p><strong>Difficulty:</strong> {trail.properties.Difficulty}</p>
                        <p><strong>Length:</strong> {trail.properties.LengthKm} km</p>
                        <p><strong>Ascent:</strong> {trail.properties.AscentMetres} m</p>
                        <p><strong>Estimated Time:</strong> {trail.properties.TimeToComplete}</p>
                        <p><strong>Description:</strong> {trail.properties.Description}</p>
                        {trail.properties.Website && (
                            <p>
                                <a href={trail.properties.Website} target="_blank" rel="noreferrer">
                                    Visit Website
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );

}
