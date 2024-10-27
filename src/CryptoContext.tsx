import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { onAuthStateChanged, User } from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { CoinListNew } from "./config/api";
import { strings } from "./utils/constants";

interface AlertState {
  open: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface PriceData {
  price: number;
  change?: number;
}

interface CryptoContextType {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  symbol: string;
  coins: any[];
  loading: boolean;
  fetchCoins: () => Promise<void>;
  alert: AlertState;
  setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
  user: User | null;
  watchlist: string[];
  setWatchlist: React.Dispatch<React.SetStateAction<string[]>>;

  wsPrices: { [coinId: string]: PriceData };
  setWsPrices: React.Dispatch<
    React.SetStateAction<{ [coinId: string]: PriceData }>
  >;
}

interface CryptoProviderProps {
  children: ReactNode;
}

const Crypto = createContext<CryptoContextType | undefined>(undefined);

const CryptoContext: React.FC<CryptoProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<string>(strings.usd);
  const [symbol, setSymbol] = useState<string>("$");
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [wsPrices, setWsPrices] = useState({});
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    type: "success",
  });
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinListNew());
      setCoins(data.data);
    } catch (error) {
      console.error(`${strings.errorFetchCoins}`, error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user.uid);
      const unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchlist(coin.data().coins);
        } else {
          console.log(`${strings.noItems}`);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user ?? null);
    });
  }, []);

  useEffect(() => {
    setSymbol(currency === strings.inr ? "₹" : "$");
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        coins,
        loading,
        fetchCoins,
        alert,
        setAlert,
        user,
        watchlist,
        setWatchlist,
        wsPrices,
        setWsPrices,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  const context = useContext(Crypto);
  if (context === undefined) {
    throw new Error("CryptoState must be used within a CryptoContextProvider");
  }
  return context;
};
