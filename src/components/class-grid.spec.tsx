import { render, screen } from "@testing-library/react";
import { ClassGrid } from "./class-grid";

describe("<ClassGrid />", () => {
  it('renders the grid: match snapshot', () => {
    render(<ClassGrid onClick={() => {}} highlight={() => {}} />);

    const section = screen.getByRole("grid", {
      name: "Class Grid",
    });
    expect(section).toBeInTheDocument();
    expect(section).toMatchSnapshot();
  });
});
