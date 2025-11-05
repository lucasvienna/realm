// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import("$lib/server/auth").Player | null;
			session: import("$lib/server/auth").Session | null;
		}
	}
}

export {};
