# Frontend Integrity and Localization Bypass

The platform's frontend is built with Vite/Vue.js but lacks proper server-side state validation for user sessions and localization.

### Vulnerability Demonstration:
* **Locale Manipulation**: By directly editing the `lang` key in the browser's `localStorage` to `ru`, the entire application state was forced into a Russian translation. 
* **State Conflict**: Despite forcing the Russian locale (`Регистрация`), the hardcoded Romanian campaign prefix (`+40`) remained active. This proves that the backend does not synchronize regional settings with user-selected languages, highlighting a "white-label" scam template implementation.
* **Dead Elements**: Multiple UI components (e.g., "Detailed GPU Statistics") were confirmed to be non-functional shells with no underlying logic or event listeners.
