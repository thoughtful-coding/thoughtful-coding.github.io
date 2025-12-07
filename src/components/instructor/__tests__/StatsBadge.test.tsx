import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsBadge from "../StatsBadge";

describe("StatsBadge", () => {
  describe("compact mode", () => {
    it("renders p50 and p95 values in compact mode", () => {
      render(<StatsBadge p50={2} p95={5} compact />);

      expect(screen.getByText(/p50: 2/)).toBeInTheDocument();
      expect(screen.getByText(/p95: 5/)).toBeInTheDocument();
    });

    it("shows descriptive tooltip for p50", () => {
      render(<StatsBadge p50={2} p95={5} compact />);

      const p50Badge = screen.getByText(/p50: 2/);
      expect(p50Badge).toHaveAttribute(
        "title",
        "50% of students completed in 2 or fewer attempts"
      );
    });

    it("applies green color class for easy difficulty (p50 <= 2)", () => {
      const { container } = render(<StatsBadge p50={1} p95={2} compact />);

      const badges = container.querySelectorAll("span");
      expect(badges[0]).toHaveClass("badge-green");
    });

    it("applies yellow color class for medium difficulty (3-4 attempts)", () => {
      const { container } = render(<StatsBadge p50={3} p95={4} compact />);

      const badges = container.querySelectorAll("span");
      expect(badges[0]).toHaveClass("badge-yellow");
    });

    it("applies red color class for hard difficulty (5+ attempts)", () => {
      const { container } = render(<StatsBadge p50={5} p95={8} compact />);

      const badges = container.querySelectorAll("span");
      expect(badges[0]).toHaveClass("badge-red");
    });

    it("can have different colors for p50 and p95", () => {
      const { container } = render(<StatsBadge p50={2} p95={6} compact />);

      const badges = container.querySelectorAll("span");
      expect(badges[0]).toHaveClass("badge-green"); // p50 is easy
      expect(badges[1]).toHaveClass("badge-red"); // p95 is hard
    });
  });

  describe("full mode", () => {
    it("renders labels and values in full mode", () => {
      render(<StatsBadge p50={2} p95={5} />);

      expect(screen.getByText("Median:")).toBeInTheDocument();
      expect(screen.getByText("p95:")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("renders without student count", () => {
      render(<StatsBadge p50={3} p95={7} />);

      expect(screen.queryByText(/students/)).not.toBeInTheDocument();
    });

    it("does not display student count when not provided", () => {
      const { container } = render(<StatsBadge p50={2} p95={4} />);

      expect(container.textContent).not.toContain("students");
    });

    it("applies correct color classes to values", () => {
      const { container } = render(<StatsBadge p50={1} p95={5} />);

      const values = container.querySelectorAll("span[class*='value-']");
      expect(values[0]).toHaveClass("value-green"); // p50=1
      expect(values[1]).toHaveClass("value-red"); // p95=5
    });
  });

  describe("color coding logic", () => {
    it("treats 1-2 attempts as easy (green)", () => {
      const { container: container1 } = render(
        <StatsBadge p50={1} p95={1} compact />
      );
      const { container: container2 } = render(
        <StatsBadge p50={2} p95={2} compact />
      );

      expect(container1.querySelector("span")).toHaveClass("badge-green");
      expect(container2.querySelector("span")).toHaveClass("badge-green");
    });

    it("treats 3-4 attempts as medium (yellow)", () => {
      const { container: container3 } = render(
        <StatsBadge p50={3} p95={3} compact />
      );
      const { container: container4 } = render(
        <StatsBadge p50={4} p95={4} compact />
      );

      expect(container3.querySelector("span")).toHaveClass("badge-yellow");
      expect(container4.querySelector("span")).toHaveClass("badge-yellow");
    });

    it("treats 5+ attempts as hard (red)", () => {
      const { container: container5 } = render(
        <StatsBadge p50={5} p95={5} compact />
      );
      const { container: container10 } = render(
        <StatsBadge p50={10} p95={10} compact />
      );

      expect(container5.querySelector("span")).toHaveClass("badge-red");
      expect(container10.querySelector("span")).toHaveClass("badge-red");
    });

    it("handles boundary values correctly", () => {
      // 2 is still green
      const { container: boundary2 } = render(
        <StatsBadge p50={2} p95={2} compact />
      );
      expect(boundary2.querySelector("span")).toHaveClass("badge-green");

      // 3 becomes yellow
      const { container: boundary3 } = render(
        <StatsBadge p50={3} p95={3} compact />
      );
      expect(boundary3.querySelector("span")).toHaveClass("badge-yellow");

      // 4 is still yellow
      const { container: boundary4 } = render(
        <StatsBadge p50={4} p95={4} compact />
      );
      expect(boundary4.querySelector("span")).toHaveClass("badge-yellow");

      // 5 becomes red
      const { container: boundary5 } = render(
        <StatsBadge p50={5} p95={5} compact />
      );
      expect(boundary5.querySelector("span")).toHaveClass("badge-red");
    });
  });

  describe("accessibility", () => {
    it("includes descriptive tooltips in compact mode", () => {
      render(<StatsBadge p50={1} p95={3} compact />);

      const p50Badge = screen.getByText(/p50: 1/);
      const p95Badge = screen.getByText(/p95: 3/);

      expect(p50Badge).toHaveAttribute(
        "title",
        "50% of students completed in 1 or fewer attempt"
      );
      expect(p95Badge).toHaveAttribute(
        "title",
        "95% of students completed in 3 or fewer attempts"
      );
    });

    it("uses correct singular/plural in tooltips", () => {
      const { rerender } = render(<StatsBadge p50={1} p95={2} compact />);

      const p50Single = screen.getByText(/p50: 1/);
      expect(p50Single).toHaveAttribute(
        "title",
        expect.stringContaining("1 or fewer attempt")
      );

      rerender(<StatsBadge p50={2} p95={3} compact />);
      const p50Plural = screen.getByText(/p50: 2/);
      expect(p50Plural).toHaveAttribute(
        "title",
        expect.stringContaining("2 or fewer attempts")
      );
    });
  });
});
