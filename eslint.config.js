export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    rules: {},
  },
];
