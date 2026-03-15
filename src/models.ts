import { ModelInfo } from "./types";

// --- Gemini CLI Models Configuration ---
export const geminiCliModels: Record<string, ModelInfo> = {
	// --- Gemini 3.x Series (Preview) ---
	"gemini-3.1-pro-preview": {
		maxTokens: 65536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsAudios: true,
		supportsVideos: true,
		supportsPdfs: true,
		supportsPromptCache: true,
		inputPrice: 0,
		outputPrice: 0,
		description: "Google's latest reasoning-first model, optimized for complex agentic workflows and coding",
		thinking: true
	},
	"gemini-3.1-pro-preview-customtools": {
		maxTokens: 65536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsAudios: true,
		supportsVideos: true,
		supportsPdfs: true,
		supportsPromptCache: true,
		inputPrice: 0,
		outputPrice: 0,
		description: "Gemini 3.1 Pro variant optimized for prioritizing custom tools in agentic workflows",
		thinking: true
	},
	"gemini-3-flash-preview": {
		maxTokens: 65536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsAudios: true,
		supportsVideos: true,
		supportsPdfs: true,
		supportsPromptCache: true,
		inputPrice: 0,
		outputPrice: 0,
		description: "Frontier-class performance rivaling larger models at a fraction of the cost",
		thinking: true
	},
	"gemini-3.1-flash-lite-preview": {
		maxTokens: 65536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsAudios: true,
		supportsVideos: true,
		supportsPdfs: true,
		supportsPromptCache: true,
		inputPrice: 0,
		outputPrice: 0,
		description: "Fast, budget-friendly Gemini 3 model for high-volume tasks at scale",
		thinking: true
	},
	// --- Gemini 2.5 Series (Stable) ---
	"gemini-2.5-pro": {
		maxTokens: 65536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsAudios: true,
		supportsVideos: true,
		supportsPdfs: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "Most advanced 2.5 model for complex tasks, deep reasoning and coding",
		thinking: true
	},
	"gemini-2.5-flash": {
		maxTokens: 65536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsAudios: true,
		supportsVideos: true,
		supportsPdfs: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "Best price-performance model for low-latency, high-volume tasks with reasoning",
		thinking: true
	},
	"gemini-2.5-flash-lite": {
		maxTokens: 65536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsAudios: true,
		supportsVideos: true,
		supportsPdfs: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "Fastest and most budget-friendly multimodal model in the 2.5 family",
		thinking: true
	}
};

// --- Default Model ---
export const DEFAULT_MODEL = "gemini-2.5-flash";

// --- Helper Functions ---
export function getModelInfo(modelId: string): ModelInfo | null {
	return geminiCliModels[modelId] || null;
}

export function getAllModelIds(): string[] {
	return Object.keys(geminiCliModels);
}

export function isValidModel(modelId: string): boolean {
	return modelId in geminiCliModels;
}
