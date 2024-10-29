import React, { useState, MouseEvent, KeyboardEvent } from "react";
import Drawer from "@material-ui/core/Drawer";
import { Avatar, Button } from "@material-ui/core";
import { CryptoState } from "../../CryptoContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { numberWithCommas } from "../CoinsTable";
import { AiFillDelete } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import { useSidebarStyles } from "../../Styles";
import { strings } from "../../utils/constants";

interface StateType {
  right: boolean;
}

interface CoinType {
  id: string;
  name: string;
  priceUsd: string;
}

export default function UserSidebar() {
  const classes = useSidebarStyles();
  const [state, setState] = useState<StateType>({ right: false });
  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const toggleDrawer =
    (anchor: "right", open: boolean) => (event: MouseEvent | KeyboardEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: strings.logoutSuccess,
    });
    toggleDrawer("right", false);
  };

  const removeFromWatchlist = async (coin: CoinType) => {
    if (!user) return;
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} ${strings.removeFromWatchlist}`,
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

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor as "right", true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
            src={user?.photoURL || ""}
            alt={user?.displayName || user?.email || ""}
          />
          <Drawer
            anchor={anchor as "right"}
            open={state[anchor as "right"]}
            onClose={toggleDrawer(anchor as "right", false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user?.photoURL || ""}
                  alt={user?.displayName || user?.email || ""}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user?.displayName || user?.email}
                </span>
                <div className={classes.watchlist}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    Watchlist
                  </span>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div key={coin.id} className={classes.coin}>
                          <span>{coin.name}</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{" "}
                            {numberWithCommas(
                              parseFloat(coin.priceUsd).toFixed(2)
                            )}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                    return null;
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
