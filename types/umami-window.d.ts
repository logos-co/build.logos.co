/** Injected by Umami script (UmamiProvider + next/script). */
interface Window {
	umami?: {
		track: (...args: unknown[]) => void;
	};
}
