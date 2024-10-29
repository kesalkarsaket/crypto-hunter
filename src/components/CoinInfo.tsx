import { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { HistoricalChartNew } from "../config/api";
import { Skeleton } from "@material-ui/lab";
import { useCoinInfoStyles } from "../Styles";
import { strings } from "../utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getTimestamp = (date: Date): number => {
  return date.getTime();
};

interface CoinInfoProps {
  coin: { id: string } | null;
}

const CoinInfo: React.FC<CoinInfoProps> = ({ coin }) => {
  const [historicData, setHistoricData] = useState<
    { date: string; priceUsd: string }[]
  >([]);
  const [days, setDays] = useState<number>(30);
  const { currency, wsPrices, symbol } = CryptoState();
  const [flag, setFlag] = useState<boolean>(false);

  const classes = useCoinInfoStyles();

  const fetchHistoricData = useCallback(async (): Promise<void> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const startTimestamp = getTimestamp(startDate);
    const endTimestamp = getTimestamp(endDate);

    if (!coin || !coin.id) return;

    const res = await fetch(
      HistoricalChartNew(coin?.id, startTimestamp, endTimestamp)
    );
    const data = await res.json();

    setFlag(true);

    let chartData = data?.data || [];

    // Add today's live price if available
    const livePrice = wsPrices[`${coin.id}`];
    if (livePrice) {
      chartData.push({ date: endDate.toISOString(), priceUsd: livePrice });
    }

    setHistoricData(chartData);
  }, [days, coin, wsPrices]);

  useEffect(() => {
    fetchHistoricData();
  }, [days, wsPrices, fetchHistoricData]);

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {coin ? (
          <Typography variant="h5" style={{ marginBottom: 20 }}>
            {`${strings.currentPrice} ${symbol} ${
              wsPrices[`${coin.id}`] || 0.0
            }`}
          </Typography>
        ) : (
          <Skeleton variant="text" animation="wave" />
        )}
        {!historicData.length || !flag ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((dataPoint) =>
                  new Date(dataPoint.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    data: historicData.map((dataPoint) =>
                      parseFloat(dataPoint.priceUsd)
                    ),
                    label: `Price (Past ${days} Days) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: { radius: 1 }, // Slightly increase point radius for better visibility
                },
                interaction: {
                  mode: "index", // Ensure the crosshair shows up at the nearest point
                  intersect: false,
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false, // Show cross line only on y-axis
                    },
                  },
                  y: {
                    grid: {
                      drawOnChartArea: true, // Show cross line on y-axis
                    },
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
