import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Equipment from "../components/Equipment";

// Mock weather hook
vi.mock("../utils/WeatherForecast", () => ({
  useWeatherForecast: () => ([
    { date: "2026-05-19", symbol: "LightRain", minTemp: 7, maxTemp: 10, wind: 25 }
  ])
}));

// Mock fetch for equipment + trail
(globalThis as any).fetch = vi.fn((url) => {
  if (url.includes("/api/equipment/get")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { itemId: 1, name: "First Aid Kit", checked: true },
        { itemId: 16, name: "Windproof Jacket", checked: true }
      ])
    });
  }

  if (url.includes("/api/trails/getMainTrail")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        idTrail: 1,
        name: "Test Trail",
        lengthKm: 12,
        ascentMetres: 300,
        lat: 53.0,
        lon: -6.0
      })
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  });
}) as any;

test("renders essential items and toggles checkbox", async () => {
  render(<Equipment />);

  // Wait for essentials to load
  const item = await screen.findByText("First Aid Kit");

  // Click the label (custom checkbox)
  fireEvent.click(item);

  const checkbox = item.closest("label")!.querySelector("input[type='checkbox']") as HTMLInputElement;
  const visual = item.closest("label")!.querySelector(".checkbox")!;

  expect(checkbox.checked).toBe(false); // was true from DB, now toggled off
  expect(visual.classList.contains("checked")).toBe(false);

});

test("renders trail-based recommendations", async () => {
  render(<Equipment />);

  // Trail length = 12km → should recommend 2–3L water + snacks
  const snacks = await screen.findByText("Snacks / Energy Food");
  const water = await screen.findByText("Water (2–3L minimum)");

  expect(snacks).toBeInTheDocument();
  expect(water).toBeInTheDocument();
});

test("renders weather-based recommendations from mocked forecast", async () => {
  render(<Equipment />);

  // LightRain + wind 25 → Waterproof Jacket + Rain Cover + Windproof Jacket
  const jacket = await screen.findByText("Waterproof Jacket");
  const rainCover = await screen.findByText("Rain Cover for Backpack");
  const windproof = await screen.findByText("Windproof Jacket");

  expect(jacket).toBeInTheDocument();
  expect(rainCover).toBeInTheDocument();
  expect(windproof).toBeInTheDocument();
});

test("toggles weather item checkbox and visual state", async () => {
  render(<Equipment />);

  const item = await screen.findByText("Windproof Jacket");

  fireEvent.click(item);

  const checkbox = item.closest("label")!.querySelector("input[type='checkbox']") as HTMLInputElement;
  const visual = item.closest("label")!.querySelector(".checkbox")!;

  expect(checkbox.checked).toBe(false); // was true from DB
  expect(visual.classList.contains("checked")).toBe(false);
});

test("clicking Save sends merged equipment list to backend", async () => {
  render(<Equipment />);

  const saveBtn = await screen.findByText("Save");

  fireEvent.click(saveBtn);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/equipment/save"),
      expect.any(Object)
    );
  });
});
