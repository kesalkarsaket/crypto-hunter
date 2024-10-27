import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CoinPage from "./CoinPage";
import { CryptoState } from "../CryptoContext";
import { useParams } from "react-router-dom";
import { setDoc } from "firebase/firestore";
import axios from "axios";

jest.mock("../CryptoContext", () => ({
  CryptoState: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("axios");
jest.mock("firebase/firestore");

describe("CoinPage Component", () => {
  const mockSetAlert = jest.fn();
  const mockSetWsPrices = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "bitcoin" });
    CryptoState.mockReturnValue({
      symbol: "$",
      user: { uid: "user123" },
      watchlist: ["ethereum"],
      setAlert: mockSetAlert,
      wsPrices: { bitcoin: 1234.56 },
      setWsPrices: mockSetWsPrices,
      coins: [{ id: "bitcoin", name: "Bitcoin" }],
    });
    axios.get.mockResolvedValue({
      data: {
        data: {
          id: "bitcoin",
          name: "Bitcoin",
          rank: 1,
          priceUsd: "50000",
          marketCapUsd: "1000000000",
        },
      },
    });
  });

  test("renders loading state when coinDetail is undefined", () => {
    CryptoState.mockReturnValueOnce({
      ...CryptoState(),
      wsPrices: {},
      coins: [],
    });

    render(<CoinPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders coin details correctly after fetching data", async () => {
    render(<CoinPage />);

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Rank: 1")).toBeInTheDocument();
    expect(screen.getByText("Current Price: $ 1234.56")).toBeInTheDocument();
    expect(screen.getByText("Market Cap: $ 1000.00 M")).toBeInTheDocument();
  });

  test("adds to watchlist when button is clicked", async () => {
    render(<CoinPage />);

    const addToWatchlistButton = screen.getByRole("button", {
      name: /add to watchlist/i,
    });
    fireEvent.click(addToWatchlistButton);

    await waitFor(() =>
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { coins: ["ethereum", "bitcoin"] },
        { merge: true }
      )
    );
    expect(mockSetAlert).toHaveBeenCalledWith({
      open: true,
      message: "Bitcoin added to watchlist",
      type: "success",
    });
  });

  test("removes from watchlist when button is clicked", async () => {
    CryptoState.mockReturnValueOnce({
      ...CryptoState(),
      watchlist: ["bitcoin"],
    });
    render(<CoinPage />);

    const removeFromWatchlistButton = screen.getByRole("button", {
      name: /remove from watchlist/i,
    });
    fireEvent.click(removeFromWatchlistButton);

    await waitFor(() =>
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        { coins: [] },
        { merge: true }
      )
    );
    expect(mockSetAlert).toHaveBeenCalledWith({
      open: true,
      message: "Bitcoin removed from watchlist",
      type: "success",
    });
  });
});
