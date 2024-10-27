import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CryptoState } from "../CryptoContext";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

jest.mock("../CryptoContext", () => ({
  CryptoState: jest.fn(),
}));

describe("Alert Component", () => {
  const mockSetAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    CryptoState.mockReturnValue({
      alert: { open: true, message: "Test Alert Message", type: "success" },
      setAlert: mockSetAlert,
    });
  });

  test("renders Snackbar with correct message and severity", () => {
    render(<Alert />);

    expect(screen.getByRole("alert")).toHaveTextContent("Test Alert Message");
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-filledSuccess"); // Checks for 'success' type
  });

  test("calls setAlert with correct arguments on close", () => {
    render(<Alert />);

    // Trigger close event
    fireEvent.click(screen.getByRole("button", { hidden: true })); // Close button in Snackbar

    expect(mockSetAlert).toHaveBeenCalledWith({
      open: false,
      message: "",
      type: "info",
    });
  });

  test('does not close alert on "clickaway"', () => {
    render(<Alert />);

    fireEvent.click(screen.getByRole("presentation"), { reason: "clickaway" }); // Simulate clickaway

    expect(mockSetAlert).not.toHaveBeenCalled();
  });
});
