// Banner.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import Banner from "../components/Banner/Banner";

// Mocking the Carousel component
jest.mock("../Banner/Carousel", () => {
  return function DummyCarousel() {
    return <div>Mock Carousel</div>; // Mock implementation
  };
});

describe("Banner Component", () => {
  test("renders without crashing", () => {
    render(<Banner />);
    expect(screen.getByText("Crypto Quest")).toBeInTheDocument(); // Checks for the title
  });

  test("displays the correct subtitle", () => {
    render(<Banner />);
    expect(
      screen.getByText(
        "Get all the Info regarding your favorite Crypto Currency"
      )
    ).toBeInTheDocument(); // Checks for the subtitle
  });

  test("renders the Carousel component", () => {
    render(<Banner />);
    expect(screen.getByText("Mock Carousel")).toBeInTheDocument(); // Checks that the Carousel is rendered
  });
});
