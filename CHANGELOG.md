# Changelog

## [0.3.0](https://github.com/stashlabs/duelr/compare/v0.2.0...v0.3.0) (2025-08-08)


### ✨ Features

* add support for GPT-5 models ([46b965f](https://github.com/stashlabs/duelr/commit/46b965fc8e77ffc995f5e9bb7a232dba09c4aba8))


### ♻️ Code Refactoring

* remove temperature parameter from API calls in Anthropic and OpenAI providers ([a8bc13a](https://github.com/stashlabs/duelr/commit/a8bc13ab0dfd61f280ef332159e6ab08b9700e8c))
* rename max_tokens to max_completion_tokens in OpenAI API call ([9937467](https://github.com/stashlabs/duelr/commit/9937467e1f1426e058a593eb6b11d0316537e423))

## [0.2.0](https://github.com/stashlabs/duelr/compare/v0.1.2...v0.2.0) (2025-08-08)


### ✨ Features

* add JSON schema detection and validation utilities ([89cdf0f](https://github.com/stashlabs/duelr/commit/89cdf0f081063c8c398bd295ced4fcfdb7e93eef))
* enhance ResultsGrid component to display validation errors ([eff163c](https://github.com/stashlabs/duelr/commit/eff163cff403b6be98750c917da1ee8467f997c2))
* enhance scoring calculations with JSON validation logic and error handling ([a3d17c6](https://github.com/stashlabs/duelr/commit/a3d17c6331018e2c9aeabf13f8654daa34dfeea9))
* implement JSON schema validation in comparison tool with auto-detection and user input options ([680f730](https://github.com/stashlabs/duelr/commit/680f730e2bdb95aedf4a32b05da7521012d854f1))
* update API to include jsonSchema in requests and adjust handling in response scoring ([0ad0290](https://github.com/stashlabs/duelr/commit/0ad029000af5ccee536e3c5d24d5fb3819a2d17f))
* update ResponseScores interface to allow null jsonValidity and add validationErrors property ([e301dc2](https://github.com/stashlabs/duelr/commit/e301dc22fbd9d7695cd5cd37413897d69ccccb20))


### 🐛 Bug Fixes

* add eslint-disable comments for better code linting in page and utils files ([0b3a16a](https://github.com/stashlabs/duelr/commit/0b3a16a7b8cfde9f7eb14bd813463dfd19820a85))

## [0.1.2](https://github.com/stashlabs/duelr/compare/v0.1.1...v0.1.2) (2025-08-04)


### 🐛 Bug Fixes

* update cost thresholds and formatting in scoring calculations ([326cdcf](https://github.com/stashlabs/duelr/commit/326cdcf1c2bf720c262ba697eae20d9b5f96a46f))

## [0.1.1](https://github.com/stashlabs/duelr/compare/v0.1.0...v0.1.1) (2025-07-30)


### 👷 CI/CD

* remove release-as config to be used for the first time ([527fc3e](https://github.com/stashlabs/duelr/commit/527fc3e8ebe6bfce52dbce1aaa87b48d5c1bce32))

## 0.1.0 (2025-07-30)


### ✨ Features

* scaffold duelr with nextjs and shadcn ([ced58f9](https://github.com/stashlabs/duelr/commit/ced58f9be210607fb706d7c6490da3a971d4b16e))


### 👷 CI/CD

* add PR check workflow for automated type checking and linting ([a278e19](https://github.com/stashlabs/duelr/commit/a278e19e74d7ba39a4d68cb65440ea22a3c12e26))
* define pipeline for automated release ([dd0c37f](https://github.com/stashlabs/duelr/commit/dd0c37fb01c4aa7015a5060104e47c4047fcddb5))
* define release-please configs ([9c9ca13](https://github.com/stashlabs/duelr/commit/9c9ca132b31a5c5ad2e8586414bbd6195140445d))
* dump package version 0.0.0 to run release-please first time ([e9210b1](https://github.com/stashlabs/duelr/commit/e9210b13b78db76af324ee7cb200ef5d437cbea0))
