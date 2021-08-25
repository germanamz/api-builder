module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
  },
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    quotes: [
      "error",
      "single",
      { avoidEscape: true, allowTemplateLiterals: false },
    ],
    "prettier/prettier": "error",
  },
};
