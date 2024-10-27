import { Button, LinearProgress, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CoinInfo from "../components/CoinInfo";
import { coinCapApi } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCoinPageStyles } from "../Styles";
import { strings } from "../utils/constants";

interface CoinDetail {
  id: string;
  name: string;
  rank: number;
  priceUsd: string;
  marketCapUsd: string;
}

const CoinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [coinDetail, setCoinDetail] = useState<CoinDetail | undefined>(
    location.state?.coinData
  );
  const { symbol, user, watchlist, setAlert, wsPrices, setWsPrices, coins } =
    CryptoState();
  const classes = useCoinPageStyles();

  const fetchCoinDetail = async () => {
    const { data } = await axios.get(coinCapApi(id!));
    setCoinDetail(data.data);
  };

  useEffect(() => {
    if (!coinDetail) {
      fetchCoinDetail();
    }
  }, [coinDetail]);

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
        message: `${coinDetail.name} ${strings.addedToWatchlist}`,
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
        message: `${coinDetail.name}${strings.removeFromWatchlist}`,
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
                : "0.00"}{" "}
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
              {inWatchlist
                ? `${strings.removeFromWatchlist}`
                : `${strings.addedToWatchlist}`}
            </Button>
          )}
        </div>
      </div>
      <CoinInfo coin={coinDetail} />
    </div>
  );
};

export default CoinPage;
