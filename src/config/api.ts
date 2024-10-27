const BASE_URL = "https://api.coincap.io/v2/";

export const TrendingCoins = (currency: string) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

export const CoinListNew = () => `${BASE_URL}assets`;
export const coinCapApi = (id: string) => `${BASE_URL}assets/${id}`;
export const HistoricalChartNew = (id: string, start: number, end: number) =>
  `${BASE_URL}assets/${id}/history?interval=d1&start=${start}&end=${end}`;
