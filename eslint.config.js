import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const AUTH_BARREL_PATHS = [
  "../../auth",
  "../../auth/index",
  "../../../auth",
  "../../../auth/index",
];

const AUTH_BARREL_MESSAGE =
  "Importer auth/navigation directement : le baril auth tirerait les gardes et le contexte utilisateur dans LegalLinks.";

export default tseslint.config(
  { ignores: ["dist", "coverage"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    files: ["src/components/**/*Sx.ts", "src/components/Navbar/navbarTile.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
  {
    files: ["src/components/LegalLinks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: AUTH_BARREL_PATHS.map((name) => ({ name, message: AUTH_BARREL_MESSAGE })),
        },
      ],
    },
  },
);
