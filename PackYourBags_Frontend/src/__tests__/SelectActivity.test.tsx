import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SelectActivity from "../components/SelectActivity";
import { vi } from "vitest";

// Mock navigate
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn()
}));

// Mock Leaflet for map
vi.mock("leaflet", () => ({
  map: () => ({
    setView: vi.fn(),
    fitBounds: vi.fn(),
    remove: vi.fn(),
    removeLayer: vi.fn()
  }),
  tileLayer: () => ({ addTo: vi.fn() }),
  layerGroup: () => ({ addTo: vi.fn(), clearLayers: vi.fn() }),
  geoJSON: () => ({
    addTo: vi.fn(),
    getBounds: () => ({}),
    on: vi.fn()
  }),
  circleMarker: () => ({ addTo: vi.fn(), on: vi.fn() })
}));

// Mock fetch for trails + user county
(globalThis as any).fetch = vi.fn((url) => {
  if (url.includes("GetIrelandActiveTrailRoutes")) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          features: [
            {
              type: "Feature",
              geometry: { type: "LineString", coordinates: [[-8, 53]] },
              properties: {
                TrailID: 1,
                Name: "Test Trail",
                County: "Dublin",
                Activity: "Walking",
                Difficulty: "Easy",
                LengthKm: 10,
                TimeToComplete: "2h",
                AscentMetres: 100,
                ExternalLinks: "",
                Website: "",
                TrailType: "Walking"
              }
            }
          ]
        })
    });
  }

  if (url.includes("getUserData")) {
    return Promise.resolve({
      json: () => Promise.resolve({ county: "Dublin" })
    });
  }

  return Promise.resolve({
    json: () => Promise.resolve({})
  });
}) as any;

test("SelectActivity renders and search input works", async () => {
  render(<SelectActivity />);

  // Wait for trails to load
  await waitFor(() => {
    expect(screen.getByText("Find an Activity")).toBeInTheDocument();
  });

  const input = screen.getByPlaceholderText("Search by name...");

  fireEvent.change(input, { target: { value: "test" } });
  expect(input).toHaveValue("test");
});

test("Shows suggestions when typing", async () => {
  render(<SelectActivity />);

  // Wait for trails to load
  await waitFor(() => {
    expect(screen.getByText("Find an Activity")).toBeInTheDocument();
  });

  const input = screen.getByPlaceholderText("Search by name...");

  fireEvent.change(input, { target: { value: "test" } });

  await waitFor(() => {
    expect(screen.getByText("Test Trail")).toBeInTheDocument();
  });
});

test("Clicking a suggestion fills the input", async () => {
  render(<SelectActivity />);

  await waitFor(() => {
    expect(screen.getByText("Find an Activity")).toBeInTheDocument();
  });

  const input = screen.getByPlaceholderText("Search by name...");

  fireEvent.change(input, { target: { value: "t" } });

  const suggestion = await screen.findByText("Test Trail");
  fireEvent.click(suggestion);

  expect(input).toHaveValue("Test Trail");
});
