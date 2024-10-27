import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { CryptoState } from "../CryptoContext";

const Alert: React.FC = () => {
  const { alert, setAlert } = CryptoState();

  const handleCloseAlert = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    setAlert({ open: false, message: "", type: "info" });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleCloseAlert}
    >
      <MuiAlert
        onClose={handleCloseAlert}
        elevation={10}
        variant="filled"
        severity={alert.type}
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
