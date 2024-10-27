import {
  Button,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CoinInfo from "../components/CoinInfo";
import { coinCapApi } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface CoinDetail {
  id: string;
  name: string;
  rank: number;
  priceUsd: string;
  marketCapUsd: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketData: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-around",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));

const CoinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [coinDetail, setCoinDetail] = useState<CoinDetail | undefined>(
    location.state?.coinData
  );
  const { symbol, user, watchlist, setAlert, wsPrices, setWsPrices, coins } =
    CryptoState();
  const classes = useStyles();

  const fetchCoinDetail = async () => {
    const { data } = await axios.get(coinCapApi(id!));
    setCoinDetail(data.data);
  };

  useEffect(() => {
    if (!coinDetail) {
      fetchCoinDetail();
    }
  }, [coinDetail]);

  console.log(wsPrices[`${coinDetail?.id}`], "wsprices");
  console.log(coinDetail?.id, "coindetail");

  useEffect(() => {
    if (coinDetail?.id) {
      const ws = new WebSocket(
        `wss://ws.coincap.io/prices?assets=${coinDetail?.id}`
      );
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message && message[coinDetail?.id]) {
          setWsPrices((prevPrices) => ({
            ...prevPrices,
            [coinDetail.id]: message[coinDetail?.id],
          }));
        }
      };

      return () => ws.close();
    }
  }, [coinDetail, coins]);

  const inWatchlist = coinDetail ? watchlist.includes(coinDetail.id) : false;

  const addToWatchlist = async () => {
    if (!coinDetail || !user) return;
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist ? [...watchlist, coinDetail.id] : [coinDetail.id],
        },
        { merge: true }
      );
      setAlert({
        open: true,
        message: `${coinDetail.name} Added to the Watchlist!`,
        type: "success",
      });
    } catch (error: any) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async () => {
    if (!coinDetail || !user) return;
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coinDetail.id) },
        { merge: true }
      );
      setAlert({
        open: true,
        message: `${coinDetail.name} Removed from the Watchlist!`,
        type: "success",
      });
    } catch (error: any) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  if (!coinDetail)
    return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <Typography variant="h3" className={classes.heading}>
          {coinDetail.name}
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank: {coinDetail.rank}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price: {symbol}{" "}
              {wsPrices[`${coinDetail?.id}`] != null
                ? wsPrices[`${coinDetail?.id}`].toString()
                : "N/A"}{" "}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap: {symbol}{" "}
              {(parseFloat(coinDetail.marketCapUsd) / 1e6).toFixed(2)} M
            </Typography>
          </span>

          {user && (
            <Button
              variant="outlined"
              style={{
                width: "85%",
                height: 40,
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>
      <CoinInfo coin={coinDetail} />
    </div>
  );
};

export default CoinPage;
