import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectActivity.css";

export default function SelectActivity() {
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);

  type TrailFeature = {
    type: "Feature";
    geometry: {
      type: string;
      coordinates: any;
    };
    properties: {
      OBJECTID: number;
      Name?: string;
      Length_km?: number;
      TrailType?: string;
      County?: string;
      [key: string]: any;
    };
  };

  const [activities, setActivities] = useState<TrailFeature[]>([]);
  const [filtered, setFiltered] = useState<TrailFeature[]>([]);
  const [selected, setSelected] = useState<TrailFeature | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      center: [53.3, -8.9],
      zoom: 7
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    const url =
      "https://services-eu1.arcgis.com/CltcWyRoZmdwaB7T/ArcGIS/rest/services/GetIrelandActiveTrailRoutes/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setActivities((data.features as TrailFeature[]) || []);
        setFiltered((data.features as TrailFeature[]) || []);

        const layer = L.geoJSON(data, {
          style: {
            color: "green",
            weight: 4
          }
        }).addTo(map);

        layerRef.current = layer;
      });
  }, []);

  // Filter logic
  useEffect(() => {
    const s = search.toLowerCase();
    const result = activities.filter((f) =>
      f?.properties?.Name?.toLowerCase().includes(s)
    );
    setFiltered(result);
  }, [search, activities]);

  // Zoom to selected activity
  function handleSelect(activity: TrailFeature) {
    setSelected(activity);

    if (!mapRef.current) return;

    const bounds = L.geoJSON(activity).getBounds();
    mapRef.current.fitBounds(bounds);
  }

  function confirmActivity() {
    alert("Activity confirmed: " + selected?.properties?.Name);
  }

  return (
    <div className="activity-layout">
      {/* SIDE MENU */}
      <div className="side-menu">
        <h3>Activities</h3>

        <input
          type="text"
          placeholder="Search activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="activity-list">
          {filtered.map((a) => (
            <div
              key={a?.properties?.OBJECTID}
              className="activity-item"
              onClick={() => handleSelect(a)}
            >
              {a?.properties?.Name || "Unnamed Activity"}
            </div>
          ))}
        </div>

        {selected && (
          <div className="activity-details">
            <h4>{selected?.properties?.Name}</h4>
            <p><strong>Length:</strong> {selected?.properties?.Length_km} km</p>
            <p><strong>Type:</strong> {selected?.properties?.TrailType}</p>
            <p><strong>County:</strong> {selected?.properties?.County}</p>

            <button className="btn btn-success" onClick={confirmActivity}>
              Confirm Activity
            </button>
          </div>
        )}
      </div>

      {/* MAP */}
      <div
        id="map"
        style={{ width: "100%", height: "100vh", marginLeft: "300px" }}
      ></div>
    </div>
  );
}
