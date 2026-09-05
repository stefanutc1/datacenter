# Technical Analysis

## Environment

- Isolated host OS, air-gapped from personal accounts and data
- Windows 10 virtual machine (Oracle VirtualBox)
- NAT-only networking (no bridged access to the host network)
- Two temporary Steam accounts registered via disposable email (Tempmail)
- VM deleted after analysis was complete

## Attack Flow

1. Victim reaches a fake "vote for skin" landing page
2. A fraudulent Steam login button is presented
3. An OpenID MITM redirect captures the entered credentials
4. The attacker attempts to lock the account via Family View
5. With Family View locked, inventory hijack becomes possible

## Frontend Findings

- Built on a CSReserve-style phishing kit template
- Minified JavaScript bundles, consistent with an off-the-shelf kit rather than custom development
- Hardcoded API endpoints rather than dynamically configured ones
- No legitimate Steam assets — all branding was reproduced/cloned
- OpenID request parameters that don't match a legitimate Steam authentication flow

## Backend Findings (Inferred)

- A lightweight credential forwarder, not a full application backend
- Hosted on a disposable VPS
- No real application logic beyond capturing and relaying credentials
- Minimal or no real session handling

## Mitigation

- Only log into Steam via `steamcommunity.com` — never via a link from an external page or "reward" offer
- Enable Steam Guard (two-factor authentication) on your account
- Be cautious of unsolicited Family Sharing invites, especially from unfamiliar accounts
- Report suspected phishing domains to the platform immediately rather than investigating them yourself

## Related Analysis

The infrastructure pattern here — a cloned login flow with a disposable backend, used for high-volume low-cost credential theft — shows up in different forms elsewhere. See [`Task-Scam-Infrastructure-Analysis`](https://github.com/moanast/Task-Scam-Infrastructure-Analysis) for an analysis of a fraudulent investment platform using a similarly templated, geographically-targeted approach.
