const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: CORS_HEADERS,
      });
    }

    try {
      const json = await request.json();
      if (!json) {
        throw new Error("Invalid JSON format.");
      }

      const { dates, tickers } = json;
      if (!Array.isArray(tickers) || tickers.length === 0) {
        throw new Error(
          "Invalid JSON format. Please provide an array of tickers."
        );
      }
      if (!dates?.startDate || !dates?.endDate) {
        throw new Error(
          "Invalid JSON format. Please provide both start date and end date."
        );
      }

      const tickerData = await fetchTickerData({
        dates,
        tickers,
        apiKey: env.POLYGON_API_KEY,
      });
      // Check if all requests failed
      const successfulFetches = tickerData.filter((data) => !data.error);
      if (successfulFetches.length === 0) {
        throw new Error("Failed to fetch data for all tickers");
      }

      return new Response(JSON.stringify(tickerData), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          ...CORS_HEADERS,
        },
      });
    } catch (error) {
      return new Response(`Bad Request: ${error}`, {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
  },
};

async function fetchTickerData({ dates, tickers, apiKey }) {
  const promises = [];
  const { startDate, endDate } = dates;
  const headers = { Authorization: `Bearer ${apiKey}` };
  for (const ticker of tickers) {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}`;
    promises.push(
      fetch(url, { headers })
        .then((response) => response.json())
        .then((data) => {
          delete data.request_id;
          return data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          return { error: true, ticker, message: error.message };
        })
    );
  }
  return await Promise.all(promises);
}
