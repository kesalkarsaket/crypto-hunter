import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { CryptoState } from "../CryptoContext";
import Authmodal from "./Authentication/Authmodal";
import UserSidebar from "./Authentication/UserSidebar";
import { useHeaderStyles } from "../Styles";
import { strings } from "../utils/constants";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const Header: React.FC = () => {
  const classes = useHeaderStyles();
  const { currency, setCurrency, user } = CryptoState();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Crypto Quest
            </Typography>
            <Select
              variant="outlined"
              value={currency}
              style={{ width: 100, height: 40, marginLeft: 15 }}
              onChange={(e) => setCurrency(e.target.value as string)}
            >
              <MenuItem value={strings.usd}>{strings.usd}</MenuItem>
              <MenuItem value={strings.inr}>{strings.inr}</MenuItem>
            </Select>
            {user ? <UserSidebar /> : <Authmodal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
