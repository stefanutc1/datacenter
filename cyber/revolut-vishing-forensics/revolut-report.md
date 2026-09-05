# Revolut Specifics Report

## 1. Exploitation of the Banking Trust Model

Threat actors capitalize on the high level of trust users place in digital banking applications like Revolut. They target the gap between the *expectations* of a user (receiving help for a 'problem') and the *reality* of security protocols.

## 2. Revolut Native Defense Analysis

The investigation highlights key mechanisms that, when properly utilized, neutralize these threats:

### The "In-App Call Status" Feature

* **Mechanism:** Revolut triggers a banner within the app when an official support agent initiates contact.
* **Why it works:** It establishes a cryptographic/authorized trust link between the server and the app.
* **Gap:** Many users are unaware that the absence of this banner during a call *is* the primary indicator of fraud.

## 3. Proposed Security Hardening

To further reduce successful phishing, the following UI/UX security controls are proposed:

### Persistent Security Banner (UX Control)

* **Implementation:** A non-intrusive, yet persistent header alert in the main dashboard:
  * *“Revolut never calls you to ask for PINs, card details, or fee payments via external links.”*
* **Impact:** This serves as a "first line of defense" that primes the user's mindset against vishing before they receive a fraudulent call.

### Proactive Fraud Alerts

* **Mechanism:** Triggering a mobile push notification when a high volume of reporting activity is detected from specific geographic regions (e.g., Romania) or when specific burner-range patterns emerge.
