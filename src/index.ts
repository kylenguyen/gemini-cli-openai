import { Hono } from "hono";
import { Env } from "./types";
import { OpenAIRoute } from "./routes/openai";
import { DebugRoute } from "./routes/debug";
import { openAIApiKeyAuth } from "./middlewares/auth";
import { loggingMiddleware } from "./middlewares/logging";

/**
 * Gemini CLI OpenAI Worker
 *
 * Provides OpenAI-compatible API endpoints for Google's Gemini models
 * via the Gemini CLI OAuth flow.
 *
 * Features:
 * - OpenAI-compatible chat completions and model listing
 * - OAuth2 authentication with token caching via in-memory KV store
 * - Support for multiple Gemini models (2.5 Pro, 2.5 Flash, etc.)
 * - Streaming responses compatible with OpenAI SDK
 * - Debug and testing endpoints for troubleshooting
 */

// Create the main Hono app
const app = new Hono<{ Bindings: Env }>();

// Middleware to bind environment variables from process.env to Hono's context
// This replaces Cloudflare Workers' automatic env binding
app.use("*", async (c, next) => {
	// Lazily import the kvStore to avoid circular dependency
	const { kvStore } = await import("./server");

	c.env = {
		...c.env,
		GCP_SERVICE_ACCOUNT: process.env.GCP_SERVICE_ACCOUNT || "",
		GEMINI_PROJECT_ID: process.env.GEMINI_PROJECT_ID,
		GEMINI_CLI_KV: kvStore,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		ENABLE_FAKE_THINKING: process.env.ENABLE_FAKE_THINKING,
		ENABLE_REAL_THINKING: process.env.ENABLE_REAL_THINKING,
		STREAM_THINKING_AS_CONTENT: process.env.STREAM_THINKING_AS_CONTENT,
		ENABLE_AUTO_MODEL_SWITCHING: process.env.ENABLE_AUTO_MODEL_SWITCHING,
		GEMINI_MODERATION_HARASSMENT_THRESHOLD: process.env.GEMINI_MODERATION_HARASSMENT_THRESHOLD as Env["GEMINI_MODERATION_HARASSMENT_THRESHOLD"],
		GEMINI_MODERATION_HATE_SPEECH_THRESHOLD: process.env.GEMINI_MODERATION_HATE_SPEECH_THRESHOLD as Env["GEMINI_MODERATION_HATE_SPEECH_THRESHOLD"],
		GEMINI_MODERATION_SEXUALLY_EXPLICIT_THRESHOLD: process.env.GEMINI_MODERATION_SEXUALLY_EXPLICIT_THRESHOLD as Env["GEMINI_MODERATION_SEXUALLY_EXPLICIT_THRESHOLD"],
		GEMINI_MODERATION_DANGEROUS_CONTENT_THRESHOLD: process.env.GEMINI_MODERATION_DANGEROUS_CONTENT_THRESHOLD as Env["GEMINI_MODERATION_DANGEROUS_CONTENT_THRESHOLD"],
		ENABLE_GEMINI_NATIVE_TOOLS: process.env.ENABLE_GEMINI_NATIVE_TOOLS,
		ENABLE_GOOGLE_SEARCH: process.env.ENABLE_GOOGLE_SEARCH,
		ENABLE_URL_CONTEXT: process.env.ENABLE_URL_CONTEXT,
		GEMINI_TOOLS_PRIORITY: process.env.GEMINI_TOOLS_PRIORITY,
		DEFAULT_TO_NATIVE_TOOLS: process.env.DEFAULT_TO_NATIVE_TOOLS,
		ALLOW_REQUEST_TOOL_CONTROL: process.env.ALLOW_REQUEST_TOOL_CONTROL,
		ENABLE_INLINE_CITATIONS: process.env.ENABLE_INLINE_CITATIONS,
		INCLUDE_GROUNDING_METADATA: process.env.INCLUDE_GROUNDING_METADATA,
		INCLUDE_SEARCH_ENTRY_POINT: process.env.INCLUDE_SEARCH_ENTRY_POINT,
	} as Env;

	await next();
});

// Add logging middleware
app.use("*", loggingMiddleware);

// Add CORS headers for all requests
app.use("*", async (c, next) => {
	// Set CORS headers
	c.header("Access-Control-Allow-Origin", "*");
	c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

	// Handle preflight requests
	if (c.req.method === "OPTIONS") {
		c.status(204);
		return c.body(null);
	}

	await next();
});

// Apply OpenAI API key authentication middleware to all /v1 routes
app.use("/v1/*", openAIApiKeyAuth);

// Setup route handlers
app.route("/v1", OpenAIRoute);
app.route("/v1/debug", DebugRoute);

// Add individual debug routes to main app for backward compatibility
app.route("/v1", DebugRoute);

// Root endpoint - basic info about the service
app.get("/", (c) => {
	const requiresAuth = !!c.env.OPENAI_API_KEY;

	return c.json({
		name: "Gemini CLI OpenAI Server",
		description: "OpenAI-compatible API for Google Gemini models via OAuth",
		version: "1.0.0",
		runtime: "Node.js",
		authentication: {
			required: requiresAuth,
			type: requiresAuth ? "Bearer token in Authorization header" : "None"
		},
		endpoints: {
			chat_completions: "/v1/chat/completions",
			models: "/v1/models",
			debug: {
				cache: "/v1/debug/cache",
				token_test: "/v1/token-test",
				full_test: "/v1/test"
			}
		},
		documentation: "https://github.com/gewoonjaap/gemini-cli-openai"
	});
});

// Health check endpoint
app.get("/health", (c) => {
	return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { app };
