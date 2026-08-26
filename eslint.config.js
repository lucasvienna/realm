import { fileURLToPath } from "node:url";

import svelte from "eslint-plugin-svelte";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import ts from "typescript-eslint";

import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default defineConfig(includeIgnoreFile(gitignorePath), ...svelte.configs.recommended, {
	files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
	name: "svelte:personal",
	languageOptions: {
		parserOptions: {
			projectService: true,
			extraFileExtensions: [".svelte"],
			parser: ts.parser,
			svelteConfig,
		},
	},
});
