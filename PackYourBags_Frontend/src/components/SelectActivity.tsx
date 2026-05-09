import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectActivity.css"

//Object from API information
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

//Global variable for trail api info
let GLOBAL_TRAILS: TrailFeature[] = [];

export default function SelectActivity() {
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [maxLength, setMaxLength] = useState(100);
  const navigate = useNavigate();

  // States
  const [activities, setActivities] = useState<TrailFeature[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTrail, setSelectedTrail] = useState<TrailFeature | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

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
        "https://services-eu1.arcgis.com/CltcWyRoZmdwaB7T/ArcGIS/rest/services/GetIrelandActiveTrailRoutes/FeatureServer/0/query?where=TrailActivity='Walking'&outFields=*&f=geojson";

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          //Save all trails in object and filter by TrailId rather than OBJECTID
          const allTrails = data.features.map((f: any) => {
            const p = f.properties;
            return {
              ...f,
              properties: {
                ...p,
                TrailID: Number(p.TrailID ?? p.trailid ?? p.TRAILID ?? p.TrailId),
              }
            };
          });

          GLOBAL_TRAILS = allTrails; //Store all trails at global variable

          setActivities(allTrails);

          //Send data to draw the trails into the map
          drawTrails(allTrails);
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

  // Autocomplete suggestions at select
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
        selectedTrail?.properties.TrailID === feature.properties.TrailID;

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
        focusTrail(feature);
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

          marker.on("click", () => focusTrail(feature));
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
  }, [selectedTrail]);

  //Function to set a selected trail and focus on map
  function focusTrail(activity: TrailFeature) {
    setSelectedTrail(activity);
    //Check if map exists
    if (!mapRef.current) return;
    //Focus on trail
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
      setSelectedTrail(exactMatch);
      setPendingFilters(false);
      return;
    }

    // Show filtered trails
    drawTrails(filtered);

    // Keep full zoom
    setSelectedTrail(null);

    setPendingFilters(false);
  }, [pendingFilters]);

  async function saveTrail(selectedTrail: TrailFeature) {
    //Build object for sending to backend
    const trailData = formatTrailData(selectedTrail, "Main");

    const res = await fetch(`http://localhost:8080/api/trails/saveTrail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(trailData)
    });

    if (res.ok) {
      //Store newly created main trail
      const savedTrail = await res.json();
      //Generate new plan based on the main trail selected
      generateTrainingPlan(savedTrail.idTrail, savedTrail.plannedActivityDate)
    } else {
      console.error("Error saving trail");
    }

  }

  async function generateTrainingPlan(trailId: number, plannedDate: string){
    //Function to call backend to generate training plans based on the main selected

    const mainTrail = activities.find(t => t.properties.TrailID === trailId);
    if (!mainTrail) return;

    // Filter by county (wait for response from backend)
    const userCounty = await getCurrentUserCounty();

    const candidates = GLOBAL_TRAILS
      .filter(t => t.properties.County == userCounty)
      .filter(t => t.properties.LengthKm! < mainTrail.properties.LengthKm!)
      .sort((a, b) => a.properties.LengthKm! - b.properties.LengthKm!);

    console.log(candidates);

    const weekendDates = computeUpcomingWeekends(plannedDate);

    // Apply 80/70/60% rules
    const caps = [0.80, 0.70, 0.60];
    const selectedTrainings: any[] = []; //obj array

    for (let i = 0; i < weekendDates.length; i++) {
      const maxKm = mainTrail.properties.LengthKm! * caps[i];

      const pick = candidates
        .filter(t => t.properties.LengthKm! <= maxKm)
        .sort((a, b) => b.properties.LengthKm! - a.properties.LengthKm!)[0];

      if (pick) {
        //Format into object
        let formattedPick = formatTrailData(pick, "Training");
        //Add objective date to the object
        formattedPick.plannedActivityDate = weekendDates[i];
        selectedTrainings.push(formattedPick);
        candidates.splice(candidates.indexOf(pick), 1);
      }
    }

    //Send all training trails to backend in a call
    const res = await fetch("http://localhost:8080/api/trails/saveTrainingTrails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(selectedTrainings)
    });

    if (res.ok) {
      console.log(res);
      //if training plans are already generated, it goes to the main menu
      navigate("/mainMenu")
    } else {
      console.error("Error saving trail");
    }
  }

  //Function to check if value is a number or not (api data clean)
  function toNumberOrNull(value: any): number | null {
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  function computeUpcomingWeekends(targetDateStr: string): string[] {
    const weekends: string[] = [];
    const targetDate = new Date(targetDateStr);
    let cur = new Date(); // today
    const maxDays = 3;

    while (cur < targetDate && weekends.length < maxDays) {
      if (cur.getDay() === 6) { // Saturday = 6
        weekends.push(cur.toISOString().split("T")[0]);
      }
      cur.setDate(cur.getDate() + 1);
    }

    return weekends;
  }

  async function getCurrentUserCounty() {
    //Gets the user in session and returns its county
    try {
      const res = await fetch("http://localhost:8080/api/users/getUserData", {
        credentials: "include"
      });
      const data = await res.json();
      return data.county;
    } catch (err) {
      console.error("Failed to load user info", err);
      return null;
    }
  }

  function formatTrailData(selectedTrail: TrailFeature, trailType: String){
    //Method to format the data to fit database expected values
    const trailData = {
      idTrail: selectedTrail.properties.TrailID,
      name: selectedTrail.properties.Name,
      county: selectedTrail.properties.County,
      activityType: selectedTrail.properties.Activity,
      description: selectedTrail.properties.Description,
      difficulty: selectedTrail.properties.Difficulty,
      lengthKm: toNumberOrNull(selectedTrail.properties.LengthKm), //Clean in case is string
      completionTime: selectedTrail.properties.TimeToComplete,
      ascentMetres: toNumberOrNull(selectedTrail.properties.AscentMetres), //Clean in case is string
      SI_website: selectedTrail.properties.Website,
      links: selectedTrail.properties.ExternalLinks,
      //Get planned date from state
      plannedActivityDate: selectedDate,
      trailType: trailType
    };

    return trailData;
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
            <input type="text" placeholder="Search by name..." value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              style={{ width: "100%", padding: "8px" }}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="autocomplete">
                {suggestions.map((a) => (
                  <div key={a.properties.OBJECTID} className="autocomplete-item"
                    onClick={() => {
                      setSearch(a.properties.Name || "");
                      setShowSuggestions(false);
                    }}>
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
            <input type="range" min="1" max="100" value={maxLength} onChange={(e) => setMaxLength(Number(e.target.value))} style={{ width: "100%" }}/>
          </div>

          <button onClick={() => setPendingFilters(true)} style={{ width: "100%", padding: "10px", marginTop: "10px" }}>
            Apply Filters
          </button>

          {/* DETAILS */}
          {selectedTrail && (
            <div className="details-box">
              <h3>{selectedTrail.properties.Name} | {selectedTrail.properties.Activity} </h3>
              <p><strong>Length:</strong> {Number(selectedTrail.properties.LengthKm)} km</p>
              <p><strong>Type:</strong> {selectedTrail.properties.TrailType}</p>
              <p><strong>County:</strong> {selectedTrail.properties.County}</p>
              <p><strong>Difficulty:</strong> {selectedTrail.properties.Difficulty}</p>
              <p><strong>Ascent(m):</strong> {selectedTrail.properties.AscentMetres}</p>
              <p><strong>Completion(h):</strong> {selectedTrail.properties.TimeToComplete}</p>

              {/* Button to show modal */}
              <button className="btn btn-primary w-100 mt-3" data-bs-toggle="modal" data-bs-target="#confirmDateModal" >
                Confirm Activity
              </button>
            </div>
          )}

          {/* CONFIRM DATE MODAL */}
          <div className="modal fade" id="confirmDateModal" tabIndex={-1} aria-labelledby="confirmDateModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="confirmDateModalLabel">Select a date for this activity</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-success" disabled={!selectedDate || !selectedTrail} onClick=
                  {async () => {
                    if (!selectedTrail) return;
                    try {
                      //Save the main trail and generate the plan
                      await saveTrail(selectedTrail);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  data-bs-dismiss="modal">Confirm</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
