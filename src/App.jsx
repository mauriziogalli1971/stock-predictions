import {
  DATES,
  MAX_DAYS,
  MAX_REPORT_WORDS,
  MAX_TICKERS,
  OPENAI_API_KEY,
  POLYGON_API_KEY,
  TICKER_MIN_LENGTH,
} from "./utils/config.js";
import { OpenAI } from "openai";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";

function App() {
  const [report, setReport] = useState(null);
  const [tickers, setTickers] = useState([]);
  const tickerInput = useRef(null);
  const addTickerBtn = useRef(null);
  const errorMessage = useRef(null);
  const loadingPanel = useRef(null);
  const newReportBtn = useRef(null);
  const reportParser = useRef(null);

  const addTicker = (e) => {
    e.preventDefault();
    const current = tickerInput.current;

    if (current.value.length < TICKER_MIN_LENGTH) {
      errorMessage.current.classList.remove("d-none");
      return;
    }

    setTickers([...tickers, current.value.toUpperCase()]);
    current.value = "";
    current.focus();
    addTickerBtn.current.disabled = true;
  };

  const canAddTicker = () => {
    return tickers.length < MAX_TICKERS;
  };

  const handleGenerateReport = () => {
    return async () => {
      loadingPanel.current.classList.add("show");

      const tickerIterator = fetchTickerData();
      const tickerData = [];

      let result = await tickerIterator.next();
      while (!result.done) {
        tickerData.push(await result.value);
        result = await tickerIterator.next();
      }

      const report = await fetchReport(JSON.stringify(tickerData));
      setReport(report);

      loadingPanel.current.classList.remove("show");
    };
  };

  async function fetchReport(data) {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const messages = [
      {
        role: "system",
        content: `
          You are an experienced financial advisor. 
          You are well known for the clarity and reliability of your reports. 
          You are asked to analyze up to 3 stock tickers' data over a ${MAX_DAYS}-days span.
          Write a report shorter than ${MAX_REPORT_WORDS + 1} words that is as accurate as possible. 
          Style the report by looking at the examples below enclosed in triple hashes (###). 
          `,
      },
      {
        role: "user",
        content: `
          Here is the data: ${data} and the examples.
          ###
          OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
          ###
          ###
          Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
          ###
          `,
      },
    ];

    try {
      const report = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 1.07,
        frequency_penalty: 0.75,
        presence_penalty: 0.25,
        messages,
      });

      if (!report) {
        throw new Error("Cannot generate report");
      }
      console.log(report);
      return report.choices[0].message.content;
    } catch (error) {
      console.log(error);
    }
  }

  async function* fetchTickerData() {
    for (const ticker of tickers) {
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${DATES.startDate}/${DATES.endDate}?apiKey=${POLYGON_API_KEY}`;
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        yield data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }

  function ReportParser() {
    return (
      <section className="mt-4">
        <h2>Your Report</h2>
        <div className="text-start" ref={reportParser}></div>
      </section>
    );
  }

  const resetApp = () => {
    return () => {
      setReport(null);
      setTickers([]);
    };
  };

  useEffect(() => {
    if (report) {
      reportParser.current.innerHTML = marked.parse(report);
    }
  }, [report]);

  return (
    <div className="container mx-auto row text-center">
      <header className="my-4">
        <h1>Stock Predictions</h1>
      </header>
      <main>
        <section>
          <form
            id="ticker-input-form"
            onSubmit={addTicker}
            className="mb-4 mx-auto md-w-1/2"
          >
            <label htmlFor="ticker-input" className="form-label">
              Add up to 3 stock tickers below <br /> to get a super accurate
              stock predictions report
            </label>
            <div className="input-group mx-auto" style={{ maxWidth: "400px" }}>
              <input
                type="text"
                id="ticker-input"
                name="ticker-input"
                placeholder="Enter a stock ticker (e.g. MSFT)"
                className="form-control"
                disabled={!canAddTicker()}
                onInput={(e) => {
                  addTickerBtn.current.disabled = !canAddTicker();
                  if (e.target.value.length >= TICKER_MIN_LENGTH) {
                    errorMessage.current.classList.add("d-none");
                  }
                }}
                ref={tickerInput}
              />
              <button
                ref={addTickerBtn}
                className="btn btn-outline-secondary"
                disabled={!canAddTicker()}
              >
                Add
              </button>
            </div>
            <div className="form-text text-danger d-none" ref={errorMessage}>
              <small>
                <strong>Note:</strong> Ticker symbols must be 3 characters or
                more.
              </small>
            </div>
          </form>
          <div className="mb-4 h5">
            {tickers.length > 0
              ? tickers.map((ticker, index) => (
                  <span
                    className={`badge text-bg-dark ${index < tickers.length - 1 ? "me-1" : ""}`}
                    key={index}
                  >
                    {ticker}
                  </span>
                ))
              : "No tickers added yet."}
          </div>
          {report ? (
            <>
              <button
                className="btn btn-primary btn-lg"
                type="button"
                ref={newReportBtn}
                onClick={resetApp()}
              >
                New Report
              </button>
              <ReportParser />
            </>
          ) : (
            <>
              <button
                className="btn btn-primary btn-lg"
                type="button"
                disabled={tickers.length === 0}
                onClick={handleGenerateReport()}
              >
                Generate Report
              </button>
              <p className="text-secondary">
                <small>Always correct 15% of the time!</small>
              </p>
              <div className="loading-panel" ref={loadingPanel}>
                <div>Querying Stocks API...</div>
                <img src="/src/assets/img/loader.svg" alt="loading" />
              </div>
            </>
          )}
        </section>
      </main>
      <footer className="mt-4 text-secondary">
        <small>&copy; This is not real financial advice!</small>
      </footer>
    </div>
  );
}

export default App;
