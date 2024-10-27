// Header.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CryptoState } from "../CryptoContext";
import Header from "./Header";
import Authmodal from "./Authentication/Authmodal";
import UserSidebar from "./Authentication/UserSidebar";

// Mock the CryptoState context
jest.mock("../CryptoContext", () => ({
  CryptoState: jest.fn(),
}));

jest.mock("./Authentication/Authmodal", () => () => <div>Auth Modal</div>);
jest.mock("./Authentication/UserSidebar", () => () => <div>User Sidebar</div>);

describe("Header Component", () => {
  beforeEach(() => {
    // Set default mock implementation for the CryptoState
    CryptoState.mockReturnValue({
      currency: "USD",
      setCurrency: jest.fn(),
      user: null, // Change to an object to test UserSidebar rendering
    });
  });

  test("renders Header with correct title", () => {
    render(<Header />);
    expect(screen.getByText("Crypto Quest")).toBeInTheDocument();
  });

  test("renders currency select dropdown with correct default value", () => {
    render(<Header />);
    const selectElement = screen.getByRole("button"); // get the select element
    expect(selectElement).toHaveTextContent("USD");
  });

  test("allows user to change currency", () => {
    const setCurrencyMock = jest.fn();
    CryptoState.mockReturnValue({
      currency: "USD",
      setCurrency: setCurrencyMock,
      user: null,
    });

    render(<Header />);
    const selectElement = screen.getByRole("button"); // get the select element
    fireEvent.mouseDown(selectElement); // Open the dropdown

    // Select INR
    const inrOption = screen.getByText("INR");
    fireEvent.click(inrOption);

    expect(setCurrencyMock).toHaveBeenCalledWith("INR");
  });

  test("renders Authmodal when user is not logged in", () => {
    render(<Header />);
    expect(screen.getByText("Auth Modal")).toBeInTheDocument();
  });

  test("renders UserSidebar when user is logged in", () => {
    CryptoState.mockReturnValue({
      currency: "USD",
      setCurrency: jest.fn(),
      user: { name: "Test User" }, // Mock a user object to simulate a logged-in state
    });

    render(<Header />);
    expect(screen.getByText("User Sidebar")).toBeInTheDocument();
  });
});
