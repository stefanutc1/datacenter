# API Logic and Configuration Disclosure

During the interception of HTTP/HTTPS traffic, a critical endpoint was identified: `/api/v1/site/config`. This endpoint serves as the primary data source for the frontend "Vibecoding" logic.

### Key Technical Evidence:
* **The "Withdrawal Kill-Switch"**: The JSON response explicitly sets `withdrawMethodBank` and `withdrawMethodRevolut` to `false`. This proves that the UI options for these payment methods are purely cosmetic decoys.
* **Geographic Campaign Lock**: The field `defaultCountryCode` is hardcoded to `+40`, matching the Romanian market. Attempts to register with other prefixes (e.g., +64) result in backend rejections.
* **Fake News Feed**: The "AI NEWS" section is populated via a static JSON array within this config, featuring outdated or fabricated headlines to build false authority.
