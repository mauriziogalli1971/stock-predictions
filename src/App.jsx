import { useEffect, useRef, useState } from "react";
import { marked } from "marked";

const TICKER_MIN_LENGTH = 3;
const MAX_TICKERS = 3;

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
    return !report && tickers.length < MAX_TICKERS;
  };

  const handleGenerateReport = () => {
    return async () => {
      loadingPanel.current.classList.add("show");

      const response = await fetchReport(tickers);
      const report = await response.text();
      setReport(report);

      loadingPanel.current.classList.remove("show");
    };
  };

  async function fetchReport(tickers) {
    const workerUrl = import.meta.env.DEV
      ? "http://localhost:8787"
      : "https://openai-worker.mauriziogalli1971.workers.dev/";
    return await fetch(workerUrl, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tickers),
    });
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
    <>
      <header className="py-4 mb-4 bg-dark">
        <h1 className="text-center text-white">Stock Predictions</h1>
      </header>
      <main>
        <section className="container mx-auto row text-center">
          <form
            id="ticker-input-form"
            onSubmit={addTicker}
            className="mb-4 mx-auto"
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
                className="btn btn-primary btn-lg mx-auto"
                style={{ maxWidth: "400px" }}
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
                className="btn btn-primary btn-lg mx-auto"
                style={{ maxWidth: "400px" }}
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
      <footer className="mt-4 text-secondary text-center">
        <small>&copy; This is not real financial advice!</small>
      </footer>
    </>
  );
}

export default App;
