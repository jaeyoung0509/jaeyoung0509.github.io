import sveltePlugin from "eslint-plugin-svelte";
import tsPlugin from "typescript-eslint";
import svelteParser from "svelte-eslint-parser";

export default [
  ...tsPlugin.configs.recommended,
  ...sveltePlugin.configs["flat/recommended"],
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsPlugin.parser,
        extraFileExtensions: [".svelte"],
      },
    },
    rules: {
      "svelte/no-navigation-without-resolve": "off",
      "svelte/no-dom-manipulating": "off",
      "svelte/no-at-html-tags": "off",
    },
  },
  {
    ignores: [
      ".svelte-kit/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "package-lock.json",
      "benchmark/**",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
