export const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
export const OPENAI_API_KEY = import.meta.env.VITE_SP_API_KEY;
export const TICKER_MIN_LENGTH = 3;
export const MAX_TICKERS = 3;
export const MAX_REPORT_WORDS = 150;
export const MAX_DAYS = 90;
export const DATES = {
  startDate: getDateNDaysAgo(MAX_DAYS), // alter days to increase/decrease data set
  endDate: getDateNDaysAgo(1), // leave at 1 to get yesterday's data
};

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDateNDaysAgo(n) {
  const now = new Date(); // current date and time
  now.setDate(now.getDate() - n); // subtract n days
  return formatDate(now);
}
