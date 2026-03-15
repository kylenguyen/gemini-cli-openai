import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { app } from "./index";
import { InMemoryKV } from "./kv-memory";

// Load environment variables from .env file
dotenv.config();

// Create a shared in-memory KV instance for token caching
const kvStore = new InMemoryKV();

// Make the KV store available to the app via a global reference
// This is used by the env binding middleware in index.ts
export { kvStore };

const port = parseInt(process.env.PORT || "8787", 10);

console.log(`🚀 Gemini CLI OpenAI Server starting on port ${port}`);

serve(
	{
		fetch: app.fetch,
		port
	},
	(info) => {
		console.log(`✅ Server is running on http://localhost:${info.port}`);
		console.log(`📡 API endpoints:`);
		console.log(`   GET  http://localhost:${info.port}/health`);
		console.log(`   GET  http://localhost:${info.port}/v1/models`);
		console.log(`   POST http://localhost:${info.port}/v1/chat/completions`);
	}
);
