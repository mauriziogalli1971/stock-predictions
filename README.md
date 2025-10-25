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
