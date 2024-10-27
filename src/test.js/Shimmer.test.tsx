import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ShimmerUI from "../components/Shimmer";

describe("ShimmerUI Component", () => {
  test("renders a list of 10 Skeleton items", () => {
    render(<ShimmerUI />);

    // Check if 10 Skeleton items are rendered
    const skeletonItems = screen.getAllByRole("progressbar"); // Skeleton elements have role="progressbar"
    expect(skeletonItems).toHaveLength(10);

    // Check that each Skeleton item has the expected attributes
    skeletonItems.forEach((item) => {
      expect(item).toHaveClass("MuiSkeleton-root"); // Ensure it’s a Skeleton component
      expect(item).toHaveAttribute("aria-busy", "true"); // Skeleton with animation has aria-busy
    });
  });
});
