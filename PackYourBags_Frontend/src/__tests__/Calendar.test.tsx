import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Calendar from "../components/Calendar";
import { vi } from "vitest";

// Mock WeatherForecast
vi.mock("../utils/WeatherForecast", () => ({
    useWeatherForecast: () => [
        { date: "2026-05-20", symbol: "Sun" },
        { date: "2026-05-25", symbol: "Rain" }
    ]
}));

// Mock backend fetch
(globalThis as any).fetch = vi.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve([
                {
                    idTrail: 1,
                    name: "Test Trail",
                    trailType: "Main",
                    plannedActivityDate: "2026-05-20"
                }
            ])
    })
);

// Header test
test("renders calendar header", async () => {
    const mockSetActiveTab = vi.fn();
    render(<Calendar setActiveTab={mockSetActiveTab} />);

    await waitFor(() => {
        expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });
});

// Navigation test
test("navigates months", async () => {
    const mockSetActiveTab = vi.fn();
    render(<Calendar setActiveTab={mockSetActiveTab} />);

    const nextBtn = screen.getByText("▶");
    const prevBtn = screen.getByText("◀");

    await waitFor(() => expect(nextBtn).toBeInTheDocument());

    const initialHeader = screen.getByRole("heading").textContent;

    fireEvent.click(nextBtn);
    expect(screen.getByRole("heading").textContent).not.toBe(initialHeader);

    fireEvent.click(prevBtn);
    expect(screen.getByRole("heading").textContent).toBe(initialHeader);
});

// Activity rendering
test("renders activities on correct date", async () => {
    const mockSetActiveTab = vi.fn();
    render(<Calendar setActiveTab={mockSetActiveTab} />);

    await waitFor(() => {
        expect(screen.getByText((t) => t.includes("Main Trail"))).toBeInTheDocument();
        expect(screen.getByText((t) => t.includes("Test Trail"))).toBeInTheDocument();
    });
});

// Clicking activity
test("clicking activity triggers navigation", async () => {
    const mockSetActiveTab = vi.fn();
    render(<Calendar setActiveTab={mockSetActiveTab} />);

    const activity = await screen.findByText((t) => t.includes("Test Trail"));
    fireEvent.click(activity);

    expect(mockSetActiveTab).toHaveBeenCalledWith("main");
});
