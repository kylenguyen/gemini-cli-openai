/**
 * In-memory KV store that implements the subset of the KVNamespace API
 * used by this project. Replaces Cloudflare KV for local/Docker usage.
 *
 * Tokens are short-lived (~1 hour) and auto-refreshed, so in-memory
 * storage is sufficient — no persistence needed across restarts.
 */

export interface KVStore {
	get(key: string, type?: "text" | "json"): Promise<string | object | null>;
	put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
	delete(key: string): Promise<void>;
}

interface CacheEntry {
	value: string;
	timer?: ReturnType<typeof setTimeout>;
}

export class InMemoryKV implements KVStore {
	private store = new Map<string, CacheEntry>();

	async get(key: string, type?: "text" | "json"): Promise<string | object | null> {
		const entry = this.store.get(key);
		if (!entry) return null;

		if (type === "json") {
			try {
				return JSON.parse(entry.value);
			} catch {
				return null;
			}
		}
		return entry.value;
	}

	async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
		// Clear any existing expiry timer for this key
		const existing = this.store.get(key);
		if (existing?.timer) {
			clearTimeout(existing.timer);
		}

		const entry: CacheEntry = { value };

		// Set auto-expiry if TTL is provided
		if (options?.expirationTtl && options.expirationTtl > 0) {
			entry.timer = setTimeout(() => {
				this.store.delete(key);
			}, options.expirationTtl * 1000);
		}

		this.store.set(key, entry);
	}

	async delete(key: string): Promise<void> {
		const entry = this.store.get(key);
		if (entry?.timer) {
			clearTimeout(entry.timer);
		}
		this.store.delete(key);
	}
}
