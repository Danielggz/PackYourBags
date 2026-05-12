import { render, screen, waitFor } from "@testing-library/react";
import TrainingPlan from "../components/TrainingPlan";
import { vi } from "vitest";

// leaflet mock
vi.mock("leaflet", () => ({
    map: () => ({
        setView: vi.fn(),
        fitBounds: vi.fn(),
        removeLayer: vi.fn()
    }),
    tileLayer: () => ({ addTo: vi.fn() }),
    layerGroup: () => ({ addTo: vi.fn(), clearLayers: vi.fn() }),
    geoJSON: () => ({
        addTo: vi.fn(),
        getBounds: () => ({})
    }),
    circleMarker: () => ({ addTo: vi.fn() })
}));

// fetch all trails test
(globalThis as any).fetch = vi
    .fn()
    .mockImplementationOnce(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve([
                    { idTrail: 101 },
                    { idTrail: 202 }
                ])
        })
    )
    // ArcGIS trail geometry for trail 101
    .mockImplementationOnce(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve({
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: [[-8, 53]]
                            },
                            properties: {
                                TrailID: 101,
                                Name: "Trail One",
                                County: "Dublin",
                                Difficulty: "Easy",
                                LengthKm: 10,
                                AscentMetres: 100,
                                TimeToComplete: "2h"
                            }
                        }
                    ]
                })
        })
    )
    // ArcGIS trail geometry for trail 202
    .mockImplementationOnce(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve({
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: [[-9, 54]]
                            },
                            properties: {
                                TrailID: 202,
                                Name: "Trail Two",
                                County: "Galway",
                                Difficulty: "Moderate",
                                LengthKm: 15,
                                AscentMetres: 200,
                                TimeToComplete: "3h"
                            }
                        }
                    ]
                })
        })
    );

// Loading items
test("renders training plan items", async () => {
    render(<TrainingPlan />);

    // Wait for both TrainingPlanItem components to appear
    await waitFor(() => {
        expect(screen.getByText("Your Training Plan")).toBeInTheDocument();
    });

    // Wait for trail info to load
    await waitFor(() => {
        expect(screen.getByText("Trail One")).toBeInTheDocument();
        expect(screen.getByText("Trail Two")).toBeInTheDocument();
    });

    // Check some details
    expect(screen.getByText((t) => t.includes("Dublin"))).toBeInTheDocument();
    expect(screen.getByText((t) => t.includes("Galway"))).toBeInTheDocument();
});
