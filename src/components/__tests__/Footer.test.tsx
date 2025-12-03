import { render, screen } from "../../test-utils";
import Footer from "../Footer";

describe("Footer Component", () => {
  it("renders the copyright notice with the current year", () => {
    // 1. Arrange: Render the component
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} Thoughtful Coding Lessons`;

    // 2. Act & Assert: Check if the expected text is in the document
    const footerText = screen.getByText(expectedText);
    expect(footerText).toBeInTheDocument();
  });
});
