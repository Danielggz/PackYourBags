import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectActivity.css";

export default function SelectActivity() {
  const mapRef = useRef<L.Map | null>(null);

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
        // Draw the full line layer
        L.geoJSON(data, {
          style: {
            color: "green",
            weight: 4
          }
        }).addTo(map);
      });
  }, []);


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* navbar unchanged */}
      </nav>

      <div className="container">
        <button id="btnSelect" className="btn btn-primary">
          Select Activity
        </button>

        <div
          id="map"
          style={{ width: "1200px", height: "800px", marginTop: "20px" }}
        ></div>
      </div>
    </div>
  );
}
