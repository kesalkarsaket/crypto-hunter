import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
  Button,
  Grow,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { getFavorites, saveFavorites } from "../utils/useLocalStorage";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import { CryptoState } from "../CryptoContext";
import { Skeleton } from "@material-ui/lab";
import ShimmerUI from "./Shimmer";
import { useCoinTableStyles } from "../Styles";
import { strings } from "../utils/constants";
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export default function CoinsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(getFavorites());
  const [animateId, setAnimateId] = useState(null);

  const { coins, loading, fetchCoins, wsPrices, setWsPrices } = CryptoState();

  const classes = useCoinTableStyles();
  const navigate = useNavigate();
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    if (coins.length > 0) {
      const assetIds = coins.map((coin) => coin.id).join(",");
      const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${assetIds}`);

      ws.onmessage = (event) => {
        const updatedPrices = JSON.parse(event.data);
        setWsPrices((prevPrices) => ({
          ...prevPrices,
          ...updatedPrices,
        }));
      };

      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };

      return () => ws.close();
    }
  }, [coins]);

  const handleSearch = () => {
    if (!Array.isArray(coins)) return [];
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  const coinsWithUpdatedPrices = handleSearch().map((coin) => {
    const updatedPrice = wsPrices[coin.id] ? wsPrices[coin.id] : coin.priceUsd;
    return {
      ...coin,
      priceUsd: updatedPrice,
    };
  });

  const handleFavoriteToggle = (id) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);

    setAnimateId(id);

    setTimeout(() => {
      setAnimateId(null);
    }, 300);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label={strings.searchForCryto}
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <>
              <LinearProgress style={{ backgroundColor: "gold" }} />
              <ShimmerUI />
            </>
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {[
                    strings.symbol,
                    strings.name,
                    strings.priceInUsd,
                    strings.hourChange,
                    strings.marketcap,
                    strings.favStatus,
                  ].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === strings.symbol ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {coinsWithUpdatedPrices
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.changePercent24Hr > 0;
                    return (
                      <TableRow className={classes.row} key={row.id}>
                        <TableCell
                          onClick={() =>
                            navigate(`/coins/${row?.id}`, {
                              state: { coinData: row },
                            })
                          }
                        >
                          <span
                            style={{
                              textTransform: "uppercase",
                              fontSize: 22,
                            }}
                          >
                            {row.symbol}
                          </span>
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() =>
                            navigate(`/coins/${row?.id}`, {
                              state: { coinData: row },
                            })
                          }
                        >
                          <span style={{ color: "darkgrey" }}>{row.name}</span>
                        </TableCell>
                        <TableCell align="right">
                          $
                          {numberWithCommas(
                            parseFloat(row.priceUsd).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {parseFloat(row.changePercent24Hr).toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          $
                          {numberWithCommas(
                            parseFloat(row.marketCapUsd).toFixed(2)
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button onClick={() => handleFavoriteToggle(row.id)}>
                            {/* Show filled icon if favorite, otherwise show outlined icon */}
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              {favorites.includes(row.id) ? (
                                <Grow
                                  in={animateId === row.id}
                                  timeout={{ enter: 0, exit: 300 }}
                                >
                                  <FavoriteIcon
                                    style={{
                                      color: "gold",
                                      position: "absolute",
                                      top: 0,
                                    }}
                                  />
                                </Grow>
                              ) : (
                                <Grow
                                  in={animateId === row.id}
                                  timeout={{ enter: 0, exit: 300 }}
                                >
                                  <FavoriteBorderOutlinedIcon
                                    style={{
                                      color: "white",
                                      position: "absolute",
                                      top: 0,
                                    }}
                                  />
                                </Grow>
                              )}
                              {/* Always show the other icon */}
                              {favorites.includes(row.id) ? (
                                <FavoriteIcon
                                  style={{ color: "gold", opacity: 0.5 }}
                                />
                              ) : (
                                <FavoriteBorderOutlinedIcon
                                  style={{ color: "white", opacity: 0.5 }}
                                />
                              )}
                            </div>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          count={Math.ceil(handleSearch().length / 10)}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}
