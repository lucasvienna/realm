import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	enumerable: true,
	value: vi.fn<(query: string) => MediaQueryList>().mockImplementation(
		(query: string): MediaQueryList => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn<MediaQueryList["addListener"]>(),
			removeListener: vi.fn<MediaQueryList["removeListener"]>(),
			addEventListener: vi.fn<MediaQueryList["addEventListener"]>(),
			removeEventListener: vi.fn<MediaQueryList["removeEventListener"]>(),
			dispatchEvent: vi.fn<MediaQueryList["dispatchEvent"]>(),
		}),
	),
});

// add more mocks here if you need them
