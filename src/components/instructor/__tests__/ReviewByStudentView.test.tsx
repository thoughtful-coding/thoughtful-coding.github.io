import { screen } from "@testing-library/react";
import { render } from "../../../test-utils"; // Use our custom render with router
import ReviewByStudentView from "../ReviewByStudentView";
import type { InstructorStudentInfo } from "../../../types/apiServiceTypes";

const mockStudents: InstructorStudentInfo[] = [
  {
    studentId: "student-123",
    studentName: "Alice",
    studentEmail: "alice@example.com",
  },
  {
    studentId: "student-456",
    studentName: "Bob",
    studentEmail: "bob@example.com",
  },
];

describe("ReviewByStudentView", () => {
  it("renders a list of students with correct links", () => {
    render(<ReviewByStudentView permittedStudents={mockStudents} />);

    // Check that the main heading and introductory text are present
    expect(
      screen.getByRole("heading", { name: /review by student/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/select a student to view their detailed progress/i)
    ).toBeInTheDocument();

    // Check that both students are rendered
    const aliceLink = screen.getByRole("link", { name: /alice/i });
    const bobLink = screen.getByRole("link", { name: /bob/i });

    expect(aliceLink).toBeInTheDocument();
    expect(bobLink).toBeInTheDocument();

    // Check that the email addresses are also displayed
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();

    // Verify that the links have the correct destination URLs
    expect(aliceLink).toHaveAttribute(
      "href",
      "/instructor-dashboard/students/student-123"
    );
    expect(bobLink).toHaveAttribute(
      "href",
      "/instructor-dashboard/students/student-456"
    );

    // Ensure the placeholder message is NOT shown
    expect(
      screen.queryByText(/no students are currently assigned/i)
    ).toBeNull();
  });

  it("renders a placeholder message when there are no students", () => {
    render(<ReviewByStudentView permittedStudents={[]} />);

    // The heading and text should still be there
    expect(
      screen.getByRole("heading", { name: /review by student/i })
    ).toBeInTheDocument();

    // The placeholder message should now be visible
    expect(
      screen.getByText(/no students are currently assigned to you/i)
    ).toBeInTheDocument();

    // There should be no links rendered
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
