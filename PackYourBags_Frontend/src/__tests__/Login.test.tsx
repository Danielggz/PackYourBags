import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Login";
import { vi } from "vitest";

// Navigate mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

// Fetch responses function
function mockFetchSequence(responses: any[]) {
  (globalThis as any).fetch = vi.fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: responses[0].ok,
        json: () => Promise.resolve(responses[0].json)
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: responses[1].ok,
        json: () => Promise.resolve(responses[1].json)
      })
    );
}

// Successful Login test
test("successful login navigates to mainMenu when user has main trail", async () => {
  mockFetchSequence([
    { ok: true, json: {} }, // login success
    { ok: true, json: true } // hasMainTrail = true
  ]);

  render(<Login />);

  fireEvent.click(screen.getByText("Login"));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/mainMenu");
  });
});

// Goes to MainMenu when user already has activity
test("successful login navigates to selectActivity when user has no main trail", async () => {
  mockFetchSequence([
    { ok: true, json: {} }, // login success
    { ok: true, json: false } // hasMainTrail = false
  ]);

  render(<Login />);

  fireEvent.click(screen.getByText("Login"));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/selectActivity");
  });
});

// Show invalid credentials error
test("shows error on invalid login", async () => {
  mockFetchSequence([
    { ok: false, json: {} } // login failed
  ]);

  render(<Login />);

  fireEvent.click(screen.getByText("Login"));

  await waitFor(() => {
    expect(screen.getByText((t) => t.includes("Invalid email or password"))).toBeInTheDocument();
  });
});

// Error message on login error
test("shows server error on fetch failure", async () => {
  (globalThis as any).fetch = vi.fn(() => Promise.reject("Network error"));

  render(<Login />);

  fireEvent.click(screen.getByText("Login"));

  await waitFor(() => {
    expect(screen.getByText((t) => t.includes("Server error"))).toBeInTheDocument();
  });
});
