import { render, screen, fireEvent } from "@testing-library/react";
import Equipment from "../components/Equipment";

test("renders equipment items and toggles checkbox", () => {
    render(<Equipment />);

    const item = screen.getByLabelText("Hiking Boots / Trail Shoes");
    expect(item).toBeInTheDocument();

    fireEvent.click(item);
    expect(item).toBeChecked();
});