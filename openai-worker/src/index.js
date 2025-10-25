import { OpenAI } from "openai";

const MAX_REPORT_WORDS = 150;
const MAX_DAYS = 3;
const dates = {
	startDate: getDateNDaysAgo(MAX_DAYS), // alter days to increase/decrease data set
	endDate: getDateNDaysAgo(1), // leave at 1 to get yesterday's data
};
const GATEWAY_URL =
	"https://gateway.ai.cloudflare.com/v1/4892e0000e9e2f5967571b3c44400136/stock-predictions/openai";
const POLYGON_WORKER_URL =
	"https://polygon-worker.mauriziogalli1971.workers.dev/";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

const OPENAI_CONFIG = {
	model: "gpt-4o",
	temperature: 1.07,
	frequency_penalty: 0.75,
	presence_penalty: 0.25,
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
			const tickers = await request.json();
			if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
				throw new Error(
					"Invalid JSON format. Please provide an array of tickers."
				);
			}

			const polygonResponse = await fetch(POLYGON_WORKER_URL, {
				method: "POST",
				body: JSON.stringify({ dates, tickers }),
			});
			const tickerData = await polygonResponse.json();

			const openai = new OpenAI({
				apiKey: env.OPENAI_API_KEY,
				baseURL: GATEWAY_URL,
			});
			try {
				const report = await openai.chat.completions.create({
					...OPENAI_CONFIG,
					messages: getMessages(tickerData),
				});

				if (!report) {
					throw new Error("Cannot generate report");
				}

				return new Response(report.choices[0].message.content, {
					status: 200,
					headers: {
						"Content-Type": "text/html; charset=utf-8",
						...CORS_HEADERS,
					},
				});
			} catch (error) {
				return new Response(`OPENAI Bad Request: ${error}`, {
					status: 400,
					headers: CORS_HEADERS,
				});
			}
		} catch (error) {
			return new Response(`POLYGON Bad Request: ${error}`, {
				status: 400,
				headers: CORS_HEADERS,
			});
		}
	},
};

function getMessages(tickerData) {
	return [
		{
			role: "system",
			content: `
          You are an experienced financial advisor.
          You are well known for the clarity and reliability of your reports.
          You are asked to analyze up to 3 stock tickers' data over a ${MAX_DAYS}-days span.
          Write a report shorter than ${MAX_REPORT_WORDS + 1} words that is as accurate as possible.
          Style the report by looking at the examples below enclosed in triple hashes (###).
          Emphasize only ticker symbols, company names, and stock prices in bold.
          `,
		},
		{
			role: "user",
			content: `
          Here is the data: ${JSON.stringify(tickerData)} and the examples.
          ###
          OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
          ###
          ###
          Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
          ###
          `,
		},
	];
}

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
