// import { createContext, useContext, useEffect, useState } from "react";

// const ApiTrailsContext = createContext([]);

// export function TrailsProvider({ children }) {
//   const [trails, setTrails] = useState([]);

//   useEffect(() => {
//     async function loadTrails() {
//       const res = await fetch("https://services-eu1.arcgis.com/CltcWyRoZmdwaB7T/ArcGIS/rest/services/GetIrelandActiveTrailRoutes/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson");
//       const data = await res.json();
//       setTrails(data.features);
//     }
//     loadTrails();
//   }, []);

//   return (
//     <ApiTrailsContext.Provider value={trails}>
//       {children}
//     </ApiTrailsContext.Provider>
//   );
// }

// export function useApiTrails() {
//   return useContext(ApiTrailsContext);
// }
