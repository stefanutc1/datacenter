# Potential SQL Injection (SQLi) Surface Analysis

During the registration and login phase, several input fields were audited for improper sanitization. While a full exploit was not executed (to remain within ethical boundaries), the entry points were identified.

### Identified Entry Points:
* **Username Field**: The `username` input (e.g., used for "Ion Croseu") is a primary vector. If the backend doesn't use parameterized queries, a payload like `' OR 1=1 --` could potentially bypass authentication or leak user tables.
* **Invite Code Field**: The `invite_code` field (validated as `888888`) likely queries a `campaigns` or `invites` table. This is a high-risk area as it’s often overlooked by "vibecoders" during backend development.

### Technical Reasoning:
* **Lack of Server-Side Regex**: While the frontend has basic regex (e.g., "Username must contain only letters and numbers"), the analysis showed that frontend validation can be easily bypassed by intercepting the request in Burp Suite and modifying the body.
* **Error-Based Potential**: In early tests, certain special characters in the username field caused unusual delay/latency in the API response (`POST /api/v1/user/auth/login`), which is an indicator of blind or time-based SQL injection possibilities.

### Security Recommendation:
To mitigate these risks, the backend must implement:
1. **Prepared Statements (Parameterized Queries)** to separate SQL logic from data.
2. **Strict Input Validation** on the server side, not just the client side.
3. **WAF (Web Application Firewall)** rules to filter out common SQL injection patterns (though Cloudflare was present, it appeared to be in 'detection' rather than 'prevention' mode for specific payload types).
