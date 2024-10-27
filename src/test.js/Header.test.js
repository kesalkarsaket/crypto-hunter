import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./header";
import { CryptoState } from "../CryptoContext";
import { strings } from "../utils/constants";

jest.mock("../CryptoContext", () => ({
  CryptoState: jest.fn(),
}));

jest.mock("./Authentication/Authmodal", () => () => (
  <div>Authmodal Component</div>
));
jest.mock("./Authentication/UserSidebar", () => () => (
  <div>UserSidebar Component</div>
));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with title and currency selector", () => {
    CryptoState.mockReturnValue({
      currency: strings.usd,
      setCurrency: jest.fn(),
      user: null,
    });

    render(<Header />);

    expect(screen.getByText("Crypto Quest")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: strings.usd })
    ).toBeInTheDocument();
  });

  test("displays Authmodal when user is not logged in", () => {
    CryptoState.mockReturnValue({
      currency: strings.usd,
      setCurrency: jest.fn(),
      user: null,
    });

    render(<Header />);

    expect(screen.getByText("Authmodal Component")).toBeInTheDocument();
  });

  test("displays UserSidebar when user is logged in", () => {
    CryptoState.mockReturnValue({
      currency: strings.usd,
      setCurrency: jest.fn(),
      user: { name: "testUser" },
    });

    render(<Header />);

    expect(screen.getByText("UserSidebar Component")).toBeInTheDocument();
  });

  test("changes currency when a new option is selected", () => {
    const setCurrency = jest.fn();
    CryptoState.mockReturnValue({
      currency: strings.usd,
      setCurrency,
      user: null,
    });

    render(<Header />);

    const currencySelect = screen.getByRole("button", { name: strings.usd });
    fireEvent.mouseDown(currencySelect);

    const inrOption = screen.getByRole("option", { name: strings.inr });
    fireEvent.click(inrOption);

    expect(setCurrency).toHaveBeenCalledWith(strings.inr);
  });
});
