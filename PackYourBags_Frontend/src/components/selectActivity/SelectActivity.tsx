import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./selectActivity.css";

export default function SelectActivity() {
    const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Only create the map once
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
        L.geoJSON(data, {
          style: {
            color: "green",
            weight: 4
          },
          onEachFeature: (feature, layer) => {
            layer.on("click", () => {
              console.log("Trail clicked:", feature.properties);
            });
          }
        }).addTo(map);
      });
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                PackYourBags <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Select Activity</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Main Menu</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <button id="btnSelect" className="btn btn-primary">
          Select Activity
        </button>

        <div id="map" style={{ width: "1200px", height: "800px", marginTop: "20px" }}></div>
      </div>
    </div>
  );
}
