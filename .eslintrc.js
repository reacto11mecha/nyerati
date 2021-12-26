const websitePackageData = require("./packages/website/package.json");

module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: ["solid", "react"],
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:solid/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: websitePackageData.dependencies.react,
    },
  },
  rules: {},
};
