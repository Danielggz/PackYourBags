import { useEffect, useRef, useState, useMemo } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectActivity.css"

export default function SelectActivity() {
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [maxLength, setMaxLength] = useState(100);

  //Object from API information
  type TrailFeature = {
    type: "Feature";
    geometry: { type: string; coordinates: any };
    properties: {
      OBJECTID: number;
      Name?: string;
      County?: string;
      Activity?: string;
      Description?: string;
      Difficulty?: string;
      LengthKm?: number;
      TimeToComplete?: number;
      AscentMetres?: number;
      ExternalLiks?: string;
      Website?: string;
      [key: string]: any;
    };
  };

  // States
  const [activities, setActivities] = useState<TrailFeature[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TrailFeature | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [difficulty, setDifficulty] = useState("");
  const [county, setCounty] = useState("");
  const [trailType, setTrailType] = useState("");
  const [pendingFilters, setPendingFilters] = useState(false);

  // Load map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      center: [53.3, -8.9],
      zoom: 7,
      zoomControl: false
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    setTimeout(() => {
      const url =
        "https://services-eu1.arcgis.com/CltcWyRoZmdwaB7T/ArcGIS/rest/services/GetIrelandActiveTrailRoutes/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson";

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const feats = (data.features as TrailFeature[]) || [];
          setActivities(feats);

          drawTrails(feats);
          setLoading(false);
        });
    }, 100);
  }, []);

  // Filtered activities
  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const nameMatch = a.properties.Name?.toLowerCase().includes(search.toLowerCase());

      const diffMatch = difficulty
        ? a.properties.Difficulty === difficulty
        : true;

      const countyMatch = county
        ? a.properties.County === county
        : true;

        const typeMatch = trailType
        ? a.properties.TrailType === trailType
        : true;

      const lengthValue = Number(a.properties.LengthKm);
      const lengthMatch = !isNaN(lengthValue) && lengthValue <= maxLength;

      return nameMatch && diffMatch && countyMatch && typeMatch && lengthMatch;
    });
  }, [activities, search, difficulty, county, trailType, maxLength]);

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!search) return [];
    return filtered.slice(0, 8);
  }, [search, filtered]);

  //Function to draw trail lines and starter
  function drawTrails(features: TrailFeature[]) {
    if (!mapRef.current) return;

    // Remove old layer
    if (layerRef.current) {
      mapRef.current.removeLayer(layerRef.current);
    }

    const group = L.layerGroup();

    features.forEach((feature) => {
      const isSelected =
        selected?.properties.OBJECTID === feature.properties.OBJECTID;

      // Draw trail line with highlight if selected
      const line = L.geoJSON(feature, {
        style: {
          color: isSelected ? "blue" : "green",
          weight: isSelected ? 5 : 3,
          opacity: isSelected ? 1 : 0.4
        }
      });

      // Make line clickable
      line.on("click", () => {
        handleSelect(feature);
      });

      line.addTo(group);

      // Add start marker (LineString or MultiLineString)
      if (feature.geometry) {
        let start: [number, number] | null = null;

        if (feature.geometry.type === "LineString") {
          if (feature.geometry.coordinates.length > 0) {
            start = feature.geometry.coordinates[0];
          }
        }

        if (feature.geometry.type === "MultiLineString") {
          const firstLine = feature.geometry.coordinates[0];
          if (firstLine && firstLine.length > 0) {
            start = firstLine[0];
          }
        }

        if (start) {
          const [lng, lat] = start;

          const marker = L.circleMarker([lat, lng], {
            radius: isSelected ? 7 : 4,
            color: isSelected ? "blue" : "green",
            fillColor: isSelected ? "blue" : "green",
            fillOpacity: 1,
            weight: isSelected ? 3 : 2
          });

          marker.on("click", () => handleSelect(feature));
          marker.addTo(group);
        }
      }
    });

    group.addTo(mapRef.current);
    layerRef.current = group;
  }

  //Change on selected trail
  useEffect(() => {
    drawTrails(filtered);
  }, [selected]);

  function handleSelect(activity: TrailFeature) {
    setSelected(activity);

    if (!mapRef.current) return;

    const bounds = L.geoJSON(activity).getBounds();
    mapRef.current.fitBounds(bounds);
  }

  //Apply filters button
  useEffect(() => {
    if (!pendingFilters) return;

    // Name match
    const exactMatch = activities.find(
      (a) => a.properties.Name?.toLowerCase() === search.toLowerCase()
    );

    if (exactMatch) {
      //Draw the required trail
      drawTrails([exactMatch]);

      // Zoom into trail
      const bounds = L.geoJSON(exactMatch).getBounds();
      mapRef.current?.fitBounds(bounds);

      setSelected(exactMatch);
      setPendingFilters(false);
      return;
    }

    // Show filtered trails
    drawTrails(filtered);

    // Keep full zoom
    setSelected(null);

    setPendingFilters(false);
  }, [pendingFilters]);


  async function saveTrail(selectedTrail: TrailFeature, userId: number) {
    
    //Build object for sending to backend
    const trailPayload = {
      name: selectedTrail.properties.Name,
      county: selectedTrail.properties.County,
      activityType: selectedTrail.properties.Activity,
      description: selectedTrail.properties.Description,
      difficulty: selectedTrail.properties.Difficulty,
      lengthKm: selectedTrail.properties.LengthKm,
      completionTime: selectedTrail.properties.TimeToComplete,
      ascentMetres: selectedTrail.properties.AscentMetres,
      links: selectedTrail.properties.ExternalLiks,
      website: selectedTrail.properties.Website
    };

    const res = await fetch(`http://localhost:8080/api/trails/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trailPayload)
    });

    if (res.ok) {
      console.log("Trail saved!");
    } else {
      console.error("Error saving trail");
    }
  }

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading trails…</p>
        </div>
      )}
      <div className="layout">
        <div id="map"></div>

        <div className="right-menu">
          <h2>Find an Activity</h2>

          {/* SEARCH */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              style={{ width: "100%", padding: "8px" }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="autocomplete">
                {suggestions.map((a) => (
                  <div
                    key={a.properties.OBJECTID}
                    className="autocomplete-item"
                    onClick={() => {
                      setSearch(a.properties.Name || "");
                      setShowSuggestions(false);
                    }}
                  >
                    {a.properties.Name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FILTERS */}
          <div className="filter-group">
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Any</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
              <option value="Very Challenging">Very Challenging</option>
            </select>
          </div>

          <div className="filter-group">
            <label>County</label>
            <select value={county} onChange={(e) => setCounty(e.target.value)}>
              <option value="">Any</option>
              {[...new Set(activities.map((a) => a.properties.County))].map((c) =>
                c ? <option key={c}>{c}</option> : null
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>Trail Type</label>
            <select value={trailType} onChange={(e) => setTrailType(e.target.value)}>
              <option value="">Any</option>
              {[...new Set(activities.map((a) => a.properties.TrailType)
                .filter((t) => t && ![
                  "Road Cycling Trail",
                  "Mountain Biking Trail",
                  "Horse Riding Trail",
                  "Off Road Cycling Trail",
                  "Snorkelling Trail",
                  "Paddling Trail"
                ].includes(t)))].map((t) =>
                t ? <option key={t}>{t}</option> : null
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>Max Length (km): {maxLength}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <button onClick={() => setPendingFilters(true)} style={{ width: "100%", padding: "10px", marginTop: "10px" }}>
            Apply Filters
          </button>

          {/* DETAILS */}
          {selected && (
            <div className="details-box">
              <h3>{selected.properties.Name} | {selected.properties.Activity} </h3>
              <p><strong>Length:</strong> {Number(selected.properties.LengthKm)} km</p>
              <p><strong>Type:</strong> {selected.properties.TrailType}</p>
              <p><strong>County:</strong> {selected.properties.County}</p>
              <p><strong>Difficulty:</strong> {selected.properties.Difficulty}</p>
              <p><strong>Ascent(m):</strong> {selected.properties.AscentMetres}</p>
              <p><strong>Completion(h):</strong> {selected.properties.TimeToComplete}</p>

              <button
                onClick={saveTrail}
                style={{ marginTop: "10px", padding: "10px", width: "100%" }}
              >
                Confirm Activity
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
