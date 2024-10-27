import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/HomePage";
import CoinPage from "./pages/CoinPage";
import Alert from "./components/Alert";
import { useAppStyles } from "./Styles";

function App(): JSX.Element {
  const classes = useAppStyles();

  return (
    <div className={classes.App}>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
        <Alert />
      </BrowserRouter>
    </div>
  );
}

export default App;
