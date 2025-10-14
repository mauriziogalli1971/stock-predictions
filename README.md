# Stock Predictions App

This application provides an interactive interface to generate concise, colorful stock prediction reports for up to
three ticker symbols using React and Vite.

## Features

- **Input up to 3 stock ticker symbols** to analyze their recent market performance.
- **ChatGPT-generated reports:** Powered by OpenAI's GPT model for natural language reports, constrained to 150 words
  for clarity.
- **Automated stock data fetching** from Polygon.io's stock market API.
- **UX enhancements** with Bootstrap 5 styling and React's stateful, interactive UI.
- **Live Markdown rendering** using the `marked` library for readable, styled reports.
- **Configurable via environment variables** for API keys (see `.env.example`).

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Copy `.env.example` to `.env` and provide your own API keys.

3. **Run the application:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view the app.

## Core Stack

- **React 19**
- **Vite** (for fast dev environment and HMR)
- **Bootstrap 5** (UI components)
- **OpenAI** (for report generation)
- **Polygon.io** (stock data API)
- **Marked** (for Markdown rendering)
- **ESLint + Prettier** for code style

## Customizing & Extending

- **ESLint:** For additional linting rules, see `eslint.config.js`.
- **Styling:** Customize visual styles in `src/assets/css/style.css`.
- **API keys:** Store sensitive keys in `.env`, never commit them.
- **TypeScript:** If you need type safety, start
  with [Vite’s React TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).

## Learn More

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [OpenAI Node.js SDK](https://www.npmjs.com/package/openai)
- [Polygon.io Docs](https://polygon.io/docs/stocks/getting-started)

---

**Disclaimer:** This project and the reports it generates are for entertainment and educational purposes only. No real
financial advice is given.

```