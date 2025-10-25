# Stock Predictions App

An interactive web application that generates AI-powered stock prediction reports using real-time market data. Built
with React, Vite, and Cloudflare Workers.

## Features

- **Multi-ticker analysis** - Analyze up to 3 stock ticker symbols simultaneously
- **AI-powered insights** - GPT-generated reports with concise market analysis (150 words max)
- **Real-time stock data** - Automated data fetching from Polygon.io REST API
- **Serverless architecture** - Cloudflare Workers for scalable API endpoints
- **Modern UI** - Bootstrap 5 styling with responsive design
- **Markdown rendering** - Beautiful report formatting using the `marked` library
- **Environment-based configuration** - Secure API key management

## Architecture

The application consists of three main components:

- **Frontend** (`/src`) - React 19 + Vite application
- **OpenAI Worker** (`/openai-worker`) - Cloudflare Worker for GPT-based report generation
- **Polygon Worker** (`/polygon-worker`) - Cloudflare Worker for stock market data retrieval

## Prerequisites

- Node.js (LTS version recommended)
- npm package manager
- Cloudflare account (for worker deployment)
- API Keys:
    - [OpenAI API Key](https://platform.openai.com/api-keys)
    - [Polygon.io API Key](https://polygon.io/)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd stock-predictions
   ```

2. **Install root dependencies:**

   ```bash
   npm install
   ```

3. **Install worker dependencies:**

   ```bash
   cd openai-worker && npm install && cd ..
   cd polygon-worker && npm install && cd ..
   ```

4. **Configure environment variables:**

   Create a `.env` file in the root directory (use `.env.example` as template):

   ```env
   VITE_OPENAI_WORKER_URL=<your-openai-worker-url>
   VITE_POLYGON_WORKER_URL=<your-polygon-worker-url>
   ```

   Configure worker secrets:

   ```bash
   # OpenAI Worker
   cd openai-worker
   npx wrangler secret put OPENAI_API_KEY
   
   # Polygon Worker
   cd ../polygon-worker
   npx wrangler secret put POLYGON_API_KEY
   ```

## Development

### Run the frontend:

The application will be available at `http://localhost:5173`

### Run workers locally:

**OpenAI Worker:**

**Polygon Worker:**

Note: When running workers locally, update your `.env` file with the local worker URLs (typically
`http://localhost:8787`).

## Deployment

### Deploy Cloudflare Workers:

**OpenAI Worker:**

**Polygon Worker:**

```bash
cd polygon-worker
npx wrangler deploy
```

After deployment, update your file with the production worker URLs. `.env`

### Deploy Frontend:

Build the production bundle:

```bash
npm run build
````

The built files will be in the `dist/` directory, ready to be deployed to your hosting platform of choice (Cloudflare
Pages, Vercel, Netlify, etc.).

## Usage

1. Enter 1-3 stock ticker symbols (e.g., AAPL, GOOGL, MSFT)
2. Click "Generate Report"
3. View AI-generated analysis with real-time market data

## Project Structure

````
stock-predictions/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── openai-worker/         # OpenAI API Cloudflare Worker
│   └── src/
│       └── index.js       # Worker handler
├── polygon-worker/        # Polygon.io API Cloudflare Worker
│   └── src/
│       └── index.js       # Worker handler
├── public/                # Static assets
├── .env.example           # Environment variables template
└── package.json           # Root dependencies
````

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **Cloudflare Workers** - Serverless API endpoints
- **OpenAI GPT** - AI-powered report generation
-
    - Real-time stock market data **Polygon.io API**
- **Marked** - Markdown parsing and rendering
